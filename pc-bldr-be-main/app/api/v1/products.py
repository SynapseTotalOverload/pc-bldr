from math import ceil
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.list_products_with_pagination import ProductListWithPagination, PaginationSchema
from app.schemas.product import ProductRead, ProductUpdate, ProductCreate, ProductCompatibilityRequest
from app.crud.product import product_crud
from app.services.keepa import fetch_product_from_keepa

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/compatible", response_model=ProductListWithPagination)
def get_compatible_products(
    request: ProductCompatibilityRequest,
    db: Session = Depends(get_db)
):
    """
    Get products compatible with selected components.
    
    Accepts a JSON body with selected components and returns only compatible products
    using the ComponentFiltersBuilder class to apply compatibility rules.
    
    Example request body:
    {
        "selected_components": {
            "cpu": 1,
            "motherboard": 5
        },
        "category_id": 1,
        "page": 1,
        "page_size": 20,
        "budget": 1000,
        "query": "Ryzen 5 5600X",
    }
    """
    items, count = product_crud.get_compatible(
        db, 
        selected_components=request.selected_components,
        page=request.page,
        page_size=request.page_size,
        category_id=request.category_id,
        budget=request.budget,
        query=request.query,
    )
    items = [ProductRead.from_orm_with_attrs(i) for i in items]
    pagination = PaginationSchema(
        currentPage=request.page,
        totalPages=ceil(count/request.page_size),
        totalItems=count,
        itemsPerPage=request.page_size,
    )
    return ProductListWithPagination(items=items, pagination=pagination)

@router.post("/{asin}", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def add_product(asin: str, db: Session = Depends(get_db)):
    obj_in = fetch_product_from_keepa(asin, db=db)
    return product_crud.create(db, obj_in=obj_in)

@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product_manually(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a product manually with optional attributes.
    
    Category IDs:
    - 1: CPU
    - 2: CPU Cooler  
    - 3: GPU
    - 4: Motherboard
    - 5: RAM
    - 6: Storage
    - 7: Power Supply
    - 8: Case
    """
    return ProductRead.from_orm_with_attrs(product_crud.create(db, obj_in=product))

@router.get("/", response_model=ProductListWithPagination)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: int | None = Query(
        None, 
        le=8, ge=1, 
        description=(
            "1 - CPU;\n"
            "2 - CPU Cooler;\n"
            "3 - GPU;\n"
            "4 - Motherboard;\n"
            "5 - RAM;\n"
            "6 - ROM;\n"
            "7 - PSU;\n"
            "8 - Case;\n"
            "If None - search in all categories"),
    ),
    price_min: int | None = Query(
        None, 
        ge=0, 
        description="Minimum price in USD"
    ),
    price_max: int | None = Query(
        None, 
        ge=0, 
        description="Maximum price in USD"
    ),
    db: Session = Depends(get_db),
):
    items, count = product_crud.get_multi(db, page=page, page_size=page_size, category_id=category_id, price_min=price_min, price_max=price_max)
    items = [ProductRead.from_orm_with_attrs(i) for i in items]
    pagination = PaginationSchema(
        currentPage=page,
        totalPages=ceil(count/page_size),
        totalItems=count,
        itemsPerPage=page_size, # or len(items)?
    )
    return ProductListWithPagination(items=items, pagination=pagination)


@router.get(
    "/random-per-category",
    response_model=list[ProductRead],
    summary="One random product from each category",
)
def random_product_per_category(db: Session = Depends(get_db)):
    items = product_crud.get_random_per_category(db=db)
    if not items:
        raise HTTPException(status_code=404, detail="No products found")
    return items

@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    obj = product_crud.get(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return ProductRead.from_orm_with_attrs(obj)

@router.put("/{product_id}", response_model=ProductRead)
def update_product(product_id: int, item: ProductUpdate, db: Session = Depends(get_db)):
    obj = product_crud.get(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return ProductRead.from_orm_with_attrs(product_crud.update(db, db_obj=obj, obj_in=item))

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product_crud.remove(db, id_=product_id)
