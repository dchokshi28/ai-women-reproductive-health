from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import User, QuizResult
from app.models.schemas import QuizQuestion
from app.routes.dependencies import get_current_user

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])

@router.get("/questions", response_model=List[QuizQuestion])
def get_quiz_questions():
    questions = [
        {
            "id": 1,
            "question": "What is the average length of a normal menstrual cycle?",
            "options": ["15-20 days", "21-35 days", "40-45 days", "50+ days"],
            "correctAnswer": 1
        },
        {
            "id": 2,
            "question": "Which hormone is primarily responsible for triggering ovulation?",
            "options": ["Progesterone", "Estrogen", "Luteinizing Hormone (LH)", "Testosterone"],
            "correctAnswer": 2
        },
        {
            "id": 3,
            "question": "True or False: Irregular periods during the first few years of menstruation are always a sign of a severe health condition.",
            "options": ["True", "False"],
            "correctAnswer": 1
        },
        {
            "id": 4,
            "question": "What is endometriosis?",
            "options": [
                "A type of cancer",
                "Tissue similar to uterine lining grows outside the uterus",
                "A bacterial infection",
                "A vitamin deficiency"
            ],
            "correctAnswer": 1
        },
        {
            "id": 5,
            "question": "Which nutrient is particularly important for menstrual health?",
            "options": ["Vitamin C", "Iron", "Vitamin D", "All of the above"],
            "correctAnswer": 3
        }
    ]
    return questions

@router.post("/submit")
def submit_quiz(
    score: int,
    total: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz_result = QuizResult(
        user_id=current_user.id,
        score=score,
        total_questions=total
    )
    
    db.add(quiz_result)
    db.commit()
    
    return {"message": "Quiz submitted successfully", "score": score, "total": total}
