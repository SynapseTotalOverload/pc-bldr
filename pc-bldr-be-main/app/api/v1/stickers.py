from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.stickers import sticker_crud
from app.db.session import get_db
from app.schemas.sticker import StickerCreate, StickerUpdate, StickerRead

router = APIRouter(prefix="/stickers", tags=["stickers"])


@router.post("/", response_model=StickerRead, status_code=status.HTTP_201_CREATED)
def create_sticker(*, db: Session = Depends(get_db), sticker_in: StickerCreate) -> StickerRead:
    """Create new sticker."""
    sticker = sticker_crud.create(db=db, obj_in=sticker_in)
    return StickerRead.model_validate(sticker)


@router.get("/{sticker_id}", response_model=StickerRead)
def get_sticker(*, db: Session = Depends(get_db), sticker_id: int) -> StickerRead:
    """Get sticker by ID."""
    sticker = sticker_crud.get(db=db, id_=sticker_id)
    if not sticker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sticker not found")
    return StickerRead.model_validate(sticker)


@router.get("/", response_model=dict)
def get_stickers(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    s_type: Optional[str] = Query(None, description="Filter by sticker type"),
    query: Optional[str] = Query(None, description="Search by name"),
) -> dict:
    """Get list of stickers with pagination and optional filters."""
    stickers, total = sticker_crud.get_multi(db=db, skip=skip, limit=limit, s_type=s_type, query=query)
    return {
        "items": [StickerRead.model_validate(st) for st in stickers],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total,
    }


@router.put("/{sticker_id}", response_model=StickerRead)
def update_sticker(*, db: Session = Depends(get_db), sticker_id: int, sticker_in: StickerUpdate) -> StickerRead:
    """Update sticker."""
    sticker = sticker_crud.get(db=db, id_=sticker_id)
    if not sticker:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sticker not found")
    sticker = sticker_crud.update(db=db, db_obj=sticker, obj_in=sticker_in)
    return StickerRead.model_validate(sticker)


@router.delete("/{sticker_id}", response_model=StickerRead)
def delete_sticker(*, db: Session = Depends(get_db), sticker_id: int) -> StickerRead:
    """Delete sticker."""
    sticker = sticker_crud.remove(db=db, id_=sticker_id)
    return StickerRead.model_validate(sticker)
