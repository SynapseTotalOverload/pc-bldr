from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.team import team_crud
from app.schemas.team import TeamCreate, TeamUpdate, TeamRead, TeamWithPlayers
from app.schemas.player import PlayerWithRelations
from app.crud.player import player_crud
from app.schemas.list_products_with_pagination import PaginationSchema
from pydantic import BaseModel, ConfigDict
from collections import defaultdict
from app.models.games import Game
from app.schemas.game import GameRead
from app.schemas.player import PlayerStickersBatch

router = APIRouter(prefix="/teams", tags=["teams"])


# Composite response schema
class TeamListWithPagination(BaseModel):
    items: List[TeamRead]
    pagination: PaginationSchema

    model_config = ConfigDict(from_attributes=True)


# --- Schema for grouping players by game ---


class TeamPlayersByGame(BaseModel):
    game: GameRead
    players: List[PlayerWithRelations]

    model_config = ConfigDict(from_attributes=True)


@router.post("/", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
def create_team(*, db: Session = Depends(get_db), team_in: TeamCreate) -> TeamRead:
    team = team_crud.create(db=db, obj_in=team_in)
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data


# Return typed response
@router.get("/", response_model=TeamListWithPagination)
def read_teams(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    query: str | None = Query(None, description="Search by team name"),
):
    items_models, total = team_crud.get_multi(db=db, skip=skip, limit=limit, query=query)

    # Convert SQLAlchemy models -> Pydantic and populate sticker_ids
    items = []
    for team in items_models:
        team_data = TeamRead.model_validate(team)
        # Populate sticker_ids from stickers
        if team.stickers:
            team_data.sticker_ids = [sticker.id for sticker in team.stickers]
        items.append(team_data)
    current_page = (skip // limit) + 1
    total_pages = (total + limit - 1) // limit if total else 1
    pagination = PaginationSchema(
        currentPage=current_page,
        totalPages=total_pages,
        totalItems=total,
        itemsPerPage=limit,
    )
    return TeamListWithPagination(items=items, pagination=pagination)


@router.get("/{team_id}", response_model=TeamWithPlayers)
def get_team(*, db: Session = Depends(get_db), team_id: int) -> TeamWithPlayers:
    team = team_crud.get(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    players = team_crud.get_players(db=db, team_id=team_id)
    players_with_rel = [PlayerWithRelations.from_player(p) for p in players]
    
    # Create team data with players and populate sticker_ids
    team_data = {**team.__dict__, "players": players_with_rel}
    if team.stickers:
        team_data["sticker_ids"] = [sticker.id for sticker in team.stickers]
    
    return TeamWithPlayers.model_validate(team_data)


@router.put("/{team_id}", response_model=TeamRead)
def update_team(*, db: Session = Depends(get_db), team_id: int, team_in: TeamUpdate) -> TeamRead:
    team = team_crud.get(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    team = team_crud.update(db=db, db_obj=team, obj_in=team_in)
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data


@router.delete("/{team_id}", response_model=TeamRead)
def delete_team(*, db: Session = Depends(get_db), team_id: int) -> TeamRead:
    team = team_crud.remove(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data


@router.post("/{team_id}/players/{player_id}", response_model=PlayerWithRelations)
def add_player_to_team(*, db: Session = Depends(get_db), team_id: int, player_id: int) -> PlayerWithRelations:
    team = team_crud.get(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    player = team_crud.add_player(db=db, team_id=team_id, player_id=player_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found")
    return PlayerWithRelations.from_player(player)


@router.delete("/{team_id}/players/{player_id}", response_model=PlayerWithRelations)
def remove_player_from_team(*, db: Session = Depends(get_db), team_id: int, player_id: int) -> PlayerWithRelations:
    team = team_crud.get(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    player = team_crud.remove_player(db=db, team_id=team_id, player_id=player_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not found or not in the team")
    return PlayerWithRelations.from_player(player)


@router.get("/{team_id}/players", response_model=List[PlayerWithRelations])
def get_team_players(*, db: Session = Depends(get_db), team_id: int) -> List[PlayerWithRelations]:
    team = team_crud.get(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    players = team_crud.get_players(db=db, team_id=team_id)
    return [PlayerWithRelations.from_player(p) for p in players]


# --- Players grouped by game ---


@router.get("/{team_id}/players/by-game", response_model=List[TeamPlayersByGame])
def get_team_players_by_game(*, db: Session = Depends(get_db), team_id: int) -> List[TeamPlayersByGame]:
    """Return players of the team grouped by their game"""
    team = team_crud.get(db=db, id_=team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")

    players = team_crud.get_players(db=db, team_id=team_id)

    grouped: dict[int, List] = defaultdict(list)
    for p in players:
        if p.game_id is not None:
            grouped[p.game_id].append(p)

    # fetch all games in one query
    if not grouped:
        return []

    games = db.query(Game).filter(Game.id.in_(grouped.keys())).all()
    game_map = {g.id: g for g in games}

    result: List[TeamPlayersByGame] = []
    for gid, players_list in grouped.items():
        game_obj = game_map.get(gid)
        if not game_obj:
            continue  # skip if game missing
        result.append(TeamPlayersByGame(
            game=GameRead.model_validate(game_obj),
            players=[PlayerWithRelations.from_player(p) for p in players_list]
        ))

    # sort by game name for consistent output
    result.sort(key=lambda x: x.game.name.lower())
    return result


@router.post("/{team_id}/stickers/batch", response_model=TeamRead)
def add_stickers_to_team_batch(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    stickers_data: PlayerStickersBatch,
) -> TeamRead:
    """Add multiple stickers to team."""
    try:
        team = team_crud.add_stickers_batch(db=db, team_id=team_id, sticker_ids=stickers_data.sticker_ids)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data


@router.delete("/{team_id}/stickers/batch", response_model=TeamRead)
def remove_stickers_from_team_batch(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    stickers_data: PlayerStickersBatch,
) -> TeamRead:
    """Remove multiple stickers from team."""
    try:
        team = team_crud.remove_stickers_batch(db=db, team_id=team_id, sticker_ids=stickers_data.sticker_ids)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data


@router.post("/{team_id}/stickers/{sticker_id}", response_model=TeamRead)
def add_sticker_to_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    sticker_id: int,
) -> TeamRead:
    try:
        team = team_crud.add_sticker(db=db, team_id=team_id, sticker_id=sticker_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data


@router.delete("/{team_id}/stickers/{sticker_id}", response_model=TeamRead)
def remove_sticker_from_team(
    *,
    db: Session = Depends(get_db),
    team_id: int,
    sticker_id: int,
) -> TeamRead:
    try:
        team = team_crud.remove_sticker(db=db, team_id=team_id, sticker_id=sticker_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # Populate sticker_ids from stickers
    team_data = TeamRead.model_validate(team)
    if team.stickers:
        team_data.sticker_ids = [sticker.id for sticker in team.stickers]
    
    return team_data
