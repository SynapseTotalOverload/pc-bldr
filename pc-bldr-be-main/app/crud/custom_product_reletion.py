from sqlalchemy.orm import joinedload, Session
from app.models.custom_product_reletion import CustomProductReletion
from app.schemas.custom_product_reletion import CustomProductReletionCreate
from typing import List





class CustomProductReletionCrud:
    def create(self, db: Session, *, obj_in: CustomProductReletionCreate) -> CustomProductReletion:
        db_obj = CustomProductReletion(**obj_in.model_dump(exclude_unset=True))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


    def get_all_by_user_id(self, db: Session, *, user_id: int) -> List[CustomProductReletion]:
        return db.query(CustomProductReletion).filter(CustomProductReletion.user_id == user_id).all()
    

    def get_by_id(self, db: Session, *, id_: int) -> CustomProductReletion:
        return db.query(CustomProductReletion).filter(CustomProductReletion.id == id_).first()
    
    def delete(self, db: Session, *, id_: int) -> CustomProductReletion:
        db_obj = db.query(CustomProductReletion).filter(CustomProductReletion.id == id_).first()
        if db_obj is None:
            return None
        db.delete(db_obj)
        db.commit()
        return db_obj
    
