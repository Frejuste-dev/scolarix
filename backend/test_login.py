"""Test the login endpoint directly"""
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

from config.database import SessionLocal
from controller.auth_controller import AuthController

def test_login():
    db = SessionLocal()
    try:
        print("Testing authentication...")
        user = AuthController.authenticate_user(db, "admin@scolarix.com", "password")
        
        if user:
            print(f"✅ Authentication SUCCESSFUL!")
            print(f"User: {user.firstname} {user.lastname}")
            print(f"Email: {user.email}")
            print(f"Roles: {[role.name for role in user.roles]}")
        else:
            print("❌ Authentication FAILED!")
            
    except Exception as e:
        print(f"❌ Error during authentication: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_login()
