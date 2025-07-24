from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Skin(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    weapon = Column(String, nullable=False)
    skin_name = Column(String, nullable=False)
    image_file = Column(Text, nullable=True)
    link = Column(Text, nullable=True)
    
    # Foreign key to skin category
    category_id = Column(BigInteger, ForeignKey("skincategory.id"), nullable=False)
    category = relationship("SkinCategory", back_populates="skins")

    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False) 