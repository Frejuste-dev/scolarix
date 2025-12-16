from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from controller.report_controller import ReportController

router = APIRouter()

@router.get("/student/{student_id}")
def get_student_report(student_id: int, period_id: int, db: Session = Depends(get_db)):
    return ReportController.get_student_report(db, student_id, period_id)

@router.get("/class/{class_id}")
def get_class_reports(class_id: int, period_id: int, db: Session = Depends(get_db)):
    return ReportController.get_class_reports(db, class_id, period_id)
