"""Pydantic schemas for API requests and responses"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from enum import Enum


# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    EDUCATOR = "educator"
    ADMIN = "admin"


class DeviceType(str, Enum):
    ARDUINO = "arduino"
    ESP32 = "esp32"
    RASPBERRY_PI = "raspberry-pi"
    SIMULATOR = "simulator"


class DeviceStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    CONNECTING = "connecting"


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None


class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Project schemas
class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[List[str]] = []


class ProjectCreate(ProjectBase):
    blocks: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    blocks: Optional[str] = None
    tags: Optional[List[str]] = None
    is_public: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: int
    blocks: Optional[str] = None
    generated_code: Optional[str] = None
    thumbnail: Optional[str] = None
    is_public: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Device schemas
class DeviceBase(BaseModel):
    name: str
    device_type: DeviceType


class DeviceCreate(DeviceBase):
    ip_address: Optional[str] = None
    mac_address: Optional[str] = None


class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[DeviceStatus] = None
    ip_address: Optional[str] = None
    firmware_version: Optional[str] = None


class DeviceResponse(DeviceBase):
    id: int
    status: DeviceStatus
    ip_address: Optional[str] = None
    firmware_version: Optional[str] = None
    last_seen: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# AI Model schemas
class AIModelBase(BaseModel):
    name: str
    model_type: str
    description: Optional[str] = None


class AIModelCreate(AIModelBase):
    pass


class AIModelResponse(AIModelBase):
    id: int
    accuracy: Optional[float] = None
    size: Optional[str] = None
    is_pretrained: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Sensor data schemas
class SensorDataCreate(BaseModel):
    device_id: int
    sensor_type: str
    value: float
    unit: Optional[str] = None


class SensorDataResponse(SensorDataCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# Tutorial schemas
class TutorialResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    difficulty: str
    category: str
    duration_minutes: int

    class Config:
        from_attributes = True


# Code generation schemas
class CodeGenerationRequest(BaseModel):
    blocks: str  # Blockly XML
    language: str = "python"  # python, cpp, javascript
    target_device: Optional[str] = None


class CodeGenerationResponse(BaseModel):
    code: str
    language: str
    warnings: List[str] = []
