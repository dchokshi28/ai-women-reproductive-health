import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import HealthInfo, User
from app.models.schemas import HealthInfo as HealthInfoSchema, UserResponse
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

@router.get("/profile/health-info", response_model=HealthInfoSchema)
def get_health_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    health_info = db.query(HealthInfo).filter(HealthInfo.user_id == current_user.id).first()
    if health_info and health_info.data:
        try:
            return json.loads(health_info.data)
        except Exception:
            return {}
    return {}

@router.post("/profile/health-info", response_model=HealthInfoSchema)
def save_health_info(
    health_info: HealthInfoSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = health_info.dict()
    record = db.query(HealthInfo).filter(HealthInfo.user_id == current_user.id).first()
    if record:
        record.data = json.dumps(data)
    else:
        record = HealthInfo(user_id=current_user.id, data=json.dumps(data))
        db.add(record)
    db.commit()
    db.refresh(record)
    return data

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
