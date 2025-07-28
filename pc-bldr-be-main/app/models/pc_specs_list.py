from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, func, text
from sqlalchemy.orm import relationship
from app.db.base import Base


class PCSpecsList(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    
    # Foreign keys to PC components
    cpu_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    cpu_cooler_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    gpu_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    motherboard_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    ram_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    storage_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    power_supply_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    case_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    
    # Relationship back to player
    player = relationship("Player", back_populates="pc_specs_list")
    
    # Relationships to products
    cpu = relationship("Product", foreign_keys=[cpu_id])
    cpu_cooler = relationship("Product", foreign_keys=[cpu_cooler_id])
    gpu = relationship("Product", foreign_keys=[gpu_id])
    motherboard = relationship("Product", foreign_keys=[motherboard_id])
    ram = relationship("Product", foreign_keys=[ram_id])
    storage = relationship("Product", foreign_keys=[storage_id])
    power_supply = relationship("Product", foreign_keys=[power_supply_id])
    case = relationship("Product", foreign_keys=[case_id])

    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    updated_at = Column(DateTime, server_default=text("timezone('UTC', now())"), server_onupdate=text("timezone('UTC', now())"), nullable=False) 