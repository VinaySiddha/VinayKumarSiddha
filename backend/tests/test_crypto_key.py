import os
from dotenv import load_dotenv
from cryptography.hazmat.primitives import serialization

def test_crypto():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(os.path.dirname(backend_dir), '.env')
    load_dotenv(dotenv_path)

    private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY")
    
    # Try different key sanitizations
    pk = private_key_raw.strip('"\'').replace('\\n', '\n')
    print("Trying load_pem_private_key on pk...")
    try:
        key = serialization.load_pem_private_key(pk.encode('utf-8'), password=None)
        print("Success loading private key!")
        return
    except Exception as e:
        print(f"Failed direct load: {e}")

    # Let's try base64 decoding and loading as DER
    import base64
    try:
        body = private_key_raw.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "")
        body = body.strip('"\'').replace('\\n', '').replace('\n', '').replace('\r', '').replace(' ', '')
        decoded = base64.b64decode(body)
        print(f"Decoded bytes length: {len(decoded)}")
        key = serialization.load_der_private_key(decoded, password=None)
        print("Success loading private key from DER bytes!")
        
        # Let's re-encode it to PEM using cryptography library!
        pem = key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        print("Successfully re-encoded to PEM PKCS8:")
        print(pem.decode('utf-8')[:150])
        
        # Let's write this pem key to a variable and test if it works with credentials.Certificate
        from firebase_admin import credentials
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": "mlsc-30",
            "private_key": pem.decode('utf-8'),
            "client_email": os.getenv("GOOGLE_CLIENT_EMAIL"),
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        print("Success initializing credentials.Certificate using re-encoded PEM key!")
    except Exception as e:
        print(f"Failed DER load/re-encode: {e}")

if __name__ == "__main__":
    test_crypto()
