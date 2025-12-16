import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes import auth, students, teachers, academic, operations, seed, users, subjects, sessions, evaluations, reports
from config.database import engine, Base
from models.subject import Subject, ClassSubject
from models.session import Session, Attendance
from models.evaluation import Evaluation, Grade

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SCOLARIX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["Teachers"])
app.include_router(academic.router, prefix="/api/academic", tags=["Academic"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(evaluations.router, prefix="/api/evaluations", tags=["Evaluations"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(operations.router, prefix="/api/operations", tags=["Operations"])
app.include_router(seed.router, prefix="/api/seed", tags=["Database Seed"])

@app.get("/api/periods")
def get_periods_shortcut(year_id: int = None):
    from config.database import SessionLocal
    from models.classe import Period, AcademicYear
    from datetime import date
    db = SessionLocal()
    try:
        query = db.query(Period)
        if year_id:
            query = query.filter(Period.academicYearID == year_id)
        periods = query.all()
        today = date.today()
        return [{
            "id": p.periodID,
            "name": p.name,
            "academic_year_id": p.academicYearID,
            "start_date": str(p.startDate) if p.startDate else None,
            "end_date": str(p.endDate) if p.endDate else None,
            "is_active": bool(p.startDate and p.endDate and p.startDate <= today <= p.endDate)
        } for p in periods]
    finally:
        db.close()

@app.get("/api/classes")
def get_classes_shortcut(year_id: int = None):
    from config.database import SessionLocal
    from models.classe import Class
    db = SessionLocal()
    try:
        query = db.query(Class)
        if year_id:
            query = query.filter(Class.academicYearID == year_id)
        classes = query.all()
        return [{
            "id": c.classID,
            "name": c.name,
            "level": c.level,
            "filiere_id": c.filiereID,
            "academic_year_id": c.academicYearID,
            "filiere": {
                "id": c.filiere.filiereID,
                "name": c.filiere.name,
                "description": c.filiere.description
            } if c.filiere else None
        } for c in classes]
    finally:
        db.close()

@app.delete("/api/classes/{class_id}")
def delete_class_shortcut(class_id: int):
    from config.database import SessionLocal
    from models.classe import Class
    db = SessionLocal()
    try:
        class_obj = db.query(Class).filter(Class.classID == class_id).first()
        if not class_obj:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Classe non trouvée")
        db.delete(class_obj)
        db.commit()
        return {"message": "Classe supprimée"}
    finally:
        db.close()

@app.get("/api/class-subjects")
def get_class_subjects_shortcut(class_id: int):
    from config.database import SessionLocal
    from models.subject import ClassSubject
    db = SessionLocal()
    try:
        class_subjects = db.query(ClassSubject).filter(ClassSubject.classID == class_id).all()
        return [{
            "id": cs.classSubjectID,
            "class_id": cs.classID,
            "subject_id": cs.subjectID,
            "teacher_id": cs.teacherID,
            "subject": {
                "id": cs.subject.subjectID,
                "name": cs.subject.name,
                "coefficient": cs.subject.coefficient
            } if cs.subject else None
        } for cs in class_subjects]
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(static_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))
