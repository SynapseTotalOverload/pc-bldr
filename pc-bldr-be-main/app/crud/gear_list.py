from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.gear_list import GearList
from app.models.product import Product
from app.schemas.gear_list import GearListCreate, GearListUpdate

import logging

logger = logging.getLogger(__name__)


class CRUDGearList:
    def create(self, db: Session, *, obj_in: GearListCreate) -> GearList:
        """Create a new gear list"""
        create_data = obj_in.model_dump(exclude_unset=True)
        
        # Validate product IDs if provided
        for field, product_id in create_data.items():
            if product_id and field.endswith('_id'):
                product = db.get(Product, product_id)
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Product with id {product_id} does not exist"
                    )
        
        # Create gear list object
        db_obj = GearList(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return gear list with products loaded
        stmt = (
            select(GearList)
            .where(GearList.id == db_obj.id)
            .options(
                joinedload(GearList.monitor).joinedload(Product.monitor_attributes),
                joinedload(GearList.monitor).joinedload(Product.category),
                joinedload(GearList.mouse).joinedload(Product.mouse_attributes),
                joinedload(GearList.mouse).joinedload(Product.category),
                joinedload(GearList.keyboard).joinedload(Product.keyboard_attributes),
                joinedload(GearList.keyboard).joinedload(Product.category),
                joinedload(GearList.headset).joinedload(Product.headset_attributes),
                joinedload(GearList.headset).joinedload(Product.category),
                joinedload(GearList.mousepad).joinedload(Product.mousepad_attributes),
                joinedload(GearList.mousepad).joinedload(Product.category),
                joinedload(GearList.earphones).joinedload(Product.headset_attributes),
                joinedload(GearList.earphones).joinedload(Product.category)
            )
        )
        return db.scalar(stmt)

    def get(self, db: Session, id_: int) -> Optional[GearList]:
        """Get gear list by ID with products loaded"""
        stmt = (
            select(GearList)
            .where(GearList.id == id_)
            .options(
                joinedload(GearList.monitor).joinedload(Product.monitor_attributes),
                joinedload(GearList.monitor).joinedload(Product.category),
                joinedload(GearList.mouse).joinedload(Product.mouse_attributes),
                joinedload(GearList.mouse).joinedload(Product.category),
                joinedload(GearList.keyboard).joinedload(Product.keyboard_attributes),
                joinedload(GearList.keyboard).joinedload(Product.category),
                joinedload(GearList.headset).joinedload(Product.headset_attributes),
                joinedload(GearList.headset).joinedload(Product.category),
                joinedload(GearList.mousepad).joinedload(Product.mousepad_attributes),
                joinedload(GearList.mousepad).joinedload(Product.category),
                joinedload(GearList.earphones).joinedload(Product.headset_attributes),
                joinedload(GearList.earphones).joinedload(Product.category)
            )
        )
        return db.scalar(stmt)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
    ) -> tuple[List[GearList], int]:
        """Get multiple gear lists with pagination"""
        # Get total count
        count_stmt = (
            select(func.count())
            .select_from(GearList)
        )
        
        # Get gear lists with pagination
        stmt = (
            select(GearList)
            .offset(skip)
            .limit(limit)
            .options(
                joinedload(GearList.monitor).joinedload(Product.monitor_attributes),
                joinedload(GearList.monitor).joinedload(Product.category),
                joinedload(GearList.mouse).joinedload(Product.mouse_attributes),
                joinedload(GearList.mouse).joinedload(Product.category),
                joinedload(GearList.keyboard).joinedload(Product.keyboard_attributes),
                joinedload(GearList.keyboard).joinedload(Product.category),
                joinedload(GearList.headset).joinedload(Product.headset_attributes),
                joinedload(GearList.headset).joinedload(Product.category),
                joinedload(GearList.mousepad).joinedload(Product.mousepad_attributes),
                joinedload(GearList.mousepad).joinedload(Product.category),
                joinedload(GearList.earphones).joinedload(Product.headset_attributes),
                joinedload(GearList.earphones).joinedload(Product.category)
            )
        )
        
        total = db.scalar(count_stmt)
        gear_lists = db.scalars(stmt).all()
        
        return gear_lists, total

    def update(self, db: Session, *, db_obj: GearList, obj_in: GearListUpdate) -> GearList:
        """Update gear list"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Validate product IDs if provided
        for field, product_id in update_data.items():
            if product_id and field.endswith('_id'):
                product = db.get(Product, product_id)
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Product with id {product_id} does not exist"
                    )
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return updated gear list with products
        return self.get(db, db_obj.id)

    def remove(self, db: Session, *, id_: int) -> GearList:
        """Delete gear list"""
        gear_list = db.get(GearList, id_)
        if not gear_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"GearList with id {id_} not found"
            )
        
        db.delete(gear_list)
        db.commit()
        return gear_list


gear_list_crud = CRUDGearList() 