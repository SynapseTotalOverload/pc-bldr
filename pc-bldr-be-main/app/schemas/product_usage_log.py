from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List
from .product import ProductRead


class ProductUsageLogCreate(BaseModel):
    user_id: int
    product_id: int
    usage_start_datetime: Optional[datetime] = None
    usage_end_datetime: Optional[datetime] = None


class ProductUsageLogUpdate(BaseModel):
    user_id: int
    product_id: int
    usage_end_datetime: Optional[date] = None
    usage_start_datetime: Optional[date] = None


class ProductUsageLog(BaseModel):
    id: int
    user_id: int
    product_id: int
    usage_start_datetime: Optional[date] = None
    usage_end_datetime: Optional[date] = None

    class Config:
        from_attributes = True


class ProductUsageLogSimple(BaseModel):
    product_id: int
    usage_start_datetime: Optional[date] = None
    usage_end_datetime: Optional[date] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_usage_log(cls, usage_log):
        return cls(
            product_id=usage_log.product_id,
            usage_start_datetime=usage_log.usage_start_datetime,
            usage_end_datetime=usage_log.usage_end_datetime
        )


class ProductUsageLogWithProduct(BaseModel):
    id: int
    user_id: int
    product_id: int
    usage_start_datetime: Optional[date] = None
    usage_end_datetime: Optional[date] = None
    product: Optional[ProductRead] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_usage_log_with_product(cls, usage_log, product=None):
        data = {
            'id': usage_log.id,
            'user_id': usage_log.user_id,
            'product_id': usage_log.product_id,
            'usage_start_datetime': usage_log.usage_start_datetime,
            'usage_end_datetime': usage_log.usage_end_datetime,
            'product': ProductRead.from_orm_with_attrs(product) if product else None
        }
        return cls(**data)