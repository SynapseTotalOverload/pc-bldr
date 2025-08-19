from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Date, String, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base

class CustomProductReletion(Base):
    __tablename__ = "custom_product_reletion"
    id = Column(Integer, primary_key=True, index=True)
    original_name = Column(String, nullable=False)
    user_id = Column(BigInteger, ForeignKey("player.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, nullable=False)
    custom_name = Column(String, nullable=False)
    pozition = Column(String, nullable=False)
    low_image_url = Column(String, nullable=True)
    high_image_url = Column(String, nullable=True)

    player = relationship("Player", back_populates="custom_products")

