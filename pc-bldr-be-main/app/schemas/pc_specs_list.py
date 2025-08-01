from datetime import datetime
from typing import Optional, TYPE_CHECKING
from pydantic import BaseModel, Field, field_validator
from .product import ProductRead
    


class PCSpecsListBase(BaseModel):
    pass
    
    class Config:
        from_attributes = True


class PCSpecsListCreate(BaseModel):
    cpu_id: Optional[int] = None
    cpu_cooler_id: Optional[int] = None
    gpu_id: Optional[int] = None
    motherboard_id: Optional[int] = None
    ram_id: Optional[int] = None
    storage_id: Optional[int] = None
    power_supply_id: Optional[int] = None
    case_id: Optional[int] = None
    
    @field_validator('cpu_id', 'cpu_cooler_id', 'gpu_id', 'motherboard_id', 'ram_id', 'storage_id', 'power_supply_id', 'case_id')
    @classmethod
    def validate_product_ids(cls, v):
        if v == 0:
            return None
        return v
    
    class Config:
        from_attributes = True


class PCSpecsListUpdate(BaseModel):
    cpu_id: Optional[int] = None
    cpu_cooler_id: Optional[int] = None
    gpu_id: Optional[int] = None
    motherboard_id: Optional[int] = None
    ram_id: Optional[int] = None
    storage_id: Optional[int] = None
    power_supply_id: Optional[int] = None
    case_id: Optional[int] = None
    
    @field_validator('cpu_id', 'cpu_cooler_id', 'gpu_id', 'motherboard_id', 'ram_id', 'storage_id', 'power_supply_id', 'case_id')
    @classmethod
    def validate_product_ids(cls, v):
        if v == 0:
            return None
        return v
    
    class Config:
        from_attributes = True


class PCSpecsListRead(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    
    @classmethod
    def from_pcspecslist(cls, pcspecslist):
        if pcspecslist is None:
            return None
        
        data = {
            'id': pcspecslist.id,
            'created_at': pcspecslist.created_at,
            'updated_at': pcspecslist.updated_at,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


class PCSpecsListWithProducts(PCSpecsListRead):
    cpu: Optional[ProductRead] = None
    cpu_cooler: Optional[ProductRead] = None
    gpu: Optional[ProductRead] = None
    motherboard: Optional[ProductRead] = None
    ram: Optional[ProductRead] = None
    storage: Optional[ProductRead] = None
    power_supply: Optional[ProductRead] = None
    case: Optional[ProductRead] = None
    
    @classmethod
    def from_pcspecslist(cls, pcspecslist):
        if pcspecslist is None:
            return None
        
        data = {
            'id': pcspecslist.id,
            'created_at': pcspecslist.created_at,
            'updated_at': pcspecslist.updated_at,
            'cpu': ProductRead.from_orm_with_attrs(pcspecslist.cpu) if pcspecslist.cpu else None,
            'cpu_cooler': ProductRead.from_orm_with_attrs(pcspecslist.cpu_cooler) if pcspecslist.cpu_cooler else None,
            'gpu': ProductRead.from_orm_with_attrs(pcspecslist.gpu) if pcspecslist.gpu else None,
            'motherboard': ProductRead.from_orm_with_attrs(pcspecslist.motherboard) if pcspecslist.motherboard else None,
            'ram': ProductRead.from_orm_with_attrs(pcspecslist.ram) if pcspecslist.ram else None,
            'storage': ProductRead.from_orm_with_attrs(pcspecslist.storage) if pcspecslist.storage else None,
            'power_supply': ProductRead.from_orm_with_attrs(pcspecslist.power_supply) if pcspecslist.power_supply else None,
            'case': ProductRead.from_orm_with_attrs(pcspecslist.case) if pcspecslist.case else None,
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


class PCSpecsListWithSimpleProducts(BaseModel):
    id: int
    created_at: datetime
    updated_at: datetime
    cpu: Optional[SimpleProduct] = None
    cpu_cooler: Optional[SimpleProduct] = None
    gpu: Optional[SimpleProduct] = None
    motherboard: Optional[SimpleProduct] = None
    ram: Optional[SimpleProduct] = None
    storage: Optional[SimpleProduct] = None
    power_supply: Optional[SimpleProduct] = None
    case: Optional[SimpleProduct] = None
    
    @classmethod
    def from_pcspecslist(cls, pcspecslist):
        if pcspecslist is None:
            return None
        
        data = {
            'id': pcspecslist.id,
            'created_at': pcspecslist.created_at,
            'updated_at': pcspecslist.updated_at,
            'cpu': SimpleProduct.from_product(pcspecslist.cpu) if pcspecslist.cpu else None,
            'cpu_cooler': SimpleProduct.from_product(pcspecslist.cpu_cooler) if pcspecslist.cpu_cooler else None,
            'gpu': SimpleProduct.from_product(pcspecslist.gpu) if pcspecslist.gpu else None,
            'motherboard': SimpleProduct.from_product(pcspecslist.motherboard) if pcspecslist.motherboard else None,
            'ram': SimpleProduct.from_product(pcspecslist.ram) if pcspecslist.ram else None,
            'storage': SimpleProduct.from_product(pcspecslist.storage) if pcspecslist.storage else None,
            'power_supply': SimpleProduct.from_product(pcspecslist.power_supply) if pcspecslist.power_supply else None,
            'case': SimpleProduct.from_product(pcspecslist.case) if pcspecslist.case else None,
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


 