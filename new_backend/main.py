from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from app.database.database import engine, Base, get_db
from app.models.models import HealthInfo
from app.routes import auth, cycles, posts, quiz, chat, user, ai
from app.routes.dependencies import get_current_user

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(   
    title="HerHealth AI API",
    description="Women's Health Tracking API with AI-powered insights",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(cycles.router)
app.include_router(posts.router)
app.include_router(quiz.router)
app.include_router(chat.router)
app.include_router(user.router)
app.include_router(ai.router)

@app.get("/api/profile/health-info")
def get_profile_health_info(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    health_info = db.query(HealthInfo).filter(HealthInfo.user_id == current_user.id).first()
    if health_info and health_info.data:
        try:
            return json.loads(health_info.data)
        except Exception:
            return {}
    return {}

@app.post("/api/profile/health-info")
def save_profile_health_info(
    data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(HealthInfo).filter(HealthInfo.user_id == current_user.id).first()
    serialized = json.dumps(data)
    if record:
        record.data = serialized
    else:
        record = HealthInfo(user_id=current_user.id, data=serialized)
        db.add(record)
    db.commit()
    return data

@app.get("/")
def root():
    return {
        "message": "HerHealth AI API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
