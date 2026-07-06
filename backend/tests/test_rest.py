import os
import json
import urllib.request
import urllib.error
from dotenv import load_dotenv

def test_rest():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(backend_dir, '.env')
    load_dotenv(dotenv_path)

    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("NEXT_PUBLIC_FIREBASE_API_KEY")
    project_id = os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID") or "mlsc-30"
    bucket_name = os.getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") or "mlsc-30.firebasestorage.app"

    print(f"Testing Firestore REST API for Project: {project_id}")
    print(f"API Key: {api_key}")
    
    # 1. Test Firestore Write
    firestore_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/test_collection/status?key={api_key}"
    data = {
        "fields": {
            "connected": {"booleanValue": True},
            "timestamp": {"stringValue": "2026-07-06T12:00:00Z"}
        }
    }
    req_data = json.dumps(data).encode('utf-8')
    
    # We use PATCH to create/update
    req = urllib.request.Request(
        firestore_url, 
        data=req_data, 
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            print("Firestore REST Write SUCCESS!")
            print(res_body[:200])
    except urllib.error.HTTPError as e:
        print(f"Firestore REST Write FAILED: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Firestore REST Write FAILED: {e}")

    # 2. Test Firestore Read
    read_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/test_collection/status?key={api_key}"
    try:
        with urllib.request.urlopen(read_url) as response:
            res_body = response.read().decode('utf-8')
            print("Firestore REST Read SUCCESS!")
            print(res_body[:200])
    except urllib.error.HTTPError as e:
        print(f"Firestore REST Read FAILED: {e.code} - {e.reason}")
    except Exception as e:
        print(f"Firestore REST Read FAILED: {e}")

    # 3. Test Storage List/Get
    storage_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o"
    try:
        with urllib.request.urlopen(storage_url) as response:
            res_body = response.read().decode('utf-8')
            print("Firebase Storage REST List SUCCESS!")
            print(res_body[:200])
    except urllib.error.HTTPError as e:
        print(f"Firebase Storage REST List FAILED: {e.code} - {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Firebase Storage REST List FAILED: {e}")

if __name__ == "__main__":
    test_rest()
