import os
import sys
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, storage

def test_conn():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(os.path.dirname(backend_dir), '.env')
    load_dotenv(dotenv_path)

    client_email = os.getenv("GOOGLE_CLIENT_EMAIL")
    private_key = os.getenv("GOOGLE_PRIVATE_KEY")

    if not client_email or not private_key:
        print("Error: GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY not set in .env")
        sys.exit(1)

    # Reconstruct private key if it has literal \n
    private_key = private_key.replace('\\n', '\n')
    
    # Extract project_id from client_email
    # E.g., firebase-adminsdk-fbsvc@mlsc-30.iam.gserviceaccount.com -> mlsc-30
    project_id = "mlsc-30"
    if "@" in client_email:
        domain = client_email.split("@")[1]
        if ".iam.gserviceaccount.com" in domain:
            project_id = domain.replace(".iam.gserviceaccount.com", "")
            
    print(f"Project ID: {project_id}")
    print(f"Client Email: {client_email}")
    
    try:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": project_id,
            "private_key": private_key,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        
        firebase_admin.initialize_app(cred, {
            'storageBucket': f"{project_id}.appspot.com"
        })
        
        print("Firebase Admin initialized successfully!")
        
        # Test Firestore
        db = firestore.client()
        print("Testing Firestore database connection...")
        # Write to a test collection
        doc_ref = db.collection('test_connection').document('status')
        doc_ref.set({
            'connected': True,
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        print("Firestore write succeeded!")
        
        # Read from test collection
        doc = doc_ref.get()
        print(f"Firestore read succeeded! Doc data: {doc.to_dict()}")
        
        # Test Storage
        bucket = storage.bucket()
        print("Testing Storage bucket connection...")
        print(f"Bucket name: {bucket.name}")
        # List blobs to check read permissions
        blobs = list(bucket.list_blobs(max_results=5))
        print(f"Successfully connected to Storage! Found {len(blobs)} blobs.")
        for b in blobs:
            print(f"  Blob: {b.name}")
            
    except Exception as e:
        print(f"Error testing Firebase connection: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_conn()
