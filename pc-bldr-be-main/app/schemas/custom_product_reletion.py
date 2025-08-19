from pydantic import BaseModel  
from datetime import date
from typing import Optional




class CustomProductReletion(BaseModel):
    id: int
    user_id: int
    original_name: str
    product_id: int
    custom_name: str
    pozition: str
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None
    data: date

    class Config:
        from_attributes = True


class CustomProductReletionSimple(BaseModel):
    id: int
    original_name: str
    product_id: int
    custom_name: str
    pozition: str
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None
    class Config:
        from_attributes = True

class CustomProductReletionCreate(BaseModel):
    original_name: str
    product_id: int
    custom_name: str
    pozition: str
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None
    data: date

class CustomProductReletionUpdate(BaseModel):
    id: int
    custom_name: Optional[str] = None
    low_image_url: Optional[str] = None
    high_image_url: Optional[str] = None


class CustomProductReletionDelete(BaseModel):
    """Schema representing deletion of a custom product relation (by id)."""
    id: int


class CustomProductReletionRequest(BaseModel):
    create_list: Optional[list[CustomProductReletionCreate]] = None
    update_list: Optional[list[CustomProductReletionUpdate]] = None
    delete_list: Optional[list[int]] = None


