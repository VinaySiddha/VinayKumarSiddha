import os
import json
import urllib.request
import urllib.parse
import urllib.error
from dotenv import load_dotenv

# Load backend/.env
backend_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(backend_dir, '.env')
load_dotenv(dotenv_path)

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("NEXT_PUBLIC_FIREBASE_API_KEY")
bucket_name = os.getenv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") or "mlsc-30.firebasestorage.app"

class StorageService:
    @staticmethod
    def upload_file(local_file_path, storage_dest_path, mime_type="application/octet-stream"):
        """
        Uploads a local file to Firebase Storage via REST API.
        Preserves original quality exactly.
        """
        encoded_path = urllib.parse.quote(storage_dest_path, safe='')
        upload_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o?uploadType=media&name={encoded_path}&key={api_key}"
        
        with open(local_file_path, "rb") as f:
            file_data = f.read()
            
        req = urllib.request.Request(
            upload_url,
            data=file_data,
            headers={
                "Content-Type": mime_type,
                "Content-Length": str(len(file_data))
            },
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                res_body = response.read().decode('utf-8')
                metadata = json.loads(res_body)
                return metadata.get("name", storage_dest_path)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            print(f"StorageService Upload HTTPError: {e.code} - {e.reason}\nBody: {err_body}")
            raise e
        except Exception as e:
            print(f"StorageService Upload Error: {e}")
            raise e

    @staticmethod
    def download_file(storage_src_path, local_dest_path):
        """
        Downloads a file from Firebase Storage to a local path.
        """
        encoded_path = urllib.parse.quote(storage_src_path, safe='')
        download_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media&key={api_key}"
        
        os.makedirs(os.path.dirname(local_dest_path), exist_ok=True)
        
        try:
            req = urllib.request.Request(download_url)
            with urllib.request.urlopen(req) as response:
                with open(local_dest_path, "wb") as f:
                    f.write(response.read())
            return local_dest_path
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            print(f"StorageService Download HTTPError: {e.code} - {e.reason}\nBody: {err_body}")
            raise e
        except Exception as e:
            print(f"StorageService Download Error: {e}")
            raise e

    @staticmethod
    def get_signed_url(storage_src_path, expiration_seconds=3600):
        """
        Retrieves the metadata for the file, gets its download token,
        and constructs a secure direct download URL.
        """
        encoded_path = urllib.parse.quote(storage_src_path, safe='')
        metadata_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?key={api_key}"
        
        try:
            req = urllib.request.Request(metadata_url)
            with urllib.request.urlopen(req) as response:
                res_body = response.read().decode('utf-8')
                metadata = json.loads(res_body)
                token = metadata.get("downloadTokens", "")
                
                # If there's a token, append it for secure access
                if token:
                    return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media&token={token}"
                else:
                    return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media&key={api_key}"
        except urllib.error.HTTPError as e:
            # Fall back to URL with API key if metadata is inaccessible or rules restrict it
            return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media&key={api_key}"
        except Exception as e:
            print(f"StorageService Signed URL Error: {e}")
            return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media&key={api_key}"

    @staticmethod
    def file_exists(storage_src_path):
        """
        Checks if a file exists in Firebase Storage by requesting its metadata.
        """
        encoded_path = urllib.parse.quote(storage_src_path, safe='')
        metadata_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?key={api_key}"
        
        req = urllib.request.Request(metadata_url, method="GET")
        try:
            with urllib.request.urlopen(req) as response:
                return True
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return False
            raise e
        except Exception:
            return False
            
    @staticmethod
    def delete_file(storage_src_path):
        """
        Deletes a file from Firebase Storage.
        """
        encoded_path = urllib.parse.quote(storage_src_path, safe='')
        delete_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?key={api_key}"
        
        req = urllib.request.Request(delete_url, method="DELETE")
        try:
            with urllib.request.urlopen(req) as response:
                return True
        except Exception as e:
            print(f"StorageService Delete Error: {e}")
            return False
