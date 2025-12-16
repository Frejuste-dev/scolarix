from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from enum import Enum

class EvaluationTypeEnum(str, Enum):
    CONTROLE = "CONTROLE"
    EXAMEN = "EXAMEN"

class EvaluationBase(BaseModel):
    subject_id: int
    class_id: int
    period_id: int
    type: EvaluationTypeEnum = EvaluationTypeEnum.CONTROLE
    date: date
    max_score: float = 20.0
    title: Optional[str] = None

class EvaluationCreate(EvaluationBase):
    pass

class EvaluationResponse(BaseModel):
    id: int
    subject_id: int
    class_id: int
    period_id: int
    type: EvaluationTypeEnum
    date: date
    max_score: float
    title: Optional[str] = None
    
    class Config:
        from_attributes = True

class GradeBase(BaseModel):
    student_id: int
    score: float

class GradeCreate(GradeBase):
    evaluation_id: int

class GradeResponse(BaseModel):
    id: int
    evaluation_id: int
    student_id: int
    score: float
    
    class Config:
        from_attributes = True

class GradesBulkSave(BaseModel):
    grades: List[GradeBase]
