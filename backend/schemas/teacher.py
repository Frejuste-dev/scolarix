from pydantic import BaseModel, EmailStr
from typing import Optional

class TeacherBase(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    grade: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class TeacherCreate(TeacherBase):
    password: str

class TeacherUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[EmailStr] = None
    grade: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class TeacherResponse(TeacherBase):
    userID: int
    picture: Optional[str] = None
    
    class Config:
        from_attributes = True
