from fastapi import APIRouter

from app.api.v1.products import router as products_router
from app.api.v1.builds import router as builds_router
from app.api.v1.skins import router as skins_router

router = APIRouter(prefix="/v1")

router.include_router(products_router)
router.include_router(builds_router)
router.include_router(skins_router)