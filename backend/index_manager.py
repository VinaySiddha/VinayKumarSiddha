import os
import json
import threading
import tempfile
import numpy as np
import faiss
from storage_service import StorageService

class IndexManager:
    _lock = threading.Lock()
    
    # In-memory FAISS indexes
    face_index = None
    person_index = None
    
    # Mappings from FAISS row index to metadata (list of dicts)
    face_mapping = []
    person_mapping = []
    
    # Paths in storage
    FACE_INDEX_PATH = "embeddings/face_index.faiss"
    FACE_MAPPING_PATH = "embeddings/face_mapping.json"
    PERSON_INDEX_PATH = "embeddings/person_index.faiss"
    PERSON_MAPPING_PATH = "embeddings/person_mapping.json"

    @classmethod
    def load_indexes(cls):
        """
        Downloads FAISS indexes and mapping files from Firebase Storage (if they exist)
        into temporary files, loads them into memory, and deletes the temp files immediately.
        If not present in storage, initializes empty indexes in memory.
        """
        with cls._lock:
            try:
                # 1. Load Face Index
                if StorageService.file_exists(cls.FACE_INDEX_PATH):
                    # Create a temporary file
                    fd, temp_path = tempfile.mkstemp(suffix=".faiss")
                    os.close(fd)
                    try:
                        StorageService.download_file(cls.FACE_INDEX_PATH, temp_path)
                        cls.face_index = faiss.read_index(temp_path)
                        print("IndexManager: Loaded Face FAISS Index from storage.")
                    except Exception as e:
                        print(f"IndexManager Error loading Face Index: {e}")
                    finally:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                
                if cls.face_index is None:
                    print("IndexManager: Initializing empty Face FAISS Index (512-dim).")
                    cls.face_index = faiss.IndexFlatIP(512)
                    
                if StorageService.file_exists(cls.FACE_MAPPING_PATH):
                    fd, temp_path = tempfile.mkstemp(suffix=".json")
                    os.close(fd)
                    try:
                        StorageService.download_file(cls.FACE_MAPPING_PATH, temp_path)
                        with open(temp_path, "r", encoding="utf-8") as f:
                            cls.face_mapping = json.load(f)
                    except Exception as e:
                        print(f"IndexManager Error loading Face Mapping: {e}")
                        cls.face_mapping = []
                    finally:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                else:
                    cls.face_mapping = []

                # 2. Load Person Index
                if StorageService.file_exists(cls.PERSON_INDEX_PATH):
                    fd, temp_path = tempfile.mkstemp(suffix=".faiss")
                    os.close(fd)
                    try:
                        StorageService.download_file(cls.PERSON_INDEX_PATH, temp_path)
                        cls.person_index = faiss.read_index(temp_path)
                        print("IndexManager: Loaded Person FAISS Index from storage.")
                    except Exception as e:
                        print(f"IndexManager Error loading Person Index: {e}")
                    finally:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                
                if cls.person_index is None:
                    print("IndexManager: Initializing empty Person FAISS Index (768-dim).")
                    cls.person_index = faiss.IndexFlatIP(768)
                    
                if StorageService.file_exists(cls.PERSON_MAPPING_PATH):
                    fd, temp_path = tempfile.mkstemp(suffix=".json")
                    os.close(fd)
                    try:
                        StorageService.download_file(cls.PERSON_MAPPING_PATH, temp_path)
                        with open(temp_path, "r", encoding="utf-8") as f:
                            cls.person_mapping = json.load(f)
                    except Exception as e:
                        print(f"IndexManager Error loading Person Mapping: {e}")
                        cls.person_mapping = []
                    finally:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                else:
                    cls.person_mapping = []
            except Exception as outer_err:
                print(f"IndexManager Outer Load Error: {outer_err}. Initializing empty in-memory indexes.")
                if cls.face_index is None:
                    cls.face_index = faiss.IndexFlatIP(512)
                    cls.face_mapping = []
                if cls.person_index is None:
                    cls.person_index = faiss.IndexFlatIP(768)
                    cls.person_mapping = []

    @classmethod
    def save_indexes(cls):
        """
        Saves current indexes and mapping files to temporary local files,
        uploads them to Firebase Storage, and deletes the temp files immediately.
        """
        # Save Face Index
        fd_idx, temp_idx_path = tempfile.mkstemp(suffix=".faiss")
        os.close(fd_idx)
        fd_map, temp_map_path = tempfile.mkstemp(suffix=".json")
        os.close(fd_map)
        
        try:
            faiss.write_index(cls.face_index, temp_idx_path)
            with open(temp_map_path, "w", encoding="utf-8") as f:
                json.dump(cls.face_mapping, f, ensure_ascii=False, indent=2)
                
            StorageService.upload_file(temp_idx_path, cls.FACE_INDEX_PATH, "application/octet-stream")
            StorageService.upload_file(temp_map_path, cls.FACE_MAPPING_PATH, "application/json")
        finally:
            if os.path.exists(temp_idx_path):
                os.remove(temp_idx_path)
            if os.path.exists(temp_map_path):
                os.remove(temp_map_path)
        
        # Save Person Index
        fd_idx, temp_idx_path = tempfile.mkstemp(suffix=".faiss")
        os.close(fd_idx)
        fd_map, temp_map_path = tempfile.mkstemp(suffix=".json")
        os.close(fd_map)
        
        try:
            faiss.write_index(cls.person_index, temp_idx_path)
            with open(temp_map_path, "w", encoding="utf-8") as f:
                json.dump(cls.person_mapping, f, ensure_ascii=False, indent=2)
                
            StorageService.upload_file(temp_idx_path, cls.PERSON_INDEX_PATH, "application/octet-stream")
            StorageService.upload_file(temp_map_path, cls.PERSON_MAPPING_PATH, "application/json")
        finally:
            if os.path.exists(temp_idx_path):
                os.remove(temp_idx_path)
            if os.path.exists(temp_map_path):
                os.remove(temp_map_path)
        
        print("IndexManager: Saved and uploaded indexes and mapping files successfully.")

    @classmethod
    def add_face_embedding(cls, media_id, face_id, person_id, embedding):
        """
        Adds a single face embedding to the FAISS face index.
        """
        with cls._lock:
            emb_np = np.array([embedding], dtype=np.float32)
            cls.face_index.add(emb_np)
            cls.face_mapping.append({
                "media_id": media_id,
                "face_id": face_id,
                "person_id": person_id
            })
            cls.save_indexes()

    @classmethod
    def add_person_embedding(cls, media_id, person_uuid, person_id, embedding):
        """
        Adds a single person ReID embedding to the FAISS person index.
        """
        with cls._lock:
            emb_np = np.array([embedding], dtype=np.float32)
            cls.person_index.add(emb_np)
            cls.person_mapping.append({
                "media_id": media_id,
                "person_uuid": person_uuid, # Unique ID of this detection
                "person_id": person_id # Person cluster ID
            })
            cls.save_indexes()

    @classmethod
    def search_face(cls, embedding, threshold=0.4, top_k=20):
        """
        Searches the face index for matches.
        Returns list of dicts: [{"media_id", "face_id", "person_id", "similarity"}]
        """
        if cls.face_index is None or cls.face_index.ntotal == 0:
            return []
            
        emb_np = np.array([embedding], dtype=np.float32)
        similarities, indices = cls.face_index.search(emb_np, min(top_k, cls.face_index.ntotal))
        
        results = []
        for sim, idx in zip(similarities[0], indices[0]):
            if idx < 0 or idx >= len(cls.face_mapping):
                continue
            if sim >= threshold:
                meta = cls.face_mapping[idx].copy()
                meta["similarity"] = float(sim)
                results.append(meta)
        return results

    @classmethod
    def search_person(cls, embedding, threshold=0.4, top_k=20):
        """
        Searches the person index for matches.
        Returns list of dicts: [{"media_id", "person_uuid", "person_id", "similarity"}]
        """
        if cls.person_index is None or cls.person_index.ntotal == 0:
            return []
            
        emb_np = np.array([embedding], dtype=np.float32)
        similarities, indices = cls.person_index.search(emb_np, min(top_k, cls.person_index.ntotal))
        
        results = []
        for sim, idx in zip(similarities[0], indices[0]):
            if idx < 0 or idx >= len(cls.person_mapping):
                continue
            if sim >= threshold:
                meta = cls.person_mapping[idx].copy()
                meta["similarity"] = float(sim)
                results.append(meta)
        return results

    @classmethod
    def rebuild_indexes_from_db(cls):
        """
        Rebuilds indexes from all records in the Firestore database.
        """
        from db_service import DBService
        
        with cls._lock:
            print("IndexManager: Rebuilding vector indexes from database...")
            
            # Reset indexes
            cls.face_index = faiss.IndexFlatIP(512)
            cls.face_mapping = []
            
            cls.person_index = faiss.IndexFlatIP(768)
            cls.person_mapping = []
            
            # 1. Fetch and add faces
            faces = DBService.get_all_faces()
            face_embeddings = []
            for face in faces:
                emb = face.get("embedding")
                if emb and len(emb) == 512:
                    face_embeddings.append(emb)
                    cls.face_mapping.append({
                        "media_id": face.get("media_id"),
                        "face_id": face.get("id"),
                        "person_id": face.get("person_id")
                    })
            if face_embeddings:
                cls.face_index.add(np.array(face_embeddings, dtype=np.float32))
                
            # 2. Fetch and add persons
            persons = DBService.get_all_persons()
            person_embeddings = []
            for person in persons:
                emb = person.get("embedding")
                if emb and len(emb) == 768:
                    person_embeddings.append(emb)
                    cls.person_mapping.append({
                        "media_id": person.get("media_id"),
                        "person_uuid": person.get("id"),
                        "person_id": person.get("person_id")
                    })
            if person_embeddings:
                cls.person_index.add(np.array(person_embeddings, dtype=np.float32))
                
            cls.save_indexes()
            print(f"IndexManager Rebuild complete: {cls.face_index.ntotal} faces, {cls.person_index.ntotal} persons indexed.")
