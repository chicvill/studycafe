import datetime
from typing import Optional, List
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    phone: str
    pin: Optional[str] = None
    role: Optional[str] = "STUDENT"
    user_type: Optional[str] = "GENERAL" # GENERAL or MANAGED

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    total_time_remaining: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class SeatBase(BaseModel):
    seat_number: str
    zone_type: str = "NORMAL"
    status: str = "EMPTY"

class SeatAssign(BaseModel):
    user_id: int
    seat_number: str

class SeatResponse(SeatBase):
    id: int
    current_user_id: Optional[int] = None
    current_user_name: Optional[str] = None
    current_user_type: Optional[str] = None
    occupied_since: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class TicketCreate(BaseModel):
    user_id: int
    ticket_type: str
    minutes_granted: int
    price: float

class TicketResponse(TicketCreate):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class SelfStudySessionCreate(BaseModel):
    user_id: int
    subject: str = "General Study"

class SelfStudySessionResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime] = None
    focus_score: float
    ai_summary: Optional[str] = None

    class Config:
        from_attributes = True

class AIQuestionRequest(BaseModel):
    user_id: int
    question: str
    context_subject: Optional[str] = None
