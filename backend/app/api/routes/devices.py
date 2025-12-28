"""Device management routes"""

from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Device, DeviceStatus
from app.schemas import DeviceCreate, DeviceUpdate, DeviceResponse

router = APIRouter()


@router.get("/", response_model=List[DeviceResponse])
async def list_devices(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all devices for the current user"""
    user_id = int(current_user["sub"])
    result = await db.execute(
        select(Device).where(Device.owner_id == user_id).order_by(Device.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
async def register_device(
    device_data: DeviceCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Register a new device"""
    user_id = int(current_user["sub"])
    device = Device(
        name=device_data.name,
        device_type=device_data.device_type,
        ip_address=device_data.ip_address,
        mac_address=device_data.mac_address,
        owner_id=user_id,
    )
    db.add(device)
    await db.commit()
    await db.refresh(device)
    return device


@router.get("/{device_id}", response_model=DeviceResponse)
async def get_device(
    device_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific device"""
    user_id = int(current_user["sub"])
    result = await db.execute(
        select(Device).where(Device.id == device_id, Device.owner_id == user_id)
    )
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device


@router.put("/{device_id}", response_model=DeviceResponse)
async def update_device(
    device_id: int,
    device_data: DeviceUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a device"""
    user_id = int(current_user["sub"])
    result = await db.execute(
        select(Device).where(Device.id == device_id, Device.owner_id == user_id)
    )
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    update_data = device_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(device, field, value)

    await db.commit()
    await db.refresh(device)
    return device


@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_device(
    device_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a device"""
    user_id = int(current_user["sub"])
    result = await db.execute(
        select(Device).where(Device.id == device_id, Device.owner_id == user_id)
    )
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    await db.delete(device)
    await db.commit()


@router.post("/{device_id}/ping", response_model=DeviceResponse)
async def ping_device(
    device_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Ping a device to update its status"""
    user_id = int(current_user["sub"])
    result = await db.execute(
        select(Device).where(Device.id == device_id, Device.owner_id == user_id)
    )
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # Simulate ping - in production, this would actually ping the device
    device.last_seen = datetime.utcnow()
    device.status = DeviceStatus.ONLINE

    await db.commit()
    await db.refresh(device)
    return device


@router.post("/{device_id}/upload")
async def upload_code(
    device_id: int,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload code to a device"""
    user_id = int(current_user["sub"])
    result = await db.execute(
        select(Device).where(Device.id == device_id, Device.owner_id == user_id)
    )
    device = result.scalar_one_or_none()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")

    # In production, this would upload code to the actual device
    return {"status": "success", "message": f"Code uploaded to {device.name}"}
