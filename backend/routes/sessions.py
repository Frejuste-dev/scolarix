from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from config.database import get_db
from controller.session_controller import SessionController

router = APIRouter()

@router.get("/")
def get_sessions(class_id: int, date: Optional[str] = None, db: Session = Depends(get_db)):
    return SessionController.get_sessions(db, class_id, date)

@router.post("/")
def create_session(data: dict, db: Session = Depends(get_db)):
    return SessionController.create_session(db, data)

@router.get("/{session_id}/attendance")
def get_attendance(session_id: int, db: Session = Depends(get_db)):
    return SessionController.get_attendance(db, session_id)

@router.post("/{session_id}/attendance")
def save_attendance(session_id: int, data: dict, db: Session = Depends(get_db)):
    return SessionController.save_attendance(db, session_id, data.get("attendances", []))
