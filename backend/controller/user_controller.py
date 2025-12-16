from sqlalchemy.orm import Session
from models.user import User, Role
from config.security import get_password_hash
from fastapi import HTTPException

class UserController:
    @staticmethod
    def get_all_users(db: Session, role: str = None, skip: int = 0, limit: int = 100):
        query = db.query(User).filter(User.isActive == True)
        if role:
            query = query.join(User.roles).filter(Role.name == role)
        users = query.offset(skip).limit(limit).all()
        return [UserController._format_user(u) for u in users]
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        user = db.query(User).filter(User.userID == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return UserController._format_user(user)
    
    @staticmethod
    def create_user(db: Session, user_data: dict):
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
        hashed_password = get_password_hash(user_data.get("password", "password123"))
        new_user = User(
            firstname=user_data["first_name"],
            lastname=user_data["last_name"],
            email=user_data["email"],
            password_hash=hashed_password
        )
        
        if "role" in user_data:
            role = db.query(Role).filter(Role.name == user_data["role"]).first()
            if not role:
                role = Role(name=user_data["role"])
                db.add(role)
                db.flush()
            new_user.roles.append(role)
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return UserController._format_user(new_user)
    
    @staticmethod
    def update_user(db: Session, user_id: int, user_data: dict):
        user = db.query(User).filter(User.userID == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        if "first_name" in user_data and user_data["first_name"]:
            user.firstname = user_data["first_name"]
        if "last_name" in user_data and user_data["last_name"]:
            user.lastname = user_data["last_name"]
        if "email" in user_data and user_data["email"]:
            user.email = user_data["email"]
        if "password" in user_data and user_data["password"]:
            user.password_hash = get_password_hash(user_data["password"])
        
        db.commit()
        db.refresh(user)
        return UserController._format_user(user)
    
    @staticmethod
    def delete_user(db: Session, user_id: int):
        user = db.query(User).filter(User.userID == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        user.isActive = False
        db.commit()
        return {"message": "Utilisateur supprimé"}
    
    @staticmethod
    def _format_user(user: User):
        return {
            "id": user.userID,
            "first_name": user.firstname,
            "last_name": user.lastname,
            "email": user.email,
            "role": user.roles[0].name if user.roles else "STUDENT"
        }
