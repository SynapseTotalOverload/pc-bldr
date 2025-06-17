from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class Product(Base):
    id = Column(Integer, primary_key=True, index=True)
    asin = Column(String(12), unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    price = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)

    category_id = Column(BigInteger, ForeignKey("category.id", ondelete="SET NULL"))
    category = relationship("Category", back_populates="products")

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)