from sqlalchemy import Column, Integer, String, Date, ForeignKey, Table
from sqlalchemy.orm import relationship
from config.database import Base

class Filiere(Base):
    __tablename__ = "filieres"
    
    filiereID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String)
    
    classes = relationship("Class", back_populates="filiere")

class AcademicYear(Base):
    __tablename__ = "academic_years"
    
    academicYearID = Column(Integer, primary_key=True, autoincrement=True)
    label = Column(String(20), unique=True, nullable=False)
    startDate = Column(Date)
    endDate = Column(Date)
    isActive = Column(Integer, default=0)
    
    periods = relationship("Period", back_populates="academic_year")
    classes = relationship("Class", back_populates="academic_year")

class Period(Base):
    __tablename__ = "periods"
    
    periodID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    academicYearID = Column(Integer, ForeignKey('academic_years.academicYearID'), nullable=False)
    startDate = Column(Date)
    endDate = Column(Date)
    
    academic_year = relationship("AcademicYear", back_populates="periods")
    # evaluations = relationship("Evaluation", back_populates="period")  # TODO: Uncomment when Evaluation model is created
    # report_cards = relationship("ReportCard", back_populates="period")  # TODO: Uncomment when ReportCard model is created

class Class(Base):
    __tablename__ = "classes"
    
    classID = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    level = Column(String(50))
    filiereID = Column(Integer, ForeignKey('filieres.filiereID'))
    academicYearID = Column(Integer, ForeignKey('academic_years.academicYearID'))
    
    filiere = relationship("Filiere", back_populates="classes")
    academic_year = relationship("AcademicYear", back_populates="classes")
    enrollments = relationship("Enrollment", back_populates="class_")
    # class_subjects = relationship("ClassSubject", back_populates="class_")  # TODO: Uncomment when ClassSubject model is created
    # report_cards = relationship("ReportCard", back_populates="class_")  # TODO: Uncomment when ReportCard model is created

class Enrollment(Base):
    __tablename__ = "enrollments"
    
    studentID = Column(Integer, ForeignKey('students.userID', ondelete='CASCADE'), primary_key=True)
    classID = Column(Integer, ForeignKey('classes.classID', ondelete='CASCADE'), primary_key=True)
    enrollmentDate = Column(Date)
    
    student = relationship("Student")  # back_populates="enrollments" - TODO: Uncomment in Student model when ready
    class_ = relationship("Class", back_populates="enrollments")

    