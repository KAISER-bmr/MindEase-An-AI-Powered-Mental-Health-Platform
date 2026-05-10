from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str

# Chat
class ChatMessage(BaseModel):
    content: str
    session_id: Optional[int] = None

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    session_id: int
    created_at: Optional[datetime] = None

class ChatResponse(BaseModel):
    session_id: int
    user_message: MessageResponse
    ai_message: MessageResponse

# Mood
class MoodLog(BaseModel):
    mood_score: int           # 1–10
    mood_label: Optional[str] = None
    notes: Optional[str] = None
    stress_level: Optional[int] = None   # 1–5
    anxiety_level: Optional[int] = None  # 1–5
    sleep_hours: Optional[float] = None

class MoodLogResponse(BaseModel):
    id: int
    mood_score: int
    mood_label: Optional[str]
    notes: Optional[str]
    stress_level: Optional[int]
    anxiety_level: Optional[int]
    sleep_hours: Optional[float]
    logged_at: Optional[datetime]

# Assessment
class AssessmentSubmit(BaseModel):
    assessment_type: str
    responses: List[int]   # list of answer scores

class AssessmentResult(BaseModel):
    score: int
    risk_level: str
    message: str
    recommendations: List[str]
