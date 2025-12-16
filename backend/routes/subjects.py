from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from config.database import get_db
from controller.subject_controller import SubjectController

router = APIRouter()

@router.get("/")
def get_subjects(db: Session = Depends(get_db)):
    return SubjectController.get_all_subjects(db)

@router.post("/")
def create_subject(data: dict, db: Session = Depends(get_db)):
    return SubjectController.create_subject(db, data)

@router.get("/class-subjects")
def get_class_subjects(class_id: int, db: Session = Depends(get_db)):
    return SubjectController.get_class_subjects(db, class_id)

@router.get("/class-subjects/my")
def get_teacher_subjects(teacher_id: int, db: Session = Depends(get_db)):
    return SubjectController.get_teacher_subjects(db, teacher_id)

@router.post("/class-subjects")
def create_class_subject(data: dict, db: Session = Depends(get_db)):
    return SubjectController.create_class_subject(db, data)
