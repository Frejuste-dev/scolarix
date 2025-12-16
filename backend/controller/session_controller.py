from sqlalchemy.orm import Session as DBSession
from models.session import Session, Attendance, AttendanceStatus
from models.subject import ClassSubject
from fastapi import HTTPException
from datetime import datetime

class SessionController:
    @staticmethod
    def get_sessions(db: DBSession, class_id: int, date_str: str = None):
        query = db.query(Session).join(ClassSubject).filter(ClassSubject.classID == class_id)
        if date_str:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            query = query.filter(Session.date == date_obj)
        sessions = query.all()
        return [SessionController._format_session(s) for s in sessions]
    
    @staticmethod
    def create_session(db: DBSession, data: dict):
        cs = db.query(ClassSubject).filter(
            ClassSubject.classID == data["class_id"],
            ClassSubject.subjectID == data["subject_id"]
        ).first()
        
        if not cs:
            cs = ClassSubject(
                classID=data["class_id"],
                subjectID=data["subject_id"],
                teacherID=data["teacher_id"]
            )
            db.add(cs)
            db.flush()
        
        new_session = Session(
            classSubjectID=cs.classSubjectID,
            date=data["date"],
            startTime=data["start_time"],
            endTime=data["end_time"],
            title=data.get("title")
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return SessionController._format_session(new_session)
    
    @staticmethod
    def get_attendance(db: DBSession, session_id: int):
        attendances = db.query(Attendance).filter(Attendance.sessionID == session_id).all()
        return [SessionController._format_attendance(a) for a in attendances]
    
    @staticmethod
    def save_attendance(db: DBSession, session_id: int, attendances: list):
        db.query(Attendance).filter(Attendance.sessionID == session_id).delete()
        
        for att in attendances:
            new_att = Attendance(
                sessionID=session_id,
                studentID=att["student_id"],
                status=AttendanceStatus(att["status"]),
                comment=att.get("comment")
            )
            db.add(new_att)
        
        db.commit()
        return {"message": "Présences enregistrées"}
    
    @staticmethod
    def _format_session(session: Session):
        cs = session.class_subject
        return {
            "id": session.sessionID,
            "subject_id": cs.subjectID if cs else None,
            "class_id": cs.classID if cs else None,
            "teacher_id": cs.teacherID if cs else None,
            "date": str(session.date),
            "start_time": str(session.startTime),
            "end_time": str(session.endTime),
            "title": session.title
        }
    
    @staticmethod
    def _format_attendance(att: Attendance):
        return {
            "session_id": att.sessionID,
            "student_id": att.studentID,
            "status": att.status.value,
            "comment": att.comment
        }
