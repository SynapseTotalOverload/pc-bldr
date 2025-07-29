from datetime import datetime, timezone
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, Session
from fastapi import HTTPException, status
from typing import List, Optional

from app.models.player import Player
from app.models.gear_list import GearList
from app.models.pc_specs_list import PCSpecsList
from app.models.setup_streaming_list import SetupStreamingList
from app.models.skin import Skin
from app.models.product import Product
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerUpdateWithGear
from app.crud.gear_list import gear_list_crud
from app.crud.pc_specs_list import pc_specs_list_crud
from app.crud.setup_streaming_list import setup_streaming_list_crud

import logging

logger = logging.getLogger(__name__)


class CRUDPlayer:
    def create(self, db: Session, *, obj_in: PlayerCreate) -> Player:
        """Create a new player"""
        create_data = obj_in.model_dump(exclude_unset=True)
        
        # Create player object
        db_obj = Player(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
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
                joinedload(Player.skins)
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
                joinedload(Player.skins)
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
                joinedload(Player.skins)
            )
        )
        
        # Apply filters
        if team:
            stmt = stmt.where(Player.team.ilike(f"%{team}%"))
            count_stmt = count_stmt.where(Player.team.ilike(f"%{team}%"))
        
        if country:
            stmt = stmt.where(Player.country.ilike(f"%{country}%"))
            count_stmt = count_stmt.where(Player.country.ilike(f"%{country}%"))
        
        if query:
            stmt = stmt.where(
                (Player.player_name.ilike(f"%{query}%")) |
                (Player.name.ilike(f"%{query}%")) |
                (Player.team.ilike(f"%{query}%")) |
                (Player.country.ilike(f"%{query}%"))
            )
            count_stmt = count_stmt.where(
                (Player.player_name.ilike(f"%{query}%")) |
                (Player.name.ilike(f"%{query}%")) |
                (Player.team.ilike(f"%{query}%")) |
                (Player.country.ilike(f"%{query}%"))
            )
        
        total = db.scalar(count_stmt)
        players = db.scalars(stmt).unique().all()
       
        
        return players, total

    def get_by_team(self, db: Session, *, team: str) -> List[Player]:
        """Get players by team"""
        stmt = (
            select(Player)
            .where(Player.team.ilike(f"%{team}%"))
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
                joinedload(Player.skins)
            )
        )
        return db.scalars(stmt).unique().all()

    def get_by_country(self, db: Session, *, country: str) -> List[Player]:
        """Get players by country"""
        stmt = (
            select(Player)
            .where(Player.country.ilike(f"%{country}%"))
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
                joinedload(Player.skins)
            )
        )
        return db.scalars(stmt).unique().all()

    def update(self, db: Session, *, db_obj: Player, obj_in: PlayerUpdate) -> Player:
        """Update player"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Validate foreign keys if provided
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

    def update_player_gear(self, db: Session, *, db_obj: Player, obj_in: PlayerUpdateWithGear) -> Player:
        """Update player and related gear lists"""
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Extract gear list, pc specs list, setup streaming list, and skins updates
        gear_list_update = update_data.pop("gear_list", None)
        pc_specs_list_update = update_data.pop("pc_specs_list", None)
        setup_streaming_list_update = update_data.pop("setup_streaming_list", None)
        skin_ids = update_data.pop("skin_ids", None)
        
        # Validate foreign keys if provided
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
        if gear_list_update and db_obj.gear_list:
            # Convert dict back to GearListUpdate model
            from app.schemas.gear_list import GearListUpdate
            gear_list_update_model = GearListUpdate(**gear_list_update)
            gear_list_crud.update(db=db, db_obj=db_obj.gear_list, obj_in=gear_list_update_model)
        
        # Update pc specs list if provided
        if pc_specs_list_update and db_obj.pc_specs_list:
            # Convert dict back to PCSpecsListUpdate model
            from app.schemas.pc_specs_list import PCSpecsListUpdate
            pc_specs_list_update_model = PCSpecsListUpdate(**pc_specs_list_update)
            pc_specs_list_crud.update(db=db, db_obj=db_obj.pc_specs_list, obj_in=pc_specs_list_update_model)
        
        # Update setup streaming list if provided
        if setup_streaming_list_update and db_obj.setup_streaming_list:
            # Convert dict back to SetupStreamingListUpdate model
            from app.schemas.setup_streaming_list import SetupStreamingListUpdate
            setup_streaming_list_update_model = SetupStreamingListUpdate(**setup_streaming_list_update)
            setup_streaming_list_crud.update(db=db, db_obj=db_obj.setup_streaming_list, obj_in=setup_streaming_list_update_model)
        
        # Update skins if provided
        if skin_ids is not None:
            self.set_player_skins(db=db, player_id=db_obj.id, skin_ids=skin_ids)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        
        # Return updated player with relations
        return self.get(db, db_obj.id)


player_crud = CRUDPlayer() 