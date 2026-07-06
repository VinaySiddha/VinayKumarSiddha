import os
import hashlib
import time
import uuid
import cv2
import numpy as np
from PIL import Image

from db_service import DBService
from storage_service import StorageService
from index_manager import IndexManager
from ai_engine import FaceEngine, PersonEngine

backend_dir = os.path.dirname(os.path.abspath(__file__))
yolo_path = os.path.join(backend_dir, "models", "yolov8n.onnx")
reid_path = os.path.join(backend_dir, "models", "person_reid_youtu_2021nov.onnx")

# Initialize models lazily
face_engine = None
person_engine = None

def init_engines():
    global face_engine, person_engine
    if face_engine is None:
        face_engine = FaceEngine()
    if person_engine is None:
        person_engine = PersonEngine(yolo_path, reid_path)

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as file:
        while True:
            chunk = file.read(65536)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()

def face_inside_person(face_bbox, person_bbox):
    """
    Checks if the center of a face bounding box is inside a person's bounding box.
    """
    fx1, fy1, fx2, fy2 = face_bbox
    px1, py1, px2, py2 = person_bbox
    cx = (fx1 + fx2) / 2
    cy = (fy1 + fy2) / 2
    return px1 <= cx <= px2 and py1 <= cy <= py2

def generate_thumbnail(local_src_path, local_dest_path, is_video=False):
    """
    Generates a resized preview thumbnail (max 300px) from an image or video frame.
    """
    os.makedirs(os.path.dirname(local_dest_path), exist_ok=True)
    if is_video:
        cap = cv2.VideoCapture(local_src_path)
        success, frame = cap.read()
        cap.release()
        if not success:
            raise Exception("Could not read video frame for thumbnail.")
        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    else:
        img = Image.open(local_src_path)
        
    img.thumbnail((300, 300))
    # Convert to RGB if PNG/RGBA
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(local_dest_path, "JPEG", quality=85)

def process_image_pipeline(media_id, local_filepath, storage_dest_path, mime_type):
    """
    Runs the full image processing pipeline.
    """
    init_engines()
    print(f"Pipeline: Processing image {media_id} ({local_filepath})...")
    
    # 1. Load image
    img = cv2.imread(local_filepath)
    if img is None:
        raise Exception("Failed to load image with OpenCV.")
    h, w = img.shape[:2]
    
    # 2. Generate and upload thumbnail
    local_thumb_path = os.path.join(backend_dir, "data", "temp_thumbs", f"{media_id}_thumb.jpg")
    os.makedirs(os.path.dirname(local_thumb_path), exist_ok=True)
    generate_thumbnail(local_filepath, local_thumb_path, is_video=False)
    
    thumb_storage_path = f"thumbnails/{media_id}.jpg"
    StorageService.upload_file(local_thumb_path, thumb_storage_path, "image/jpeg")
    
    # Clean up local thumbnail
    if os.path.exists(local_thumb_path):
        os.remove(local_thumb_path)
        
    # 3. Detect faces and bodies
    faces = face_engine.detect_and_embed(img)
    person_boxes, person_scores = person_engine.detect_persons(img)
    
    print(f"Pipeline: Detected {len(faces)} faces and {len(person_boxes)} persons.")
    
    # 4. Map face detections to person cluster IDs
    face_person_ids = {} # maps face_id to person_cluster_id
    for i, face in enumerate(faces):
        face_id = f"{media_id}_face_{i}"
        embedding = face["embedding"]
        
        # Search Face FAISS Index for matching person cluster
        matches = IndexManager.search_face(embedding, threshold=0.55, top_k=1)
        if matches:
            person_cluster_id = matches[0]["person_id"]
            print(f"  Face {i} matched existing cluster: {person_cluster_id}")
        else:
            # Create a new person cluster ID
            person_cluster_id = f"person_{uuid.uuid4().hex[:8]}"
            print(f"  Face {i} created new cluster: {person_cluster_id}")
            
        # Add to Face Index
        IndexManager.add_face_embedding(media_id, face_id, person_cluster_id, embedding)
        
        # Save face record in Firestore
        face_data = {
            "id": face_id,
            "media_id": media_id,
            "person_id": person_cluster_id,
            "bbox": face["bbox"],
            "confidence": face["score"],
            "faiss_index_id": len(IndexManager.face_mapping) - 1,
            "embedding": embedding
        }
        DBService.save_face(face_data)
        face_person_ids[face_id] = person_cluster_id
        
    # 5. Map person body detections to person cluster IDs
    for j, (p_box, p_score) in enumerate(zip(person_boxes, person_scores)):
        person_uuid = f"{media_id}_body_{j}"
        embedding = person_engine.extract_reid_embedding(img, p_box)
        if not embedding:
            continue
            
        # Search Person ReID FAISS Index for matching person cluster
        matches = IndexManager.search_person(embedding, threshold=0.6, top_k=1)
        
        person_cluster_id = None
        if matches:
            person_cluster_id = matches[0]["person_id"]
            print(f"  Body {j} matched existing body cluster: {person_cluster_id}")
        else:
            # Check if this person body overlaps with a detected face in this frame
            overlapping_face_cluster = None
            for face_idx, face in enumerate(faces):
                face_id = f"{media_id}_face_{face_idx}"
                if face_inside_person(face["bbox"], p_box):
                    overlapping_face_cluster = face_person_ids.get(face_id)
                    if overlapping_face_cluster:
                        print(f"  Body {j} linked to face {face_idx} cluster: {overlapping_face_cluster}")
                        break
            
            if overlapping_face_cluster:
                person_cluster_id = overlapping_face_cluster
            else:
                # Create new cluster
                person_cluster_id = f"person_{uuid.uuid4().hex[:8]}"
                print(f"  Body {j} created new body cluster: {person_cluster_id}")
                
        # Add to Person ReID Index
        IndexManager.add_person_embedding(media_id, person_uuid, person_cluster_id, embedding)
        
        # Save person body record in Firestore
        person_data = {
            "id": person_uuid,
            "media_id": media_id,
            "person_id": person_cluster_id,
            "bbox": p_box,
            "confidence": p_score,
            "faiss_index_id": len(IndexManager.person_mapping) - 1,
            "embedding": embedding
        }
        DBService.save_person(person_data)
        
    # 6. Update media metadata and status
    DBService.update_media_status(
        media_id, 
        "completed", 
        extra_metadata={
            "width": w,
            "height": h,
            "thumbnail_path": thumb_storage_path,
            "recognition_types": ["face" if faces else "person"]
        }
    )
    print(f"Pipeline: Completed image {media_id} successfully!")

def process_video_pipeline(media_id, local_filepath, storage_dest_path, mime_type):
    """
    Runs the full video processing pipeline.
    Extracts frames at 1-second intervals and runs recognition on each frame.
    """
    init_engines()
    print(f"Pipeline: Processing video {media_id} ({local_filepath})...")
    
    # 1. Video Capture
    cap = cv2.VideoCapture(local_filepath)
    if not cap.isOpened():
        raise Exception("Failed to open video file with OpenCV.")
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    duration = total_frames / fps if fps > 0 else 0
    
    # Determine frame sampling interval (1 frame per second)
    sample_interval_frames = max(1, int(fps))
    
    # 2. Generate and upload video thumbnail (using frame 0)
    local_thumb_path = os.path.join(backend_dir, "data", "temp_thumbs", f"{media_id}_thumb.jpg")
    os.makedirs(os.path.dirname(local_thumb_path), exist_ok=True)
    try:
        generate_thumbnail(local_filepath, local_thumb_path, is_video=True)
        thumb_storage_path = f"thumbnails/{media_id}.jpg"
        StorageService.upload_file(local_thumb_path, thumb_storage_path, "image/jpeg")
    except Exception as e:
        print(f"Pipeline Warning: Failed to generate video thumbnail ({e})")
        thumb_storage_path = ""
        
    if os.path.exists(local_thumb_path):
        os.remove(local_thumb_path)
        
    frame_count = 0
    processed_frames = 0
    
    # Lists to aggregate faces and bodies found in video
    video_has_faces = False
    video_has_persons = False
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % sample_interval_frames == 0:
            timestamp_sec = frame_count / fps
            print(f"  Processing frame {frame_count} (timestamp: {timestamp_sec:.2f}s)...")
            
            # Save frame temporarily
            frame_uuid = f"{media_id}_frame_{frame_count}"
            local_frame_path = os.path.join(backend_dir, "data", "temp_frames", f"{frame_uuid}.jpg")
            os.makedirs(os.path.dirname(local_frame_path), exist_ok=True)
            cv2.imwrite(local_frame_path, frame)
            
            # Upload frame to Storage
            frame_storage_path = f"video_frames/{media_id}/frame_{frame_count}.jpg"
            StorageService.upload_file(local_frame_path, frame_storage_path, "image/jpeg")
            
            # Run Face detection on frame
            faces = face_engine.detect_and_embed(frame)
            person_boxes, person_scores = person_engine.detect_persons(frame)
            
            face_person_ids = {}
            for i, face in enumerate(faces):
                video_has_faces = True
                face_id = f"{frame_uuid}_face_{i}"
                embedding = face["embedding"]
                
                # Face matching
                matches = IndexManager.search_face(embedding, threshold=0.55, top_k=1)
                if matches:
                    person_cluster_id = matches[0]["person_id"]
                else:
                    person_cluster_id = f"person_{uuid.uuid4().hex[:8]}"
                    
                IndexManager.add_face_embedding(media_id, face_id, person_cluster_id, embedding)
                
                face_data = {
                    "id": face_id,
                    "media_id": media_id,
                    "frame_number": frame_count,
                    "timestamp": timestamp_sec,
                    "person_id": person_cluster_id,
                    "bbox": face["bbox"],
                    "confidence": face["score"],
                    "faiss_index_id": len(IndexManager.face_mapping) - 1,
                    "embedding": embedding
                }
                DBService.save_face(face_data)
                face_person_ids[face_id] = person_cluster_id
                
            # Run Person ReID on frame
            for j, (p_box, p_score) in enumerate(zip(person_boxes, person_scores)):
                video_has_persons = True
                person_uuid = f"{frame_uuid}_body_{j}"
                embedding = person_engine.extract_reid_embedding(frame, p_box)
                if not embedding:
                    continue
                    
                matches = IndexManager.search_person(embedding, threshold=0.6, top_k=1)
                person_cluster_id = None
                
                if matches:
                    person_cluster_id = matches[0]["person_id"]
                else:
                    overlapping_face_cluster = None
                    for face_idx, face in enumerate(faces):
                        face_id = f"{frame_uuid}_face_{face_idx}"
                        if face_inside_person(face["bbox"], p_box):
                            overlapping_face_cluster = face_person_ids.get(face_id)
                            if overlapping_face_cluster:
                                break
                                
                    if overlapping_face_cluster:
                        person_cluster_id = overlapping_face_cluster
                    else:
                        person_cluster_id = f"person_{uuid.uuid4().hex[:8]}"
                        
                IndexManager.add_person_embedding(media_id, person_uuid, person_cluster_id, embedding)
                
                person_data = {
                    "id": person_uuid,
                    "media_id": media_id,
                    "frame_number": frame_count,
                    "timestamp": timestamp_sec,
                    "person_id": person_cluster_id,
                    "bbox": p_box,
                    "confidence": p_score,
                    "faiss_index_id": len(IndexManager.person_mapping) - 1,
                    "embedding": embedding
                }
                DBService.save_person(person_data)
                
            # Save frame record in Firestore
            frame_data = {
                "id": frame_uuid,
                "media_id": media_id,
                "frame_number": frame_count,
                "timestamp": timestamp_sec,
                "path": frame_storage_path,
                "thumbnail_path": frame_storage_path # frame is small, can serve as its own preview
            }
            DBService.save_video_frame(frame_data)
            
            # Clean up local frame
            if os.path.exists(local_frame_path):
                os.remove(local_frame_path)
                
            processed_frames += 1
            
        frame_count += 1
        
    cap.release()
    
    # 3. Update media metadata
    recognition_types = []
    if video_has_faces:
        recognition_types.append("face")
    if video_has_persons:
        recognition_types.append("person")
        
    DBService.update_media_status(
        media_id, 
        "completed", 
        extra_metadata={
            "width": width,
            "height": height,
            "duration": duration,
            "fps": fps,
            "thumbnail_path": thumb_storage_path,
            "recognition_types": recognition_types,
            "processed_frames_count": processed_frames
        }
    )
    print(f"Pipeline: Completed video {media_id} successfully!")

def run_pipeline(media_id):
    """
    Main entry point for FastAPI BackgroundTasks.
    Loads media metadata, retrieves the file, and runs processing.
    """
    try:
        media = DBService.get_media(media_id)
        if not media:
            print(f"Pipeline Error: Media {media_id} not found in database.")
            return
            
        # Update status to processing
        DBService.update_media_status(media_id, "processing")
        
        # Download media file locally for OpenCV processing
        storage_path = media["path"]
        ext = os.path.splitext(storage_path)[1]
        local_filepath = os.path.join(backend_dir, "data", "temp_downloads", f"{media_id}{ext}")
        os.makedirs(os.path.dirname(local_filepath), exist_ok=True)
        
        StorageService.download_file(storage_path, local_filepath)
        
        # Branch depending on type
        if media["type"] == "video":
            process_video_pipeline(media_id, local_filepath, storage_path, media["mime_type"])
        else:
            process_image_pipeline(media_id, local_filepath, storage_path, media["mime_type"])
            
        # Clean up downloaded file
        if os.path.exists(local_filepath):
            os.remove(local_filepath)
            
    except Exception as e:
        print(f"Pipeline Error for media {media_id}: {e}")
        import traceback
        traceback.print_exc()
        DBService.update_media_status(media_id, "failed", error=str(e))
