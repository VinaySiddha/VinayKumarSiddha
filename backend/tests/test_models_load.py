import os
import onnxruntime as ort
import numpy as np

def test_models():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    reid_path = os.path.join(backend_dir, "models", "person_reid_youtu_2021nov.onnx")
    yolo_path = os.path.join(backend_dir, "models", "yolov8n.onnx")
    
    print("Testing Person ReID model loading...")
    if os.path.exists(reid_path):
        try:
            session = ort.InferenceSession(reid_path, providers=['CPUExecutionProvider'])
            print("Successfully loaded ReID model!")
            for i, inp in enumerate(session.get_inputs()):
                print(f"  Input {i}: Name={inp.name}, Shape={inp.shape}, Type={inp.type}")
            for i, out in enumerate(session.get_outputs()):
                print(f"  Output {i}: Name={out.name}, Shape={out.shape}, Type={out.type}")
        except Exception as e:
            print(f"Error loading ReID model: {e}")
    else:
        print("ReID model file does not exist!")
        
    print("\nTesting YOLOv8n model loading...")
    if os.path.exists(yolo_path):
        try:
            session = ort.InferenceSession(yolo_path, providers=['CPUExecutionProvider'])
            print("Successfully loaded YOLOv8n model!")
            for i, inp in enumerate(session.get_inputs()):
                print(f"  Input {i}: Name={inp.name}, Shape={inp.shape}, Type={inp.type}")
            for i, out in enumerate(session.get_outputs()):
                print(f"  Output {i}: Name={out.name}, Shape={out.shape}, Type={out.type}")
        except Exception as e:
            print(f"Error loading YOLOv8n model: {e}")
    else:
        print("YOLOv8n model file does not exist!")

if __name__ == "__main__":
    test_models()
