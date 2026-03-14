from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import User, Cycle
from app.models.schemas import CycleCreate, CycleResponse, PredictionRequest, PredictionResponse
from app.services.ml_service import ml_predictor
from app.services.ai_agent import health_ai_agent
from app.routes.dependencies import get_current_user

router = APIRouter(prefix="/api/cycles", tags=["Cycles"])

@router.post("/", response_model=CycleResponse)
def create_cycle(
    cycle_data: CycleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get ML prediction
    prediction_data = {
        "Age": current_user.age or 25,
        "Cycle_Length": cycle_data.cycle_length,
        "Period_Duration": cycle_data.period_duration,
        "Pain_Level": cycle_data.pain_level,
        "Flow_Intensity": cycle_data.flow_intensity,
        "Mood_Changes": cycle_data.mood_changes
    }
    
    prediction_result = ml_predictor.predict(prediction_data)
    
    # Get AI insights
    ai_insights = health_ai_agent.get_health_insights({
        "cycle_length": cycle_data.cycle_length,
        "period_duration": cycle_data.period_duration,
        "pain_level": cycle_data.pain_level,
        "flow_intensity": cycle_data.flow_intensity,
        "mood_changes": cycle_data.mood_changes
    })
    
    # Create cycle record
    new_cycle = Cycle(
        user_id=current_user.id,
        date=cycle_data.date,
        cycle_length=cycle_data.cycle_length,
        period_duration=cycle_data.period_duration,
        pain_level=cycle_data.pain_level,
        flow_intensity=cycle_data.flow_intensity,
        mood_changes=cycle_data.mood_changes,
        notes=cycle_data.notes,
        prediction=prediction_result['prediction'],
        recommendation=f"{prediction_result['recommendation']} {ai_insights}"
    )
    
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)
    
    return new_cycle

@router.get("/", response_model=List[CycleResponse])
def get_cycles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 10
):
    cycles = db.query(Cycle).filter(
        Cycle.user_id == current_user.id
    ).order_by(Cycle.date.desc()).limit(limit).all()
    
    return cycles

@router.post("/predict", response_model=PredictionResponse)
def predict_health(prediction_data: PredictionRequest):
    result = ml_predictor.predict(prediction_data.dict())
    return result
