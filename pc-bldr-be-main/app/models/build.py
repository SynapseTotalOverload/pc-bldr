from typing import TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship, Mapped
from app.db.base import Base


if TYPE_CHECKING:
    from app.models.product import Product

class Build(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    build_price = Column(Float, nullable=True)
    
    # Foreign keys to products (nullable)
    cpu_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    cpu_cooler_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    gpu_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    motherboard_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    ram_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    storage_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    psu_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    case_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships to products
    cpu: Mapped["Product"] = relationship("Product", foreign_keys=[cpu_id], lazy="joined")
    cpu_cooler: Mapped["Product"] = relationship("Product", foreign_keys=[cpu_cooler_id], lazy="joined")
    gpu: Mapped["Product"] = relationship("Product", foreign_keys=[gpu_id], lazy="joined")
    motherboard: Mapped["Product"] = relationship("Product", foreign_keys=[motherboard_id], lazy="joined")
    ram: Mapped["Product"] = relationship("Product", foreign_keys=[ram_id], lazy="joined")
    storage: Mapped["Product"] = relationship("Product", foreign_keys=[storage_id], lazy="joined")
    psu: Mapped["Product"] = relationship("Product", foreign_keys=[psu_id], lazy="joined")
    case: Mapped["Product"] = relationship("Product", foreign_keys=[case_id], lazy="joined")
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=datetime.now(timezone.utc), nullable=False) 