from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.skin import Skin
from app.models.skin_category import SkinCategory
from app.schemas.skin import SkinCreate, SkinUpdate, SkinCategoryCreate, SkinCategoryUpdate

import logging

logger = logging.getLogger(__name__)


class CRUDSkin:
    def create(self, db: Session, *, obj_in: SkinCreate) -> Skin:
        """Create a new skin"""
        create_data = obj_in.model_dump(exclude_unset=True)
        
        # Check if category exists
        category = db.get(SkinCategory, create_data["category_id"])
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with id {create_data['category_id']} does not exist"
            )
        
        # Create skin object
        db_obj = Skin(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return skin with category loaded
        stmt = (
            select(Skin)
            .where(Skin.id == db_obj.id)
            .options(joinedload(Skin.category))
        )
        return db.scalar(stmt)

    def get(self, db: Session, id_: int) -> Optional[Skin]:
        """Get skin by ID with category loaded"""
        stmt = (
            select(Skin)
            .where(Skin.id == id_)
            .options(joinedload(Skin.category))
        )
        return db.scalar(stmt)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        category_id: Optional[int] = None,
        weapon: Optional[str] = None,
        query: Optional[str] = None,
        return_category: bool = False,
    ) -> tuple[List[Skin], int]:
        """Get multiple skins with pagination and filtering"""
        # Get total count
        count_stmt = (
            select(func.count())
            .select_from(Skin)
        )
        
        # Get skins with pagination
        stmt = (
            select(Skin)
            .offset(skip)
            .limit(limit)
        )
        
        # Apply filters
        if category_id:
            stmt = stmt.where(Skin.category_id == category_id)
            count_stmt = count_stmt.where(Skin.category_id == category_id)
        
        if weapon:
            stmt = stmt.where(Skin.weapon.ilike(f"%{weapon}%"))
            count_stmt = count_stmt.where(Skin.weapon.ilike(f"%{weapon}%"))
        
        if query:
            stmt = stmt.where(
                (Skin.name.ilike(f"%{query}%")) |
                (Skin.full_name.ilike(f"%{query}%")) |
                (Skin.skin_name.ilike(f"%{query}%")) |
                (Skin.weapon.ilike(f"%{query}%"))
            )
            count_stmt = count_stmt.where(
                (Skin.name.ilike(f"%{query}%")) |
                (Skin.full_name.ilike(f"%{query}%")) |
                (Skin.skin_name.ilike(f"%{query}%")) |
                (Skin.weapon.ilike(f"%{query}%"))
            )
        
        # Always load category since SkinRead schema includes it
        stmt = stmt.options(joinedload(Skin.category))
        
        skins = db.scalars(stmt.order_by(Skin.updated_at.desc())).all()
        total = db.scalar(count_stmt)
        
        return skins, total

    def get_by_weapon(self, db: Session, *, weapon: str) -> List[Skin]:
        """Get skins by weapon type"""
        stmt = (
            select(Skin)
            .where(Skin.weapon.ilike(f"%{weapon}%"))
            .options(joinedload(Skin.category))
            .order_by(Skin.name)
        )
        return db.scalars(stmt).all()

    def get_by_category(self, db: Session, *, category_id: int) -> List[Skin]:
        """Get skins by category ID"""
        stmt = (
            select(Skin)
            .where(Skin.category_id == category_id)
            .options(joinedload(Skin.category))
            .order_by(Skin.name)
        )
        return db.scalars(stmt).all()

    def update(self, db: Session, *, db_obj: Skin, obj_in: SkinUpdate) -> Skin:
        """Update skin"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Check if category exists if category_id is being updated
        if "category_id" in update_data:
            category = db.get(SkinCategory, update_data["category_id"])
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with id {update_data['category_id']} does not exist"
                )
        
        # Update fields
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db_obj.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_obj)
        
        # Return skin with category loaded
        stmt = (
            select(Skin)
            .where(Skin.id == db_obj.id)
            .options(joinedload(Skin.category))
        )
        return db.scalar(stmt)

    def remove(self, db: Session, *, id_: int) -> Skin:
        """Delete skin by ID"""
        # Get skin with category loaded
        stmt = (
            select(Skin)
            .where(Skin.id == id_)
            .options(joinedload(Skin.category))
        )
        skin = db.scalar(stmt)
        
        if not skin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skin not found"
            )
        
        db.delete(skin)
        db.commit()
        return skin


class CRUDSkinCategory:
    def create(self, db: Session, *, obj_in: SkinCategoryCreate) -> SkinCategory:
        """Create a new skin category"""
        create_data = obj_in.model_dump(exclude_unset=True)
        
        # Check if category with same name already exists
        existing_category = db.query(SkinCategory).filter(
            SkinCategory.name == create_data["name"]
        ).first()
        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Category with name '{create_data['name']}' already exists"
            )
        
        # Create category object
        db_obj = SkinCategory(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return category with skins loaded
        stmt = (
            select(SkinCategory)
            .where(SkinCategory.id == db_obj.id)
            .options(joinedload(SkinCategory.skins))
        )
        return db.scalar(stmt)

    def get(self, db: Session, id_: int) -> Optional[SkinCategory]:
        """Get skin category by ID"""
        stmt = (
            select(SkinCategory)
            .where(SkinCategory.id == id_)
            .options(joinedload(SkinCategory.skins))
        )
        return db.scalar(stmt)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        query: Optional[str] = None,
        return_skins: bool = False,
    ) -> tuple[List[SkinCategory], int]:
        """Get multiple skin categories with pagination"""
        # Get total count
        count_stmt = (
            select(func.count())
            .select_from(SkinCategory)
        )
        
        # Get categories with pagination
        stmt = (
            select(SkinCategory)
            .offset(skip)
            .limit(limit)
        )
        
        # Apply filters
        if query:
            stmt = stmt.where(SkinCategory.name.ilike(f"%{query}%"))
            count_stmt = count_stmt.where(SkinCategory.name.ilike(f"%{query}%"))
        
        if return_skins:
            stmt = stmt.options(joinedload(SkinCategory.skins))
        
        categories = db.scalars(stmt.order_by(SkinCategory.name)).all()
        total = db.scalar(count_stmt)
        
        return categories, total

    def update(self, db: Session, *, db_obj: SkinCategory, obj_in: SkinCategoryUpdate) -> SkinCategory:
        """Update skin category"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Check if category with same name already exists (if name is being updated)
        if "name" in update_data:
            existing_category = db.query(SkinCategory).filter(
                SkinCategory.name == update_data["name"],
                SkinCategory.id != db_obj.id
            ).first()
            if existing_category:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Category with name '{update_data['name']}' already exists"
                )
        
        # Update fields
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db_obj.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_obj)
        
        # Return category with skins loaded
        stmt = (
            select(SkinCategory)
            .where(SkinCategory.id == db_obj.id)
            .options(joinedload(SkinCategory.skins))
        )
        return db.scalar(stmt)

    def remove(self, db: Session, *, id_: int) -> SkinCategory:
        """Delete skin category by ID"""
        # Get category with skins loaded
        stmt = (
            select(SkinCategory)
            .where(SkinCategory.id == id_)
            .options(joinedload(SkinCategory.skins))
        )
        category = db.scalar(stmt)
        
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Skin category not found"
            )
        
        # Check if category has associated skins
        skins_count = db.query(Skin).filter(Skin.category_id == id_).count()
        if skins_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete category with {skins_count} associated skins"
            )
        
        db.delete(category)
        db.commit()
        return category


skin_crud = CRUDSkin()
skin_category_crud = CRUDSkinCategory()
