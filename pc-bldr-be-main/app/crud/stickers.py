from sqlalchemy import select, func
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional, Tuple

from app.models.stickers import Stickers
from app.schemas.sticker import StickerCreate, StickerUpdate


class CRUDSticker:
    """CRUD operations for Stickers model."""

    # ----------------------------
    # CREATE
    # ----------------------------
    def create(self, db: Session, *, obj_in: StickerCreate) -> Stickers:
        """Create a new sticker."""
        create_data = obj_in.model_dump(exclude_unset=True)

        # Check duplicate by name (optional safety)
        existing = db.scalar(select(Stickers).where(Stickers.name == create_data["name"]))
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Sticker with name '{create_data['name']}' already exists",
            )

        db_obj = Stickers(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    # ----------------------------
    # READ
    # ----------------------------
    def get(self, db: Session, id_: int) -> Optional[Stickers]:
        """Get sticker by ID."""
        return db.get(Stickers, id_)

    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        s_type: Optional[str] = None,
        query: Optional[str] = None,
    ) -> Tuple[List[Stickers], int]:
        """Return list of stickers with pagination and optional filters."""
        stmt = select(Stickers)
        count_stmt = select(func.count()).select_from(Stickers)

        if s_type:
            stmt = stmt.where(Stickers.s_type == s_type)
            count_stmt = count_stmt.where(Stickers.s_type == s_type)

        if query:
            stmt = stmt.where(Stickers.name.ilike(f"%{query}%"))
            count_stmt = count_stmt.where(Stickers.name.ilike(f"%{query}%"))

        stmt = (
            stmt.order_by(Stickers.id.desc())
            .offset(skip)
            .limit(limit)
        )

        stickers = db.scalars(stmt).all()
        total = db.scalar(count_stmt)
        return stickers, total

    # ----------------------------
    # UPDATE
    # ----------------------------
    def update(self, db: Session, *, db_obj: Stickers, obj_in: StickerUpdate) -> Stickers:
        """Update sticker."""
        update_data = obj_in.model_dump(exclude_unset=True)

        # Prevent duplicate name on update
        if "name" in update_data:
            duplicate = db.scalar(
                select(Stickers).where(
                    Stickers.name == update_data["name"], Stickers.id != db_obj.id
                )
            )
            if duplicate:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sticker with name '{update_data['name']}' already exists",
                )

        for field, value in update_data.items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    # ----------------------------
    # DELETE
    # ----------------------------
    def remove(self, db: Session, *, id_: int) -> Stickers:
        """Delete sticker by ID."""
        sticker = self.get(db, id_)
        if not sticker:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sticker not found",
            )
        db.delete(sticker)
        db.commit()
        return sticker


sticker_crud = CRUDSticker()
