from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from models.student import GenderEnum

class StudentBase(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    matricule: Optional[str] = None
    birthdate: Optional[date] = None
    gender: Optional[GenderEnum] = GenderEnum.MALE
    phone: Optional[str] = None
    address: Optional[str] = None

class StudentCreate(StudentBase):
    password: str

class StudentUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[EmailStr] = None
    matricule: Optional[str] = None
    birthdate: Optional[date] = None
    gender: Optional[GenderEnum] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class StudentResponse(StudentBase):
    userID: int
    picture: Optional[str] = None
    
    class Config:
        from_attributes = True
