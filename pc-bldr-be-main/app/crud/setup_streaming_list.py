from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.setup_streaming_list import SetupStreamingList
from app.models.product import Product
from app.schemas.setup_streaming_list import SetupStreamingListCreate, SetupStreamingListUpdate

import logging

logger = logging.getLogger(__name__)


class CRUDSetupStreamingList:
    def create(self, db: Session, *, obj_in: SetupStreamingListCreate) -> SetupStreamingList:
        """Create a new setup streaming list"""
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
        
        # Create setup streaming list object
        db_obj = SetupStreamingList(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return setup streaming list with products loaded
        stmt = (
            select(SetupStreamingList)
            .where(SetupStreamingList.id == db_obj.id)
            .options(
                joinedload(SetupStreamingList.chair).joinedload(Product.chair_attributes),
                joinedload(SetupStreamingList.chair).joinedload(Product.category),
                joinedload(SetupStreamingList.microphone).joinedload(Product.category),
                joinedload(SetupStreamingList.webcam).joinedload(Product.category)
            )
        )
        return db.scalar(stmt)

    def get(self, db: Session, id_: int) -> Optional[SetupStreamingList]:
        """Get setup streaming list by ID with products loaded"""
        stmt = (
            select(SetupStreamingList)
            .where(SetupStreamingList.id == id_)
            .options(
                joinedload(SetupStreamingList.chair).joinedload(Product.chair_attributes),
                joinedload(SetupStreamingList.chair).joinedload(Product.category),
                joinedload(SetupStreamingList.microphone).joinedload(Product.category),
                joinedload(SetupStreamingList.webcam).joinedload(Product.category)
            )
        )
        return db.scalar(stmt)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
    ) -> tuple[List[SetupStreamingList], int]:
        """Get multiple setup streaming lists with pagination"""
        # Get total count
        count_stmt = (
            select(func.count())
            .select_from(SetupStreamingList)
        )
        
        # Get setup streaming lists with pagination
        stmt = (
            select(SetupStreamingList)
            .offset(skip)
            .limit(limit)
            .options(
                joinedload(SetupStreamingList.chair).joinedload(Product.chair_attributes),
                joinedload(SetupStreamingList.chair).joinedload(Product.category),
                joinedload(SetupStreamingList.microphone).joinedload(Product.category),
                joinedload(SetupStreamingList.webcam).joinedload(Product.category)
            )
        )
        
        total = db.scalar(count_stmt)
        setup_streaming_lists = db.scalars(stmt).all()
        
        return setup_streaming_lists, total

    def update(self, db: Session, *, db_obj: SetupStreamingList, obj_in: SetupStreamingListUpdate) -> SetupStreamingList:
        """Update setup streaming list"""
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
        
        # Return updated setup streaming list with products
        return self.get(db, db_obj.id)
    
    def update_by_model(self, db: Session, *, db_obj: SetupStreamingList, obj_in: SetupStreamingListUpdate) -> SetupStreamingList:
        """Update setup streaming list by model"""

        if obj_in.chair:
            if obj_in.chair.id_change:
                db_obj.chair_id = obj_in.chair.id

        if obj_in.microphone:
            if obj_in.microphone.id_change:
                db_obj.microphone_id = obj_in.microphone.id

        if obj_in.camera:
            if obj_in.camera.id_change:
                db_obj.webcam_id = obj_in.camera.id

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj



    def remove(self, db: Session, *, id_: int) -> SetupStreamingList:
        """Delete setup streaming list"""
        setup_streaming_list = db.get(SetupStreamingList, id_)
        if not setup_streaming_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"SetupStreamingList with id {id_} not found"
            )
        
        db.delete(setup_streaming_list)
        db.commit()
        return setup_streaming_list


setup_streaming_list_crud = CRUDSetupStreamingList() 