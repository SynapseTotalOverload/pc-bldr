from datetime import datetime, date
from typing import Optional, List, TYPE_CHECKING
from pydantic import BaseModel, Field, field_validator
from .gear_list import GearListRead, GearListWithProducts, GearListWithSimpleProducts, GearListUpdate
from .pc_specs_list import PCSpecsListRead, PCSpecsListWithProducts, PCSpecsListWithSimpleProducts, PCSpecsListUpdate
from .setup_streaming_list import SetupStreamingListRead, SetupStreamingListWithProducts, SetupStreamingListWithSimpleProducts, SetupStreamingListUpdate
from .skin import SkinRead
from .product_usage_log import ProductUsageLogWithProduct, ProductUsageLogSimple

    


class PlayerBase(BaseModel):
    player_name: str = Field(..., min_length=1, max_length=255)
    player_img: Optional[str] = None
    team: Optional[str] = Field(None, max_length=255)
    country: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)  # Full name
    birthday: Optional[date] = None
    info: Optional[str] = None
    note: Optional[str] = None
    user_urls: Optional[dict[str, str]] = None
    
    @field_validator('birthday', mode='before')
    @classmethod
    def validate_birthday(cls, v):
        if v == "" or v is None:
            return None
        return v
    
    class Config:
        from_attributes = True


class PlayerCreate(PlayerBase):
    gear_list_id: Optional[int] = None
    pc_specs_list_id: Optional[int] = None
    setup_streaming_list_id: Optional[int] = None
    
    @field_validator('gear_list_id', 'pc_specs_list_id', 'setup_streaming_list_id')
    @classmethod
    def validate_foreign_keys(cls, v):
        if v == 0:
            return None
        return v
    
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
    note: Optional[str] = None
    user_urls: Optional[dict[str, str]] = None
    gear_list_id: Optional[int] = None
    pc_specs_list_id: Optional[int] = None
    setup_streaming_list_id: Optional[int] = None
    
    @field_validator('player_name')
    @classmethod
    def validate_player_name(cls, v):
        if v is not None and len(v.strip()) < 1:
            raise ValueError('player_name must be at least 1 character long')
        return v
    
    @field_validator('birthday', mode='before')
    @classmethod
    def validate_birthday(cls, v):
        if v == "" or v is None:
            return None
        return v
    
    @field_validator('gear_list_id', 'pc_specs_list_id', 'setup_streaming_list_id')
    @classmethod
    def validate_foreign_keys(cls, v):
        if v == 0:
            return None
        return v
    
    class Config:
        from_attributes = True


class SkinUpdate(BaseModel):
    skin_id: int
    is_stat_track: Optional[bool] = None
    wear_level: Optional[str] = None
    pattern: Optional[int] = None
    souvenir: Optional[bool] = None

    @field_validator('wear_level')
    @classmethod
    def validate_wear_level(cls, v):
        if v is not None and v not in ["None", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]:
            raise ValueError('wear_level must be one of: None, Factory New, Minimal Wear, Field-Tested, Well-Worn, Battle-Scarred')
        return v

    @field_validator('pattern')
    @classmethod
    def validate_pattern(cls, v):
        if v is not None and (v < 0 or v > 999):
            raise ValueError('pattern must be between 0 and 999')
        return v

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
    note: Optional[str] = None
    user_urls: Optional[dict[str, str]] = None
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
    skins: Optional[List[SkinUpdate]] = None
    
    @field_validator('player_name')
    @classmethod
    def validate_player_name(cls, v):
        if v is not None and len(v.strip()) < 1:
            raise ValueError('player_name must be at least 1 character long')
        return v
    
    @field_validator('birthday', mode='before')
    @classmethod
    def validate_birthday(cls, v):
        if v == "" or v is None:
            return None
        return v
    
    @field_validator('gear_list_id', 'pc_specs_list_id', 'setup_streaming_list_id')
    @classmethod
    def validate_foreign_keys(cls, v):
        if v == 0:
            return None
        return v
    
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


class PlayerSkinRead(BaseModel):
    """Schema for player skin with additional attributes from player_skins table"""
    skin: SkinRead
    is_stat_track: Optional[bool] = False
    wear_level: Optional[str] = "None"
    pattern: Optional[int] = None
    souvenir: Optional[bool] = False
    created_at: datetime
    
    @field_validator('wear_level')
    @classmethod
    def validate_wear_level(cls, v):
        if v is not None and v not in ["None", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]:
            raise ValueError('wear_level must be one of: None, Factory New, Minimal Wear, Field-Tested, Well-Worn, Battle-Scarred')
        return v
    
    @field_validator('pattern')
    @classmethod
    def validate_pattern(cls, v):
        if v is not None and (v < 0 or v > 999):
            raise ValueError('pattern must be between 0 and 999')
        return v
    
    @classmethod
    def from_player_skin(cls, player_skin):
        if player_skin is None:
            return None
        
        return cls(
            skin=SkinRead.model_validate(player_skin.skin),
            is_stat_track=player_skin.is_stat_track if player_skin.is_stat_track is not None else False,
            wear_level=player_skin.wear_level if player_skin.wear_level is not None else "None",
            pattern=player_skin.pattern,
            souvenir=player_skin.souvenir if player_skin.souvenir is not None else False,
            created_at=player_skin.created_at
        )
    
    class Config:
        from_attributes = True


class PlayerSkinCreate(BaseModel):
    """Schema for creating a new player skin relationship"""
    skin_id: int
    is_stat_track: bool = False
    wear_level: str = "None"
    pattern: Optional[int] = None
    souvenir: bool = False
    
    @field_validator('wear_level')
    @classmethod
    def validate_wear_level(cls, v):
        if v not in ["None", "Factory New", "Minimal Wear", "Field-Tested", "Well-Worn", "Battle-Scarred"]:
            raise ValueError('wear_level must be one of: None, Factory New, Minimal Wear, Field-Tested, Well-Worn, Battle-Scarred')
        return v
    
    @field_validator('pattern')
    @classmethod
    def validate_pattern(cls, v):
        if v is not None and (v < 0 or v > 999):
            raise ValueError('pattern must be between 0 and 999')
        return v
    
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
    note: Optional[str] = None
    user_urls: Optional[dict[str, str]] = None
    created_at: datetime
    updated_at: datetime
    gear_list: Optional[GearListWithSimpleProducts] = None
    pc_specs_list: Optional[PCSpecsListWithSimpleProducts] = None
    setup_streaming_list: Optional[SetupStreamingListWithSimpleProducts] = None
    skins: List[PlayerSkinRead] = []
    product_usage_logs: List[ProductUsageLogSimple] = []
    
    @classmethod
    def from_player(cls, player, product_usage_logs=None):
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
            'note': player.note,
            'user_urls': player.user_urls,
            'created_at': player.created_at,
            'updated_at': player.updated_at,
            'gear_list': GearListWithSimpleProducts.from_gearlist(player.gear_list),
            'pc_specs_list': PCSpecsListWithSimpleProducts.from_pcspecslist(player.pc_specs_list),
            'setup_streaming_list': SetupStreamingListWithSimpleProducts.from_setupstreaminglist(player.setup_streaming_list),
            'skins': [PlayerSkinRead.from_player_skin(player_skin) for player_skin in player.player_skins] if player.player_skins else [],
            'product_usage_logs': [ProductUsageLogSimple.from_usage_log(log) for log in product_usage_logs] if product_usage_logs else [],
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