"""API Router - combines all route modules"""

from fastapi import APIRouter

from app.api.routes import auth, projects, devices, ai_models, code, tutorials

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(projects.router, prefix="/projects", tags=["Projects"])
router.include_router(devices.router, prefix="/devices", tags=["Devices"])
router.include_router(ai_models.router, prefix="/ai-models", tags=["AI Models"])
router.include_router(code.router, prefix="/code", tags=["Code Generation"])
router.include_router(tutorials.router, prefix="/tutorials", tags=["Tutorials"])
