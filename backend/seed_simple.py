"""Simple test to create roles and users"""
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
from models.user import User, Role
import bcrypt

def create_test_users():
    db = SessionLocal()
    try:
        # Check if roles exist
        existing_roles = db.query(Role).count()
        if existing_roles > 0:
            print("✅ Roles already exist")
            roles = {role.name: role for role in db.query(Role).all()}
        else:
            print("Creating roles...")
            # Create roles
            admin_role = Role(name="ADMIN")
            teacher_role = Role(name="TEACHER")
            student_role = Role(name="STUDENT")
            
            db.add(admin_role)
            db.add(teacher_role)
            db.add(student_role)
            db.commit()
            
            roles = {"ADMIN": admin_role, "TEACHER": teacher_role, "STUDENT": student_role}
            print("✅ Roles created")
        
        # Check if users exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"✅ {existing_users} users already exist")
            return
        
        print("Creating users...")
        # Create users with simple password hashing
        users_data = [
            {"firstname": "Admin", "lastname": "System", "email": "admin@scolarix.com", "role": "ADMIN"},
            {"firstname": "Jean", "lastname": "Dupont", "email": "teacher@scolarix.com", "role": "TEACHER"},
            {"firstname": "Marie", "lastname": "Martin", "email": "student@scolarix.com", "role": "STUDENT"},
        ]
        
        for user_data in users_data:
            # Hash password using bcrypt directly
            password = "password"
            password_bytes = password.encode('utf-8')[:72]
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt)
            
            user = User(
                firstname=user_data["firstname"],
                lastname=user_data["lastname"],
                email=user_data["email"],
                password_hash=hashed.decode('utf-8'),
                isActive=True
            )
            user.roles.append(roles[user_data["role"]])
            db.add(user)
            print(f"✅ Created user: {user_data['email']}")
        
        db.commit()
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Test Accounts:")
        print("=" * 50)
        for user_data in users_data:
            print(f"Email: {user_data['email']}")
            print(f"Password: password")
            print(f"Role: {user_data['role']}")
            print("-" * 50)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()
