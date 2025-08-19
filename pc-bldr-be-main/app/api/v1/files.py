import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from botocore.exceptions import ClientError

from app.db.session import get_db
from app.schemas.s3_file import S3FileRead
from app.crud.s3_file import s3_file_crud
from app.services.s3_service import s3_service


router = APIRouter(prefix="/files", tags=["files"])


@router.post("/", response_model=S3FileRead, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    key = f"{uuid.uuid4().hex}_{file.filename}"
    url = s3_service.upload_fileobj(file.file, key)
    record = s3_file_crud.create(db, key=key, url=url, original_filename=file.filename)
    return record


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_file(
    key: str | None = Query(None),
    url: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if not key and not url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide either key or url")

    if not key:
        key = s3_service.extract_key_from_url(url)
    s3_service.delete_file(key)
    s3_file_crud.remove(db, key=key)
    return


@router.get("/")
def get_file(
    key: str | None = Query(None),
    url: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if not key and not url:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide either key or url")

    # Derive the S3 key if only the public URL was provided
    if not key:
        key = s3_service.extract_key_from_url(url)

    # Attempt to determine a user-friendly filename
    record = s3_file_crud.get_by_key(db, key)
    if record and record.original_filename:
        filename = record.original_filename
    else:
        # Fallback: strip UUID prefix (everything before the first underscore)
        filename = key.split("_", 1)[-1] if "_" in key else key

    # Try to fetch the file body from S3 – if the key does not exist, return a 404 instead of propagating
    try:
        body = s3_service.get_file_body(key)
    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "NoSuchKey":
            # File not found in S3 – translate to a clean 404 for the API consumer
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        # Re-raise any other S3 related error as a 500 so we don’t hide genuine issues
        raise

    headers = {"Content-Disposition": f"attachment; filename=\"{filename}\""}
    return StreamingResponse(body, media_type="application/octet-stream", headers=headers)
