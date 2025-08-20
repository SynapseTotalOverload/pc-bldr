from __future__ import annotations

from typing import Optional, List, Dict, TYPE_CHECKING
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator

from .sticker import StickerRead


class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    logo: Optional[str] = None
    jerseys_img: Optional[str] = None
    socila_media_links: Optional[Dict[str, str]] = None  # keep original column name typo

    model_config = ConfigDict(from_attributes=True)


class TeamCreate(TeamBase):
    sticker_ids: Optional[List[int]] = None

    @field_validator('sticker_ids')
    @classmethod
    def validate_sticker_ids(cls, v):
        if v is not None:
            if not v:
                raise ValueError('sticker_ids cannot be empty')
            if len(set(v)) != len(v):
                raise ValueError('sticker_ids cannot contain duplicates')
        return v

    model_config = ConfigDict(from_attributes=True)


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    logo: Optional[str] = None
    jerseys_img: Optional[str] = None
    socila_media_links: Optional[Dict[str, str]] = None
    sticker_ids: Optional[List[int]] = None

    @field_validator('sticker_ids')
    @classmethod
    def validate_sticker_ids(cls, v):
        if v is not None:
            if not v:
                raise ValueError('sticker_ids cannot be empty')
            if len(set(v)) != len(v):
                raise ValueError('sticker_ids list cannot contain duplicates')
        return v

    model_config = ConfigDict(from_attributes=True)


class TeamRead(TeamBase):
    id: int
    stickers: List[StickerRead] = []
    sticker_ids: List[int] = []  # Add sticker_ids field for frontend compatibility
    created_at: Optional[datetime] = None  # not in model but common pattern
    updated_at: Optional[datetime] = None  # placeholder in case added later

    model_config = ConfigDict(from_attributes=True)


class TeamWithPlayers(TeamRead):
    players: List["PlayerWithRelations"] = []

    model_config = ConfigDict(from_attributes=True)

# Short representation (id + name) for embedding in other schemas
class TeamShort(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)

if TYPE_CHECKING:
    from .player import PlayerWithRelations
