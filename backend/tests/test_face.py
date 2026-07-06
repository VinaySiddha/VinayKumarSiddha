import sys
import os

try:
    from insightface.app import FaceAnalysis
    import numpy as np
    print("InsightFace imported successfully!")
    
    # Try importing ONNX and FAISS
    import onnxruntime
    import faiss
    print("ONNX Runtime and FAISS imported successfully!")
    
except Exception as e:
    print(f"Error importing modules: {e}")
    sys.exit(1)

print("All imports succeeded!")
