from datetime import datetime

from pydantic import BaseModel


class S3FileRead(BaseModel):
    id: int
    key: str
    url: str
    original_filename: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
