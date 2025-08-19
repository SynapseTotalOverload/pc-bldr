from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

class CountryRead(BaseModel):
    id: int
    name: str = Field(..., max_length=255)
    iso_code: str = Field(..., max_length=10)

    class Config:
        from_attributes = True
