from sqlalchemy.orm import Session as DBSession
from models.evaluation import Evaluation, Grade, EvaluationType
from models.subject import ClassSubject
from fastapi import HTTPException

class EvaluationController:
    @staticmethod
    def get_evaluations(db: DBSession, class_id: int, subject_id: int, period_id: int):
        query = db.query(Evaluation).join(ClassSubject).filter(
            ClassSubject.classID == class_id,
            ClassSubject.subjectID == subject_id,
            Evaluation.periodID == period_id
        )
        evaluations = query.all()
        return [EvaluationController._format_evaluation(e) for e in evaluations]
    
    @staticmethod
    def create_evaluation(db: DBSession, data: dict):
        cs = db.query(ClassSubject).filter(
            ClassSubject.classID == data["class_id"],
            ClassSubject.subjectID == data["subject_id"]
        ).first()
        
        if not cs:
            cs = ClassSubject(
                classID=data["class_id"],
                subjectID=data["subject_id"]
            )
            db.add(cs)
            db.flush()
        
        new_eval = Evaluation(
            classSubjectID=cs.classSubjectID,
            periodID=data["period_id"],
            type=EvaluationType(data.get("type", "CONTROLE")),
            date=data["date"],
            maxScore=data.get("max_score", 20.0),
            title=data.get("title")
        )
        db.add(new_eval)
        db.commit()
        db.refresh(new_eval)
        return EvaluationController._format_evaluation(new_eval)
    
    @staticmethod
    def save_grades(db: DBSession, evaluation_id: int, grades: list):
        for g in grades:
            existing = db.query(Grade).filter(
                Grade.evaluationID == evaluation_id,
                Grade.studentID == g["student_id"]
            ).first()
            
            if existing:
                existing.score = g["score"]
            else:
                new_grade = Grade(
                    evaluationID=evaluation_id,
                    studentID=g["student_id"],
                    score=g["score"]
                )
                db.add(new_grade)
        
        db.commit()
        return {"message": "Notes enregistrées"}
    
    @staticmethod
    def _format_evaluation(evaluation: Evaluation):
        cs = evaluation.class_subject
        return {
            "id": evaluation.evaluationID,
            "subject_id": cs.subjectID if cs else None,
            "class_id": cs.classID if cs else None,
            "period_id": evaluation.periodID,
            "type": evaluation.type.value,
            "date": str(evaluation.date),
            "max_score": evaluation.maxScore,
            "title": evaluation.title
        }
