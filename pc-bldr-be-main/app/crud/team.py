from typing import List, Tuple, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func

from app.models.team import Team
from app.models.player import Player
from app.schemas.team import TeamCreate, TeamUpdate
from app.models.stickers import Stickers


class CRUDTeam:
    """CRUD operations for Team model"""

    def get(self, db: Session, id_: int) -> Optional[Team]:
        stmt = select(Team).options(joinedload(Team.stickers)).where(Team.id == id_)
        team = db.scalar(stmt)
        if team and not hasattr(team, '_stickers_loaded'):
            db.refresh(team, attribute_names=['stickers'])
            team._stickers_loaded = True
        return team

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100, query: str | None = None) -> Tuple[List[Team], int]:
        count_stmt = select(func.count()).select_from(Team)
        stmt = select(Team).options(joinedload(Team.stickers)).offset(skip).limit(limit)

        if query:
            ilike = f"%{query}%"
            stmt = stmt.where(Team.name.ilike(ilike))
            count_stmt = count_stmt.where(Team.name.ilike(ilike))

        stmt = stmt.order_by(Team.name)
        total = db.scalar(count_stmt)
        items = db.scalars(stmt).unique().all()
        
        # Ensure stickers are loaded for each team
        for team in items:
            if not hasattr(team, '_stickers_loaded'):
                db.refresh(team, attribute_names=['stickers'])
                team._stickers_loaded = True
        
        return items, total

    def set_team_stickers(self, db: Session, *, team_id: int, sticker_ids: List[int]):
        """Replace team's stickers with provided list."""
        team = db.get(Team, team_id)
        if not team:
            raise ValueError("Team not found")
        # duplicates
        if len(sticker_ids) != len(set(sticker_ids)):
            raise ValueError("Duplicate sticker IDs in request")
        # fetch
        stickers = db.query(Stickers).filter(Stickers.id.in_(sticker_ids)).all() if sticker_ids else []
        if len(stickers) != len(sticker_ids):
            missing = set(sticker_ids) - {s.id for s in stickers}
            raise ValueError(f"Stickers {missing} not found")
        for st in stickers:
            if st.s_type and st.s_type.lower() != "team":
                raise ValueError(f"Sticker {st.id} is not of type 'team'")
        team.stickers = stickers
        db.commit()
        db.refresh(team)
        # Refresh stickers relationship and mark as loaded
        db.refresh(team, attribute_names=['stickers'])
        team._stickers_loaded = True
        return team

    def create(self, db: Session, *, obj_in: TeamCreate) -> Team:
        create_data = obj_in.model_dump(exclude_unset=True)
        sticker_ids = create_data.pop("sticker_ids", None)
        db_obj = Team(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        if sticker_ids:
            self.set_team_stickers(db=db, team_id=db_obj.id, sticker_ids=sticker_ids)
        # Refresh stickers after creation and mark as loaded
        db.refresh(db_obj, attribute_names=['stickers'])
        db_obj._stickers_loaded = True
        return db_obj

    def update(self, db: Session, *, db_obj: Team, obj_in: TeamUpdate) -> Team:
        update_data = obj_in.model_dump(exclude_unset=True)
        sticker_ids = update_data.pop("sticker_ids", None)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        if sticker_ids is not None:
            self.set_team_stickers(db=db, team_id=db_obj.id, sticker_ids=sticker_ids)
        # Refresh stickers after update and mark as loaded
        db.refresh(db_obj, attribute_names=['stickers'])
        db_obj._stickers_loaded = True
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
        stmt = select(Player).options(joinedload(Player.stickers)).where(Player.team_id == team_id)
        players = db.scalars(stmt).unique().all()
        
        # Ensure stickers are loaded for each player
        for player in players:
            if not hasattr(player, '_stickers_loaded'):
                db.refresh(player, attribute_names=['stickers'])
                player._stickers_loaded = True
        
        return players

    # Sticker association helpers
    def add_sticker(self, db: Session, *, team_id: int, sticker_id: int):
        team = db.get(Team, team_id)
        if not team:
            raise ValueError("Team not found")
        sticker = db.get(Stickers, sticker_id)
        if not sticker:
            raise ValueError("Sticker not found")
        if sticker.s_type and sticker.s_type.lower() != "team":
            raise ValueError("Only stickers with type 'team' can be linked to a team")
        if sticker not in team.stickers:
            team.stickers.append(sticker)
            db.commit()
            db.refresh(team)
            # Refresh stickers relationship and mark as loaded
            db.refresh(team, attribute_names=['stickers'])
            team._stickers_loaded = True
        return team

    def remove_sticker(self, db: Session, *, team_id: int, sticker_id: int):
        team = db.get(Team, team_id)
        if not team:
            raise ValueError("Team not found")
        sticker = db.get(Stickers, sticker_id)
        if not sticker:
            raise ValueError("Sticker not found")
        if sticker in team.stickers:
            team.stickers.remove(sticker)
            db.commit()
            db.refresh(team)
            # Refresh stickers relationship and mark as loaded
            db.refresh(team, attribute_names=['stickers'])
            team._stickers_loaded = True
        return team

    def add_stickers_batch(self, db: Session, *, team_id: int, sticker_ids: list[int]):
        team = db.get(Team, team_id)
        if not team:
            raise ValueError("Team not found")
        stickers = db.query(Stickers).filter(Stickers.id.in_(sticker_ids)).all()
        if len(stickers) != len(sticker_ids):
            missing = set(sticker_ids) - {s.id for s in stickers}
            raise ValueError(f"Stickers {missing} not found")
        for st in stickers:
            if st.s_type and st.s_type.lower() != "team":
                raise ValueError(f"Sticker {st.id} is not of type 'team'")
        current_ids = {s.id for s in team.stickers}
        new_stickers = [s for s in stickers if s.id not in current_ids]
        if new_stickers:
            team.stickers.extend(new_stickers)
            db.commit()
            db.refresh(team)
            # Refresh stickers relationship and mark as loaded
            db.refresh(team, attribute_names=['stickers'])
            team._stickers_loaded = True
        return team

    def remove_stickers_batch(self, db: Session, *, team_id: int, sticker_ids: list[int]):
        team = db.get(Team, team_id)
        if not team:
            raise ValueError("Team not found")
        stickers = db.query(Stickers).filter(Stickers.id.in_(sticker_ids)).all()
        for st in stickers:
            if st in team.stickers:
                team.stickers.remove(st)
        db.commit()
        db.refresh(team)
        # Refresh stickers relationship and mark as loaded
        db.refresh(team, attribute_names=['stickers'])
        team._stickers_loaded = True
        return team


team_crud = CRUDTeam()
