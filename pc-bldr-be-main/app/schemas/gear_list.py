from datetime import date, datetime
from typing import Optional, TYPE_CHECKING
from pydantic import BaseModel, Field, field_validator
from .product import ProductRead
    


class GearListBase(BaseModel):
    pass
    
    class Config:
        from_attributes = True


class GearListCreate(BaseModel):
    monitor_id: Optional[int] = None
    mouse_id: Optional[int] = None
    keyboard_id: Optional[int] = None
    headset_id: Optional[int] = None
    mousepad_id: Optional[int] = None
    earphones_id: Optional[int] = None
    
    @field_validator('monitor_id', 'mouse_id', 'keyboard_id', 'headset_id', 'mousepad_id', 'earphones_id')
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


class GearListUpdate(BaseModel):
    id: Optional[int] = None

    monitor: Optional[PropertyStatUpdate] = None
    mouse: Optional[PropertyStatUpdate] = None
    keyboard: Optional[PropertyStatUpdate] = None
    headset: Optional[PropertyStatUpdate] = None
    mousepad: Optional[PropertyStatUpdate] = None
    earphones: Optional[PropertyStatUpdate] = None
    

    
    class Config:
        from_attributes = True


class GearListRead(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    
    
    @classmethod
    def from_gearlist(cls, gearlist):
        if gearlist is None:
            return None
        
        data = {
            'id': gearlist.id,
            'created_at': gearlist.created_at,
            'updated_at': gearlist.updated_at,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


class GearListWithProducts(GearListRead):
    monitor: Optional[ProductRead] = None
    mouse: Optional[ProductRead] = None
    keyboard: Optional[ProductRead] = None
    headset: Optional[ProductRead] = None
    mousepad: Optional[ProductRead] = None
    earphones: Optional[ProductRead] = None
    
    @classmethod
    def from_gearlist(cls, gearlist):
        if gearlist is None:
            return None
        
        data = {
            'id': gearlist.id,
            'created_at': gearlist.created_at,
            'updated_at': gearlist.updated_at,
            'monitor': ProductRead.from_orm_with_attrs(gearlist.monitor) if gearlist.monitor else None,
            'mouse': ProductRead.from_orm_with_attrs(gearlist.mouse) if gearlist.mouse else None,
            'keyboard': ProductRead.from_orm_with_attrs(gearlist.keyboard) if gearlist.keyboard else None,
            'headset': ProductRead.from_orm_with_attrs(gearlist.headset) if gearlist.headset else None,
            'mousepad': ProductRead.from_orm_with_attrs(gearlist.mousepad) if gearlist.mousepad else None,
            'earphones': ProductRead.from_orm_with_attrs(gearlist.earphones) if gearlist.earphones else None,
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


class GearListWithSimpleProducts(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    monitor: Optional[SimpleProduct] = None
    mouse: Optional[SimpleProduct] = None
    keyboard: Optional[SimpleProduct] = None
    headset: Optional[SimpleProduct] = None
    mousepad: Optional[SimpleProduct] = None
    earphones: Optional[SimpleProduct] = None
    
    @classmethod
    def from_gearlist(cls, gearlist):
        if gearlist is None:
            return None
        
        data = {
            'id': gearlist.id,
            'created_at': gearlist.created_at,
            'updated_at': gearlist.updated_at,
            'monitor': SimpleProduct.from_product(gearlist.monitor) if gearlist.monitor else None,
            'mouse': SimpleProduct.from_product(gearlist.mouse) if gearlist.mouse else None,
            'keyboard': SimpleProduct.from_product(gearlist.keyboard) if gearlist.keyboard else None,
            'headset': SimpleProduct.from_product(gearlist.headset) if gearlist.headset else None,
            'mousepad': SimpleProduct.from_product(gearlist.mousepad) if gearlist.mousepad else None,
            'earphones': SimpleProduct.from_product(gearlist.earphones) if gearlist.earphones else None,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True 