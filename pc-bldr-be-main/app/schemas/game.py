from __future__ import annotations

from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class GameBase(BaseModel):
    """Shared attributes for Game schemas"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    image: Optional[str] = None
    icon: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GameCreate(GameBase):
    """Schema for creating Game"""
    pass


class GameUpdate(BaseModel):
    """Schema for updating Game (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    image: Optional[str] = None
    icon: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GameRead(GameBase):
    """Schema for reading Game"""
    id: int
    created_at: Optional[datetime] = None  # Keep same pattern as TeamRead
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Forward reference to PlayerWithRelations for GameWithPlayers schema
if TYPE_CHECKING:
    from .player import PlayerWithRelations


class GameWithPlayers(GameRead):
    players: List["PlayerWithRelations"] = []

    model_config = ConfigDict(from_attributes=True)
