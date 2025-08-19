from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models.games import Game
from app.schemas.game import GameCreate, GameUpdate


class CRUDGame:
    """CRUD operations for Game model"""

    def get(self, db: Session, id_: int) -> Optional[Game]:
        return db.get(Game, id_)

    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        query: str | None = None,
    ) -> Tuple[List[Game], int]:
        """Return list of games with pagination and optional search by name"""
        count_stmt = select(func.count()).select_from(Game)
        stmt = select(Game).offset(skip).limit(limit)

        if query:
            ilike = f"%{query}%"
            stmt = stmt.where(Game.name.ilike(ilike))
            count_stmt = count_stmt.where(Game.name.ilike(ilike))

        stmt = stmt.order_by(Game.name)
        total = db.scalar(count_stmt)
        items = db.scalars(stmt).all()
        return items, total

    def create(self, db: Session, *, obj_in: GameCreate) -> Game:
        db_obj = Game(**obj_in.model_dump(exclude_unset=True))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Game, obj_in: GameUpdate) -> Game:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id_: int) -> Optional[Game]:
        db_obj = db.get(Game, id_)
        if not db_obj:
            return None
        db.delete(db_obj)
        db.commit()
        return db_obj


# Singleton instance similar to other crud modules

game_crud = CRUDGame()
