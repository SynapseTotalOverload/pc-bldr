from typing import List

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.countries import Country

class CRUDCountry:
    """Basic CRUD for Country table"""

    def get_all(self, db: Session) -> List[Country]:
        stmt = select(Country).order_by(Country.name)
        return db.scalars(stmt).all()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100, query: str | None = None) -> tuple[List[Country], int]:
        """Return countries with pagination and optional search by name/ISO"""
        count_stmt = select(func.count()).select_from(Country)
        stmt = select(Country).offset(skip).limit(limit)

        if query:
            ilike = f"%{query}%"
            stmt = stmt.where((Country.name.ilike(ilike)) | (Country.iso_code.ilike(ilike)))
            count_stmt = count_stmt.where((Country.name.ilike(ilike)) | (Country.iso_code.ilike(ilike)))

        stmt = stmt.order_by(Country.name)
        total = db.scalar(count_stmt)
        items = db.scalars(stmt).all()
        return items, total

country_crud = CRUDCountry()
