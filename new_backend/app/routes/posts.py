from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Post
from app.models.schemas import PostResponse

router = APIRouter(prefix="/api/posts", tags=["Posts"])

@router.get("/", response_model=List[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    
    # If no posts in DB, return mock data
    if not posts:
        return [
            {
                "id": 1,
                "doctor_name": "Dr. Sarah Jenkins",
                "verified": True,
                "profile_image": "https://i.pravatar.cc/150?img=1",
                "title": "Understanding PCOS",
                "content": "Polycystic ovary syndrome (PCOS) is a common hormonal disorder among women of reproductive age. Symptoms include irregular periods and excess androgen levels. Early diagnosis is key.",
                "likes": 124,
                "comments": 15,
                "created_at": "2024-01-15T10:00:00"
            },
            {
                "id": 2,
                "doctor_name": "Dr. Emily Chen",
                "verified": True,
                "profile_image": "https://i.pravatar.cc/150?img=5",
                "title": "Nutrition for Hormonal Balance",
                "content": "A balanced diet rich in Omega-3 fatty acids, leafy greens, and lean proteins can significantly impact hormonal stability throughout your cycle.",
                "likes": 89,
                "comments": 7,
                "created_at": "2024-01-14T14:30:00"
            },
            {
                "id": 3,
                "doctor_name": "Dr. Ayesha Rahman",
                "verified": True,
                "profile_image": "https://i.pravatar.cc/150?img=9",
                "title": "Debunking Menstruation Myths",
                "content": "There are many myths surrounding menstruation. Exercise is actually beneficial during your period, contrary to popular belief, as it can help relieve cramps.",
                "likes": 210,
                "comments": 42,
                "created_at": "2024-01-13T09:15:00"
            }
        ]
    
    return posts
