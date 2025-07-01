from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status

from app.core.enums import cat_id_to_attrs_model_map
from app.models.product import Product
from app.models.attributes import (
    CPUAttributes,
    CPUCoolerAttributes,
    GPUAttributes,
    MotherboardAttributes,
    RAMAttributes,
    StorageAttributes,
    PowerSupplyAttributes,
    CaseAttributes,
)
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.attributes import (
    CPUAttributesUpdateSchema,
    CPUCoolerAttributesUpdateSchema,
    MotherboardAttributesUpdateSchema,
    RAMAttributesUpdateSchema,
    StorageAttributesUpdateSchema,
    GPUAttributesUpdateSchema,
    PowerSupplyAttributesUpdateSchema,
    CaseAttributesUpdateSchema,
)


class CRUDProduct:
    def _get_joinedload_attrs_option(self):
        return (
            joinedload(Product.cpu_attributes),
            joinedload(Product.cpu_cooler_attributes),
            joinedload(Product.case_attributes),
            joinedload(Product.gpu_attributes),
            joinedload(Product.motherboard_attributes),
            joinedload(Product.power_supply_attributes),
            joinedload(Product.ram_attributes),
            joinedload(Product.storage_attributes),
        )

    def _get_attrs_relationship_name(self, attrs_model):
        """Get the relationship name for the attributes model"""
        mapping = {
            CPUAttributes: "cpu_attributes",
            CPUCoolerAttributes: "cpu_cooler_attributes",
            GPUAttributes: "gpu_attributes",
            MotherboardAttributes: "motherboard_attributes",
            RAMAttributes: "ram_attributes",
            StorageAttributes: "storage_attributes",
            PowerSupplyAttributes: "power_supply_attributes",
            CaseAttributes: "case_attributes",
        }
        return mapping.get(attrs_model)

    def _get_attrs_update_schema_for_category(self, category_id: int):
        """Get the appropriate update schema for a category"""
        mapping = {
            1: CPUAttributesUpdateSchema,
            2: CPUCoolerAttributesUpdateSchema,
            3: GPUAttributesUpdateSchema,
            4: MotherboardAttributesUpdateSchema,
            5: RAMAttributesUpdateSchema,
            6: StorageAttributesUpdateSchema,
            7: PowerSupplyAttributesUpdateSchema,
            8: CaseAttributesUpdateSchema,
        }
        return mapping.get(category_id)

    def _validate_attrs_for_category(self, category_id: int, attrs_data: dict) -> list[str]:
        """Validate that all provided attribute fields exist for the given category"""
        attrs_model = cat_id_to_attrs_model_map.get(category_id)
        if not attrs_model:
            return []
        
        valid_fields = {column.name for column in attrs_model.__table__.columns 
                       if column.name not in ['id', 'product_id', 'created_at', 'updated_at']}
        provided_fields = set(attrs_data.keys())
        invalid_fields = provided_fields - valid_fields
        
        return list(invalid_fields)

    def create(self, db: Session, *, obj_in: ProductCreate) -> Product:
        create_data = obj_in.model_dump(exclude_unset=True)
        attrs_data = create_data.pop('attrs', None)
        
        # Create basic product
        db_obj = Product(**create_data)
        db.add(db_obj)
        db.flush()  # Flush to get the product ID
        
        # Handle attributes creation
        if attrs_data is not None:
            category_id = db_obj.category_id
            if not category_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot create attributes without category_id. Please set category_id first."
                )
            
            # Validate attributes using the appropriate schema
            try:
                update_schema = self._get_attrs_update_schema_for_category(category_id)
                validated_attrs = update_schema(**attrs_data)
                attrs_dict = validated_attrs.model_dump(exclude_none=True)
            except Exception as e:
                attrs_model = cat_id_to_attrs_model_map.get(category_id)
                valid_fields = [column.name for column in attrs_model.__table__.columns 
                              if column.name not in ['id', 'product_id', 'created_at', 'updated_at']]
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"For category {category_id} you can only pass in attrs the following fields: {', '.join(valid_fields)}"
                )
            
            # Create attributes record
            attrs_model = cat_id_to_attrs_model_map.get(category_id)
            new_attrs = attrs_model(product_id=db_obj.id, **attrs_dict)
            db.add(new_attrs)
        
        db.commit()
        db.refresh(db_obj, attribute_names=["category"])
        return db_obj

    def get(self, db: Session, id_: int):
        return db.get(Product, id_, options=(self._get_joinedload_attrs_option()))
    
    def get_by_asin(self, db: Session, asin: str):
        return db.scalar(select(Product).where(Product.asin == asin).options(*self._get_joinedload_attrs_option()))

    def get_multi(self, db: Session, *, page: int = 1, page_size: int = 20, category_id: int | None = None):
        stmt = (
            select(Product)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        if category_id:
            CatAttrTable = cat_id_to_attrs_model_map[category_id]
            stmt = stmt.join(CatAttrTable)
        else:
            stmt = stmt.options(*self._get_joinedload_attrs_option())
        count_stmt = select(func.count()).select_from(Product)
        if category_id:
            CatAttrTable = cat_id_to_attrs_model_map[category_id]
            count_stmt = count_stmt.join(CatAttrTable)
        total = db.scalar(count_stmt)
        return db.scalars(stmt).all(), total

    def update(self, db: Session, *, db_obj: Product, obj_in: ProductUpdate):
        update_data = obj_in.model_dump(exclude_unset=True)
        category_id = update_data.pop('category_id', None)
        attrs_data = update_data.pop('attrs', None)
        
        # Update basic product fields
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        if category_id:
            db_obj.category_id = category_id
        else:
            category_id = db_obj.category_id
        
        # Handle attributes update
        if attrs_data is not None:
            # Determine category for validation
            if not category_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Product has no category assigned. Please set category_id first."
                )
            
            # Validate attributes using the appropriate schema
            try:
                update_schema = self._get_attrs_update_schema_for_category(category_id)
                validated_attrs = update_schema(**attrs_data)
                attrs_dict = validated_attrs.model_dump(exclude_none=True)
            except Exception as e:
                attrs_model = cat_id_to_attrs_model_map.get(category_id)
                valid_fields = [column.name for column in attrs_model.__table__.columns 
                              if column.name not in ['id', 'product_id', 'created_at', 'updated_at']]
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"For category {category_id} you can only pass in attrs the following fields: {', '.join(valid_fields)}"
                )
            
            # Get or create attributes record
            attrs_model = cat_id_to_attrs_model_map.get(category_id)
            relationship_name = self._get_attrs_relationship_name(attrs_model)
            existing_attrs = getattr(db_obj, relationship_name)
            
            if existing_attrs:
                # Update existing attributes
                for field, value in attrs_dict.items():
                    setattr(existing_attrs, field, value)
            else:
                # Create new attributes record
                new_attrs = attrs_model(product_id=db_obj.id, **attrs_dict)
                db.add(new_attrs)
        db_obj.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_compatible(
            self, 
            db: Session,
            *, 
            selected_components: dict, 
            page: int = 1, 
            page_size: int = 20, 
            category_id: int | None = None, 
            budget: int | None = None,
            query: str | None = None
        ):
        """Get products compatible with selected components using ComponentFiltersBuilder"""
        from app.services.pc_builder.component_filters_builder import ComponentFiltersBuilder
        
        # Get selected component products from database
        selected_products = {}
        if selected_components:
            for component_type, component_id in selected_components.items():
                product = self.get(db, component_id)
                if product:
                    selected_products[component_type] = product
        
        # Build compatibility filters based on category
        filters = []
        if category_id:
            if category_id == 1:  # CPU
                filters = ComponentFiltersBuilder.form_cpu_compability_filters(selected_products)
            elif category_id == 2:  # CPU Cooler
                filters = ComponentFiltersBuilder.form_cpu_cooler_compability_filters(selected_products)
            elif category_id == 3:  # GPU
                filters = ComponentFiltersBuilder.form_gpu_compability_filters(selected_products)
            elif category_id == 4:  # Motherboard
                filters = ComponentFiltersBuilder.form_motherboard_compability_filters(selected_products)
            elif category_id == 5:  # RAM
                filters = ComponentFiltersBuilder.form_ram_compability_filters(selected_products)
            elif category_id == 6:  # Storage
                filters = ComponentFiltersBuilder.form_storage_compability_filters(selected_products)
            elif category_id == 7:  # Power Supply
                filters = ComponentFiltersBuilder.form_power_supply_compability_filters(selected_products, budget or 0)
            elif category_id == 8:  # Case
                filters = ComponentFiltersBuilder.form_case_compability_filters(selected_products)
        
        # Build query
        stmt = (
            select(Product)
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        
        # Apply category filter
        if category_id:
            CatAttrTable = cat_id_to_attrs_model_map[category_id]
            stmt = stmt.join(CatAttrTable)
            
            # Apply compatibility filters
            if filters:
                stmt = stmt.where(*filters)
        else:
            stmt = stmt.options(*self._get_joinedload_attrs_option())

        if query:
            stmt = stmt.where(Product.title.ilike(f"%{query}%"))
        
        # Count query
        count_stmt = select(func.count()).select_from(Product)
        if category_id:
            CatAttrTable = cat_id_to_attrs_model_map[category_id]
            count_stmt = count_stmt.join(CatAttrTable)
            if filters:
                count_stmt = count_stmt.where(*filters)
        
        total = db.scalar(count_stmt)
        return db.scalars(stmt).all(), total

    def remove(self, db: Session, *, id_: int):
        obj = db.get(Product, id_)
        if obj:
            db.delete(obj)
            db.commit()

    def get_random_per_category(self, db: Session) -> list[Product]:
            subq = (
                select(
                    Product.id.label("id"),
                    func.row_number()
                    .over(
                        partition_by=Product.category_id,
                        order_by=func.random(),
                    )
                    .label("rn"),
                )
                .where(Product.category_id.isnot(None))
                .subquery()
            )

            result = (
                db.query(Product)
                .options(joinedload(Product.category))
                .join(subq, Product.id == subq.c.id)
                .filter(subq.c.rn == 1)
                .all()
            )
            return result

product_crud = CRUDProduct()
