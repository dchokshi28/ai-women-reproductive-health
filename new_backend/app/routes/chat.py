from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import User, ChatMessage
from app.models.schemas import ChatMessageCreate, ChatMessageResponse
from app.routes.dependencies import get_current_user

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.get("/messages", response_model=List[ChatMessageResponse])
def get_messages(
    db: Session = Depends(get_db),
    limit: int = 50
):
    messages = db.query(ChatMessage).order_by(
        ChatMessage.created_at.desc()
    ).limit(limit).all()
    
    return messages[::-1]  # Reverse to show oldest first

@router.post("/messages", response_model=ChatMessageResponse)
def send_message(
    message_data: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_message = ChatMessage(
        user_id=current_user.id,
        username=current_user.username,
        message=message_data.message
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message
