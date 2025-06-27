from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.build import Build
from app.models.product import Product
from app.schemas.build import BuildCreate, BuildUpdate, BuildTypeEnum
from app.services.pc_builder.selector import ComponentSelector
from app.services.pc_builder.rules import get_rules_for_purpose


class CRUDBuild:
    def _get_component_mapping(self, build: Build) -> dict[str, Optional[Product]]:
        """Get mapping of component types to products"""
        return {
            "cpu": build.cpu,
            "cpu_cooler": build.cpu_cooler,
            "gpu": build.gpu,
            "motherboard": build.motherboard,
            "ram": build.ram,
            "storage": build.storage,
            "psu": build.psu,
            "case": build.case,
        }

    def _check_compatibility(self, db: Session, build: Build) -> bool:
        """Check if all components in the build are compatible"""
        component_mapping = self._get_component_mapping(build)
        
        # Filter out None components
        selected_components = {k: v for k, v in component_mapping.items() if v is not None}
        
        if len(selected_components) < 2:
            return True  # Need at least 2 components to check compatibility
        
        # Use ComponentSelector to check compatibility
        selector = ComponentSelector(
            budget=0,  # Not used for compatibility checking
            rules=get_rules_for_purpose("gaming"),  # Default rules
            session=db,
            selected_components=selected_components,
        )
        
        # Check each component against others
        for component_type, product in selected_components.items():
            selector.component_type = component_type
            if not selector.is_compatible(product):
                return False
        
        return True

    def _calculate_build_price(self, build: Build) -> float:
        """Calculate total price of all components in the build"""
        total_price = 0.0
        component_mapping = self._get_component_mapping(build)
        
        for component in component_mapping.values():
            if component and component.price:
                total_price += component.price
        
        return round(total_price, 2)

    def create(self, db: Session, *, obj_in: BuildCreate) -> Build:
        """Create a new build with compatibility check"""
        create_data = obj_in.model_dump(exclude_unset=True)
        
        # Create build object
        db_obj = Build(**create_data)
        db.add(db_obj)
        db.flush()  # Flush to get the build ID
        
        # Check compatibility if components are provided
        if any([
            db_obj.cpu_id, db_obj.cpu_cooler_id, db_obj.gpu_id, db_obj.motherboard_id,
            db_obj.ram_id, db_obj.storage_id, db_obj.psu_id, db_obj.case_id
        ]):
            if not self._check_compatibility(db, db_obj):
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Selected components are not compatible with each other"
                )
        
        # Calculate and set build price if not provided
        if db_obj.build_price is None:
            db_obj.build_price = self._calculate_build_price(db_obj)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, id_: int) -> Optional[Build]:
        """Get build by ID with all components loaded"""
        return db.get(Build, id_)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        build_type: BuildTypeEnum = None,
        return_models: bool = False
    ) -> tuple[List[Build], int]:
        """Get multiple builds with pagination"""
        # Get total count
        count_stmt = select(func.count()).select_from(Build)
        total = db.scalar(count_stmt)
        
        # Get builds with pagination
        stmt = (
            select(Build)
            .offset(skip)
            .limit(limit)
        )
        if build_type:
            stmt = stmt.where(Build.build_type == build_type)
        if return_models:
            stmt = stmt.options(
                joinedload(Build.cpu), 
                joinedload(Build.cpu_cooler), 
                joinedload(Build.gpu), 
                joinedload(Build.motherboard), 
                joinedload(Build.ram), 
                joinedload(Build.storage), 
                joinedload(Build.psu), 
                joinedload(Build.case)
            )
        builds = db.scalars(stmt).all()
        
        return builds, total

    def update(self, db: Session, *, db_obj: Build, obj_in: BuildUpdate) -> Build:
        """Update build with compatibility check"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Update fields
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        # Check compatibility if components were updated
        if any([
            'cpu_id', 'cpu_cooler_id', 'gpu_id', 'motherboard_id',
            'ram_id', 'storage_id', 'psu_id', 'case_id'
        ]) in update_data:
            if not self._check_compatibility(db, db_obj):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Selected components are not compatible with each other"
                )
        
        # Recalculate build price if components were updated
        if any([
            'cpu_id', 'cpu_cooler_id', 'gpu_id', 'motherboard_id',
            'ram_id', 'storage_id', 'psu_id', 'case_id'
        ]) in update_data:
            db_obj.build_price = self._calculate_build_price(db_obj)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id_: int) -> Build:
        """Delete build by ID"""
        build = db.get(Build, id_)
        if not build:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Build not found"
            )
        
        db.delete(build)
        db.commit()
        return build


build_crud = CRUDBuild() 