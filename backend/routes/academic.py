from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from controller.academic_controller import AcademicController
from schemas.academic import (
    FiliereCreate, FiliereResponse,
    AcademicYearCreate, AcademicYearResponse,
    PeriodCreate, PeriodResponse,
    ClassCreate, ClassResponse
)

router = APIRouter()

# --- FILIERE ROUTES ---
@router.post("/filieres", response_model=FiliereResponse, status_code=status.HTTP_201_CREATED)
def create_filiere(filiere: FiliereCreate, db: Session = Depends(get_db)):
    return AcademicController.create_filiere(db, filiere)

@router.get("/filieres", response_model=List[FiliereResponse])
def get_filieres(db: Session = Depends(get_db)):
    return AcademicController.get_filieres(db)

# --- ACADEMIC YEAR ROUTES ---
@router.post("/years", response_model=AcademicYearResponse, status_code=status.HTTP_201_CREATED)
def create_year(year: AcademicYearCreate, db: Session = Depends(get_db)):
    return AcademicController.create_year(db, year)

@router.get("/years", response_model=List[AcademicYearResponse])
def get_years(db: Session = Depends(get_db)):
    return AcademicController.get_years(db)

# --- PERIOD ROUTES ---
@router.post("/periods", response_model=PeriodResponse, status_code=status.HTTP_201_CREATED)
def create_period(period: PeriodCreate, db: Session = Depends(get_db)):
    return AcademicController.create_period(db, period)

# --- CLASS ROUTES ---
@router.post("/classes", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(class_data: ClassCreate, db: Session = Depends(get_db)):
    return AcademicController.create_class(db, class_data)

@router.get("/classes", response_model=List[ClassResponse])
def get_classes(db: Session = Depends(get_db)):
    return AcademicController.get_classes(db)
