"""Test script to verify password hashing and verification"""
import os
from pathlib import Path

# Change to backend directory
backend_dir = Path(__file__).parent
os.chdir(backend_dir)

# Load .env manually
env_file = backend_dir / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key, value)

import bcrypt
from config.database import SessionLocal
from models.user import User

def test_password_verification():
    db = SessionLocal()
    try:
        # Get admin user
        admin = db.query(User).filter(User.email == "admin@scolarix.com").first()
        
        if not admin:
            print("❌ Admin user not found!")
            return
        
        print(f"✅ Found user: {admin.email}")
        print(f"Password hash in DB: {admin.password_hash[:50]}...")
        
        # Test password verification
        test_password = "password"
        password_bytes = test_password.encode('utf-8')
        hash_bytes = admin.password_hash.encode('utf-8')
        
        print(f"\nTesting password verification...")
        try:
            result = bcrypt.checkpw(password_bytes, hash_bytes)
            if result:
                print("✅ Password verification SUCCESSFUL!")
            else:
                print("❌ Password verification FAILED!")
        except Exception as e:
            print(f"❌ Error during verification: {e}")
            
            # Try to create a new hash and compare
            print("\nCreating new hash for comparison...")
            new_hash = bcrypt.hashpw(password_bytes[:72], bcrypt.gensalt())
            print(f"New hash: {new_hash.decode('utf-8')[:50]}...")
            
            # Test with new hash
            if bcrypt.checkpw(password_bytes, new_hash):
                print("✅ New hash verification works!")
                print("\n⚠️  The issue is with the stored hash format.")
                print("Recommendation: Re-run seed_simple.py to recreate users with correct hash format")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_password_verification()
