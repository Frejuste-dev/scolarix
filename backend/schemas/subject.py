from pydantic import BaseModel
from typing import Optional

class SubjectBase(BaseModel):
    name: str
    coefficient: float = 1.0

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int
    
    class Config:
        from_attributes = True

class ClassSubjectBase(BaseModel):
    class_id: int
    subject_id: int
    teacher_id: Optional[int] = None

class ClassSubjectCreate(ClassSubjectBase):
    pass

class ClassSubjectResponse(BaseModel):
    id: int
    class_id: int
    subject_id: int
    teacher_id: Optional[int] = None
    subject: Optional[SubjectResponse] = None
    
    class Config:
        from_attributes = True
