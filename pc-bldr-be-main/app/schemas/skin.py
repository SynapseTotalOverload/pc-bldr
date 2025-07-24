from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class SkinCategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    
    class Config:
        from_attributes = True


class SkinCategoryCreate(SkinCategoryBase):
    pass


class SkinCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    
    class Config:
        from_attributes = True


class SkinCategoryRead(SkinCategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime


class SkinBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    full_name: str = Field(..., min_length=1, max_length=255)
    weapon: str = Field(..., min_length=1, max_length=100)
    skin_name: str = Field(..., min_length=1, max_length=255)
    image_file: Optional[str] = None
    link: Optional[str] = None
    category_id: int = Field(..., gt=0)
    
    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v < 1 or v > 6:
            raise ValueError('category_id must be between 1 and 6')
        return v
    
    class Config:
        from_attributes = True


class SkinCreate(SkinBase):
    pass


class SkinUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    weapon: Optional[str] = Field(None, min_length=1, max_length=100)
    skin_name: Optional[str] = Field(None, min_length=1, max_length=255)
    image_file: Optional[str] = None
    link: Optional[str] = None
    category_id: Optional[int] = Field(None, gt=0)
    
    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 6):
            raise ValueError('category_id must be between 1 and 6')
        return v
    
    class Config:
        from_attributes = True


class SkinRead(SkinBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[SkinCategoryRead] = None 