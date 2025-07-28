from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud.setup_streaming_list import setup_streaming_list_crud
from app.db.session import get_db
from app.schemas.setup_streaming_list import SetupStreamingListCreate, SetupStreamingListUpdate, SetupStreamingListRead, SetupStreamingListWithProducts

router = APIRouter(prefix="/setup-streaming-lists", tags=["setup-streaming-lists"])


@router.post("/", response_model=SetupStreamingListWithProducts, status_code=status.HTTP_201_CREATED)
def create_setup_streaming_list(
    *,
    db: Session = Depends(get_db),
    setup_streaming_list_in: SetupStreamingListCreate,
) -> SetupStreamingListWithProducts:
    """
    Create new setup streaming list.
    """
    setup_streaming_list = setup_streaming_list_crud.create(db=db, obj_in=setup_streaming_list_in)
    return SetupStreamingListWithProducts.from_setupstreaminglist(setup_streaming_list)


@router.get("/{setup_streaming_list_id}", response_model=SetupStreamingListWithProducts)
def get_setup_streaming_list(
    *,
    db: Session = Depends(get_db),
    setup_streaming_list_id: int,
) -> SetupStreamingListWithProducts:
    """
    Get setup streaming list by ID with products.
    """
    setup_streaming_list = setup_streaming_list_crud.get(db=db, id_=setup_streaming_list_id)
    if not setup_streaming_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Setup streaming list not found"
        )
    return SetupStreamingListWithProducts.from_setupstreaminglist(setup_streaming_list)


@router.get("/", response_model=dict)
def get_setup_streaming_lists(
    *,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
) -> dict:
    """
    Get multiple setup streaming lists with pagination.
    """
    setup_streaming_lists, total = setup_streaming_list_crud.get_multi(
        db=db,
        skip=skip,
        limit=limit,
    )
    
    return {
        "items": [SetupStreamingListWithProducts.from_setupstreaminglist(setup_streaming_list) for setup_streaming_list in setup_streaming_lists],
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": skip + limit < total
    }


@router.put("/{setup_streaming_list_id}", response_model=SetupStreamingListWithProducts)
def update_setup_streaming_list(
    *,
    db: Session = Depends(get_db),
    setup_streaming_list_id: int,
    setup_streaming_list_in: SetupStreamingListUpdate,
) -> SetupStreamingListWithProducts:
    """
    Update setup streaming list.
    """
    setup_streaming_list = setup_streaming_list_crud.get(db=db, id_=setup_streaming_list_id)
    if not setup_streaming_list:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Setup streaming list not found"
        )
    setup_streaming_list = setup_streaming_list_crud.update(db=db, db_obj=setup_streaming_list, obj_in=setup_streaming_list_in)
    return SetupStreamingListWithProducts.from_setupstreaminglist(setup_streaming_list)


@router.delete("/{setup_streaming_list_id}", response_model=SetupStreamingListRead)
def delete_setup_streaming_list(
    *,
    db: Session = Depends(get_db),
    setup_streaming_list_id: int,
) -> SetupStreamingListRead:
    """
    Delete setup streaming list.
    """
    setup_streaming_list = setup_streaming_list_crud.remove(db=db, id_=setup_streaming_list_id)
    return SetupStreamingListRead.from_setupstreaminglist(setup_streaming_list) 