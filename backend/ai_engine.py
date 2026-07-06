import os
import cv2
import numpy as np
import onnxruntime as ort
from insightface.app import FaceAnalysis

class FaceEngine:
    def __init__(self):
        # FaceAnalysis will download the models if not present (buffalo_l is accurate)
        # We specify CPUExecutionProvider for compatibility
        self.app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
        # det_size=(640, 640) is standard for face detection
        self.app.prepare(ctx_id=-1, det_size=(640, 640)) # -1 for CPU execution

    def detect_and_embed(self, img_bgr):
        """
        Detects faces in a BGR image and returns a list of dictionaries with bounding boxes,
        confidence scores, and normalized embeddings (512-dim).
        """
        faces = self.app.get(img_bgr)
        results = []
        for face in faces:
            bbox = face.bbox.astype(int).tolist() # [x1, y1, x2, y2]
            embedding = face.embedding # 512-dim float32 array
            # Normalize embedding
            norm = np.linalg.norm(embedding)
            if norm > 0:
                embedding = embedding / norm
            det_score = float(face.det_score)
            results.append({
                "bbox": bbox,
                "embedding": embedding.tolist(),
                "score": det_score
            })
        return results

class PersonEngine:
    def __init__(self, yolo_path, reid_path):
        self.yolo_sess = ort.InferenceSession(yolo_path, providers=['CPUExecutionProvider'])
        self.reid_sess = ort.InferenceSession(reid_path, providers=['CPUExecutionProvider'])

    def detect_persons(self, img_bgr, conf_threshold=0.4, nms_threshold=0.4):
        """
        Detects persons using YOLOv8 ONNX model and returns bounding boxes and confidence scores.
        """
        h, w = img_bgr.shape[:2]
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        img_resized = cv2.resize(img_rgb, (640, 640))
        input_tensor = img_resized.transpose(2, 0, 1).astype(np.float32) / 255.0
        input_tensor = np.expand_dims(input_tensor, axis=0) # [1, 3, 640, 640]

        # Run YOLOv8
        outputs = self.yolo_sess.run(None, {"images": input_tensor})
        predictions = outputs[0][0] # shape [84, 8400]

        boxes = []
        scores = []
        
        # Row 4 is the class probability for class 0 (person) in COCO
        person_scores = predictions[4, :]
        
        # Filter by threshold
        cand_indices = np.where(person_scores > conf_threshold)[0]
        for idx in cand_indices:
            x_center, y_center, box_w, box_h = predictions[0:4, idx]
            score = float(person_scores[idx])
            
            # Convert center, width, height coordinates to corner coordinates (xmin, ymin, xmax, ymax)
            xmin = (x_center - box_w / 2) / 640 * w
            ymin = (y_center - box_h / 2) / 640 * h
            xmax = (x_center + box_w / 2) / 640 * w
            ymax = (y_center + box_h / 2) / 640 * h
            
            xmin = max(0, min(xmin, w - 1))
            ymin = max(0, min(ymin, h - 1))
            xmax = max(0, min(xmax, w - 1))
            ymax = max(0, min(ymax, h - 1))
            
            if xmax > xmin and ymax > ymin:
                boxes.append([int(xmin), int(ymin), int(xmax), int(ymax)])
                scores.append(score)
        
        # Apply NMS
        indices = cv2.dnn.NMSBoxes(boxes, scores, conf_threshold, nms_threshold)
        
        final_boxes = []
        final_scores = []
        if len(indices) > 0:
            for idx in indices.flatten():
                final_boxes.append(boxes[idx])
                final_scores.append(scores[idx])
                
        return final_boxes, final_scores

    def extract_reid_embedding(self, img_bgr, bbox):
        """
        Crops a person from the bounding box, processes it, and generates a normalized
        768-dim Person ReID embedding.
        """
        x1, y1, x2, y2 = bbox
        crop = img_bgr[y1:y2, x1:x2]
        if crop.size == 0:
            return None
            
        crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
        crop_resized = cv2.resize(crop_rgb, (128, 256)) # width=128, height=256
        
        # ImageNet normalization
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        
        crop_normalized = (crop_resized.astype(np.float32) / 255.0 - mean) / std
        input_tensor = crop_normalized.transpose(2, 0, 1) # [3, 256, 128]
        input_tensor = np.expand_dims(input_tensor, axis=0) # [1, 3, 256, 128]
        
        # Run Person ReID ONNX model
        outputs = self.reid_sess.run(None, {"input": input_tensor})
        embedding = outputs[0][0].flatten() # 768-dim
        
        # Normalize embedding
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
            
        return embedding.tolist()
