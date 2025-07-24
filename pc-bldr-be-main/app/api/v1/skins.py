from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.skins import skin_crud, skin_category_crud
from app.db.session import get_db
from app.schemas.skin import (
    SkinCreate, 
    SkinUpdate, 
    SkinRead, 
    SkinCategoryCreate, 
    SkinCategoryUpdate, 
    SkinCategoryRead
)

router = APIRouter(prefix="/skins", tags=["skins"])


# Skin endpoints
@router.post("/", response_model=SkinRead, status_code=status.HTTP_201_CREATED)
def create_skin(
    *,
    db: Session = Depends(get_db),
    skin_in: SkinCreate,
) -> SkinRead:
    """
    Create new skin.
    """
    skin = skin_crud.create(db=db, obj_in=skin_in)
    return SkinRead.model_validate(skin)


@router.get("/{skin_id}", response_model=SkinRead)
def get_skin(
    *,
    db: Session = Depends(get_db),
    skin_id: int,
) -> SkinRead:
    """
    Get skin by ID.
    """
    skin = skin_crud.get(db=db, id_=skin_id)
    if not skin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skin not found"
        )
    return SkinRead.model_validate(skin)


@router.get("/", response_model=dict)
def get_skins(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    category_id: Optional[int] = Query(None, ge=1, le=6, description="Filter by category ID"),
    weapon: Optional[str] = Query(None, description="Filter by weapon type"),
    query: Optional[str] = Query(None, description="Search query for name, full_name, skin_name, or weapon"),
    include_category: bool = Query(False, description="Include category information"),
) -> dict:
    """
    Get multiple skins with pagination and filtering.
    """
    skins, total = skin_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        weapon=weapon,
        query=query,
        return_category=include_category,
    )
    
    return {
        "items": [SkinRead.model_validate(skin) for skin in skins],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.get("/weapon/{weapon}", response_model=List[SkinRead])
def get_skins_by_weapon(
    *,
    db: Session = Depends(get_db),
    weapon: str,
) -> List[SkinRead]:
    """
    Get skins by weapon type.
    """
    skins = skin_crud.get_by_weapon(db=db, weapon=weapon)
    return [SkinRead.model_validate(skin) for skin in skins]


@router.get("/category/{category_id}", response_model=List[SkinRead])
def get_skins_by_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
) -> List[SkinRead]:
    """
    Get skins by category ID.
    """
    skins = skin_crud.get_by_category(db=db, category_id=category_id)
    return [SkinRead.model_validate(skin) for skin in skins]


@router.put("/{skin_id}", response_model=SkinRead)
def update_skin(
    *,
    db: Session = Depends(get_db),
    skin_id: int,
    skin_in: SkinUpdate,
) -> SkinRead:
    """
    Update skin.
    """
    skin = skin_crud.get(db=db, id_=skin_id)
    if not skin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skin not found"
        )
    skin = skin_crud.update(db=db, db_obj=skin, obj_in=skin_in)
    return SkinRead.model_validate(skin)


@router.delete("/{skin_id}", response_model=SkinRead)
def delete_skin(
    *,
    db: Session = Depends(get_db),
    skin_id: int,
) -> SkinRead:
    """
    Delete skin.
    """
    skin = skin_crud.remove(db=db, id_=skin_id)
    return SkinRead.model_validate(skin)


# Skin Category endpoints
@router.post("/categories/", response_model=SkinCategoryRead, status_code=status.HTTP_201_CREATED)
def create_skin_category(
    *,
    db: Session = Depends(get_db),
    category_in: SkinCategoryCreate,
) -> SkinCategoryRead:
    """
    Create new skin category.
    """
    category = skin_category_crud.create(db=db, obj_in=category_in)
    return SkinCategoryRead.model_validate(category)


@router.get("/categories/{category_id}", response_model=SkinCategoryRead)
def get_skin_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
) -> SkinCategoryRead:
    """
    Get skin category by ID.
    """
    category = skin_category_crud.get(db=db, id_=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skin category not found"
        )
    return SkinCategoryRead.model_validate(category)


@router.get("/categories/", response_model=dict)
def get_skin_categories(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    query: Optional[str] = Query(None, description="Search query for category name"),
    include_skins: bool = Query(False, description="Include skins information"),
) -> dict:
    """
    Get multiple skin categories with pagination.
    """
    categories, total = skin_category_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
        query=query,
        return_skins=include_skins,
    )
    
    return {
        "items": [SkinCategoryRead.model_validate(category) for category in categories],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.put("/categories/{category_id}", response_model=SkinCategoryRead)
def update_skin_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
    category_in: SkinCategoryUpdate,
) -> SkinCategoryRead:
    """
    Update skin category.
    """
    category = skin_category_crud.get(db=db, id_=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skin category not found"
        )
    category = skin_category_crud.update(db=db, db_obj=category, obj_in=category_in)
    return SkinCategoryRead.model_validate(category)


@router.delete("/categories/{category_id}", response_model=SkinCategoryRead)
def delete_skin_category(
    *,
    db: Session = Depends(get_db),
    category_id: int,
) -> SkinCategoryRead:
    """
    Delete skin category.
    """
    category = skin_category_crud.remove(db=db, id_=category_id)
    return SkinCategoryRead.model_validate(category)
