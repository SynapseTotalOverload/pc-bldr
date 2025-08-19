from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from pydantic import BaseModel, ConfigDict
from app.db.session import get_db
from app.crud.country import country_crud
from app.schemas.country import CountryRead
from app.schemas.list_products_with_pagination import PaginationSchema

router = APIRouter(prefix="/countries", tags=["countries"])


class CountryListWithPagination(BaseModel):
    items: List[CountryRead]
    pagination: PaginationSchema

    model_config = ConfigDict(from_attributes=True)


@router.get("/", response_model=CountryListWithPagination)
def read_countries(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    query: str | None = Query(None, description="Search by country name or ISO code"),
) -> CountryListWithPagination:
    """Return countries with pagination and optional search."""
    items, total = country_crud.get_multi(db, skip=skip, limit=limit, query=query)

    current_page = (skip // limit) + 1
    total_pages = (total + limit - 1) // limit if total else 1
    pagination = PaginationSchema(
        currentPage=current_page,
        totalPages=total_pages,
        totalItems=total,
        itemsPerPage=limit,
    )

    return CountryListWithPagination(items=items, pagination=pagination)
