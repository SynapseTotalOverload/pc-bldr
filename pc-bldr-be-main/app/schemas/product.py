from datetime import datetime
from typing import Optional, Dict, Any, Union

from pydantic import BaseModel, Field, field_validator, model_validator

from app.models.product import Product
from app.schemas.attributes import (
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
    MicrophoneAttributesUpdateSchema,
    CameraAttributesUpdateSchema,
    HeadphonesAttributesUpdateSchema,
)
from .category import CategoryRead


class ProductBase(BaseModel):
    asin: str = Field(..., min_length=10, max_length=12)
    title: str
    price: Optional[float] = None
    rating: Optional[float] = None
    low_image_url: Optional[str] = Field(None, description="Low resolution image URL")
    high_image_url: Optional[str] = Field(None, description="High resolution image URL")
    display_name: Optional[str] = Field(None, description="Display name combining brand and model from attributes")
    
    class Config:
        from_attributes = True


class ProductCreate(ProductBase):
    category_id: int = Field(..., ge=1, le=17, description="Category ID for the product")
    attrs: Optional[Dict[str, Any]] = Field(None, description="Product attributes as dictionary")

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v < 1 or v > 17:
            raise ValueError('category_id must be between 1 and 17')
        return v

    @model_validator(mode='after')
    def validate_attrs_with_category(self):
        """Validate attrs against the appropriate schema based on category_id"""
        if self.attrs is not None:
            category_id = self.category_id
            
            # Map category_id to the appropriate schema
            schema_mapping = {
                1: CPUAttributesUpdateSchema,
                2: CPUCoolerAttributesUpdateSchema,
                3: GPUAttributesUpdateSchema,
                4: MotherboardAttributesUpdateSchema,
                5: RAMAttributesUpdateSchema,
                6: StorageAttributesUpdateSchema,
                7: PowerSupplyAttributesUpdateSchema,
                8: CaseAttributesUpdateSchema,
                9: MouseAttributesUpdateSchema,
                10: MonitorAttributesUpdateSchema,
                11: KeyboardAttributesUpdateSchema,
                12: HeadsetAttributesUpdateSchema,
                13: MousepadAttributesUpdateSchema,
                14: ChairAttributesUpdateSchema,
                15: MicrophoneAttributesUpdateSchema,
                16: CameraAttributesUpdateSchema,
                17: HeadphonesAttributesUpdateSchema,
            }
            
            schema_class = schema_mapping.get(category_id)
            if schema_class:
                try:
                    # Validate attrs against the appropriate schema
                    validated_attrs = schema_class(**self.attrs)
                    # Replace attrs with validated data
                    self.attrs = validated_attrs.model_dump(exclude_none=True)
                except Exception as e:
                    raise ValueError(f"Invalid attributes for category {category_id}: {str(e)}")
        
        return self


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    price: Optional[float] = None
    rating: Optional[float] = None
    category_id: Optional[int] = None
    attrs: Optional[Dict[str, Any]] = Field(None, description="Product attributes as dictionary")
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None
    display_name: Optional[str] = None

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v is not None and (v < 1 or v > 17):
            raise ValueError('category_id must be between 1 and 17')
        return v

    @model_validator(mode='after')
    def validate_attrs_with_category(self):
        """Validate attrs against the appropriate schema based on category_id"""
        if self.attrs is not None:
            # Get category_id - either from the update or we'll need to get it from the existing product
            category_id = self.category_id
            
            if category_id is None:
                # If category_id is not provided in the update, we can't validate attrs
                # The validation will be done in the CRUD layer when we have access to the existing product
                return self
            
            # Map category_id to the appropriate schema
            schema_mapping = {
                1: CPUAttributesUpdateSchema,
                2: CPUCoolerAttributesUpdateSchema,
                3: GPUAttributesUpdateSchema,
                4: MotherboardAttributesUpdateSchema,
                5: RAMAttributesUpdateSchema,
                6: StorageAttributesUpdateSchema,
                7: PowerSupplyAttributesUpdateSchema,
                8: CaseAttributesUpdateSchema,
                9: MouseAttributesUpdateSchema,
                10: MonitorAttributesUpdateSchema,
                11: KeyboardAttributesUpdateSchema,
                12: HeadsetAttributesUpdateSchema,
                13: MousepadAttributesUpdateSchema,
                14: ChairAttributesUpdateSchema,
                15: MicrophoneAttributesUpdateSchema,
                16: CameraAttributesUpdateSchema,
                17: HeadphonesAttributesUpdateSchema,
            }
            
            schema_class = schema_mapping.get(category_id)
            if schema_class:
                try:
                    # Validate attrs against the appropriate schema
                    validated_attrs = schema_class(**self.attrs)
                    # Replace attrs with validated data
                    self.attrs = validated_attrs.model_dump(exclude_none=True)
                except Exception as e:
                    raise ValueError(f"Invalid attributes for category {category_id}: {str(e)}")
        
        return self

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
            ("microphone_attributes", MicrophoneAttributesUpdateSchema),
            ("camera_attributes", CameraAttributesUpdateSchema),
            ("headphones_attributes", HeadphonesAttributesUpdateSchema),
        ]

        attrs = None
        for relationship_name, schema_class in mapping:
            attrs_obj = getattr(obj, relationship_name, None)
            if attrs_obj:
                attrs = schema_class.model_validate(attrs_obj).model_dump()
                break

        return cls.model_validate({
            **obj.__dict__,
            "category": category,
            "attrs": attrs
        })


class ProductCompatibilityRequest(BaseModel):
    selected_components: Dict[str, int] = Field(..., description="Dictionary of selected component IDs")
    category_id: int = Field(..., ge=1, le=17, description="Category ID to search for compatible products")
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")
    budget: Optional[int] = Field(None, ge=0, description="Maximum budget in USD")
    query: Optional[str] = Field(None, description="Search query")

    @field_validator('category_id')
    @classmethod
    def validate_category_id(cls, v):
        if v < 1 or v > 17:
            raise ValueError('category_id must be between 1 and 17')
        return v
