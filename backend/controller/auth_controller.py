from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError
from config.database import get_db
from config.security import verify_password, get_password_hash, decode_access_token
from models.user import User, Role
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

class AuthController:
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str):
        user = db.query(User).filter(User.email == email, User.isActive == True).first()
        if not user:
            return False
        if not verify_password(password, user.password_hash):
            return False
        return user
    
    @staticmethod
    def register_user(db: Session, user_data: dict):
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
        hashed_password = get_password_hash(user_data["password"])
        new_user = User(
            firstname=user_data["firstname"],
            lastname=user_data["lastname"],
            email=user_data["email"],
            password_hash=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Utilisateur créé avec succès", "userID": new_user.userID}
    
    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        payload = decode_access_token(token)
        if payload is None:
            raise credentials_exception
        
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        
        if email is None or user_id is None:
            raise credentials_exception
        
        user = db.query(User).filter(User.userID == user_id).first()
        if user is None:
            raise credentials_exception
        
        return user

