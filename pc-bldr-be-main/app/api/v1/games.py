from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.crud.game import game_crud
from app.schemas.game import GameCreate, GameUpdate, GameRead, GameWithPlayers
from app.schemas.player import PlayerWithRelations
from app.crud.player import player_crud
from app.schemas.list_products_with_pagination import PaginationSchema
from pydantic import BaseModel, ConfigDict
from app.models.player import Player

router = APIRouter(prefix="/games", tags=["games"])


class GameListWithPagination(BaseModel):
    items: List[GameRead]
    pagination: PaginationSchema

    model_config = ConfigDict(from_attributes=True)


@router.post("/", response_model=GameRead, status_code=status.HTTP_201_CREATED)
def create_game(*, db: Session = Depends(get_db), game_in: GameCreate) -> GameRead:
    game = game_crud.create(db=db, obj_in=game_in)
    return game


@router.get("/", response_model=GameListWithPagination)
def read_games(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    query: str | None = Query(None, description="Search by game name"),
):
    items_models, total = game_crud.get_multi(db=db, skip=skip, limit=limit, query=query)

    # Convert to Pydantic model
    items = [GameRead.model_validate(game) for game in items_models]
    current_page = (skip // limit) + 1
    total_pages = (total + limit - 1) // limit if total else 1
    pagination = PaginationSchema(
        currentPage=current_page,
        totalPages=total_pages,
        totalItems=total,
        itemsPerPage=limit,
    )
    return GameListWithPagination(items=items, pagination=pagination)


@router.get("/{game_id}", response_model=GameWithPlayers)
def get_game(*, db: Session = Depends(get_db), game_id: int) -> GameWithPlayers:
    game = game_crud.get(db=db, id_=game_id)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    # Fetch players associated with this game
    players_models = db.scalars(select(Player).where(Player.game_id == game_id)).all()
    players = [PlayerWithRelations.from_player(p) for p in players_models]
    return GameWithPlayers.model_validate({**game.__dict__, "players": players})


# --- Update Game ---


@router.put("/{game_id}", response_model=GameRead)
def update_game(*, db: Session = Depends(get_db), game_id: int, game_in: GameUpdate) -> GameRead:
    game = game_crud.get(db=db, id_=game_id)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    game = game_crud.update(db=db, db_obj=game, obj_in=game_in)
    return game


# --- Delete Game ---


@router.delete("/{game_id}", response_model=GameRead)
def delete_game(*, db: Session = Depends(get_db), game_id: int) -> GameRead:
    game = game_crud.remove(db=db, id_=game_id)
    if not game:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Game not found")
    return game
