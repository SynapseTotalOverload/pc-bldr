from app.schemas.product import ProductRead

from pydantic import BaseModel, Field, ConfigDict


class PaginationSchema(BaseModel): 
    current_page: int = Field(..., alias="currentPage")
    total_pages: int = Field(..., alias="totalPages")
    total_items: int = Field(..., alias="totalItems")
    items_per_page: int = Field(..., alias="itemsPerPage")

    model_config = ConfigDict(populate_by_name=True)


class ProductListWithPagination(BaseModel):
    items: list[ProductRead]
    pagination: PaginationSchema

    model_config = ConfigDict(from_attributes=True)
