from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.models.team import Team
from app.models.player import Player
from app.schemas.team import TeamCreate, TeamUpdate


class CRUDTeam:
    """CRUD operations for Team model"""

    def get(self, db: Session, id_: int) -> Optional[Team]:
        return db.get(Team, id_)

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100, query: str | None = None) -> Tuple[List[Team], int]:
        count_stmt = select(func.count()).select_from(Team)
        stmt = select(Team).offset(skip).limit(limit)

        if query:
            ilike = f"%{query}%"
            stmt = stmt.where(Team.name.ilike(ilike))
            count_stmt = count_stmt.where(Team.name.ilike(ilike))

        stmt = stmt.order_by(Team.name)
        total = db.scalar(count_stmt)
        items = db.scalars(stmt).all()
        return items, total

    def create(self, db: Session, *, obj_in: TeamCreate) -> Team:
        db_obj = Team(**obj_in.model_dump(exclude_unset=True))
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Team, obj_in: TeamUpdate) -> Team:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, *, id_: int) -> Optional[Team]:
        db_obj = db.get(Team, id_)
        if not db_obj:
            return None
        db.delete(db_obj)
        db.commit()
        return db_obj

    # Player association helpers
    def add_player(self, db: Session, *, team_id: int, player_id: int) -> Optional[Player]:
        player = db.get(Player, player_id)
        if not player:
            return None
        player.team_id = team_id
        db.commit()
        db.refresh(player)
        return player

    def remove_player(self, db: Session, *, team_id: int, player_id: int) -> Optional[Player]:
        player = db.get(Player, player_id)
        if not player or player.team_id != team_id:
            return None
        player.team_id = None
        db.commit()
        db.refresh(player)
        return player

    def get_players(self, db: Session, *, team_id: int) -> List[Player]:
        stmt = select(Player).where(Player.team_id == team_id)
        return db.scalars(stmt).all()


team_crud = CRUDTeam()
