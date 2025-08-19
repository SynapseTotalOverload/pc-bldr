from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, Text, func, text
from sqlalchemy.orm import relationship
from app.db.base import Base



class Stickers(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    class_name = Column(String, nullable=True)
    tournire = Column(String, nullable=True)
    image_url = Column(Text, nullable=True)

    s_type = Column(String, nullable=True)

    # Relationships
    players = relationship("Player", secondary="player_stickers", back_populates="stickers")
    teams = relationship("Team", secondary="team_stickers", back_populates="stickers")
