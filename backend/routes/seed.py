from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User, Role
from config.security import get_password_hash

router = APIRouter()

@router.post("/seed")
def seed_database(db: Session = Depends(get_db)):
    """
    Initialize database with test data
    WARNING: This should only be used in development
    """
    try:
        # Check if roles already exist
        existing_roles = db.query(Role).count()
        if existing_roles > 0:
            return {"message": "Database already seeded", "status": "skipped"}
        
        # Create Roles
        roles_data = [
            {"name": "ADMIN"},
            {"name": "TEACHER"},
            {"name": "STUDENT"},
        ]
        
        roles = {}
        for role_data in roles_data:
            role = Role(**role_data)
            db.add(role)
            db.flush()
            roles[role_data["name"]] = role
        
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
        
        created_users = []
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
            created_users.append({
                "email": user_data["email"],
                "role": user_data["role"],
                "password": user_data["password"]
            })
        
        db.commit()
        
        return {
            "message": "Database seeded successfully",
            "status": "success",
            "users": created_users
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error seeding database: {str(e)}")
