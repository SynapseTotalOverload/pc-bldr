from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, Text, func, text
from sqlalchemy.orm import relationship
from app.db.base import Base


class TeamStickers(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    team_id = Column(BigInteger, ForeignKey("teams.id"), nullable=False)
    stickers_id = Column(BigInteger, ForeignKey("stickers.id"), nullable=False)

    # Relationships
    team = relationship("Team", viewonly=True)
    sticker = relationship("Stickers", viewonly=True)