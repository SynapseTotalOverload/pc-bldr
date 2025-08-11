from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, Text, Date, func, text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Player(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    player_name = Column(String, nullable=False)
    player_img = Column(Text, nullable=True)
    team = Column(String, nullable=True)
    country = Column(String, nullable=True)
    name = Column(String, nullable=True)  # Full name
    birthday = Column(Date, nullable=True)
    info = Column(Text, nullable=True)
    note = Column(Text, nullable=True)
    
    # Foreign keys to related lists
    gear_list_id = Column(BigInteger, ForeignKey("gearlist.id"), nullable=True)
    pc_specs_list_id = Column(BigInteger, ForeignKey("pcspecslist.id"), nullable=True)
    setup_streaming_list_id = Column(BigInteger, ForeignKey("setupstreaminglist.id"), nullable=True)
    
    # Relationships
    gear_list = relationship("GearList", back_populates="player")
    pc_specs_list = relationship("PCSpecsList", back_populates="player")
    setup_streaming_list = relationship("SetupStreamingList", back_populates="player")
    
    # Many-to-many relationship with skins
    skins = relationship("Skin", secondary="player_skins", back_populates="players")
    
    # Direct relationship with player_skins to access additional attributes
    player_skins = relationship("PlayerSkin", back_populates="player")

    user_urls = Column(JSON, nullable=True)

    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    updated_at = Column(DateTime, server_default=text("timezone('UTC', now())"), server_onupdate=text("timezone('UTC', now())"), nullable=False) 