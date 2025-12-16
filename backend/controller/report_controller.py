from sqlalchemy.orm import Session as DBSession
from sqlalchemy import func
from models.evaluation import Evaluation, Grade
from models.subject import Subject, ClassSubject
from models.session import Session, Attendance, AttendanceStatus
from models.user import User
from models.classe import Enrollment
from fastapi import HTTPException

class ReportController:
    @staticmethod
    def get_student_report(db: DBSession, student_id: int, period_id: int):
        student = db.query(User).filter(User.userID == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Étudiant non trouvé")
        
        grades = db.query(Grade).join(Evaluation).filter(
            Grade.studentID == student_id,
            Evaluation.periodID == period_id
        ).all()
        
        subject_averages = {}
        for grade in grades:
            cs = grade.evaluation.class_subject
            if cs and cs.subject:
                sid = cs.subjectID
                if sid not in subject_averages:
                    subject_averages[sid] = {
                        "subject": {
                            "id": cs.subject.subjectID,
                            "name": cs.subject.name,
                            "coefficient": cs.subject.coefficient
                        },
                        "scores": [],
                        "max_scores": []
                    }
                subject_averages[sid]["scores"].append(grade.score)
                subject_averages[sid]["max_scores"].append(grade.evaluation.maxScore)
        
        subject_grades = []
        total_weighted = 0
        total_coef = 0
        
        for sid, data in subject_averages.items():
            if data["max_scores"]:
                normalized_scores = [s / m * 20 for s, m in zip(data["scores"], data["max_scores"])]
                avg = sum(normalized_scores) / len(normalized_scores)
                coef = data["subject"]["coefficient"]
                total_weighted += avg * coef
                total_coef += coef
                subject_grades.append({
                    "subject": data["subject"],
                    "average": round(avg, 2)
                })
        
        global_avg = round(total_weighted / total_coef, 2) if total_coef > 0 else 0
        
        presences = db.query(func.count(Attendance.attendanceID)).filter(
            Attendance.studentID == student_id,
            Attendance.status == AttendanceStatus.PRESENT
        ).scalar() or 0
        
        absences = db.query(func.count(Attendance.attendanceID)).filter(
            Attendance.studentID == student_id,
            Attendance.status.in_([AttendanceStatus.ABSENT, AttendanceStatus.RETARD])
        ).scalar() or 0
        
        return {
            "student": {
                "id": student.userID,
                "first_name": student.firstname,
                "last_name": student.lastname,
                "email": student.email,
                "role": "STUDENT"
            },
            "period_id": period_id,
            "subject_grades": subject_grades,
            "global_average": global_avg,
            "class_presences": presences,
            "class_absences": absences
        }
    
    @staticmethod
    def get_class_reports(db: DBSession, class_id: int, period_id: int):
        enrollments = db.query(Enrollment).filter(Enrollment.classID == class_id).all()
        reports = []
        for enrollment in enrollments:
            try:
                report = ReportController.get_student_report(db, enrollment.studentID, period_id)
                reports.append(report)
            except:
                pass
        return reports
