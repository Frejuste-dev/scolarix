from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role_ids: List[int] = []

class UserUpdate(BaseModel):
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[EmailStr] = None
    isActive: Optional[bool] = None

class UserResponse(UserBase):
    userID: int
    isActive: bool
    createdAt: datetime
    roles: List[str] = []
    
    class Config:
        from_attributes = True