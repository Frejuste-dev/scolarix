from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from config.database import Base
import enum

class EvaluationType(str, enum.Enum):
    CONTROLE = "CONTROLE"
    EXAMEN = "EXAMEN"

class Evaluation(Base):
    __tablename__ = "evaluations"
    
    evaluationID = Column(Integer, primary_key=True, autoincrement=True)
    classSubjectID = Column(Integer, ForeignKey('class_subjects.classSubjectID', ondelete='CASCADE'), nullable=False)
    periodID = Column(Integer, ForeignKey('periods.periodID', ondelete='CASCADE'), nullable=False)
    type = Column(Enum(EvaluationType), default=EvaluationType.CONTROLE)
    date = Column(Date, nullable=False)
    maxScore = Column(Float, default=20.0)
    title = Column(String(200))
    
    class_subject = relationship("ClassSubject", back_populates="evaluations")
    grades = relationship("Grade", back_populates="evaluation", cascade="all, delete-orphan")

class Grade(Base):
    __tablename__ = "grades"
    
    gradeID = Column(Integer, primary_key=True, autoincrement=True)
    evaluationID = Column(Integer, ForeignKey('evaluations.evaluationID', ondelete='CASCADE'), nullable=False)
    studentID = Column(Integer, ForeignKey('students.userID', ondelete='CASCADE'), nullable=False)
    score = Column(Float, nullable=False)
    
    evaluation = relationship("Evaluation", back_populates="grades")
