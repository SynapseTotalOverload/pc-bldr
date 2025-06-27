from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.v1 import router as api_v1_router


settings = get_settings()
app = FastAPI(title=settings.app_name, root_path=settings.api_prefix)
app.include_router(api_v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
