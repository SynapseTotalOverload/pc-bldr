from sqlalchemy import Column, Integer, String, DateTime, text
from app.db.base import Base


class S3File(Base):
    """Stores metadata for files uploaded to S3."""

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    key = Column(String, unique=True, index=True, nullable=False)
    url = Column(String, unique=True, nullable=False)
    original_filename = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=text("timezone('UTC', now())"), nullable=False)
