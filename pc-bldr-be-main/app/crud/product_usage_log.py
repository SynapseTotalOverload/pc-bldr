from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from fastapi import HTTPException
from app.models.product_usage_log import ProductUsageLog
from app.models.product import Product
from app.schemas.product_usage_log import ProductUsageLogCreate, ProductUsageLogUpdate, ProductUsageLogWithProduct, ProductUsageLogSimple

class CRUDProductUsageLog:
    def create_log(self, db: Session, *, obj_in: ProductUsageLogCreate) -> ProductUsageLog:
        db_obj = ProductUsageLog(**obj_in.model_dump(exclude_unset=True, exclude_none=True))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def create_log_by_list(self, db: Session, *, obj_in: List[ProductUsageLogCreate]) -> List[ProductUsageLog]:
        db_objs = [ProductUsageLog(**log.model_dump(exclude_unset=True, exclude_none=True)) for log in obj_in]
        db.add_all(db_objs)
        db.commit()
        return db_objs
    
    def update_log(self, db: Session, *, obj_in: ProductUsageLogUpdate) -> ProductUsageLog:
        db_obj = db.query(ProductUsageLog).filter(ProductUsageLog.user_id == obj_in.user_id, ProductUsageLog.product_id == obj_in.product_id).first()
        if not db_obj:
            raise HTTPException(status_code=404, detail="Product usage log not found")
        db_obj.usage_end_datetime = obj_in.usage_end_datetime
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update_data_start_usage_log(self, db: Session, *, obj_in: ProductUsageLogUpdate) -> ProductUsageLog:
        db_obj = db.query(ProductUsageLog).filter(ProductUsageLog.user_id == obj_in.user_id, ProductUsageLog.product_id == obj_in.product_id).order_by(ProductUsageLog.id.desc()).first()
        if not db_obj:
            raise HTTPException(status_code=404, detail="Product usage log not found")
        db_obj.usage_start_datetime = obj_in.usage_start_datetime
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update_data_end_usage_log(self, db: Session, *, obj_in: ProductUsageLogUpdate) -> ProductUsageLog:
        db_obj = db.query(ProductUsageLog).filter(ProductUsageLog.user_id == obj_in.user_id, ProductUsageLog.product_id == obj_in.product_id).order_by(ProductUsageLog.id.desc()).first()
        if not db_obj:
            raise HTTPException(status_code=404, detail="Product usage log not found")
        db_obj.usage_end_datetime = obj_in.usage_end_datetime
        db.commit()
        db.refresh(db_obj)
        return db_obj
    

    def change_log_start_datetime(self, db: Session, *, obj_in: ProductUsageLogUpdate) -> ProductUsageLog:
        log_in_db = db.query(ProductUsageLog).filter(ProductUsageLog.user_id == obj_in.user_id, ProductUsageLog.product_id == obj_in.product_id).order_by(ProductUsageLog.id.desc()).first()
        if not log_in_db:
            return None
        log_in_db.usage_start_datetime = obj_in.usage_start_datetime
        db.commit()
        db.refresh(log_in_db)
        return log_in_db

    def get_user_usage_logs_simple(self, db: Session, *, user_id: int) -> List[ProductUsageLog]:
        """
        Get all usage logs for a user without product information.
        Returns only the latest log for each product_id/user_id combination.
        """
        # Subquery to get the latest log ID for each product_id/user_id combination
        latest_logs_subquery = (
            db.query(
                ProductUsageLog.product_id,
                func.max(ProductUsageLog.id).label('latest_id')
            )
            .filter(ProductUsageLog.user_id == user_id)
            .group_by(ProductUsageLog.product_id)
            .subquery()
        )
        
        # Main query to get the actual log records without product information
        logs = (
            db.query(ProductUsageLog)
            .join(latest_logs_subquery, ProductUsageLog.id == latest_logs_subquery.c.latest_id)
            .filter(ProductUsageLog.user_id == user_id)
            .all()
        )
        
        return logs

    def get_user_usage_logs_with_products(self, db: Session, *, user_id: int) -> List[ProductUsageLogWithProduct]:
        """
        Get all usage logs for a user with product information.
        Returns only the latest log for each product_id/user_id combination.
        """
        # Subquery to get the latest log ID for each product_id/user_id combination
        latest_logs_subquery = (
            db.query(
                ProductUsageLog.product_id,
                func.max(ProductUsageLog.id).label('latest_id')
            )
            .filter(ProductUsageLog.user_id == user_id)
            .group_by(ProductUsageLog.product_id)
            .subquery()
        )
        
        # Main query to get the actual log records with product information
        logs_with_products = (
            db.query(ProductUsageLog, Product)
            .join(latest_logs_subquery, ProductUsageLog.id == latest_logs_subquery.c.latest_id)
            .outerjoin(Product, ProductUsageLog.product_id == Product.id)
            .filter(ProductUsageLog.user_id == user_id)
            .all()
        )
        
        return [
            ProductUsageLogWithProduct.from_usage_log_with_product(log, product)
            for log, product in logs_with_products
        ]

    
product_usage_log_crud = CRUDProductUsageLog()