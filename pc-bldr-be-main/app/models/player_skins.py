from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, func, text, Boolean, Float
from sqlalchemy.orm import relationship
from app.db.base import Base


class PlayerSkin(Base):
    __tablename__ = "player_skins"
    
    player_id = Column(BigInteger, ForeignKey("player.id"), primary_key=True)
    skin_id = Column(BigInteger, ForeignKey("skin.id"), primary_key=True)
    is_stat_track = Column(Boolean, default=False)
    wear_level = Column(String, default="None")
    pattern = Column(BigInteger, nullable=True)
    souvenir = Column(Boolean, nullable=True)
    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    
    # Relationships
    player = relationship("Player", back_populates="player_skins")
    skin = relationship("Skin") 