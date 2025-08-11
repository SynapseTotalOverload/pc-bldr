from datetime import date, datetime
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class ProductUsageGraphRequest(BaseModel):
    start_date: date = Field(..., description="Start date for the graph data")
    end_date: date = Field(..., description="End date for the graph data")
    category_ids: Optional[List[int]] = Field(None, description="Filter by specific category IDs")
    group_by_category: bool = Field(False, description="Group data by category instead of individual products")


class BrandUsageGraphRequest(BaseModel):
    start_date: date = Field(..., description="Start date for the graph data")
    end_date: date = Field(..., description="End date for the graph data")
    category_ids: Optional[List[int]] = Field(None, description="Filter by specific category IDs")
    brands: Optional[List[str]] = Field(None, description="Filter by specific brands")


class ProductSpecificUsageRequest(BaseModel):
    start_date: date = Field(..., description="Start date for the graph data")
    end_date: date = Field(..., description="End date for the graph data")
    product_id: int = Field(..., description="Specific product ID to analyze")


class DailyProductStats(BaseModel):
    date: str
    products: Dict[str, int]
    deleted_products: Optional[Dict[str, str]] = Field(None, description="Products deleted on this date")


class ProductUsageGraphResponse(BaseModel):
    data: List[DailyProductStats]
    categories: Dict[str, str] = Field(..., description="Category ID to name mapping")
    total_products: int
    total_users: int
    date_range: Dict[str, str]


class BrandUsageGraphResponse(BaseModel):
    data: List[DailyProductStats]
    brands: Dict[str, Dict[str, Any]] = Field(..., description="Brand information with product counts")
    total_products: int
    total_users: int
    date_range: Dict[str, str]


class ProductSpecificUsageResponse(BaseModel):
    data: List[DailyProductStats]
    product_info: Dict[str, Any] = Field(..., description="Product information")
    total_users: int
    date_range: Dict[str, str]


class BrandInfo(BaseModel):
    name: str
    product_count: int
    categories: List[str]


class BrandsResponse(BaseModel):
    brands: List[BrandInfo]
    total_brands: int 