"""Tutorial routes"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Tutorial, UserProgress
from app.schemas import TutorialResponse

router = APIRouter()


@router.get("/", response_model=List[TutorialResponse])
async def list_tutorials(
    category: str = None,
    difficulty: str = None,
    db: AsyncSession = Depends(get_db),
):
    """List all tutorials"""
    query = select(Tutorial).where(Tutorial.is_published == True)
    
    if category:
        query = query.where(Tutorial.category == category)
    if difficulty:
        query = query.where(Tutorial.difficulty == difficulty)
    
    result = await db.execute(query.order_by(Tutorial.order))
    return result.scalars().all()


@router.get("/{tutorial_id}", response_model=TutorialResponse)
async def get_tutorial(tutorial_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific tutorial"""
    result = await db.execute(
        select(Tutorial).where(Tutorial.id == tutorial_id, Tutorial.is_published == True)
    )
    tutorial = result.scalar_one_or_none()
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return tutorial


@router.post("/{tutorial_id}/complete")
async def complete_tutorial(
    tutorial_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mark a tutorial as completed"""
    user_id = int(current_user["sub"])
    
    # Check if tutorial exists
    result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = result.scalar_one_or_none()
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    # Check existing progress
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.tutorial_id == tutorial_id,
        )
    )
    progress = result.scalar_one_or_none()
    
    if progress:
        if progress.completed:
            return {"status": "already_completed", "xp_earned": 0}
    else:
        progress = UserProgress(
            user_id=user_id,
            tutorial_id=tutorial_id,
        )
        db.add(progress)
    
    from datetime import datetime
    progress.completed = True
    progress.completed_at = datetime.utcnow()
    progress.xp_earned = 50  # XP reward
    
    await db.commit()
    
    return {"status": "completed", "xp_earned": 50}


@router.get("/progress/me")
async def get_my_progress(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's learning progress"""
    user_id = int(current_user["sub"])
    
    # Get completed tutorials
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.completed == True,
        )
    )
    completed = result.scalars().all()
    
    # Get total tutorials
    result = await db.execute(
        select(Tutorial).where(Tutorial.is_published == True)
    )
    total = len(result.scalars().all())
    
    total_xp = sum(p.xp_earned for p in completed)
    
    return {
        "completed_count": len(completed),
        "total_count": total,
        "progress_percentage": (len(completed) / total * 100) if total > 0 else 0,
        "total_xp": total_xp,
        "completed_tutorial_ids": [p.tutorial_id for p in completed],
    }
