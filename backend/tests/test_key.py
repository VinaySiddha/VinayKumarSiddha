import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

def test_key_format():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(os.path.dirname(backend_dir), '.env')
    load_dotenv(dotenv_path)

    client_email = os.getenv("GOOGLE_CLIENT_EMAIL")
    private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY")
    
    print(f"Raw private key starts with: {private_key_raw[:50] if private_key_raw else 'None'}")
    
    # Try cleaning option 1: replace double quotes, then replace \\n with \n
    pk1 = private_key_raw.strip('"\'').replace('\\n', '\n')
    print(f"\nOption 1 private key starts with:\n{pk1[:100]}")
    try:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": "mlsc-30",
            "private_key": pk1,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        print("Option 1 SUCCESS!")
        return
    except Exception as e:
        print(f"Option 1 FAILED: {e}")
        
    # Try cleaning option 2: reconstruct PEM key by wrapping base64 content
    try:
        # Extract base64 part
        key_body = private_key_raw.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "")
        key_body = key_body.strip('"\'')
        key_body = key_body.replace('\\n', '').replace('\n', '').replace('\r', '').replace(' ', '')
        
        # Wrap base64 string at 64 characters per line
        wrapped = [key_body[i:i+64] for i in range(0, len(key_body), 64)]
        pk2 = "-----BEGIN PRIVATE KEY-----\n" + "\n".join(wrapped) + "\n-----END PRIVATE KEY-----\n"
        print(f"\nOption 2 private key starts with:\n{pk2[:100]}")
        
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": "mlsc-30",
            "private_key": pk2,
            "client_email": client_email,
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        print("Option 2 SUCCESS!")
        return
    except Exception as e:
        print(f"Option 2 FAILED: {e}")

if __name__ == "__main__":
    test_key_format()
