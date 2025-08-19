from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Date, String, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base


class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    
    players = relationship("Player", back_populates="game_obj")
 