import os
import urllib.request
import urllib.error

def download_file(urls, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    if isinstance(urls, str):
        urls = [urls]
        
    for url in urls:
        print(f"Trying to download from {url}...")
        
        # Progress callback
        def progress(block_num, block_size, total_size):
            read_so_far = block_num * block_size
            if total_size > 0:
                percent = read_so_far * 100 / total_size
                print(f"\rDownloaded {read_so_far} of {total_size} bytes ({percent:.1f}%)", end="")
            else:
                print(f"\rDownloaded {read_so_far} bytes", end="")
                
        try:
            urllib.request.urlretrieve(url, dest_path, progress)
            print("\nDownload complete!")
            return True
        except urllib.error.HTTPError as e:
            print(f"\nHTTP Error {e.code}: {e.reason} for URL: {url}")
        except Exception as e:
            print(f"\nError downloading from {url}: {e}")
            
    return False

if __name__ == "__main__":
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Youtu ReID model in ONNX format
    reid_url = "https://huggingface.co/opencv/person_reid_youtureid/resolve/main/person_reid_youtu_2021nov.onnx"
    reid_dest = os.path.join(backend_dir, "models", "person_reid_youtu_2021nov.onnx")
    
    if not os.path.exists(reid_dest):
        success = download_file(reid_url, reid_dest)
        if not success:
            print("Failed to download Person ReID model.")
    else:
        print(f"Person ReID model already exists at {reid_dest}")
        
    # 2. YOLOv8n ONNX model (try multiple repositories)
    yolo_urls = [
        "https://huggingface.co/webnn/yolov8n/resolve/main/yolov8n.onnx",
        "https://huggingface.co/unity/inference-engine-yolo/resolve/main/yolov8n.onnx",
        "https://huggingface.co/Kalray/yolov8/resolve/main/yolov8n.onnx"
    ]
    yolo_dest = os.path.join(backend_dir, "models", "yolov8n.onnx")
    
    if not os.path.exists(yolo_dest):
        success = download_file(yolo_urls, yolo_dest)
        if not success:
            print("Failed to download YOLOv8n model.")
    else:
        print(f"YOLOv8n model already exists at {yolo_dest}")
