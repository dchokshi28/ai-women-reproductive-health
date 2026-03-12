from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import User
from app.models.schemas import UserResponse
from app.routes.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/user", tags=["User"])

class UpdateProfile(BaseModel):
    full_name: str = None
    age: int = None

class UpdateSubscription(BaseModel):
    tier: str

@router.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_data: UpdateProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name
    if profile_data.age:
        current_user.age = profile_data.age
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.post("/subscription")
def update_subscription(
    subscription_data: UpdateSubscription,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.subscription_tier = subscription_data.tier
    db.commit()
    
    return {"message": f"Subscription updated to {subscription_data.tier}"}
