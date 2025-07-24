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
    MouseAttributesUpdateSchema,
    MonitorAttributesUpdateSchema,
    KeyboardAttributesUpdateSchema,
    HeadsetAttributesUpdateSchema,
    MousepadAttributesUpdateSchema,
    ChairAttributesUpdateSchema,
)
from .category import CategoryRead


class ProductBase(BaseModel):
    asin: str = Field(..., min_length=10, max_length=12)
    title: str
    price: Optional[float] = None
    rating: Optional[float] = None
    low_image_url: Optional[str] = Field(None, description="Low resolution image URL")
    high_image_url: Optional[str] = Field(None, description="High resolution image URL")
    
    class Config:
        from_attributes = True


class ProductCreate(ProductBase):
    category_id: Optional[int] = None
    attrs: Optional[AttributesUpdateUnion] = None

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 14):
            raise ValueError('category_id must be between 1 and 14')
        return v


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None
    category_id: Optional[int] = None
    attrs: Optional[AttributesUpdateUnion] = None
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 14):
            raise ValueError('category_id must be between 1 and 14')
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
            ("mouse_attributes", MouseAttributesUpdateSchema),
            ("monitor_attributes", MonitorAttributesUpdateSchema),
            ("keyboard_attributes", KeyboardAttributesUpdateSchema),
            ("headset_attributes", HeadsetAttributesUpdateSchema),
            ("mousepad_attributes", MousepadAttributesUpdateSchema),
            ("chair_attributes", ChairAttributesUpdateSchema),
        ]

        for attr_name, schema in mapping:
            attrs_model = getattr(obj, attr_name, None)
            if attrs_model:
                attrs_dict = schema.model_validate(attrs_model).model_dump()
                # Add type field based on attribute name
                type_mapping = {
                    "cpu_attributes": "cpu",
                    "cpu_cooler_attributes": "cpu_cooler", 
                    "gpu_attributes": "gpu",
                    "motherboard_attributes": "motherboard",
                    "ram_attributes": "memory",
                    "storage_attributes": "internal_hard_drive",
                    "power_supply_attributes": "power_supply",
                    "case_attributes": "case",
                    "mouse_attributes": "mouse",
                    "monitor_attributes": "monitor",
                    "keyboard_attributes": "keyboard",
                    "headset_attributes": "headset",
                    "mousepad_attributes": "mousepad",
                    "chair_attributes": "chair",
                }
                attrs_dict["type"] = type_mapping.get(attr_name, "unknown")
                return cls(
                    **obj.__dict__,
                    category=category,
                    attrs=attrs_dict
                )

        return cls(**obj.__dict__, category=category, attrs=None)


class ProductCompatibilityRequest(BaseModel):
    """Schema for POST request to get compatible products"""
    selected_components: Optional[Dict[str, int]] = Field(
        None, 
        description="Dictionary of selected component types and their IDs. Keys: cpu, cpu_cooler, gpu, motherboard, ram, storage, psu, case"
    )
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
    category_id: Optional[int] = Field(
        None, 
        ge=1, 
        le=8, 
        description="Filter by category ID (1-CPU, 2-CPU Cooler, 3-GPU, 4-Motherboard, 5-RAM, 6-Storage, 7-PSU, 8-Case)"
    )
    budget: Optional[int] = Field(None, description="Budget for power supply estimation")

    query: Optional[str] = Field(None, description="Query string for filtering products")

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 8):
            raise ValueError('category_id must be between 1 and 8')
        return v

    class Config:
        from_attributes = True
