from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator
from app.models.build import Build


class BuildBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    build_price: Optional[float] = None
    
    # Component IDs (nullable)
    cpu_id: Optional[int] = None
    cpu_cooler_id: Optional[int] = None
    gpu_id: Optional[int] = None
    motherboard_id: Optional[int] = None
    ram_id: Optional[int] = None
    storage_id: Optional[int] = None
    psu_id: Optional[int] = None
    case_id: Optional[int] = None

    class Config:
        from_attributes = True


class BuildCreate(BuildBase):
    @field_validator('build_price')
    @classmethod
    def validate_build_price(cls, v):
        if v is not None and v < 0:
            raise ValueError('build_price cannot be negative')
        return v


class BuildUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    build_price: Optional[float] = None
    
    # Component IDs (nullable)
    cpu_id: Optional[int] = None
    cpu_cooler_id: Optional[int] = None
    gpu_id: Optional[int] = None
    motherboard_id: Optional[int] = None
    ram_id: Optional[int] = None
    storage_id: Optional[int] = None
    psu_id: Optional[int] = None
    case_id: Optional[int] = None

    @field_validator('build_price')
    @classmethod
    def validate_build_price(cls, v):
        if v is not None and v < 0:
            raise ValueError('build_price cannot be negative')
        return v

    class Config:
        from_attributes = True


class BuildRead(BuildBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 