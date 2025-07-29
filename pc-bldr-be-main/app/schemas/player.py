from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from pydantic import BaseModel, Field, field_validator
from .gear_list import GearListRead, GearListWithProducts, GearListWithSimpleProducts, GearListUpdate
from .pc_specs_list import PCSpecsListRead, PCSpecsListWithProducts, PCSpecsListWithSimpleProducts, PCSpecsListUpdate
from .setup_streaming_list import SetupStreamingListRead, SetupStreamingListWithProducts, SetupStreamingListWithSimpleProducts, SetupStreamingListUpdate
from .skin import SkinRead

    


class PlayerBase(BaseModel):
    player_name: str = Field(..., min_length=1, max_length=255)
    player_img: Optional[str] = None
    team: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)  # Full name
    birthday: Optional[date] = None
    info: Optional[str] = None
    
    class Config:
        from_attributes = True


class PlayerCreate(PlayerBase):
    gear_list_id: Optional[int] = None
    pc_specs_list_id: Optional[int] = None
    setup_streaming_list_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class PlayerUpdate(BaseModel):
    player_name: Optional[str] = Field(None, min_length=1, max_length=255)
    player_img: Optional[str] = None
    team: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    birthday: Optional[date] = None
    info: Optional[str] = None
    gear_list_id: Optional[int] = None
    pc_specs_list_id: Optional[int] = None
    setup_streaming_list_id: Optional[int] = None
    
    class Config:
        from_attributes = True


class PlayerUpdateWithGear(BaseModel):
    # Player fields
    player_name: Optional[str] = Field(None, min_length=1, max_length=255)
    player_img: Optional[str] = None
    team: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    birthday: Optional[date] = None
    info: Optional[str] = None
    gear_list_id: Optional[int] = None
    pc_specs_list_id: Optional[int] = None
    setup_streaming_list_id: Optional[int] = None
    
    # Gear list update fields
    gear_list: Optional[GearListUpdate] = None
    
    # PC specs list update fields
    pc_specs_list: Optional[PCSpecsListUpdate] = None
    
    # Setup streaming list update fields
    setup_streaming_list: Optional[SetupStreamingListUpdate] = None
    
    # Skins update fields
    skin_ids: Optional[List[int]] = None
    
    class Config:
        from_attributes = True


class PlayerRead(PlayerBase):
    id: int
    gear_list_id: Optional[int] = None
    pc_specs_list_id: Optional[int] = None
    setup_streaming_list_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PlayerWithRelations(BaseModel):
    id: int
    player_name: str
    player_img: Optional[str] = None
    team: Optional[str] = None
    country: Optional[str] = None
    name: Optional[str] = None
    birthday: Optional[date] = None
    info: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    gear_list: Optional[GearListWithSimpleProducts] = None
    pc_specs_list: Optional[PCSpecsListWithSimpleProducts] = None
    setup_streaming_list: Optional[SetupStreamingListWithSimpleProducts] = None
    skins: List[SkinRead] = []
    
    @classmethod
    def from_player(cls, player):
        if player is None:
            return None
        
        data = {
            'id': player.id,
            'player_name': player.player_name,
            'player_img': player.player_img,
            'team': player.team,
            'country': player.country,
            'name': player.name,
            'birthday': player.birthday,
            'info': player.info,
            'created_at': player.created_at,
            'updated_at': player.updated_at,
            'gear_list': GearListWithSimpleProducts.from_gearlist(player.gear_list),
            'pc_specs_list': PCSpecsListWithSimpleProducts.from_pcspecslist(player.pc_specs_list),
            'setup_streaming_list': SetupStreamingListWithSimpleProducts.from_setupstreaminglist(player.setup_streaming_list),
            'skins': [SkinRead.model_validate(skin) for skin in player.skins] if player.skins else [],
        }
        return cls(**data)
    
    class Config:
        from_attributes = True


class PlayerSkinsBatch(BaseModel):
    skin_ids: List[int] = Field(..., min_items=1, max_items=100)
    
    @field_validator('skin_ids')
    @classmethod
    def validate_skin_ids(cls, v):
        if not v:
            raise ValueError('skin_ids cannot be empty')
        if len(set(v)) != len(v):
            raise ValueError('skin_ids cannot contain duplicates')
        return v
    
    class Config:
        from_attributes = True


class PlayerSkinsResponse(BaseModel):
    message: str
    added_count: int = 0
    removed_count: int = 0
    skipped_count: int = 0
    player: PlayerWithRelations
    
    class Config:
        from_attributes = True 