from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base
import enum

class GenderEnum(str, enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"

class Student(Base):
    __tablename__ = "students"
    
    userID = Column(Integer, ForeignKey('users.userID', ondelete='CASCADE'), primary_key=True)
    matricule = Column(String(50), unique=True)
    birthdate = Column(Date)
    gender = Column(Enum(GenderEnum), default=GenderEnum.MALE)
    phone = Column(String(20))
    address = Column(String(255))
    picture = Column(String(255))
    
    user = relationship("User")  # back_populates commented in User model
    # enrollments = relationship("Enrollment", back_populates="student")  # TODO: Uncomment when Enrollment model is created
    # attendances = relationship("Attendance", back_populates="student")  # TODO: Uncomment when Attendance model is created
    # grades = relationship("Grade", back_populates="student")  # TODO: Uncomment when Grade model is created
    # report_cards = relationship("ReportCard", back_populates="student")  # TODO: Uncomment when ReportCard model is created

