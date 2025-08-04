from math import ceil
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.list_products_with_pagination import ProductListWithPagination, PaginationSchema
from app.schemas.product import ProductRead, ProductUpdate, ProductCreate, ProductCompatibilityRequest
from app.crud.product import product_crud
from app.services.keepa import fetch_product_from_keepa
from app.services.json_attributes_parser import parse_json_attributes, parse_single_json_file

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
    - 9: Mouse
    - 10: Monitor
    - 11: Keyboard
    - 12: Headset
    - 13: Mousepad
    - 14: Chair
    - 15: Microphone
    - 16: Camera
    - 17: Headphones
    """
    return ProductRead.from_orm_with_attrs(product_crud.create(db, obj_in=product))

@router.get("/", response_model=ProductListWithPagination)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: int | None = Query(
        None, 
        le=17, ge=1, 
        description=(
            "1 - CPU;\n"
            "2 - CPU Cooler;\n"
            "3 - GPU;\n"
            "4 - Motherboard;\n"
            "5 - RAM;\n"
            "6 - Storage;\n"
            "7 - Power Supply;\n"
            "8 - Case;\n"
            "9 - Mouse;\n"
            "10 - Monitor;\n"
            "11 - Keyboard;\n"
            "12 - Headset;\n"
            "13 - Mousepad;\n"
            "14 - Chair;\n"
            "15 - Microphone;\n"
            "16 - Camera;\n"
            "17 - Headphones;\n"
            "If None - search in all categories"),
    ),
    periphery_flag: bool = Query(
        False, 
        description="""If False and category_id is None - return categories 1-8,
        otherwise - return only categoies 9-17"""
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
    query: str | None = Query(
        None, 
        description="Search query"
    ),
    db: Session = Depends(get_db),
):
    items, count = product_crud.get_multi(
        db, 
        page=page, 
        page_size=page_size, 
        category_id=category_id, 
        periphery=periphery_flag,
        price_min=price_min, 
        price_max=price_max, 
        query=query
    )
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
    
    result = ProductRead.from_orm_with_attrs(obj)
    print(f"🔍 Product {product_id} attrs: {result.attrs}")
    return result

@router.put("/{product_id}", response_model=ProductRead)
def update_product(product_id: int, item: ProductUpdate, db: Session = Depends(get_db)):
    obj = product_crud.get(db, product_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return ProductRead.from_orm_with_attrs(product_crud.update(db, db_obj=obj, obj_in=item))

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product by ID.
    """
    try:
        product_crud.remove(db, id_=product_id)
    except HTTPException as e:
        # Re-raise HTTP exceptions with Ukrainian messages
        if e.status_code == 404:
            raise HTTPException(
                status_code=404, 
                detail="Product not found"
            )
        elif e.status_code == 400:
            # This is the case when product has references
            raise HTTPException(
                status_code=400, 
                detail=e.detail
            )
        else:
            raise e
    except Exception as e:
        # Handle any other unexpected errors
        raise HTTPException(
            status_code=500, 
            detail="Error deleting product. Please try again."
        )

@router.post("/update-display-names", summary="Update display_name for all existing products")
def update_display_names(db: Session = Depends(get_db)):
    """
    Update display_name field for all existing products that don't have it set.
    This will populate display_name with brand + model from their respective attributes tables.
    """
    updated_count = product_crud.update_display_names_for_existing_products(db)
    return {"message": f"Updated display_name for {updated_count} products"}

