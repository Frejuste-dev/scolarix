from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Teacher(Base):
    __tablename__ = "teachers"
    
    userID = Column(Integer, ForeignKey('users.userID', ondelete='CASCADE'), primary_key=True)
    grade = Column(String(100))
    phone = Column(String(20))
    address = Column(String(255))
    picture = Column(String(255))
    
    user = relationship("User")  # back_populates commented in User model
    # class_subjects = relationship("ClassSubject", back_populates="teacher")  # TODO: Uncomment when ClassSubject model is created
    # sessions = relationship("Session", back_populates="teacher")  # TODO: Uncomment when Session model is created
    # evaluations = relationship("Evaluation", back_populates="teacher")  # TODO: Uncomment when Evaluation model is created
    