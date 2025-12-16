from sqlalchemy.orm import Session
from models.classe import Filiere, AcademicYear, Period, Class
from schemas.academic import FiliereCreate, AcademicYearCreate, PeriodCreate, ClassCreate
from fastapi import HTTPException

class AcademicController:
    # --- FILIERE ---
    @staticmethod
    def create_filiere(db: Session, filiere: FiliereCreate):
        new_filiere = Filiere(**filiere.dict())
        db.add(new_filiere)
        db.commit()
        db.refresh(new_filiere)
        return new_filiere

    @staticmethod
    def get_filieres(db: Session):
        return db.query(Filiere).all()

    # --- ACADEMIC YEAR ---
    @staticmethod
    def create_year(db: Session, year: AcademicYearCreate):
        new_year = AcademicYear(**year.dict())
        db.add(new_year)
        db.commit()
        db.refresh(new_year)
        return new_year
    
    @staticmethod
    def get_years(db: Session):
        return db.query(AcademicYear).all()

    # --- PERIOD ---
    @staticmethod
    def create_period(db: Session, period: PeriodCreate):
        new_period = Period(**period.dict())
        db.add(new_period)
        db.commit()
        db.refresh(new_period)
        return new_period

    # --- CLASS ---
    @staticmethod
    def create_class(db: Session, class_data: ClassCreate):
        new_class = Class(**class_data.dict())
        db.add(new_class)
        db.commit()
        db.refresh(new_class)
        return new_class
    
    @staticmethod
    def get_classes(db: Session):
        return db.query(Class).all()
