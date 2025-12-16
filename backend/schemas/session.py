from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time
from enum import Enum

class AttendanceStatusEnum(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    RETARD = "RETARD"
    JUSTIFIE = "JUSTIFIE"

class SessionBase(BaseModel):
    subject_id: int
    class_id: int
    teacher_id: int
    date: date
    start_time: time
    end_time: time
    title: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class SessionResponse(BaseModel):
    id: int
    subject_id: int
    class_id: int
    teacher_id: int
    date: date
    start_time: time
    end_time: time
    title: Optional[str] = None
    
    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    session_id: int
    student_id: int
    status: AttendanceStatusEnum = AttendanceStatusEnum.PRESENT
    comment: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    class Config:
        from_attributes = True

class AttendanceBulkSave(BaseModel):
    attendances: List[AttendanceBase]
