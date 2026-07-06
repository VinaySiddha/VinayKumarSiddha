import os
from dotenv import load_dotenv

def main():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    dotenv_path = os.path.join(os.path.dirname(backend_dir), '.env')
    load_dotenv(dotenv_path)

    private_key_raw = os.getenv("GOOGLE_PRIVATE_KEY")
    if not private_key_raw:
        print("GOOGLE_PRIVATE_KEY not found in environment!")
        return

    # Clean the key
    # In some envs, the key is double quoted and contains literal \n characters (2 characters: backslash and n)
    # We replace literal '\\n' with actual newline
    pk = private_key_raw.strip('"\'').replace('\\n', '\n')
    
    pem_path = os.path.join(backend_dir, "key.pem")
    with open(pem_path, "w", encoding="utf-8") as f:
        f.write(pk)
        
    print(f"Wrote private key to {pem_path}")
    print(f"File size: {os.path.getsize(pem_path)} bytes")
    print("First line:", repr(pk.split('\n')[0]))
    print("Second line (start):", repr(pk.split('\n')[1][:30]))
    
if __name__ == "__main__":
    main()
