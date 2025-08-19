from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class StickerBase(BaseModel):
    """Base fields for Sticker."""
    name: str = Field(..., min_length=1, max_length=255)
    class_name: Optional[str] = Field(None, max_length=255)
    tournire: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = None
    s_type: Optional[str] = Field(None, max_length=100)

    class Config:
        from_attributes = True


class StickerCreate(StickerBase):
    """Fields required to create a Sticker."""
    pass


class StickerUpdate(BaseModel):
    """Fields that can be updated for Sticker."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    class_name: Optional[str] = Field(None, max_length=255)
    tournire: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = None
    s_type: Optional[str] = Field(None, max_length=100)

    class Config:
        from_attributes = True


class StickerRead(StickerBase):
    """Sticker data returned from API."""
    id: int
