from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from config.database import get_db
from config.settings import settings
from config.security import create_access_token
from controller.auth_controller import AuthController
from schemas.auth import Token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = AuthController.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.userID},
        expires_delta=access_token_expires
    )
    
    # Get user roles
    roles = [role.name for role in user.roles] if user.roles else []
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.userID,
            "first_name": user.firstname,
            "last_name": user.lastname,
            "email": user.email,
            "role": roles[0] if roles else "STUDENT",  # Primary role
        }
    }

@router.post("/register")
def register(user_data: dict, db: Session = Depends(get_db)):
    return AuthController.register_user(db, user_data)

@router.get("/me")
def get_current_user_info(current_user = Depends(AuthController.get_current_user)):
    return current_user

