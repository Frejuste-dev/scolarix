from pydantic import BaseModel
from typing import Optional
from datetime import date

# Enrollment
class EnrollmentBase(BaseModel):
    studentID: int
    classID: int
    enrollmentDate: Optional[date] = None

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentResponse(EnrollmentBase):
    class Config:
        from_attributes = True
