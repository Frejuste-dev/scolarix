from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.database import get_db
from controller.evaluation_controller import EvaluationController

router = APIRouter()

@router.get("/")
def get_evaluations(class_id: int, subject_id: int, period_id: int, db: Session = Depends(get_db)):
    return EvaluationController.get_evaluations(db, class_id, subject_id, period_id)

@router.post("/")
def create_evaluation(data: dict, db: Session = Depends(get_db)):
    return EvaluationController.create_evaluation(db, data)

@router.post("/{evaluation_id}/grades")
def save_grades(evaluation_id: int, data: dict, db: Session = Depends(get_db)):
    return EvaluationController.save_grades(db, evaluation_id, data.get("grades", []))
