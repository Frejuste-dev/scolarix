from sqlalchemy.orm import Session
from models.subject import Subject, ClassSubject
from fastapi import HTTPException

class SubjectController:
    @staticmethod
    def get_all_subjects(db: Session):
        subjects = db.query(Subject).all()
        return [SubjectController._format_subject(s) for s in subjects]
    
    @staticmethod
    def create_subject(db: Session, subject_data: dict):
        new_subject = Subject(
            name=subject_data["name"],
            coefficient=subject_data.get("coefficient", 1.0)
        )
        db.add(new_subject)
        db.commit()
        db.refresh(new_subject)
        return SubjectController._format_subject(new_subject)
    
    @staticmethod
    def get_class_subjects(db: Session, class_id: int):
        class_subjects = db.query(ClassSubject).filter(ClassSubject.classID == class_id).all()
        return [SubjectController._format_class_subject(cs) for cs in class_subjects]
    
    @staticmethod
    def get_teacher_subjects(db: Session, teacher_id: int):
        class_subjects = db.query(ClassSubject).filter(ClassSubject.teacherID == teacher_id).all()
        return [SubjectController._format_class_subject(cs) for cs in class_subjects]
    
    @staticmethod
    def create_class_subject(db: Session, data: dict):
        new_cs = ClassSubject(
            classID=data["class_id"],
            subjectID=data["subject_id"],
            teacherID=data.get("teacher_id")
        )
        db.add(new_cs)
        db.commit()
        db.refresh(new_cs)
        return SubjectController._format_class_subject(new_cs)
    
    @staticmethod
    def _format_subject(subject: Subject):
        return {
            "id": subject.subjectID,
            "name": subject.name,
            "coefficient": subject.coefficient
        }
    
    @staticmethod
    def _format_class_subject(cs: ClassSubject):
        return {
            "id": cs.classSubjectID,
            "class_id": cs.classID,
            "subject_id": cs.subjectID,
            "teacher_id": cs.teacherID,
            "subject": SubjectController._format_subject(cs.subject) if cs.subject else None
        }
