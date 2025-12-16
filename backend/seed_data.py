"""
Script to seed the database with initial data (users and roles)
Run this script once to populate the database with test data
"""
import os
import sys
from pathlib import Path

# Change to backend directory to ensure .env is found
backend_dir = Path(__file__).parent
os.chdir(backend_dir)

# Load environment variables manually from .env file
env_file = backend_dir / '.env'
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ.setdefault(key, value)

from sqlalchemy.orm import Session
from config.database import SessionLocal, engine, Base
from models.user import User, Role
from config.security import get_password_hash

def seed_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Check if roles already exist
        existing_roles = db.query(Role).count()
        if existing_roles > 0:
            print("⚠️  Database already seeded. Skipping...")
            return
        
        print("🌱 Seeding database...")
        
        # Create Roles
        roles_data = [
            {"roleName": "ADMIN", "description": "Administrator with full access"},
            {"roleName": "TEACHER", "description": "Teacher with teaching privileges"},
            {"roleName": "STUDENT", "description": "Student with learning access"},
        ]
        
        roles = {}
        for role_data in roles_data:
            role = Role(**role_data)
            db.add(role)
            db.flush()
            roles[role_data["roleName"]] = role
            print(f"✅ Created role: {role_data['roleName']}")
        
        # Create Users
        users_data = [
            {
                "firstname": "Admin",
                "lastname": "System",
                "email": "admin@scolarix.com",
                "password": "password",
                "role": "ADMIN"
            },
            {
                "firstname": "Jean",
                "lastname": "Dupont",
                "email": "teacher@scolarix.com",
                "password": "password",
                "role": "TEACHER"
            },
            {
                "firstname": "Marie",
                "lastname": "Martin",
                "email": "student@scolarix.com",
                "password": "password",
                "role": "STUDENT"
            },
        ]
        
        for user_data in users_data:
            user = User(
                firstname=user_data["firstname"],
                lastname=user_data["lastname"],
                email=user_data["email"],
                password_hash=get_password_hash(user_data["password"]),
                isActive=True
            )
            user.roles.append(roles[user_data["role"]])
            db.add(user)
            print(f"✅ Created user: {user_data['email']} (Role: {user_data['role']})")
        
        db.commit()
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Test Accounts:")
        print("=" * 50)
        for user_data in users_data:
            print(f"Email: {user_data['email']}")
            print(f"Password: {user_data['password']}")
            print(f"Role: {user_data['role']}")
            print("-" * 50)
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
