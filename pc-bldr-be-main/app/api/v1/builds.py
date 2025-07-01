from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from math import ceil
from pydantic import BaseModel

from app.db.session import get_db
from app.crud.build import build_crud
from app.schemas.build import BuildCreate, BuildUpdate, BuildRead, BuildTypeEnum
from app.schemas.list_products_with_pagination import PaginationSchema


router = APIRouter(prefix="/builds", tags=["builds"])


@router.post("/", response_model=BuildRead, status_code=status.HTTP_201_CREATED)
def create_build(
    *,
    db: Session = Depends(get_db),
    build_in: BuildCreate,
) -> BuildRead:
    """
    Create a new PC build with compatibility check.
    """
    print(f"Creating build with components: {build_in}")
    build = build_crud.create(db=db, obj_in=build_in)
    return BuildRead.model_validate(build)


class BuildListWithPagination(BaseModel):
    items: List[BuildRead]
    pagination: PaginationSchema

    class Config:
        from_attributes = True


@router.get("/", response_model=BuildListWithPagination)
def read_builds(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    build_type: BuildTypeEnum = Query(None, description="Build type"),
    return_models: bool = Query(False, description="Return models of components instead of ids"),
    query: str = Query(None, description="Search query")
) -> BuildListWithPagination:
    """
    Retrieve builds with pagination.
    """
    builds, total = build_crud.get_multi(
        db=db, 
        skip=skip, 
        limit=limit, 
        build_type=build_type.value if build_type else None, 
        return_models=return_models,
        query=query
    )
    
    items = [BuildRead.from_orm_with_attrs(build, return_models=return_models) for build in builds]
    
    # Calculate pagination info
    page = (skip // limit) + 1
    pagination = PaginationSchema(
        currentPage=page,
        totalPages=ceil(total / limit) if total > 0 else 1,
        totalItems=total,
        itemsPerPage=limit,
    )
    
    return BuildListWithPagination(items=items, pagination=pagination)


@router.get("/{build_id}", response_model=BuildRead)
def read_build(
    *,
    db: Session = Depends(get_db),
    build_id: int,
) -> BuildRead:
    """
    Get build by ID.
    """
    build = build_crud.get(db=db, id_=build_id)
    if not build:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Build not found"
        )
    return BuildRead.model_validate(build)


@router.put("/{build_id}", response_model=BuildRead)
def update_build(
    *,
    db: Session = Depends(get_db),
    build_id: int,
    build_in: BuildUpdate,
) -> BuildRead:
    """
    Update build with compatibility check.
    """
    build = build_crud.get(db=db, id_=build_id)
    if not build:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Build not found"
        )
    build = build_crud.update(db=db, db_obj=build, obj_in=build_in)
    return BuildRead.model_validate(build)


@router.delete("/{build_id}", response_model=BuildRead)
def delete_build(
    *,
    db: Session = Depends(get_db),
    build_id: int,
) -> BuildRead:
    """
    Delete build.
    """
    build = build_crud.remove(db=db, id_=build_id)
    return BuildRead.model_validate(build)

