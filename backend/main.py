from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, students, teachers, academic, operations, seed
from config.database import engine, Base

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SCOLARIX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Explicit origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(teachers.router, prefix="/api/teachers", tags=["Teachers"])
app.include_router(academic.router, prefix="/api/academic", tags=["Academic"])
app.include_router(operations.router, prefix="/api/operations", tags=["Operations"])
app.include_router(seed.router, prefix="/api/seed", tags=["Database Seed"])

