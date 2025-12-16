from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from controller.teacher_controller import TeacherController
from schemas.teacher import TeacherCreate, TeacherResponse, TeacherUpdate

router = APIRouter()

@router.post("/", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
def create_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    return TeacherController.create_teacher(db, teacher)

@router.get("/", response_model=List[TeacherResponse])
def get_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return TeacherController.get_all_teachers(db, skip, limit)

@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)):
    return TeacherController.get_teacher_by_id(db, teacher_id)

@router.put("/{teacher_id}", response_model=TeacherResponse)
def update_teacher(teacher_id: int, teacher: TeacherUpdate, db: Session = Depends(get_db)):
    return TeacherController.update_teacher(db, teacher_id, teacher)

@router.delete("/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    return TeacherController.delete_teacher(db, teacher_id)
