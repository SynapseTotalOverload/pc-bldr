from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, Field, field_validator
from app.models.build import Build
from app.core.enums import BuildTypeEnum
from app.schemas.product import ProductRead


class BuildBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    build_type: Annotated[Optional[BuildTypeEnum], Field(None, description="The type of build")] = None
    build_price: Optional[float] = None
    
    # Component IDs (nullable)
    cpu: Optional[int|ProductRead] = None
    cpu_cooler: Optional[int|ProductRead] = None
    gpu: Optional[int|ProductRead] = None
    motherboard: Optional[int|ProductRead] = None
    ram: Optional[int|ProductRead] = None
    storage: Optional[int|ProductRead] = None
    psu: Optional[int|ProductRead] = None
    case: Optional[int|ProductRead] = None

    @field_validator('build_type', mode='after')
    @classmethod
    def convert_build_type_to_string(cls, v):
        if v is not None:
            if isinstance(v, BuildTypeEnum):
                return v.value
            elif isinstance(v, str):
                # Validate string value
                valid_values = [e.value for e in BuildTypeEnum]
                if v not in valid_values:
                    raise ValueError(f'build_type must be one of: {", ".join(valid_values)}')
                return v
        return v

    class Config:
        from_attributes = True


class BuildCreate(BuildBase):
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


class BuildUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    build_type: Annotated[Optional[BuildTypeEnum], Field(None, description="The type of build")] = None
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

    @field_validator('build_type', mode='after')
    @classmethod
    def convert_build_type_to_string(cls, v):
        if v is not None:
            if isinstance(v, BuildTypeEnum):
                return v.value
            elif isinstance(v, str):
                # Validate string value
                valid_values = [e.value for e in BuildTypeEnum]
                if v not in valid_values:
                    raise ValueError(f'build_type must be one of: {", ".join(valid_values)}')
                return v
        return v

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

    @classmethod
    def from_orm_with_attrs(cls, obj: Build, return_models: bool = False) -> "BuildRead":
        """
        Construct BuildRead instance with resolved component ProductRead objects.
        """
        # Create a copy of the object's dict to avoid modifying the original
        build_data = obj.__dict__.copy()
        # Convert component relationships to ProductRead objects
        component_fields = [
            'cpu', 'cpu_cooler', 'gpu', 'motherboard', 
            'ram', 'storage', 'psu', 'case'
        ]
        if not return_models: # ids instead of models
            for field in component_fields:
                component_id = getattr(obj, f"{field}_id", None)
                if component_id:
                    build_data[field] = component_id
                else:
                    build_data[field] = None
        else: 
            for field in component_fields:
                component = getattr(obj, field, None)
                if component:
                    # Use ProductRead.from_orm_with_attrs to convert the component
                    build_data[field] = ProductRead.from_orm_with_attrs(component)
                else:
                    build_data[field] = None
        
        return cls(**build_data) 