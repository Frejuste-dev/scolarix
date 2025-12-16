from pydantic import BaseModel
from typing import Optional, List
from datetime import date

# Filiere
class FiliereBase(BaseModel):
    name: str
    description: Optional[str] = None

class FiliereCreate(FiliereBase):
    pass

class FiliereResponse(FiliereBase):
    filiereID: int
    class Config:
        from_attributes = True

# Academic Year
class AcademicYearBase(BaseModel):
    label: str
    startDate: date
    endDate: date
    isActive: bool = False

class AcademicYearCreate(AcademicYearBase):
    pass

class AcademicYearResponse(AcademicYearBase):
    academicYearID: int
    class Config:
        from_attributes = True

# Period
class PeriodBase(BaseModel):
    name: str
    academicYearID: int
    startDate: date
    endDate: date

class PeriodCreate(PeriodBase):
    pass

class PeriodResponse(PeriodBase):
    periodID: int
    class Config:
        from_attributes = True

# Class
class ClassBase(BaseModel):
    name: str
    level: Optional[str] = None
    filiereID: Optional[int] = None
    academicYearID: Optional[int] = None

class ClassCreate(ClassBase):
    pass

class ClassResponse(ClassBase):
    classID: int
    class Config:
        from_attributes = True
