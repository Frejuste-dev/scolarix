from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Enum
from sqlalchemy.orm import relationship
from config.database import Base
import enum

class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    RETARD = "RETARD"
    JUSTIFIE = "JUSTIFIE"

class Session(Base):
    __tablename__ = "sessions"
    
    sessionID = Column(Integer, primary_key=True, autoincrement=True)
    classSubjectID = Column(Integer, ForeignKey('class_subjects.classSubjectID', ondelete='CASCADE'), nullable=False)
    date = Column(Date, nullable=False)
    startTime = Column(Time, nullable=False)
    endTime = Column(Time, nullable=False)
    title = Column(String(200))
    
    class_subject = relationship("ClassSubject", back_populates="sessions")
    attendances = relationship("Attendance", back_populates="session", cascade="all, delete-orphan")

class Attendance(Base):
    __tablename__ = "attendances"
    
    attendanceID = Column(Integer, primary_key=True, autoincrement=True)
    sessionID = Column(Integer, ForeignKey('sessions.sessionID', ondelete='CASCADE'), nullable=False)
    studentID = Column(Integer, ForeignKey('students.userID', ondelete='CASCADE'), nullable=False)
    status = Column(Enum(AttendanceStatus), default=AttendanceStatus.PRESENT)
    comment = Column(String(500))
    
    session = relationship("Session", back_populates="attendances")
