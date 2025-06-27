from datetime import datetime
from typing import Optional, Dict, Any, Union

from pydantic import BaseModel, Field, field_validator

from app.models.product import Product
from app.schemas.attributes import (
    AttributesUpdateUnion,
    CPUAttributesUpdateSchema,
    CPUCoolerAttributesUpdateSchema,
    GPUAttributesUpdateSchema,
    MotherboardAttributesUpdateSchema,
    RAMAttributesUpdateSchema,
    StorageAttributesUpdateSchema,
    PowerSupplyAttributesUpdateSchema,
    CaseAttributesUpdateSchema,
)
from .category import CategoryRead


class ProductBase(BaseModel):
    asin: str = Field(..., min_length=10, max_length=12)
    title: str
    price: Optional[float] = None
    rating: Optional[float] = None

    class Config:
        from_attributes = True


class ProductCreate(ProductBase):
    category_id: Optional[int] = None
    attrs: Optional[AttributesUpdateUnion] = None

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 8):
            raise ValueError('category_id must be between 1 and 8')
        return v


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None
    category_id: Optional[int] = None
    attrs: Optional[AttributesUpdateUnion] = None

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 8):
            raise ValueError('category_id must be between 1 and 8')
        return v

    class Config:
        from_attributes = True


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    category: Optional[CategoryRead] = None
    attrs: Optional[dict] = None

    @classmethod
    def from_orm_with_attrs(cls, obj: Product) -> "ProductRead":
        """
        Construct ProductRead instance with resolved attrs field.
        """

        if obj.category: 
            category = CategoryRead.model_validate(obj.category)
            del obj.category
        else:
            category = None

        mapping: list[tuple[str, BaseModel]] = [
            ("cpu_attributes", CPUAttributesUpdateSchema),
            ("cpu_cooler_attributes", CPUCoolerAttributesUpdateSchema),
            ("gpu_attributes", GPUAttributesUpdateSchema),
            ("motherboard_attributes", MotherboardAttributesUpdateSchema),
            ("ram_attributes", RAMAttributesUpdateSchema),
            ("storage_attributes", StorageAttributesUpdateSchema),
            ("power_supply_attributes", PowerSupplyAttributesUpdateSchema),
            ("case_attributes", CaseAttributesUpdateSchema),
        ]

        for attr_name, schema in mapping:
            attrs_model = getattr(obj, attr_name, None)
            if attrs_model:
                return cls(
                    **obj.__dict__,
                    category=category,
                    attrs=schema.model_validate(attrs_model).model_dump()
                )

        return cls(**obj.__dict__, category=category, attrs=None)
