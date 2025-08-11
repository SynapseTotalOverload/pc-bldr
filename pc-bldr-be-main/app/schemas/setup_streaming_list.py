from datetime import date, datetime
from typing import Optional, TYPE_CHECKING
from pydantic import BaseModel, Field, field_validator
from .product import ProductRead


class SetupStreamingListBase(BaseModel):
    pass
    
    class Config:
        from_attributes = True


class SetupStreamingListCreate(BaseModel):
    chair_id: Optional[int] = None
    microphone_id: Optional[int] = None
    webcam_id: Optional[int] = None
    
    @field_validator('chair_id', 'microphone_id', 'webcam_id')
    @classmethod
    def validate_product_ids(cls, v):
        if v == 0:
            return None
        return v
    
    class Config:
        from_attributes = True


class PropertyStatUpdate(BaseModel):
    data_change: Optional[bool] = None
    id_change: Optional[bool] = None
    id: Optional[int] = None
    old_id: Optional[int] = None
    usage_start_datetime: Optional[date] = None

class SetupStreamingListUpdate(BaseModel):
    id: Optional[int] = None
    camera: Optional[PropertyStatUpdate] = None
    chair: Optional[PropertyStatUpdate] = None
    microphone: Optional[PropertyStatUpdate] = None
    
    class Config:
        from_attributes = True


class SetupStreamingListRead(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @classmethod
    def from_setupstreaminglist(cls, setupstreaminglist):
        if setupstreaminglist is None:
            return None
        
        data = {
            'id': setupstreaminglist.id,
            'created_at': setupstreaminglist.created_at,
            'updated_at': setupstreaminglist.updated_at,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


class SetupStreamingListWithProducts(SetupStreamingListRead):
    chair: Optional[ProductRead] = None
    microphone: Optional[ProductRead] = None
    webcam: Optional[ProductRead] = None
    
    @classmethod
    def from_setupstreaminglist(cls, setupstreaminglist):
        if setupstreaminglist is None:
            return None
        
        data = {
            'id': setupstreaminglist.id,
            'created_at': setupstreaminglist.created_at,
            'updated_at': setupstreaminglist.updated_at,
            'chair': ProductRead.from_orm_with_attrs(setupstreaminglist.chair) if setupstreaminglist.chair else None,
            'microphone': ProductRead.from_orm_with_attrs(setupstreaminglist.microphone) if setupstreaminglist.microphone else None,
            'camera': ProductRead.from_orm_with_attrs(setupstreaminglist.webcam) if setupstreaminglist.webcam else None,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


class SimpleProduct(BaseModel):
    id: int
    name: str
    display_name: Optional[str] = None
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None
    
    @classmethod
    def from_product(cls, product):
        if product is None:
            return None
        return cls(
            id=product.id, 
            name=product.title,
            display_name=product.display_name,
            low_image_url=product.low_image_url,
            high_image_url=product.high_image_url
        )
    
    class Config:
        from_attributes = True


class SetupStreamingListWithSimpleProducts(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    chair: Optional[SimpleProduct] = None
    microphone: Optional[SimpleProduct] = None
    camera: Optional[SimpleProduct] = None
    
    @classmethod
    def from_setupstreaminglist(cls, setupstreaminglist):
        if setupstreaminglist is None:
            return None
        
        data = {
            'id': setupstreaminglist.id,
            'created_at': setupstreaminglist.created_at,
            'updated_at': setupstreaminglist.updated_at,
            'chair': SimpleProduct.from_product(setupstreaminglist.chair) if setupstreaminglist.chair else None,
            'microphone': SimpleProduct.from_product(setupstreaminglist.microphone) if setupstreaminglist.microphone else None,
            'camera': SimpleProduct.from_product(setupstreaminglist.webcam) if setupstreaminglist.webcam else None,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True 