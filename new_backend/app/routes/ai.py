from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_agent import health_ai_agent

router = APIRouter(prefix="/api/ai", tags=["AI Agent"])

class HealthQuestion(BaseModel):
    question: str

@router.post("/ask")
def ask_health_question(question_data: HealthQuestion):
    answer = health_ai_agent.answer_health_question(question_data.question)
    return {"answer": answer}
