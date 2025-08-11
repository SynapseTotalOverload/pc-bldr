from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.pc_specs_list import PCSpecsList
from app.models.product import Product
from app.schemas.pc_specs_list import PCSpecsListCreate, PCSpecsListUpdate

import logging

logger = logging.getLogger(__name__)


class CRUDPCSpecsList:
    def create(self, db: Session, *, obj_in: PCSpecsListCreate) -> PCSpecsList:
        """Create a new PC specs list"""
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
        
        # Create PC specs list object
        db_obj = PCSpecsList(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return PC specs list with products loaded
        stmt = (
            select(PCSpecsList)
            .where(PCSpecsList.id == db_obj.id)
            .options(
                joinedload(PCSpecsList.cpu).joinedload(Product.cpu_attributes),
                joinedload(PCSpecsList.cpu).joinedload(Product.category),
                joinedload(PCSpecsList.cpu_cooler).joinedload(Product.cpu_cooler_attributes),
                joinedload(PCSpecsList.cpu_cooler).joinedload(Product.category),
                joinedload(PCSpecsList.gpu).joinedload(Product.gpu_attributes),
                joinedload(PCSpecsList.gpu).joinedload(Product.category),
                joinedload(PCSpecsList.motherboard).joinedload(Product.motherboard_attributes),
                joinedload(PCSpecsList.motherboard).joinedload(Product.category),
                joinedload(PCSpecsList.ram).joinedload(Product.ram_attributes),
                joinedload(PCSpecsList.ram).joinedload(Product.category),
                joinedload(PCSpecsList.storage).joinedload(Product.storage_attributes),
                joinedload(PCSpecsList.storage).joinedload(Product.category),
                joinedload(PCSpecsList.power_supply).joinedload(Product.power_supply_attributes),
                joinedload(PCSpecsList.power_supply).joinedload(Product.category),
                joinedload(PCSpecsList.case).joinedload(Product.case_attributes),
                joinedload(PCSpecsList.case).joinedload(Product.category)
            )
        )
        return db.scalar(stmt)

    def get(self, db: Session, id_: int) -> Optional[PCSpecsList]:
        """Get PC specs list by ID with products loaded"""
        stmt = (
            select(PCSpecsList)
            .where(PCSpecsList.id == id_)
            .options(
                joinedload(PCSpecsList.cpu).joinedload(Product.cpu_attributes),
                joinedload(PCSpecsList.cpu).joinedload(Product.category),
                joinedload(PCSpecsList.cpu_cooler).joinedload(Product.cpu_cooler_attributes),
                joinedload(PCSpecsList.cpu_cooler).joinedload(Product.category),
                joinedload(PCSpecsList.gpu).joinedload(Product.gpu_attributes),
                joinedload(PCSpecsList.gpu).joinedload(Product.category),
                joinedload(PCSpecsList.motherboard).joinedload(Product.motherboard_attributes),
                joinedload(PCSpecsList.motherboard).joinedload(Product.category),
                joinedload(PCSpecsList.ram).joinedload(Product.ram_attributes),
                joinedload(PCSpecsList.ram).joinedload(Product.category),
                joinedload(PCSpecsList.storage).joinedload(Product.storage_attributes),
                joinedload(PCSpecsList.storage).joinedload(Product.category),
                joinedload(PCSpecsList.power_supply).joinedload(Product.power_supply_attributes),
                joinedload(PCSpecsList.power_supply).joinedload(Product.category),
                joinedload(PCSpecsList.case).joinedload(Product.case_attributes),
                joinedload(PCSpecsList.case).joinedload(Product.category)
            )
        )
        return db.scalar(stmt)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
    ) -> tuple[List[PCSpecsList], int]:
        """Get multiple PC specs lists with pagination"""
        # Get total count
        count_stmt = (
            select(func.count())
            .select_from(PCSpecsList)
        )
        
        # Get PC specs lists with pagination
        stmt = (
            select(PCSpecsList)
            .offset(skip)
            .limit(limit)
            .options(
                joinedload(PCSpecsList.cpu).joinedload(Product.cpu_attributes),
                joinedload(PCSpecsList.cpu).joinedload(Product.category),
                joinedload(PCSpecsList.cpu_cooler).joinedload(Product.cpu_cooler_attributes),
                joinedload(PCSpecsList.cpu_cooler).joinedload(Product.category),
                joinedload(PCSpecsList.gpu).joinedload(Product.gpu_attributes),
                joinedload(PCSpecsList.gpu).joinedload(Product.category),
                joinedload(PCSpecsList.motherboard).joinedload(Product.motherboard_attributes),
                joinedload(PCSpecsList.motherboard).joinedload(Product.category),
                joinedload(PCSpecsList.ram).joinedload(Product.ram_attributes),
                joinedload(PCSpecsList.ram).joinedload(Product.category),
                joinedload(PCSpecsList.storage).joinedload(Product.storage_attributes),
                joinedload(PCSpecsList.storage).joinedload(Product.category),
                joinedload(PCSpecsList.power_supply).joinedload(Product.power_supply_attributes),
                joinedload(PCSpecsList.power_supply).joinedload(Product.category),
                joinedload(PCSpecsList.case).joinedload(Product.case_attributes),
                joinedload(PCSpecsList.case).joinedload(Product.category)
            )
        )
        
        total = db.scalar(count_stmt)
        pc_specs_lists = db.scalars(stmt).all()
        
        return pc_specs_lists, total

    def update(self, db: Session, *, db_obj: PCSpecsList, obj_in: PCSpecsListUpdate) -> PCSpecsList:
        """Update PC specs list"""
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
        
        # Return updated PC specs list with products
        return self.get(db, db_obj.id)
    
    def update_by_model(self, db: Session, *, db_obj: PCSpecsList, obj_in: PCSpecsListUpdate) -> PCSpecsList:
        """Update PC specs list by model"""
        if obj_in.case:
            if obj_in.case.id_change:
                db_obj.case_id = obj_in.case.id
        
        if obj_in.cpu:
            if obj_in.cpu.id_change:
                db_obj.cpu_id = obj_in.cpu.id
        
        if obj_in.cpu_cooler:
            if obj_in.cpu_cooler.id_change:
                db_obj.cpu_cooler_id = obj_in.cpu_cooler.id

        if obj_in.gpu:
            if obj_in.gpu.id_change:
                db_obj.gpu_id = obj_in.gpu.id

        if obj_in.motherboard:
            if obj_in.motherboard.id_change:
                db_obj.motherboard_id = obj_in.motherboard.id

        if obj_in.ram:
            if obj_in.ram.id_change:
                db_obj.ram_id = obj_in.ram.id

        if obj_in.storage:
            if obj_in.storage.id_change:
                db_obj.storage_id = obj_in.storage.id

        if obj_in.power_supply:
            if obj_in.power_supply.id_change:
                db_obj.power_supply_id = obj_in.power_supply.id

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

        

    def remove(self, db: Session, *, id_: int) -> PCSpecsList:
        """Delete PC specs list"""
        pc_specs_list = db.get(PCSpecsList, id_)
        if not pc_specs_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"PCSpecsList with id {id_} not found"
            )
        
        db.delete(pc_specs_list)
        db.commit()
        return pc_specs_list


pc_specs_list_crud = CRUDPCSpecsList() 