from datetime import datetime
from typing import Optional, TYPE_CHECKING
from pydantic import BaseModel, Field
from .product import ProductRead


class SetupStreamingListBase(BaseModel):
    pass
    
    class Config:
        from_attributes = True


class SetupStreamingListCreate(BaseModel):
    chair_id: Optional[int] = None
    microphone_id: Optional[int] = None
    webcam_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class SetupStreamingListUpdate(BaseModel):
    chair_id: Optional[int] = None
    microphone_id: Optional[int] = None
    webcam_id: Optional[int] = None
    
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
            'webcam': ProductRead.from_orm_with_attrs(setupstreaminglist.webcam) if setupstreaminglist.webcam else None,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


class SimpleProduct(BaseModel):
    id: int
    name: str
    display_name: Optional[str] = None
    
    @classmethod
    def from_product(cls, product):
        if product is None:
            return None
        return cls(
            id=product.id, 
            name=product.title,
            display_name=product.display_name
        )
    
    class Config:
        from_attributes = True


class SetupStreamingListWithSimpleProducts(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    chair: Optional[SimpleProduct] = None
    microphone: Optional[SimpleProduct] = None
    webcam: Optional[SimpleProduct] = None
    
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
            'webcam': SimpleProduct.from_product(setupstreaminglist.webcam) if setupstreaminglist.webcam else None,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True 