from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.player import player_crud
from app.crud.gear_list import gear_list_crud
from app.crud.pc_specs_list import pc_specs_list_crud
from app.crud.setup_streaming_list import setup_streaming_list_crud
from app.db.session import get_db
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerRead, PlayerWithRelations, PlayerSkinsBatch, PlayerSkinsResponse
from app.schemas.gear_list import GearListCreate
from app.schemas.pc_specs_list import PCSpecsListCreate
from app.schemas.setup_streaming_list import SetupStreamingListCreate

router = APIRouter(prefix="/players", tags=["players"])


@router.post("/", response_model=PlayerWithRelations, status_code=status.HTTP_201_CREATED)
def create_player(
    *,
    db: Session = Depends(get_db),
    player_in: PlayerCreate,
) -> PlayerWithRelations:
    """
    Create new player.
    """
    player = player_crud.create(db=db, obj_in=player_in)
    return PlayerWithRelations.from_player(player)


@router.post("/with-lists", response_model=PlayerWithRelations, status_code=status.HTTP_201_CREATED)
def create_player_with_lists(
    *,
    db: Session = Depends(get_db),
    player_in: PlayerCreate,
) -> PlayerWithRelations:
    """
    Create new player with empty gear list, PC specs list, and setup streaming list.
    """
    # Create empty gear list
    gear_list = gear_list_crud.create(db=db, obj_in=GearListCreate())
    
    # Create empty PC specs list
    pc_specs_list = pc_specs_list_crud.create(db=db, obj_in=PCSpecsListCreate())
    
    # Create empty setup streaming list
    setup_streaming_list = setup_streaming_list_crud.create(db=db, obj_in=SetupStreamingListCreate())
    
    # Update player data with the created list IDs
    player_data = player_in.model_dump()
    player_data.update({
        "gear_list_id": gear_list.id,
        "pc_specs_list_id": pc_specs_list.id,
        "setup_streaming_list_id": setup_streaming_list.id
    })
    
    # Create player with the list IDs
    player = player_crud.create(db=db, obj_in=PlayerCreate(**player_data))
    return PlayerWithRelations.from_player(player)


@router.get("/{player_id}", response_model=PlayerWithRelations)
def get_player(
    *,
    db: Session = Depends(get_db),
    player_id: int,
) -> PlayerWithRelations:
    """
    Get player by ID with all relations.
    """
    player = player_crud.get(db=db, id_=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    return PlayerWithRelations.from_player(player)


@router.get("/", response_model=dict)
def get_players(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    team: Optional[str] = Query(None, description="Filter by team"),
    country: Optional[str] = Query(None, description="Filter by country"),
    query: Optional[str] = Query(None, description="Search query for player_name, name, team, or country"),
) -> dict:
    """
    Get multiple players with pagination and filtering.
    """
    players, total = player_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
        team=team,
        country=country,
        query=query,
    )

    
    
    return {
        "items": [PlayerWithRelations.from_player(player) for player in players],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.get("/team/{team}", response_model=List[PlayerWithRelations])
def get_players_by_team(
    *,
    db: Session = Depends(get_db),
    team: str,
) -> List[PlayerWithRelations]:
    """
    Get players by team.
    """
    players = player_crud.get_by_team(db=db, team=team)
    return [PlayerWithRelations.from_player(player) for player in players]


@router.get("/country/{country}", response_model=List[PlayerWithRelations])
def get_players_by_country(
    *,
    db: Session = Depends(get_db),
    country: str,
) -> List[PlayerWithRelations]:
    """
    Get players by country.
    """
    players = player_crud.get_by_country(db=db, country=country)
    return [PlayerWithRelations.from_player(player) for player in players]


@router.put("/{player_id}", response_model=PlayerWithRelations)
def update_player(
    *,
    db: Session = Depends(get_db),
    player_id: int,
    player_in: PlayerUpdate,
) -> PlayerWithRelations:
    """
    Update player.
    """
    player = player_crud.get(db=db, id_=player_id)
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    player = player_crud.update(db=db, db_obj=player, obj_in=player_in)
    return PlayerWithRelations.from_player(player)


@router.delete("/{player_id}", response_model=PlayerRead)
def delete_player(
    *,
    db: Session = Depends(get_db),
    player_id: int,
) -> PlayerRead:
    """
    Delete player.
    """
    player = player_crud.remove(db=db, id_=player_id)
    return PlayerRead.model_validate(player)


@router.post("/{player_id}/skins/batch", response_model=PlayerSkinsResponse)
def add_skins_to_player_batch(
    *,
    db: Session = Depends(get_db),
    player_id: int,
    skins_data: PlayerSkinsBatch,
) -> PlayerSkinsResponse:
    """
    Add multiple skins to player with duplicate check.
    """
    # Get player before adding skins to count current skins
    player_before = player_crud.get(db=db, id_=player_id)
    if not player_before:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    initial_skin_count = len(player_before.skins)
    
    player = player_crud.add_skins_batch(db=db, player_id=player_id, skin_ids=skins_data.skin_ids)
    
    # Count added skins
    final_skin_count = len(player.skins)
    added_count = final_skin_count - initial_skin_count
    skipped_count = len(skins_data.skin_ids) - added_count
    
    return PlayerSkinsResponse(
        message=f"Successfully processed {len(skins_data.skin_ids)} skins",
        added_count=added_count,
        skipped_count=skipped_count,
        player=PlayerWithRelations.from_player(player)
    )


@router.delete("/{player_id}/skins/batch", response_model=PlayerSkinsResponse)
def remove_skins_from_player_batch(
    *,
    db: Session = Depends(get_db),
    player_id: int,
    skins_data: PlayerSkinsBatch,
) -> PlayerSkinsResponse:
    """
    Remove multiple skins from player.
    """
    # Get player before removing skins to count current skins
    player_before = player_crud.get(db=db, id_=player_id)
    if not player_before:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found"
        )
    
    initial_skin_count = len(player_before.skins)
    
    player = player_crud.remove_skins_batch(db=db, player_id=player_id, skin_ids=skins_data.skin_ids)
    
    # Count removed skins
    final_skin_count = len(player.skins)
    removed_count = initial_skin_count - final_skin_count
    skipped_count = len(skins_data.skin_ids) - removed_count
    
    return PlayerSkinsResponse(
        message=f"Successfully processed {len(skins_data.skin_ids)} skins",
        removed_count=removed_count,
        skipped_count=skipped_count,
        player=PlayerWithRelations.from_player(player)
    )


@router.put("/{player_id}/skins", response_model=PlayerWithRelations)
def set_player_skins(
    *,
    db: Session = Depends(get_db),
    player_id: int,
    skins_data: PlayerSkinsBatch,
) -> PlayerWithRelations:
    """
    Set player skins (replace all existing skins with new ones).
    """
    player = player_crud.set_player_skins(db=db, player_id=player_id, skin_ids=skins_data.skin_ids)
    return PlayerWithRelations.from_player(player)


@router.post("/{player_id}/skins/{skin_id}", response_model=PlayerWithRelations)
def add_skin_to_player(
    *,
    db: Session = Depends(get_db),
    player_id: int,
    skin_id: int,
) -> PlayerWithRelations:
    """
    Add skin to player.
    """
    player = player_crud.add_skin(db=db, player_id=player_id, skin_id=skin_id)
    return PlayerWithRelations.from_player(player)


@router.delete("/{player_id}/skins/{skin_id}", response_model=PlayerWithRelations)
def remove_skin_from_player(
    *,
    db: Session = Depends(get_db),
    player_id: int,
    skin_id: int,
) -> PlayerWithRelations:
    """
    Remove skin from player.
    """
    player = player_crud.remove_skin(db=db, player_id=player_id, skin_id=skin_id)
    return PlayerWithRelations.from_player(player) 