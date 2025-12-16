from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Subject(Base):
    __tablename__ = "subjects"
    
    subjectID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    coefficient = Column(Float, default=1.0)
    
    class_subjects = relationship("ClassSubject", back_populates="subject")

class ClassSubject(Base):
    __tablename__ = "class_subjects"
    
    classSubjectID = Column(Integer, primary_key=True, autoincrement=True)
    classID = Column(Integer, ForeignKey('classes.classID', ondelete='CASCADE'), nullable=False)
    subjectID = Column(Integer, ForeignKey('subjects.subjectID', ondelete='CASCADE'), nullable=False)
    teacherID = Column(Integer, ForeignKey('users.userID'), nullable=True)
    
    subject = relationship("Subject", back_populates="class_subjects")
    sessions = relationship("Session", back_populates="class_subject")
    evaluations = relationship("Evaluation", back_populates="class_subject")
