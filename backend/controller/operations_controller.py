from sqlalchemy.orm import Session
from models.classe import Enrollment
from schemas.operations import EnrollmentCreate
from fastapi import HTTPException

class OperationsController:
    # --- ENROLLMENT ---
    @staticmethod
    def enroll_student(db: Session, enrollment: EnrollmentCreate):
        # Check if enrollment already exists
        existing = db.query(Enrollment).filter(
            Enrollment.studentID == enrollment.studentID,
            Enrollment.classID == enrollment.classID
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="L'étudiant est déjà inscrit dans cette classe")
            
        new_enrollment = Enrollment(**enrollment.dict())
        db.add(new_enrollment)
        db.commit()
        db.refresh(new_enrollment)
        return new_enrollment
    
    @staticmethod
    def get_enrollments(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Enrollment).offset(skip).limit(limit).all()
