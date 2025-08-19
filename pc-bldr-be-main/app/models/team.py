from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Team(Base):
    __tablename__ = "teams"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    jerseys_img = Column(String, nullable=True)
    socila_media_links = Column(JSON, nullable=True)
    
    players = relationship("Player", back_populates="team")
    
    
  