from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base


class Country(Base):
    __tablename__ = "countries"
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    iso_code = Column(String, nullable=False)
  