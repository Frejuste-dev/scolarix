from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from config.database import get_db
from controller.user_controller import UserController

router = APIRouter()

@router.get("/")
def get_users(role: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return UserController.get_all_users(db, role, skip, limit)

@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return UserController.get_user_by_id(db, user_id)

@router.post("/")
def create_user(user_data: dict, db: Session = Depends(get_db)):
    return UserController.create_user(db, user_data)

@router.put("/{user_id}")
def update_user(user_id: int, user_data: dict, db: Session = Depends(get_db)):
    return UserController.update_user(db, user_id, user_data)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return UserController.delete_user(db, user_id)
