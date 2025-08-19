from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, Text, Date, func, text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Player(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    player_name = Column(String, nullable=False)
    player_img = Column(Text, nullable=True)
    team_id = Column(BigInteger, ForeignKey("teams.id"), nullable=True)
    country = Column(BigInteger, ForeignKey("countries.id"), nullable=True)
    country_obj = relationship("Country")  # new relationship
    name = Column(String, nullable=True)  # Full name
    birthday = Column(Date, nullable=True)
    info = Column(Text, nullable=True)
    note = Column(Text, nullable=True)
    pc_image = Column(Text, nullable=True)
    pc_image_name = Column(String, nullable=True)
    
    game_id = Column(BigInteger, ForeignKey("games.id"), nullable=True)
    game_obj = relationship("Game", back_populates="players")
    # Foreign keys to related lists
    gear_list_id = Column(BigInteger, ForeignKey("gearlist.id"), nullable=True)
    pc_specs_list_id = Column(BigInteger, ForeignKey("pcspecslist.id"), nullable=True)
    setup_streaming_list_id = Column(BigInteger, ForeignKey("setupstreaminglist.id"), nullable=True)
    
    # Relationships
    gear_list = relationship("GearList", back_populates="player")
    pc_specs_list = relationship("PCSpecsList", back_populates="player")
    setup_streaming_list = relationship("SetupStreamingList", back_populates="player")
    team = relationship("Team", back_populates="players")
    
    # Many-to-many relationship with skins
    skins = relationship("Skin", secondary="player_skins", back_populates="players")
    
    # Many-to-many relationship with stickers
    stickers = relationship("Stickers", secondary="player_stickers", back_populates="players")
    
    # Direct relationship with player_skins to access additional attributes
    player_skins = relationship("PlayerSkin", back_populates="player")

    custom_products = relationship("CustomProductReletion", back_populates="player", cascade="all, delete-orphan")

    user_urls = Column(JSON, nullable=True)

    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    updated_at = Column(DateTime, server_default=text("timezone('UTC', now())"), server_onupdate=text("timezone('UTC', now())"), nullable=False) 