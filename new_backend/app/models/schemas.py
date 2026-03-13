from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    age: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    age: Optional[int]
    subscription_tier: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class CycleCreate(BaseModel):
    date: datetime
    cycle_length: int
    period_duration: int
    pain_level: int
    flow_intensity: int
    mood_changes: int
    notes: Optional[str] = None

class CycleResponse(BaseModel):
    id: int
    date: datetime
    cycle_length: int
    period_duration: int
    pain_level: int
    flow_intensity: int
    mood_changes: int
    notes: Optional[str]
    prediction: Optional[str]
    recommendation: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class PredictionRequest(BaseModel):
    Age: int
    Cycle_Length: int
    Period_Duration: int
    Pain_Level: int
    Flow_Intensity: int
    Mood_Changes: int

class PredictionResponse(BaseModel):
    prediction: str
    recommendation: str
    confidence: Optional[float] = None

class HealthInfo(BaseModel):
    age: Optional[int]
    height: Optional[float]
    weight: Optional[float]
    bmi: Optional[float]
    cycleLength: Optional[int]
    periodDuration: Optional[int]
    menarcheAge: Optional[int]
    stressLevel: Optional[str]
    sleepHours: Optional[float]
    exerciseFrequency: Optional[str]
    conditions: Optional[dict]
    goal: Optional[str]

class PostResponse(BaseModel):
    id: int
    doctor_name: str
    verified: bool
    profile_image: Optional[str]
    title: str
    content: str
    likes: int
    comments: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: list[str]
    correctAnswer: int

class ChatMessageCreate(BaseModel):
    message: str

class ChatMessageResponse(BaseModel):
    id: int
    username: str
    message: str
    created_at: datetime
    
    class Config:
        from_attributes = True
