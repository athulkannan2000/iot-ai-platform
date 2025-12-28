"""Application configuration settings"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "IoT & AI Visual Platform"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./platform.db"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]
    
    # MQTT (for IoT devices)
    MQTT_BROKER: str = "localhost"
    MQTT_PORT: int = 1883
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
