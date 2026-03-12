from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    age = Column(Integer)
    is_active = Column(Boolean, default=True)
    subscription_tier = Column(String, default="free")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    cycles = relationship("Cycle", back_populates="user")
    quiz_results = relationship("QuizResult", back_populates="user")

class Cycle(Base):
    __tablename__ = "cycles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, nullable=False)
    cycle_length = Column(Integer)
    period_duration = Column(Integer)
    pain_level = Column(Integer)
    flow_intensity = Column(Integer)
    mood_changes = Column(Integer)
    notes = Column(Text)
    prediction = Column(String)
    recommendation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="cycles")

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String, nullable=False)
    verified = Column(Boolean, default=True)
    profile_image = Column(String)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuizResult(Base):
    __tablename__ = "quiz_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Integer)
    total_questions = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="quiz_results")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    username = Column(String)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
