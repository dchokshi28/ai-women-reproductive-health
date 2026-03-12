from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.routes import auth, cycles, posts, quiz, chat, user, ai

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
