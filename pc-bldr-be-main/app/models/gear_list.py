from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, func, text
from sqlalchemy.orm import relationship
from app.db.base import Base


class GearList(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    
    # Foreign keys to different gear items
    monitor_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    mouse_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    keyboard_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    headset_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    mousepad_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    earphones_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    
    # Relationship back to player
    player = relationship("Player", back_populates="gear_list")
    
    # Relationships to products
    monitor = relationship("Product", foreign_keys=[monitor_id])
    mouse = relationship("Product", foreign_keys=[mouse_id])
    keyboard = relationship("Product", foreign_keys=[keyboard_id])
    headset = relationship("Product", foreign_keys=[headset_id])
    mousepad = relationship("Product", foreign_keys=[mousepad_id])
    earphones = relationship("Product", foreign_keys=[earphones_id])

    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    updated_at = Column(DateTime, server_default=text("timezone('UTC', now())"), server_onupdate=text("timezone('UTC', now())"), nullable=False) 