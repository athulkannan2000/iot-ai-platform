"""AI Model management routes"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import AIModel
from app.schemas import AIModelCreate, AIModelResponse

router = APIRouter()


@router.get("/", response_model=List[AIModelResponse])
async def list_models(
    model_type: str = None,
    db: AsyncSession = Depends(get_db),
):
    """List all available AI models"""
    query = select(AIModel).where(AIModel.is_public == True)
    if model_type:
        query = query.where(AIModel.model_type == model_type)
    
    result = await db.execute(query.order_by(AIModel.created_at.desc()))
    return result.scalars().all()


@router.get("/{model_id}", response_model=AIModelResponse)
async def get_model(model_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific AI model"""
    result = await db.execute(select(AIModel).where(AIModel.id == model_id))
    model = result.scalar_one_or_none()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model


@router.post("/", response_model=AIModelResponse)
async def create_model(
    model_data: AIModelCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new AI model entry"""
    user_id = int(current_user["sub"])
    model = AIModel(
        name=model_data.name,
        model_type=model_data.model_type,
        description=model_data.description,
        owner_id=user_id,
        is_pretrained=False,
    )
    db.add(model)
    await db.commit()
    await db.refresh(model)
    return model


@router.post("/{model_id}/test")
async def test_model(
    model_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Test an AI model with sample data"""
    result = await db.execute(select(AIModel).where(AIModel.id == model_id))
    model = result.scalar_one_or_none()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    # Simulated test result
    return {
        "model": model.name,
        "status": "success",
        "result": "Test prediction: sample_class",
        "confidence": 0.95,
    }


@router.post("/upload")
async def upload_model(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """Upload a custom AI model file"""
    # In production, this would save the file and process it
    return {
        "status": "success",
        "filename": file.filename,
        "message": "Model uploaded successfully",
    }
