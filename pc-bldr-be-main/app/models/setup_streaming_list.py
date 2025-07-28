from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, ForeignKey, func, text
from sqlalchemy.orm import relationship
from app.db.base import Base


class SetupStreamingList(Base):
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    
    # Foreign keys to streaming equipment
    chair_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    microphone_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    webcam_id = Column(BigInteger, ForeignKey("product.id"), nullable=True)
    
    # Relationship back to player
    player = relationship("Player", back_populates="setup_streaming_list")
    
    # Relationships to products
    chair = relationship("Product", foreign_keys=[chair_id])
    microphone = relationship("Product", foreign_keys=[microphone_id])
    webcam = relationship("Product", foreign_keys=[webcam_id])

    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
    updated_at = Column(DateTime, server_default=text("timezone('UTC', now())"), server_onupdate=text("timezone('UTC', now())"), nullable=False) 