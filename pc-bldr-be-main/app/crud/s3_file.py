from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.s3_file import S3File


class CRUDS3File:
    """CRUD helper for S3File records."""

    def create(self, db: Session, *, key: str, url: str, original_filename: str | None = None) -> S3File:
        db_obj = S3File(key=key, url=url, original_filename=original_filename)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_key(self, db: Session, key: str) -> S3File | None:
        return db.scalar(select(S3File).where(S3File.key == key))

    def get_by_url(self, db: Session, url: str) -> S3File | None:
        return db.scalar(select(S3File).where(S3File.url == url))

    def remove(self, db: Session, *, key: str | None = None, url: str | None = None) -> S3File:
        obj = None
        if key:
            obj = self.get_by_key(db, key)
        elif url:
            obj = self.get_by_url(db, url)
        if obj is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        db.delete(obj)
        db.commit()
        return obj


s3_file_crud = CRUDS3File()
