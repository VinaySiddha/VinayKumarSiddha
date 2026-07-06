import os
import uuid
import shutil
import zipfile
import threading
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel

from db_service import DBService
from storage_service import StorageService
from index_manager import IndexManager
from pipeline import run_pipeline, compute_sha256
import pipeline
import cv2

app = FastAPI(title="Enterprise AI Media Intelligence Platform API", version="2.0.0")

# Setup CORS to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to load FAISS indexes
@app.on_event("startup")
def startup_event():
    print("Starting backend services...")
    # Load indexes in a background thread so we do not block port binding health checks
    threading.Thread(target=IndexManager.load_indexes, daemon=True).start()
    print("Startup index load task dispatched to background thread.")

# Request models
class RebuildIndexRequest(BaseModel):
    pass

class BulkDownloadRequest(BaseModel):
    ids: List[str]

@app.post("/api/media/bulk-upload")
async def bulk_upload(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    person_id: Optional[str] = Form(None)
):
    """
    Accepts bulk files, performs SHA-256 duplicate detection,
    uploads them to Firebase Storage, inserts pending metadata,
    and queues them for AI background indexing.
    """
    results = []
    
    # Create temp directory for hashing and uploads
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "temp_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    
    for upload_file in files:
        file_uuid = uuid.uuid4().hex
        ext = os.path.splitext(upload_file.filename)[1].lower()
        temp_filepath = os.path.join(temp_dir, f"{file_uuid}{ext}")
        
        # Save uploaded file locally temporarily to hash it
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
            
        # Compute SHA-256 hash
        sha256 = compute_sha256(temp_filepath)
        file_size = os.path.getsize(temp_filepath)
        
        # Check duplicate
        duplicate = DBService.get_duplicate_media(sha256)
        if duplicate:
            # Clean up temp file
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
                
            results.append({
                "filename": upload_file.filename,
                "status": "duplicate",
                "media_id": duplicate["id"],
                "message": "File already exists. Linked to existing media."
            })
            continue
            
        # Determine media type
        mime_type = upload_file.content_type or "application/octet-stream"
        is_video = any(vid_ext in ext for vid_ext in [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"])
        media_type = "video" if is_video else "image"
        
        # Upload original file to Firebase Storage (preserving byte-for-byte quality)
        folder = "videos" if is_video else "images"
        cluster_folder = person_id if person_id else "unassigned"
        storage_path = f"{folder}/{cluster_folder}/original/{file_uuid}{ext}"
        
        try:
            StorageService.upload_file(temp_filepath, storage_path, mime_type)
        except Exception as upload_err:
            if os.path.exists(temp_filepath):
                os.remove(temp_filepath)
            results.append({
                "filename": upload_file.filename,
                "status": "failed",
                "error": f"Storage upload failed: {str(upload_err)}"
            })
            continue
            
        # Store metadata in Firestore
        media_data = {
            "id": file_uuid,
            "filename": upload_file.filename,
            "mime_type": mime_type,
            "file_size": file_size,
            "sha256": sha256,
            "path": storage_path,
            "thumbnail_path": "",
            "type": media_type,
            "width": 0,
            "height": 0,
            "duration": 0.0,
            "fps": 0.0,
            "upload_date": datetime.utcnow().isoformat() + "Z",
            "status": "pending",
            "error": "",
            "metadata": {
                "original_filename": upload_file.filename,
                "original_size": file_size
            }
        }
        
        DBService.save_media(media_data)
        
        # Queue AI background job
        background_tasks.add_task(run_pipeline, file_uuid)
        
        # Clean up temp file
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)
            
        results.append({
            "filename": upload_file.filename,
            "status": "queued",
            "media_id": file_uuid
        })
        
    return JSONResponse(content={"results": results})

@app.post("/api/media/complete-upload")
async def complete_upload():
    """
    Dummy endpoint matching specification to mark uploads complete.
    Our system handles queues immediately in background_tasks, so we return success.
    """
    return {"status": "success", "message": "All uploads are in queue."}

@app.post("/api/search")
async def search_media(
    file: UploadFile = File(...),
    threshold: float = Form(0.4),
    top_k: int = Form(10),
    search_type: str = Form("hybrid") # face, person, hybrid
):
    """
    AI Search: Accepts query image, detects faces/bodies, extracts embeddings,
    queries FAISS vector indexes, and returns a merged list of ranked matching files.
    """
    pipeline.init_engines()
    
    # Save search query file locally temporarily
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "temp_search")
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, f"search_{uuid.uuid4().hex}.jpg")
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    img = cv2.imread(temp_path)
    if img is None:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=400, detail="Invalid image file uploaded.")
        
    # Run detectors
    faces = pipeline.face_engine.detect_and_embed(img) if search_type in ["face", "hybrid"] else []
    person_boxes, person_scores = pipeline.person_engine.detect_persons(img) if search_type in ["person", "hybrid"] else ([], [])
    
    # Clean up temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)
        
    print(f"Search API: Detected {len(faces)} faces and {len(person_boxes)} bodies.")
    
    # Keep track of matches found
    face_matches = []
    person_matches = []
    
    # 1. Search Face Index
    face_person_ids = []
    for face in faces:
        emb = face["embedding"]
        matches = IndexManager.search_face(emb, threshold=threshold, top_k=top_k)
        face_matches.extend(matches)
        for m in matches:
            face_person_ids.append(m["person_id"])
            
    # 2. Search Person ReID Index
    for p_box in person_boxes:
        emb = pipeline.person_engine.extract_reid_embedding(img, p_box)
        if emb:
            matches = IndexManager.search_person(emb, threshold=threshold, top_k=top_k)
            person_matches.extend(matches)
            
    # 3. Merge Results & Group by Media ID
    media_scores = {} # maps media_id to {"similarity", "method", "person_ids", "matches"}
    
    # Add face matches
    for match in face_matches:
        mid = match["media_id"]
        pid = match["person_id"]
        sim = match["similarity"]
        
        if mid not in media_scores:
            media_scores[mid] = {
                "similarity": sim,
                "method": "face",
                "person_ids": {pid},
                "count": 1
            }
        else:
            media_scores[mid]["similarity"] = max(media_scores[mid]["similarity"], sim)
            media_scores[mid]["person_ids"].add(pid)
            media_scores[mid]["count"] += 1

    # Add person ReID matches
    for match in person_matches:
        mid = match["media_id"]
        pid = match["person_id"]
        sim = match["similarity"]
        
        if mid not in media_scores:
            media_scores[mid] = {
                "similarity": sim,
                "method": "person",
                "person_ids": {pid},
                "count": 1
            }
        else:
            # If already matched via face, upgrade method to hybrid and combine similarity
            media_scores[mid]["method"] = "hybrid"
            media_scores[mid]["similarity"] = max(media_scores[mid]["similarity"], sim)
            media_scores[mid]["person_ids"].add(pid)
            media_scores[mid]["count"] += 1
            
    # Retrieve media documents and populate confidence rankings
    ranked_results = []
    for mid, info in media_scores.items():
        media_doc = DBService.get_media(mid)
        if not media_doc:
            continue
            
        # Get secure capability URLs for previews/downloads
        media_doc["signed_url"] = StorageService.get_signed_url(media_doc["path"])
        if media_doc.get("thumbnail_path"):
            media_doc["thumbnail_url"] = StorageService.get_signed_url(media_doc["thumbnail_path"])
        else:
            media_doc["thumbnail_url"] = media_doc["signed_url"]
            
        ranked_results.append({
            "media": media_doc,
            "similarity": info["similarity"],
            "recognition_method": info["method"],
            "matched_person_ids": list(info["person_ids"]),
            "match_count": info["count"]
        })
        
    # Sort by similarity descending
    ranked_results.sort(key=lambda x: x["similarity"], reverse=True)
    ranked_results = ranked_results[:top_k]
    
    # Notify user details
    status_msg = "Search successful."
    if len(faces) == 0 and len(person_boxes) > 0:
        status_msg = "No visible face detected. Searching using body appearance and person re-identification."
    elif len(faces) == 0 and len(person_boxes) == 0:
        status_msg = "No subjects detected in query image."
        
    return {
        "status": "success",
        "message": status_msg,
        "results_count": len(ranked_results),
        "results": ranked_results
    }

@app.post("/api/media/bulk-download")
async def bulk_download(req: BulkDownloadRequest):
    """
    Downloads original media items, generates a single ZIP file,
    uploads it to Storage, and returns a secure download URL.
    """
    if not req.ids:
        raise HTTPException(status_code=400, detail="No media IDs specified.")
        
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "temp_downloads")
    os.makedirs(temp_dir, exist_ok=True)
    
    zip_uuid = uuid.uuid4().hex
    zip_filename = f"bulk_download_{zip_uuid}.zip"
    zip_filepath = os.path.join(temp_dir, zip_filename)
    
    # Create ZIP archive
    try:
        with zipfile.ZipFile(zip_filepath, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for media_id in req.ids:
                media = DBService.get_media(media_id)
                if not media:
                    continue
                # Download original file locally
                ext = os.path.splitext(media["path"])[1]
                local_item_path = os.path.join(temp_dir, f"{media_id}{ext}")
                StorageService.download_file(media["path"], local_item_path)
                
                # Write to ZIP
                zipf.write(local_item_path, arcname=media["filename"])
                
                # Clean up local item file immediately to save disk
                if os.path.exists(local_item_path):
                    os.remove(local_item_path)
                    
        # Upload ZIP to Storage
        storage_dest_path = f"downloads/{zip_filename}"
        StorageService.upload_file(zip_filepath, storage_dest_path, "application/zip")
        
        # Clean up local ZIP file
        if os.path.exists(zip_filepath):
            os.remove(zip_filepath)
            
        # Get signed download URL
        download_url = StorageService.get_signed_url(storage_dest_path)
        return {"status": "success", "download_url": download_url}
        
    except Exception as e:
        if os.path.exists(zip_filepath):
            os.remove(zip_filepath)
        raise HTTPException(status_code=500, detail=f"Failed to generate bulk ZIP download: {str(e)}")

@app.get("/api/media/download/{id}")
async def download_single_media(id: str):
    """
    Returns a secure capability download URL for a single file.
    The frontend can redirect to this URL to trigger browser download.
    """
    media = DBService.get_media(id)
    if not media:
        raise HTTPException(status_code=404, detail="Media not found.")
        
    download_url = StorageService.get_signed_url(media["path"])
    return {"status": "success", "download_url": download_url}

@app.get("/api/media/serve/{path:path}")
async def serve_file(path: str):
    """
    Endpoint serving local files when Firebase Storage is not configured
    or needs range-based HTTP requests locally.
    """
    local_path = StorageService.get_local_path(path)
    if not os.path.exists(local_path):
        raise HTTPException(status_code=404, detail="File not found.")
    return FileResponse(local_path)

@app.post("/api/admin/rebuild-index")
async def rebuild_index(req: RebuildIndexRequest):
    """
    Admin endpoint to rebuild FAISS indexes from all database faces/persons.
    """
    try:
        IndexManager.rebuild_indexes_from_db()
        return {"status": "success", "message": "FAISS vector indexes rebuilt and uploaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rebuild failed: {str(e)}")

@app.get("/api/media/status/{job_id}")
async def get_processing_status(job_id: str):
    """
    Fetches the processing status of a media item.
    """
    media = DBService.get_media(job_id)
    if not media:
        raise HTTPException(status_code=404, detail="Media job not found.")
        
    return {
        "id": media["id"],
        "filename": media["filename"],
        "type": media["type"],
        "status": media["status"],
        "error": media.get("error", ""),
        "upload_date": media["upload_date"]
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """
    Aggregates database and FAISS metrics for dashboard analytics.
    """
    try:
        stats = DBService.get_stats()
        # Retrieve worker status
        # Since we use FastAPI BackgroundTasks, the worker status is "online" as long as the API is up.
        stats["worker_status"] = "online"
        
        # Calculate recent files (last 5)
        recent_media = DBService.list_media(limit=5)
        for r in recent_media:
            r["signed_url"] = StorageService.get_signed_url(r["path"])
            if r.get("thumbnail_path"):
                r["thumbnail_url"] = StorageService.get_signed_url(r["thumbnail_path"])
            else:
                r["thumbnail_url"] = r["signed_url"]
                
        stats["recent_media"] = recent_media
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/media")
async def list_media(media_type: Optional[str] = Query(None), limit: int = Query(50)):
    """
    Lists uploaded media files with secure URLs.
    """
    media_list = DBService.list_media(media_type=media_type, limit=limit)
    for m in media_list:
        m["signed_url"] = StorageService.get_signed_url(m["path"])
        if m.get("thumbnail_path"):
            m["thumbnail_url"] = StorageService.get_signed_url(m["thumbnail_path"])
        else:
            m["thumbnail_url"] = m["signed_url"]
    return media_list

class AccommodationRequest(BaseModel):
    name: str
    days: int
    persons: int
    paid: float

@app.post("/api/accommodation")
async def create_accommodation(req: AccommodationRequest):
    import math
    # Club 4 members rule: cost is 1500 per day per group of up to 4 persons
    groups = math.ceil(req.persons / 4)
    expected = groups * 1500 * req.days
    difference = req.paid - expected
    
    if difference == 0:
        status = "correct"
    elif difference < 0:
        status = "less"
    else:
        status = "extra"
        
    acc_data = {
        "id": uuid.uuid4().hex,
        "name": req.name,
        "days": req.days,
        "persons": req.persons,
        "paid": req.paid,
        "expected": expected,
        "difference": difference,
        "status": status,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    
    try:
        DBService.save_accommodation(acc_data)
        return acc_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/accommodation")
async def get_accommodation():
    try:
        logs = DBService.get_accommodation_logs()
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RoomRequest(BaseModel):
    id: str
    name: str
    cost: float
    guests: List[str]

@app.get("/api/rooms")
async def get_rooms():
    try:
        rooms = DBService.list_rooms()
        # If no rooms exist, initialize 7 default rooms
        if not rooms:
            rooms = []
            for i in range(1, 8):
                room_data = {
                    "id": f"room_{i}",
                    "name": f"Room {i}",
                    "cost": 1500.0,
                    "guests": [],
                    "created_at": datetime.utcnow().isoformat() + "Z"
                }
                DBService.save_room(room_data)
                rooms.append(room_data)
        return rooms
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rooms")
async def save_room(req: RoomRequest):
    room_data = {
        "id": req.id,
        "name": req.name,
        "cost": req.cost,
        "guests": req.guests,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    try:
        DBService.save_room(room_data)
        return room_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/rooms/{room_id}")
async def delete_room(room_id: str):
    try:
        DBService.delete_room(room_id)
        return {"status": "success", "message": f"Room {room_id} deleted."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TripMember(BaseModel):
    id: str
    name: str
    fri: bool
    sat: bool
    sun: bool
    paid: float

class TripStateRequest(BaseModel):
    members: List[TripMember]
    fri_rooms: int = 7
    sat_rooms: int = 2
    sun_rooms: int = 4
    room_cost: float = 1500.0

@app.get("/api/trip")
async def get_trip():
    try:
        state = DBService.get_trip_state()
        if not state:
            # Return default structure with 28 guests
            members = []
            for i in range(1, 29):
                members.append({
                    "id": f"guest_{i}",
                    "name": f"Guest {i}",
                    "fri": True,
                    "sat": False,
                    "sun": False,
                    "paid": 375.0
                })
            state = {
                "members": members,
                "fri_rooms": 7,
                "sat_rooms": 2,
                "sun_rooms": 4,
                "room_cost": 1500.0
            }
        return state
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trip")
async def save_trip(req: TripStateRequest):
    try:
        state_data = {
            "members": [m.dict() for m in req.members],
            "fri_rooms": req.fri_rooms,
            "sat_rooms": req.sat_rooms,
            "sun_rooms": req.sun_rooms,
            "room_cost": req.room_cost
        }
        DBService.save_trip_state(state_data)
        return state_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Bind dynamically to $PORT (defaults to 8000 for local runs)
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
