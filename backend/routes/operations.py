from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from controller.operations_controller import OperationsController
from schemas.operations import EnrollmentCreate, EnrollmentResponse

router = APIRouter()

# --- ENROLLMENT ROUTES ---
@router.post("/enrollments", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
def enroll_student(enrollment: EnrollmentCreate, db: Session = Depends(get_db)):
    return OperationsController.enroll_student(db, enrollment)

@router.get("/enrollments", response_model=List[EnrollmentResponse])
def get_enrollments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return OperationsController.get_enrollments(db, skip, limit)
