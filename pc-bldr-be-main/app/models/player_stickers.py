from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, Text, func, text
from sqlalchemy.orm import relationship
from app.db.base import Base


class PlayerStickers(Base):

    __tablename__ = "player_stickers"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    player_id = Column(BigInteger, ForeignKey("player.id"), nullable=False)
    stickers_id = Column(BigInteger, ForeignKey("stickers.id"), nullable=False)

    # Relationships
    player = relationship("Player", viewonly=True)
    sticker = relationship("Stickers", viewonly=True)