import os
import json
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime
from dotenv import load_dotenv

# Load backend/.env
backend_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(backend_dir, '.env')
load_dotenv(dotenv_path)

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("NEXT_PUBLIC_FIREBASE_API_KEY")
project_id = os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID") or "mlsc-30"

# Firestore helper functions to convert Python types to Firestore REST API JSON format
def to_firestore_val(val):
    if isinstance(val, bool):
        return {"booleanValue": val}
    elif isinstance(val, int):
        return {"integerValue": str(val)}
    elif isinstance(val, float):
        return {"doubleValue": val}
    elif isinstance(val, str):
        return {"stringValue": val}
    elif isinstance(val, list):
        return {"arrayValue": {"values": [to_firestore_val(v) for v in val if v is not None]}}
    elif isinstance(val, dict):
        return {"mapValue": {"fields": {k: to_firestore_val(v) for k, v in val.items() if v is not None}}}
    elif val is None:
        return {"nullValue": None}
    else:
        return {"stringValue": str(val)}

def from_firestore_val(fval):
    if not isinstance(fval, dict):
        return fval
    if "stringValue" in fval:
        return fval["stringValue"]
    elif "booleanValue" in fval:
        return fval["booleanValue"]
    elif "integerValue" in fval:
        return int(fval["integerValue"])
    elif "doubleValue" in fval:
        return float(fval["doubleValue"])
    elif "arrayValue" in fval:
        vals = fval["arrayValue"].get("values", [])
        return [from_firestore_val(v) for v in vals]
    elif "mapValue" in fval:
        fields = fval["mapValue"].get("fields", {})
        return {k: from_firestore_val(v) for k, v in fields.items()}
    elif "nullValue" in fval:
        return None
    else:
        return None

def to_firestore_doc(data):
    return {"fields": {k: to_firestore_val(v) for k, v in data.items() if v is not None}}

def from_firestore_doc(doc):
    fields = doc.get("fields", {})
    return {k: from_firestore_val(v) for k, v in fields.items()}

class DBService:
    @staticmethod
    def _request(url, data=None, method="GET"):
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8') if data is not None else None,
            headers={"Content-Type": "application/json"} if data is not None else {},
            method=method
        )
        try:
            with urllib.request.urlopen(req) as response:
                return json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            err_body = e.read().decode('utf-8')
            print(f"Firestore REST error: {e.code} - {e.reason}\nBody: {err_body}")
            raise e

    @staticmethod
    def save_media(media_data):
        media_id = media_data["id"]
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/media/{media_id}?key={api_key}"
        doc_data = to_firestore_doc(media_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def update_media_status(media_id, status, error=None, extra_metadata=None):
        # First retrieve existing media document to merge fields
        media = DBService.get_media(media_id)
        if not media:
            return
        
        media["status"] = status
        if error:
            media["error"] = error
        if extra_metadata:
            # Update root fields if provided
            for k in ["width", "height", "duration", "fps", "thumbnail_path"]:
                if k in extra_metadata:
                    media[k] = extra_metadata[k]
            # Merge into metadata dictionary
            if "metadata" not in media or not isinstance(media["metadata"], dict):
                media["metadata"] = {}
            media["metadata"].update(extra_metadata)
            
        DBService.save_media(media)

    @staticmethod
    def get_media(media_id):
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/media/{media_id}?key={api_key}"
        res = DBService._request(url)
        return from_firestore_doc(res) if res else None

    @staticmethod
    def list_media(media_type=None, limit=100):
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/media?pageSize={limit}&key={api_key}"
        res = DBService._request(url)
        if not res or "documents" not in res:
            return []
        
        results = [from_firestore_doc(doc) for doc in res["documents"]]
        if media_type:
            results = [r for r in results if r.get("type") == media_type]
            
        # Sort by upload_date descending
        results.sort(key=lambda x: x.get("upload_date", ""), reverse=True)
        return results

    @staticmethod
    def get_duplicate_media(sha256):
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents:runQuery?key={api_key}"
        query = {
            "structuredQuery": {
                "from": [{"collectionId": "media"}],
                "where": {
                    "fieldFilter": {
                        "field": {"fieldPath": "sha256"},
                        "op": "EQUAL",
                        "value": {"stringValue": sha256}
                    }
                },
                "limit": 1
            }
        }
        res = DBService._request(url, data=query, method="POST")
        if res and isinstance(res, list):
            for item in res:
                if "document" in item:
                    return from_firestore_doc(item["document"])
        return None

    @staticmethod
    def save_face(face_data):
        face_id = face_data["id"]
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/faces/{face_id}?key={api_key}"
        doc_data = to_firestore_doc(face_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def save_person(person_data):
        person_uuid = person_data["id"]
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/persons/{person_uuid}?key={api_key}"
        doc_data = to_firestore_doc(person_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def get_all_faces():
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/faces?pageSize=1000&key={api_key}"
        res = DBService._request(url)
        if not res or "documents" not in res:
            return []
        return [from_firestore_doc(doc) for doc in res["documents"]]

    @staticmethod
    def get_all_persons():
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/persons?pageSize=1000&key={api_key}"
        res = DBService._request(url)
        if not res or "documents" not in res:
            return []
        return [from_firestore_doc(doc) for doc in res["documents"]]

    @staticmethod
    def save_video_frame(frame_data):
        frame_id = frame_data["id"]
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/video_frames/{frame_id}?key={api_key}"
        doc_data = to_firestore_doc(frame_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def get_video_frames(media_id):
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents:runQuery?key={api_key}"
        query = {
            "structuredQuery": {
                "from": [{"collectionId": "video_frames"}],
                "where": {
                    "fieldFilter": {
                        "field": {"fieldPath": "media_id"},
                        "op": "EQUAL",
                        "value": {"stringValue": media_id}
                    }
                },
                "orderBy": [
                    {
                        "field": {"fieldPath": "timestamp"},
                        "direction": "ASCENDING"
                    }
                ]
            }
        }
        res = DBService._request(url, data=query, method="POST")
        frames = []
        if res and isinstance(res, list):
            for item in res:
                if "document" in item:
                    frames.append(from_firestore_doc(item["document"]))
        return frames

    @staticmethod
    def get_stats():
        """
        Returns stats: total images, total videos, total indexed faces, total indexed persons, total size.
        Uses REST to scan collections.
        """
        media_list = DBService.list_media(limit=1000)
        total_images = sum(1 for m in media_list if m.get("type") == "image")
        total_videos = sum(1 for m in media_list if m.get("type") == "video")
        total_size = sum(m.get("file_size", 0) for m in media_list)
        
        faces = DBService.get_all_faces()
        persons = DBService.get_all_persons()
        
        return {
            "total_images": total_images,
            "total_videos": total_videos,
            "total_faces": len(faces),
            "total_persons": len(persons),
            "total_size_bytes": total_size
        }

    @staticmethod
    def save_accommodation(acc_data):
        acc_id = acc_data["id"]
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/accommodation/{acc_id}?key={api_key}"
        doc_data = to_firestore_doc(acc_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def get_accommodation_logs():
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/accommodation?pageSize=1000&key={api_key}"
        res = DBService._request(url)
        if not res or "documents" not in res:
            return []
        
        results = [from_firestore_doc(doc) for doc in res["documents"]]
        # Sort by date descending
        results.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return results

    @staticmethod
    def save_room(room_data):
        room_id = room_data["id"]
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/rooms/{room_id}?key={api_key}"
        doc_data = to_firestore_doc(room_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def list_rooms():
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/rooms?pageSize=100&key={api_key}"
        res = DBService._request(url)
        if not res or "documents" not in res:
            return []
        results = [from_firestore_doc(doc) for doc in res["documents"]]
        # Sort by id/name
        results.sort(key=lambda x: x.get("id", ""))
        return results

    @staticmethod
    def delete_room(room_id):
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/rooms/{room_id}?key={api_key}"
        DBService._request(url, method="DELETE")

    @staticmethod
    def save_trip_state(state_data):
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/trip/current_trip?key={api_key}"
        doc_data = to_firestore_doc(state_data)
        DBService._request(url, data=doc_data, method="PATCH")

    @staticmethod
    def get_trip_state():
        url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents/trip/current_trip?key={api_key}"
        res = DBService._request(url)
        return from_firestore_doc(res) if res else None
