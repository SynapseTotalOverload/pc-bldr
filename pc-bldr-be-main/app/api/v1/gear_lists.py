from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.gear_list import gear_list_crud
from app.db.session import get_db
from app.schemas.gear_list import GearListCreate, GearListUpdate, GearListRead, GearListWithProducts

router = APIRouter(prefix="/gear-lists", tags=["gear-lists"])


@router.post("/", response_model=GearListWithProducts, status_code=status.HTTP_201_CREATED)
def create_gear_list(
    *,
    db: Session = Depends(get_db),
    gear_list_in: GearListCreate,
) -> GearListWithProducts:
    """
    Create new gear list.
    """
    gear_list = gear_list_crud.create(db=db, obj_in=gear_list_in)
    return GearListWithProducts.from_gearlist(gear_list)


@router.get("/{gear_list_id}", response_model=GearListWithProducts)
def get_gear_list(
    *,
    db: Session = Depends(get_db),
    gear_list_id: int,
) -> GearListWithProducts:
    """
    Get gear list by ID with products.
    """
    gear_list = gear_list_crud.get(db=db, id_=gear_list_id)
    if not gear_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gear list not found"
        )
    return GearListWithProducts.from_gearlist(gear_list)


@router.get("/", response_model=dict)
def get_gear_lists(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
) -> dict:
    """
    Get multiple gear lists with pagination.
    """
    gear_lists, total = gear_list_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
    )
    
    return {
        "items": [GearListWithProducts.from_gearlist(gear_list) for gear_list in gear_lists],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.put("/{gear_list_id}", response_model=GearListWithProducts)
def update_gear_list(
    *,
    db: Session = Depends(get_db),
    gear_list_id: int,
    gear_list_in: GearListUpdate,
) -> GearListWithProducts:
    """
    Update gear list.
    """
    gear_list = gear_list_crud.get(db=db, id_=gear_list_id)
    if not gear_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gear list not found"
        )
    gear_list = gear_list_crud.update(db=db, db_obj=gear_list, obj_in=gear_list_in)
    return GearListWithProducts.from_gearlist(gear_list)


@router.delete("/{gear_list_id}", response_model=GearListRead)
def delete_gear_list(
    *,
    db: Session = Depends(get_db),
    gear_list_id: int,
) -> GearListRead:
    """
    Delete gear list.
    """
    gear_list = gear_list_crud.remove(db=db, id_=gear_list_id)
    return GearListRead.from_gearlist(gear_list) 