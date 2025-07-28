from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, func, text
from app.db.base import Base


class PlayerSkin(Base):
    __tablename__ = "player_skins"
    
    player_id = Column(BigInteger, ForeignKey("player.id"), primary_key=True)
    skin_id = Column(BigInteger, ForeignKey("skin.id"), primary_key=True)
    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False) 