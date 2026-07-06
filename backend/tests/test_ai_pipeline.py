import os
import cv2
import numpy as np
from ai_engine import FaceEngine, PersonEngine

def test_pipeline():
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    yolo_path = os.path.join(backend_dir, "models", "yolov8n.onnx")
    reid_path = os.path.join(backend_dir, "models", "person_reid_youtu_2021nov.onnx")
    
    print("Initializing PersonEngine...")
    person_eng = PersonEngine(yolo_path, reid_path)
    print("PersonEngine initialized successfully!")
    
    print("\nInitializing FaceEngine (This may take a moment on the first run as InsightFace downloads its model)...")
    face_eng = FaceEngine()
    print("FaceEngine initialized successfully!")
    
    # Create a dummy image representing a scene (500x500 RGB image with a random colored rectangle representing a person)
    img = np.zeros((500, 500, 3), dtype=np.uint8)
    cv2.rectangle(img, (100, 100), (300, 450), (120, 120, 120), -1) # A grey box as a person body
    
    print("\nTesting person detection and embedding on dummy image...")
    boxes, scores = person_eng.detect_persons(img)
    print(f"Detected {len(boxes)} persons:")
    for i, (box, score) in enumerate(zip(boxes, scores)):
        print(f"  Person {i}: Box={box}, Confidence={score:.2f}")
        emb = person_eng.extract_reid_embedding(img, box)
        if emb:
            print(f"    ReID embedding extracted! Dim={len(emb)}, First 5 values={emb[:5]}")
            
    print("\nTesting face detection and embedding on dummy image...")
    faces = face_eng.detect_and_embed(img)
    print(f"Detected {len(faces)} faces.")
    
    print("\nAll pipeline components tested successfully!")

if __name__ == "__main__":
    test_pipeline()
