from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.pc_specs_list import pc_specs_list_crud
from app.db.session import get_db
from app.schemas.pc_specs_list import PCSpecsListCreate, PCSpecsListUpdate, PCSpecsListRead, PCSpecsListWithProducts

router = APIRouter(prefix="/pc-specs-lists", tags=["pc-specs-lists"])


@router.post("/", response_model=PCSpecsListWithProducts, status_code=status.HTTP_201_CREATED)
def create_pc_specs_list(
    *,
    db: Session = Depends(get_db),
    pc_specs_list_in: PCSpecsListCreate,
) -> PCSpecsListWithProducts:
    """
    Create new PC specs list.
    """
    pc_specs_list = pc_specs_list_crud.create(db=db, obj_in=pc_specs_list_in)
    return PCSpecsListWithProducts.from_pcspecslist(pc_specs_list)


@router.get("/{pc_specs_list_id}", response_model=PCSpecsListWithProducts)
def get_pc_specs_list(
    *,
    db: Session = Depends(get_db),
    pc_specs_list_id: int,
) -> PCSpecsListWithProducts:
    """
    Get PC specs list by ID with products.
    """
    pc_specs_list = pc_specs_list_crud.get(db=db, id_=pc_specs_list_id)
    if not pc_specs_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PC specs list not found"
        )
    return PCSpecsListWithProducts.from_pcspecslist(pc_specs_list)


@router.get("/", response_model=dict)
def get_pc_specs_lists(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
) -> dict:
    """
    Get multiple PC specs lists with pagination.
    """
    pc_specs_lists, total = pc_specs_list_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
    )
    
    return {
        "items": [PCSpecsListWithProducts.from_pcspecslist(pc_specs_list) for pc_specs_list in pc_specs_lists],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.put("/{pc_specs_list_id}", response_model=PCSpecsListWithProducts)
def update_pc_specs_list(
    *,
    db: Session = Depends(get_db),
    pc_specs_list_id: int,
    pc_specs_list_in: PCSpecsListUpdate,
) -> PCSpecsListWithProducts:
    """
    Update PC specs list.
    """
    pc_specs_list = pc_specs_list_crud.get(db=db, id_=pc_specs_list_id)
    if not pc_specs_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PC specs list not found"
        )
    pc_specs_list = pc_specs_list_crud.update(db=db, db_obj=pc_specs_list, obj_in=pc_specs_list_in)
    return PCSpecsListWithProducts.from_pcspecslist(pc_specs_list)


@router.delete("/{pc_specs_list_id}", response_model=PCSpecsListRead)
def delete_pc_specs_list(
    *,
    db: Session = Depends(get_db),
    pc_specs_list_id: int,
) -> PCSpecsListRead:
    """
    Delete PC specs list.
    """
    pc_specs_list = pc_specs_list_crud.remove(db=db, id_=pc_specs_list_id)
    return PCSpecsListRead.from_pcspecslist(pc_specs_list) 