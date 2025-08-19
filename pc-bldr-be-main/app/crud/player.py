from datetime import datetime, timezone, date
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.player import Player
from app.models.gear_list import GearList
from app.models.games import Game
from app.models.pc_specs_list import PCSpecsList
from app.models.setup_streaming_list import SetupStreamingList
from app.models.countries import Country
from app.models.skin import Skin
from app.models.product import Product
from app.models.player_skins import PlayerSkin
from app.models.custom_product_reletion import CustomProductReletion
from app.schemas.product_usage_log import ProductUsageLogCreate, ProductUsageLogUpdate
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerUpdateWithGear, SkinUpdate
from app.schemas.gear_list import GearListCreate
from app.schemas.pc_specs_list import PCSpecsListCreate
from app.schemas.setup_streaming_list import SetupStreamingListCreate
from app.crud.gear_list import gear_list_crud
from app.crud.pc_specs_list import pc_specs_list_crud
from app.crud.setup_streaming_list import setup_streaming_list_crud
from app.crud.product_usage_log import product_usage_log_crud
import logging
from app.models.team import Team
from app.models.stickers import Stickers

logger = logging.getLogger(__name__)


class CRUDPlayer:
    def _handle_product_id_change(self, db: Session, product_obj, user_id: int, date_now: date):
        """Handle product ID change - create new log and update old log end datetime"""
        if (product_obj.id_change and 
            product_obj.usage_start_datetime is not None and 
            product_obj.id is not None):
            
            # Create new usage log for new product
            product_usage_log_crud.create_log(db=db, obj_in=ProductUsageLogCreate(
                product_id=product_obj.id,
                usage_start_datetime=product_obj.usage_start_datetime,
                user_id=user_id,
            ))

            # Update end datetime for old product
            product_usage_log_crud.update_data_end_usage_log(db=db, obj_in=ProductUsageLogUpdate(
                user_id=user_id,
                product_id=product_obj.old_id,
                usage_end_datetime=date_now,
            ))

    def _handle_product_data_change(self, db: Session, product_obj, user_id: int):
        """Handle product data change - update start datetime"""
        if product_obj.data_change:
            product_usage_log_crud.update_data_start_usage_log(db=db, obj_in=ProductUsageLogUpdate(
                user_id=user_id,
                product_id=product_obj.id,
                usage_start_datetime=product_obj.usage_start_datetime,
            ))

    def _process_gear_list_changes(self, db: Session, gear_list_obj, user_id: int, date_now: date):
        """Process all gear list product changes"""
        products = [
            gear_list_obj.monitor,
            gear_list_obj.mouse,
            gear_list_obj.keyboard,
            gear_list_obj.headset,
            gear_list_obj.mousepad,
            gear_list_obj.earphones
        ]
        
        for product in products:
            if product:
                self._handle_product_id_change(db, product, user_id, date_now)
                self._handle_product_data_change(db, product, user_id)

    def _process_pc_specs_changes(self, db: Session, pc_specs_obj, user_id: int, date_now: date):
        """Process all PC specs product changes"""
        products = [
            pc_specs_obj.case,
            pc_specs_obj.cpu,
            pc_specs_obj.cpu_cooler,
            pc_specs_obj.gpu,
            pc_specs_obj.motherboard,
            pc_specs_obj.ram,
            pc_specs_obj.storage,
            pc_specs_obj.power_supply
        ]
        
        for product in products:
            if product:
                self._handle_product_id_change(db, product, user_id, date_now)
                self._handle_product_data_change(db, product, user_id)

    def _process_setup_streaming_changes(self, db: Session, setup_streaming_obj, user_id: int, date_now: date):
        """Process all setup streaming product changes"""
        products = [
            setup_streaming_obj.chair,
            setup_streaming_obj.microphone,
            setup_streaming_obj.camera
        ]
        
        for product in products:
            if product:
                self._handle_product_id_change(db, product, user_id, date_now)
                self._handle_product_data_change(db, product, user_id)

    def create(self, db: Session, *, obj_in: PlayerCreate) -> Player:
        """Create a new player"""
        create_data = obj_in.model_dump(exclude_unset=True)
        # Extract stickers first so they are not treated as plain columns
        sticker_ids = create_data.pop("sticker_ids", None)
        # Validate foreign keys
        if "game_id" in create_data and create_data["game_id"]:
            if not db.get(Game, create_data["game_id"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Game with id {create_data['game_id']} does not exist"
                )
        # Map country_id -> country FK column
        if "country_id" in create_data:
            create_data["country"] = create_data.pop("country_id")
        
        # Create player object
        db_obj = Player(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)

        # Attach stickers if provided
        if sticker_ids is not None:
            # Re-use CRUD helper to ensure validation logic is consistent
            self.set_player_stickers(db=db, player_id=db_obj.id, sticker_ids=sticker_ids)

        # Return player with all relations loaded
        stmt = (
            select(Player)
            .where(Player.id == db_obj.id)
            .options(
                # Gear list products with attributes and categories
                joinedload(Player.gear_list).joinedload(GearList.monitor).joinedload(Product.monitor_attributes),
                joinedload(Player.gear_list).joinedload(GearList.monitor).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.mouse).joinedload(Product.mouse_attributes),
                joinedload(Player.gear_list).joinedload(GearList.mouse).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.keyboard).joinedload(Product.keyboard_attributes),
                joinedload(Player.gear_list).joinedload(GearList.keyboard).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.headset).joinedload(Product.headset_attributes),
                joinedload(Player.gear_list).joinedload(GearList.headset).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.mousepad).joinedload(Product.mousepad_attributes),
                joinedload(Player.gear_list).joinedload(GearList.mousepad).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.earphones).joinedload(Product.headset_attributes),
                joinedload(Player.gear_list).joinedload(GearList.earphones).joinedload(Product.category),
                # PC specs list products with attributes and categories
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu).joinedload(Product.cpu_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler).joinedload(Product.cpu_cooler_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu).joinedload(Product.gpu_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard).joinedload(Product.motherboard_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram).joinedload(Product.ram_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage).joinedload(Product.storage_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply).joinedload(Product.power_supply_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case).joinedload(Product.case_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case).joinedload(Product.category),
                # Setup streaming list products with categories (no attributes for microphone/webcam)
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair).joinedload(Product.chair_attributes),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair).joinedload(Product.category),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.microphone).joinedload(Product.category),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.webcam).joinedload(Product.category),
                joinedload(Player.skins),
                joinedload(Player.stickers),
                joinedload(Player.custom_products),
                joinedload(Player.country_obj)
            )
        )
        return db.scalar(stmt)

    def get(self, db: Session, id_: int) -> Optional[Player]:
        """Get player by ID with all relations loaded"""
        stmt = (
            select(Player)
            .where(Player.id == id_)
            .options(
                # Gear list products with attributes and categories
                joinedload(Player.gear_list).joinedload(GearList.monitor).joinedload(Product.monitor_attributes),
                joinedload(Player.gear_list).joinedload(GearList.monitor).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.mouse).joinedload(Product.mouse_attributes),
                joinedload(Player.gear_list).joinedload(GearList.mouse).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.keyboard).joinedload(Product.keyboard_attributes),
                joinedload(Player.gear_list).joinedload(GearList.keyboard).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.headset).joinedload(Product.headset_attributes),
                joinedload(Player.gear_list).joinedload(GearList.headset).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.mousepad).joinedload(Product.mousepad_attributes),
                joinedload(Player.gear_list).joinedload(GearList.mousepad).joinedload(Product.category),
                joinedload(Player.gear_list).joinedload(GearList.earphones).joinedload(Product.headset_attributes),
                joinedload(Player.gear_list).joinedload(GearList.earphones).joinedload(Product.category),
                # PC specs list products with attributes and categories
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu).joinedload(Product.cpu_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler).joinedload(Product.cpu_cooler_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu).joinedload(Product.gpu_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard).joinedload(Product.motherboard_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram).joinedload(Product.ram_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage).joinedload(Product.storage_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply).joinedload(Product.power_supply_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply).joinedload(Product.category),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case).joinedload(Product.case_attributes),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case).joinedload(Product.category),
                # Setup streaming list products with categories (no attributes for microphone/webcam)
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair).joinedload(Product.chair_attributes),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair).joinedload(Product.category),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.microphone).joinedload(Product.category),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.webcam).joinedload(Product.category),
                joinedload(Player.skins),
                joinedload(Player.country_obj),
            )
        )
        return db.scalar(stmt)

    def get_multi(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        team: Optional[str] = None,
        country: Optional[str] = None,
        query: Optional[str] = None,
    ) -> tuple[List[Player], int]:
        """Get multiple players with pagination and filtering"""
        # Get total count
        count_stmt = (
            select(func.count())
            .select_from(Player)
        )
        
        # Get players with pagination
        stmt = (
            select(Player)
            .offset(skip)
            .limit(limit)
            .options(
                joinedload(Player.gear_list).joinedload(GearList.monitor),
                joinedload(Player.gear_list).joinedload(GearList.mouse),
                joinedload(Player.gear_list).joinedload(GearList.keyboard),
                joinedload(Player.gear_list).joinedload(GearList.headset),
                joinedload(Player.gear_list).joinedload(GearList.mousepad),
                joinedload(Player.gear_list).joinedload(GearList.earphones),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.microphone),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.webcam),
                joinedload(Player.skins),
                joinedload(Player.custom_products),
                joinedload(Player.country_obj)
            )
        )
        
        # Apply filters
        if team:
            stmt = stmt.join(Team, Player.team_id == Team.id).where(Team.name.ilike(f"%{team}%"))
            count_stmt = count_stmt.join(Team, Player.team_id == Team.id).where(Team.name.ilike(f"%{team}%"))

        if country:
            stmt = stmt.join(Country, Player.country == Country.id).where(
                (Country.name.ilike(f"%{country}%")) | (Country.iso_code.ilike(f"%{country}%"))
            )
            count_stmt = count_stmt.join(Country, Player.country == Country.id).where(
                (Country.name.ilike(f"%{country}%")) | (Country.iso_code.ilike(f"%{country}%"))
            )

        if query:
            stmt = stmt.join(Team, Player.team_id == Team.id, isouter=True).where(
                (Player.player_name.ilike(f"%{query}%")) |
                (Player.name.ilike(f"%{query}%")) |
                (Team.name.ilike(f"%{query}%"))
            )
            count_stmt = count_stmt.join(Team, Player.team_id == Team.id, isouter=True).where(
                (Player.player_name.ilike(f"%{query}%")) |
                (Player.name.ilike(f"%{query}%")) |
                (Team.name.ilike(f"%{query}%"))
            )
        
        total = db.scalar(count_stmt)
        players = db.scalars(stmt).unique().all()
       
        
        return players, total

    def get_by_team(self, db: Session, *, team: str) -> List[Player]:
        """Get players by team"""
        stmt = (
            select(Player)
            .join(Team, Player.team_id == Team.id)
            .where(Team.name.ilike(f"%{team}%"))
            .options(
                joinedload(Player.gear_list).joinedload(GearList.monitor),
                joinedload(Player.gear_list).joinedload(GearList.mouse),
                joinedload(Player.gear_list).joinedload(GearList.keyboard),
                joinedload(Player.gear_list).joinedload(GearList.headset),
                joinedload(Player.gear_list).joinedload(GearList.mousepad),
                joinedload(Player.gear_list).joinedload(GearList.earphones),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.microphone),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.webcam),
                joinedload(Player.skins),
                joinedload(Player.custom_products),
                joinedload(Player.country_obj)
            )
        )
        return db.scalars(stmt).unique().all()

    def get_by_country(self, db: Session, *, country: str) -> List[Player]:
        """Get players by country name or iso_code"""
        stmt = (
            select(Player)
            .join(Country, Player.country == Country.id)
            .where(
                (Country.name.ilike(f"%{country}%")) |
                (Country.iso_code.ilike(f"%{country}%"))
            )
            .options(
                joinedload(Player.gear_list).joinedload(GearList.monitor),
                joinedload(Player.gear_list).joinedload(GearList.mouse),
                joinedload(Player.gear_list).joinedload(GearList.keyboard),
                joinedload(Player.gear_list).joinedload(GearList.headset),
                joinedload(Player.gear_list).joinedload(GearList.mousepad),
                joinedload(Player.gear_list).joinedload(GearList.earphones),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.cpu_cooler),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.gpu),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.motherboard),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.ram),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.storage),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.power_supply),
                joinedload(Player.pc_specs_list).joinedload(PCSpecsList.case),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.chair),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.microphone),
                joinedload(Player.setup_streaming_list).joinedload(SetupStreamingList.webcam),
                joinedload(Player.skins),
                joinedload(Player.custom_products),
                joinedload(Player.country_obj)
            )
        )
        return db.scalars(stmt).unique().all()

    def update(self, db: Session, *, db_obj: Player, obj_in: PlayerUpdate) -> Player:
        """Update player"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Validate foreign keys if provided
        if "game_id" in update_data and update_data["game_id"]:
            if not db.get(Game, update_data["game_id"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Game with id {update_data['game_id']} does not exist"
                )
        if "gear_list_id" in update_data and update_data["gear_list_id"]:
            gear_list = db.get(GearList, update_data["gear_list_id"])
            if not gear_list:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"GearList with id {update_data['gear_list_id']} does not exist"
                )
        
        if "pc_specs_list_id" in update_data and update_data["pc_specs_list_id"]:
            pc_specs = db.get(PCSpecsList, update_data["pc_specs_list_id"])
            if not pc_specs:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PCSpecsList with id {update_data['pc_specs_list_id']} does not exist"
                )
        
        if "setup_streaming_list_id" in update_data and update_data["setup_streaming_list_id"]:
            setup_streaming = db.get(SetupStreamingList, update_data["setup_streaming_list_id"])
            if not setup_streaming:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"SetupStreamingList with id {update_data['setup_streaming_list_id']} does not exist"
                )
        
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return updated player with relations
        return self.get(db, db_obj.id)

    def remove(self, db: Session, *, id_: int) -> Player:
        """Delete player"""
        player = db.get(Player, id_)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {id_} not found"
            )
        
        db.delete(player)
        db.commit()
        return player

    def add_skin(self, db: Session, *, player_id: int, skin_id: int) -> Player:
        """Add skin to player"""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {player_id} not found"
            )
        
        skin = db.get(Skin, skin_id)
        if not skin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skin with id {skin_id} not found"
            )
        
        if skin not in player.skins:
            player.skins.append(skin)
            db.commit()
            db.refresh(player)
        
        return self.get(db, player_id)

    def remove_skin(self, db: Session, *, player_id: int, skin_id: int) -> Player:
        """Remove skin from player"""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {player_id} not found"
            )
        
        skin = db.get(Skin, skin_id)
        if not skin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skin with id {skin_id} not found"
            )
        
        if skin in player.skins:
            player.skins.remove(skin)
            db.commit()
            db.refresh(player)
        
        return self.get(db, player_id)

    def add_skins_batch(self, db: Session, *, player_id: int, skin_ids: List[int]) -> Player:
        """Add multiple skins to player with duplicate check"""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {player_id} not found"
            )
        
        # Get all skins at once
        skins = db.query(Skin).filter(Skin.id.in_(skin_ids)).all()
        if len(skins) != len(skin_ids):
            found_ids = {skin.id for skin in skins}
            missing_ids = set(skin_ids) - found_ids
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skins with ids {missing_ids} not found"
            )
        
        # Check for duplicates in input
        if len(skin_ids) != len(set(skin_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate skin IDs in request"
            )
        
        # Get current player skins to check for duplicates
        current_skin_ids = {skin.id for skin in player.skins}
        
        # Add only new skins
        new_skins = [skin for skin in skins if skin.id not in current_skin_ids]
        
        if new_skins:
            player.skins.extend(new_skins)
            db.commit()
            db.refresh(player)
        
        return self.get(db, player_id)

    def remove_skins_batch(self, db: Session, *, player_id: int, skin_ids: List[int]) -> Player:
        """Remove multiple skins from player"""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {player_id} not found"
            )
        
        # Get all skins at once
        skins = db.query(Skin).filter(Skin.id.in_(skin_ids)).all()
        if len(skins) != len(skin_ids):
            found_ids = {skin.id for skin in skins}
            missing_ids = set(skin_ids) - found_ids
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skins with ids {missing_ids} not found"
            )
        
        # Get current player skin IDs
        current_skin_ids = {skin.id for skin in player.skins}
        
        # Remove only existing skins
        skins_to_remove = [skin for skin in skins if skin.id in current_skin_ids]
        
        if skins_to_remove:
            for skin in skins_to_remove:
                player.skins.remove(skin)
            db.commit()
            db.refresh(player)
        
        return self.get(db, player_id)

    def set_player_skins(self, db: Session, *, player_id: int, skin_ids: List[int]) -> Player:
        """Set player skins (replace all existing skins with new ones)"""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {player_id} not found"
            )
        
        # Check for duplicates in input
        if len(skin_ids) != len(set(skin_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate skin IDs in request"
            )
        
        # Get all skins at once
        skins = db.query(Skin).filter(Skin.id.in_(skin_ids)).all()
        if len(skins) != len(skin_ids):
            found_ids = {skin.id for skin in skins}
            missing_ids = set(skin_ids) - found_ids
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skins with ids {missing_ids} not found"
            )
        
        # Replace all skins
        player.skins = skins
        db.commit()
        db.refresh(player)
        
        return self.get(db, player_id)
    

    def update_player_skins_list(self, db: Session, *, player_id: int, skins_update: List[SkinUpdate]) -> Player:
        """Update player skins"""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Player with id {player_id} not found"
            )
        
        input_skins_ids = [skin_update["skin_id"] for skin_update in skins_update]

        # Check for duplicates in input
        if len(input_skins_ids) != len(set(input_skins_ids)):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Duplicate skin IDs in request"
            )
        
        # Get all skins at once
        skins = db.query(Skin).filter(Skin.id.in_(input_skins_ids)).all()
        if len(skins) != len(input_skins_ids):
            found_ids = {skin.id for skin in skins}
            missing_ids = set(input_skins_ids) - found_ids
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skins with ids {missing_ids} not found"
            )

        all_player_skins = db.query(PlayerSkin).filter(PlayerSkin.player_id == player_id).all()
        all_player_skins_ids = [skin.skin_id for skin in all_player_skins]

        for skin_id in all_player_skins_ids:
            if skin_id not in input_skins_ids:
                player_skin = db.query(PlayerSkin).filter(PlayerSkin.player_id == player_id, PlayerSkin.skin_id == skin_id).first()
                db.delete(player_skin)
                db.commit()

       

        for skin_update in skins_update:
            player_skin_in_db = db.query(PlayerSkin).filter(PlayerSkin.player_id == player_id, PlayerSkin.skin_id == skin_update["skin_id"]).first()
            if player_skin_in_db:
                player_skin_in_db.is_stat_track = skin_update["is_stat_track"] if skin_update["is_stat_track"] else None
                player_skin_in_db.wear_level = skin_update["wear_level"] if skin_update["wear_level"] else None
                player_skin_in_db.pattern = skin_update["pattern"] if skin_update["pattern"] else None
                player_skin_in_db.souvenir = skin_update["souvenir"] if skin_update["souvenir"] else None
                db.commit()
                db.refresh(player_skin_in_db)
                continue
            
            player_skin = PlayerSkin(
                player_id=player_id,
                skin_id=skin_update["skin_id"] if skin_update["skin_id"] else None,
                is_stat_track=skin_update["is_stat_track"] if skin_update["is_stat_track"] else None,
                wear_level=skin_update["wear_level"] if skin_update["wear_level"] else None,
                pattern=skin_update["pattern"] if skin_update["pattern"] else None,
                souvenir=skin_update["souvenir"] if skin_update["souvenir"] else None
            )

            db.add(player_skin)
            db.commit()
            db.refresh(player_skin) 
        
        return self.get(db, player_id)

        
        

    def update_player_gear(self, db: Session, *, db_obj: Player, obj_in: PlayerUpdateWithGear) -> Player:
        """Update player and related gear lists"""
        print("obj_in", obj_in)
        update_data = obj_in.model_dump(exclude_unset=True)
        # Extract skins update separately for later processing
        skins_update = obj_in.skins
        if "country_id" in update_data:
            update_data["country"] = update_data.pop("country_id")
        # Current date for usage tracking / logs
        date_now = date.today()

        # Remove nested relational update keys to prevent assigning raw dicts to relationship attributes
        # Comment: These relations are processed separately below via their respective CRUD handlers.
        for relation_key in [
            "gear_list",
            "pc_specs_list",
            "setup_streaming_list",
            "skins",
            "custom_product_reletion",
        ]:
            update_data.pop(relation_key, None)
        
        # Validate foreign keys if provided
        if "game_id" in update_data and update_data["game_id"]:
            if not db.get(Game, update_data["game_id"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Game with id {update_data['game_id']} does not exist"
                )
        if "gear_list_id" in update_data and update_data["gear_list_id"]:
            gear_list = db.get(GearList, update_data["gear_list_id"])
            if not gear_list:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"GearList with id {update_data['gear_list_id']} does not exist"
                )
        
        if "pc_specs_list_id" in update_data and update_data["pc_specs_list_id"]:
            pc_specs = db.get(PCSpecsList, update_data["pc_specs_list_id"])
            if not pc_specs:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PCSpecsList with id {update_data['pc_specs_list_id']} does not exist"
                )
        
        if "setup_streaming_list_id" in update_data and update_data["setup_streaming_list_id"]:
            setup_streaming = db.get(SetupStreamingList, update_data["setup_streaming_list_id"])
            if not setup_streaming:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"SetupStreamingList with id {update_data['setup_streaming_list_id']} does not exist"
                )
        
        # Update player fields
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        

        # Update gear list if provided
        if obj_in.gear_list:
            # Check if gear_list exists, if not create it
            if db_obj.gear_list is None:
                # Create new gear list
                gear_list = gear_list_crud.create(db=db, obj_in=GearListCreate())
                db_obj.gear_list_id = gear_list.id
                db_obj.gear_list = gear_list
                db.commit()
                db.refresh(db_obj)
            
            # Convert dict back to GearListUpdate model
            gear_list_crud.update_by_model(db=db, db_obj=db_obj.gear_list, obj_in=obj_in.gear_list)
            great_list_obj = obj_in.gear_list
            print("great_list_obj", great_list_obj.model_dump())
            self._process_gear_list_changes(db, great_list_obj, db_obj.id, date_now)


        if obj_in.pc_specs_list:
            # Check if pc_specs_list exists, if not create it
            if db_obj.pc_specs_list is None:
                # Create new pc specs list
                pc_specs_list = pc_specs_list_crud.create(db=db, obj_in=PCSpecsListCreate())
                db_obj.pc_specs_list_id = pc_specs_list.id
                db_obj.pc_specs_list = pc_specs_list
                db.commit()
                db.refresh(db_obj)
            
            pc_specs_list_crud.update_by_model(db=db, db_obj=db_obj.pc_specs_list, obj_in=obj_in.pc_specs_list)
            pc_specs_list_obj = obj_in.pc_specs_list

            self._process_pc_specs_changes(db, pc_specs_list_obj, db_obj.id, date_now)


        if obj_in.setup_streaming_list:
            # Check if setup_streaming_list exists, if not create it
            if db_obj.setup_streaming_list is None:
                # Create new setup streaming list
                setup_streaming_list = setup_streaming_list_crud.create(db=db, obj_in=SetupStreamingListCreate())
                db_obj.setup_streaming_list_id = setup_streaming_list.id
                db_obj.setup_streaming_list = setup_streaming_list
                db.commit()
                db.refresh(db_obj)
            
            setup_streaming_list_crud.update_by_model(db=db, db_obj=db_obj.setup_streaming_list, obj_in=obj_in.setup_streaming_list)

            setup_streaming_list_obj = obj_in.setup_streaming_list
            self._process_setup_streaming_changes(db, setup_streaming_list_obj, db_obj.id, date_now)


       
        if obj_in.custom_product_reletion:
            cust_rel = obj_in.custom_product_reletion

            # Handle creations
            if cust_rel.create_list:
                for cp in cust_rel.create_list:
                    cp_data = cp.model_dump(exclude_unset=True)
                    usage_start = cp_data.pop("data", None)
                    cp_data["user_id"] = db_obj.id  # ensure relation to current player
                    # Persist relation
                    new_rel = CustomProductReletion(**cp_data)
                    db.add(new_rel)

                    # Create corresponding usage log if we have start date
                    product_usage_log_crud.create_log(
                        db=db,
                        obj_in=ProductUsageLogCreate(
                            user_id=db_obj.id,
                            product_id=cp.product_id,
                            usage_start_datetime=usage_start or date_now,
                        )
                    )

            # Handle updates
            if cust_rel.update_list:
                for cp in cust_rel.update_list:
                    existing_cp = db.query(CustomProductReletion).filter(
                        CustomProductReletion.id == cp.id,
                        CustomProductReletion.user_id == db_obj.id
                    ).first()
                    if existing_cp:
                        if cp.custom_name is not None:
                            existing_cp.custom_name = cp.custom_name
                        if cp.low_image_url is not None:
                            existing_cp.low_image_url = cp.low_image_url
                        if cp.high_image_url is not None:
                            existing_cp.high_image_url = cp.high_image_url

            # Handle deletions
            if cust_rel.delete_list:
                for cp_id in cust_rel.delete_list:
                    existing_cp = db.query(CustomProductReletion).filter(
                        CustomProductReletion.id == cp_id,
                        CustomProductReletion.user_id == db_obj.id
                    ).first()
                    if existing_cp:
                        db.delete(existing_cp)

                        # close usage log
                        product_usage_log_crud.update_data_end_usage_log(
                            db=db,
                            obj_in=ProductUsageLogUpdate(
                                user_id=db_obj.id,
                                product_id=existing_cp.product_id,
                                usage_end_datetime=date_now,
                            )
                        )

        # Update skins if provided
        if skins_update is not None:
            self.update_player_skins_list(db=db, player_id=db_obj.id, skins_update=skins_update)
        
        # Update stickers if provided
        if obj_in.stickers is not None:
            self.set_player_stickers(db=db, player_id=db_obj.id, sticker_ids=obj_in.stickers)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return updated player with relations
        return self.get(db, db_obj.id)

    def add_sticker(self, db: Session, *, player_id: int, sticker_id: int) -> Player:
        """Add sticker to player (only player-type stickers)."""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with id {player_id} not found")

        sticker = db.get(Stickers, sticker_id)
        if not sticker:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Sticker with id {sticker_id} not found")

        # Ensure sticker is of correct type
        if sticker.s_type and sticker.s_type.lower() != "player":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only stickers with type 'player' can be linked to a player")

        if sticker not in player.stickers:
            player.stickers.append(sticker)
            db.commit()
            db.refresh(player)

        return self.get(db, player_id)

    def remove_sticker(self, db: Session, *, player_id: int, sticker_id: int) -> Player:
        """Remove sticker from player."""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with id {player_id} not found")

        sticker = db.get(Stickers, sticker_id)
        if not sticker:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Sticker with id {sticker_id} not found")

        if sticker in player.stickers:
            player.stickers.remove(sticker)
            db.commit()
            db.refresh(player)

        return self.get(db, player_id)

    def add_stickers_batch(self, db: Session, *, player_id: int, sticker_ids: list[int]) -> Player:
        """Add multiple stickers to player, skipping duplicates."""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with id {player_id} not found")

        # Fetch all stickers
        stickers = db.query(Stickers).filter(Stickers.id.in_(sticker_ids)).all()
        if len(stickers) != len(sticker_ids):
            found_ids = {st.id for st in stickers}
            missing = set(sticker_ids) - found_ids
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stickers with ids {missing} not found")

        # Validate types
        for st in stickers:
            if st.s_type and st.s_type.lower() != "player":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Sticker {st.id} is not of type 'player'")

        current_ids = {st.id for st in player.stickers}
        new_stickers = [st for st in stickers if st.id not in current_ids]
        if new_stickers:
            player.stickers.extend(new_stickers)
            db.commit()
            db.refresh(player)
        return self.get(db, player_id)

    def remove_stickers_batch(self, db: Session, *, player_id: int, sticker_ids: list[int]) -> Player:
        """Remove multiple stickers from player."""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with id {player_id} not found")

        stickers = db.query(Stickers).filter(Stickers.id.in_(sticker_ids)).all()
        if len(stickers) != len(sticker_ids):
            found_ids = {st.id for st in stickers}
            missing = set(sticker_ids) - found_ids
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stickers with ids {missing} not found")

        for st in stickers:
            if st in player.stickers:
                player.stickers.remove(st)
        db.commit()
        db.refresh(player)
        return self.get(db, player_id)

    def set_player_stickers(self, db: Session, *, player_id: int, sticker_ids: List[int]) -> Player:
        """Replace player's stickers with given list."""
        player = db.get(Player, player_id)
        if not player:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Player with id {player_id} not found")
        # duplicates check
        if len(sticker_ids) != len(set(sticker_ids)):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Duplicate sticker IDs in request")
        # fetch stickers
        stickers = db.query(Stickers).filter(Stickers.id.in_(sticker_ids)).all() if sticker_ids else []
        if len(stickers) != len(sticker_ids):
            found = {s.id for s in stickers}
            missing = set(sticker_ids) - found
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Stickers {missing} not found")
        # type validation
        for st in stickers:
            if st.s_type and st.s_type.lower() != "player":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Sticker {st.id} is not of type 'player'")
        player.stickers = stickers
        db.commit()
        db.refresh(player)
        return self.get(db, player_id)


player_crud = CRUDPlayer() 