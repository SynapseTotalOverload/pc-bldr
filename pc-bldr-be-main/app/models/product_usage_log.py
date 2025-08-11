from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Date
from app.db.base import Base

class ProductUsageLog(Base):
    __tablename__ = "product_usage_log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)
    usage_start_datetime = Column(Date, nullable=True)
    usage_end_datetime = Column(Date, nullable=True)




