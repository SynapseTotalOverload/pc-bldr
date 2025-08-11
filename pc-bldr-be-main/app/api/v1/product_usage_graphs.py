from datetime import date, timedelta
from typing import List, Dict, Any
import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.product_usage_graph import (
    ProductUsageGraphRequest, 
    BrandUsageGraphRequest,
    ProductSpecificUsageRequest,
    ProductUsageGraphResponse,
    BrandUsageGraphResponse,
    ProductSpecificUsageResponse,
    BrandsResponse,
    BrandInfo
)
from app.services.product_usage_graph_service import ProductUsageGraphService
from app.models.product import Product

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/product-usage-graphs", tags=["Product Usage Graphs"])


@router.post("/generate", response_model=ProductUsageGraphResponse)
async def generate_product_usage_graph(
    request: ProductUsageGraphRequest,
    db: Session = Depends(get_db)
):
    """
    Generate graph data for product usage based on specified parameters.
    
    This endpoint allows you to:
    - Filter by date range
    - Filter by specific categories (e.g., Intel, AMD, etc.)
    - Group data by category or show individual products
    - Get daily statistics of active users per product/category
    """
    # Validate date range
    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=400, 
            detail="Start date must be before or equal to end date"
        )
    
    # Limit date range to prevent excessive data
    max_days = 365  # Maximum 1 year
    if (request.end_date - request.start_date).days > max_days:
        raise HTTPException(
            status_code=400,
            detail=f"Date range cannot exceed {max_days} days"
        )
    
    try:
        result = ProductUsageGraphService.get_product_usage_for_graph(db, request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating graph data: {str(e)}"
        )


@router.get("/categories")
async def get_available_categories(
    db: Session = Depends(get_db)
):
    """
    Get list of available categories for filtering graph data.
    
    Returns categories with their IDs, names, and product counts.
    """
    try:
        categories = ProductUsageGraphService.get_available_categories(db)
        return {
            "categories": categories,
            "total_categories": len(categories)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching categories: {str(e)}"
        )


@router.get("/summary")
async def get_usage_summary(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    db: Session = Depends(get_db)
):
    """
    Get summary statistics for product usage.
    
    Returns:
    - Total active users in the period
    - Most used products
    - Most used categories
    """
    try:
        summary = ProductUsageGraphService.get_usage_summary(db, days)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching usage summary: {str(e)}"
        )


@router.get("/quick-graph")
async def get_quick_graph(
    days: int = Query(7, ge=1, le=30, description="Number of days to analyze"),
    category_ids: List[int] = Query(None, description="Filter by category IDs"),
    group_by_category: bool = Query(False, description="Group data by category"),
    db: Session = Depends(get_db)
):
    """
    Quick endpoint to get recent usage graph data.
    
    This is a simplified version of the main graph endpoint for common use cases.
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days)
    
    request = ProductUsageGraphRequest(
        start_date=start_date,
        end_date=end_date,
        category_ids=category_ids,
        group_by_category=group_by_category
    )
    
    try:
        result = ProductUsageGraphService.get_product_usage_for_graph(db, request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating quick graph: {str(e)}"
        )


@router.get("/category-comparison")
async def get_category_comparison(
    start_date: date = Query(..., description="Start date"),
    end_date: date = Query(..., description="End date"),
    category_ids: List[int] = Query(..., description="Category IDs to compare"),
    db: Session = Depends(get_db)
):
    """
    Compare usage between specific categories over time.
    
    This endpoint is specifically designed for comparing categories like Intel vs AMD.
    """
    if len(category_ids) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 category IDs are required for comparison"
        )
    
    request = ProductUsageGraphRequest(
        start_date=start_date,
        end_date=end_date,
        category_ids=category_ids,
        group_by_category=True  # Force grouping by category for comparison
    )
    
    try:
        result = ProductUsageGraphService.get_product_usage_for_graph(db, request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating category comparison: {str(e)}"
        )


@router.post("/brand-graph", response_model=BrandUsageGraphResponse)
async def generate_brand_usage_graph(
    request: BrandUsageGraphRequest,
    db: Session = Depends(get_db)
):
    """
    Generate graph data for product usage grouped by brands.
    
    This endpoint allows you to:
    - Filter by date range
    - Filter by specific categories
    - Filter by specific brands
    - Get daily statistics of active users per brand
    """
    # Validate date range
    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=400, 
            detail="Start date must be before or equal to end date"
        )
    
    # Limit date range to prevent excessive data
    max_days = 365  # Maximum 1 year
    if (request.end_date - request.start_date).days > max_days:
        raise HTTPException(
            status_code=400,
            detail=f"Date range cannot exceed {max_days} days"
        )
    
    try:
        logger.info(f"Generating brand usage graph for date range: {request.start_date} to {request.end_date}")
        logger.info(f"Category IDs: {request.category_ids}, Brands: {request.brands}")
        
        result = ProductUsageGraphService.get_brand_usage_for_graph(db, request)
        
        logger.info(f"Successfully generated brand usage graph with {len(result.brands)} brands")
        return result
    except Exception as e:
        logger.error(f"Error generating brand graph data: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error generating brand graph data: {str(e)}"
        )


@router.post("/product-specific", response_model=ProductSpecificUsageResponse)
async def generate_specific_product_usage_graph(
    request: ProductSpecificUsageRequest,
    db: Session = Depends(get_db)
):
    """
    Generate graph data for usage of a specific product.
    
    This endpoint provides detailed usage statistics for a single product:
    - Daily usage statistics
    - Product information (brand, category, price, rating)
    - Total users count
    """
    # Validate date range
    if request.start_date > request.end_date:
        raise HTTPException(
            status_code=400, 
            detail="Start date must be before or equal to end date"
        )
    
    # Limit date range to prevent excessive data
    max_days = 365  # Maximum 1 year
    if (request.end_date - request.start_date).days > max_days:
        raise HTTPException(
            status_code=400,
            detail=f"Date range cannot exceed {max_days} days"
        )
    
    try:
        result = ProductUsageGraphService.get_specific_product_usage(db, request)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating product-specific graph data: {str(e)}"
        )


@router.get("/brands")
async def get_available_brands(
    category_ids: List[int] = Query(None, description="Filter by category IDs"),
    db: Session = Depends(get_db)
):
    """
    Get list of available brands for filtering graph data.
    
    Returns brands with their product counts, optionally filtered by categories.
    """
    try:
        # Get all products with brand information
        products_query = db.query(Product)
        if category_ids:
            products_query = products_query.filter(Product.category_id.in_(category_ids))
        
        products = products_query.all()
        
        # Extract brands from product attributes
        brands_info = {}
        
        for p in products:
            brand = None
            
            # Check all possible attribute types regardless of category name
            if p.cpu_attributes and p.cpu_attributes.brand:
                brand = p.cpu_attributes.brand
            elif p.cpu_cooler_attributes and p.cpu_cooler_attributes.brand:
                brand = p.cpu_cooler_attributes.brand
            elif p.gpu_attributes and p.gpu_attributes.brand:
                brand = p.gpu_attributes.brand
            elif p.motherboard_attributes and p.motherboard_attributes.brand:
                brand = p.motherboard_attributes.brand
            elif p.ram_attributes and p.ram_attributes.brand:
                brand = p.ram_attributes.brand
            elif p.storage_attributes and p.storage_attributes.brand:
                brand = p.storage_attributes.brand
            elif p.power_supply_attributes and p.power_supply_attributes.brand:
                brand = p.power_supply_attributes.brand
            elif p.case_attributes and p.case_attributes.brand:
                brand = p.case_attributes.brand
            elif p.mouse_attributes and p.mouse_attributes.brand:
                brand = p.mouse_attributes.brand
            elif p.monitor_attributes and p.monitor_attributes.brand:
                brand = p.monitor_attributes.brand
            elif p.keyboard_attributes and p.keyboard_attributes.brand:
                brand = p.keyboard_attributes.brand
            elif p.headset_attributes and p.headset_attributes.brand:
                brand = p.headset_attributes.brand
            elif p.mousepad_attributes and p.mousepad_attributes.brand:
                brand = p.mousepad_attributes.brand
            elif p.chair_attributes and p.chair_attributes.brand:
                brand = p.chair_attributes.brand
            elif p.microphone_attributes and p.microphone_attributes.brand:
                brand = p.microphone_attributes.brand
            elif p.camera_attributes and p.camera_attributes.brand:
                brand = p.camera_attributes.brand
            elif p.headphones_attributes and p.headphones_attributes.brand:
                brand = p.headphones_attributes.brand
            
            brand = brand or "Unknown"
            
            if brand not in brands_info:
                brands_info[brand] = {
                    "name": brand,
                    "product_count": 0,
                    "categories": set()
                }
            
            brands_info[brand]["product_count"] += 1
            if p.category:
                brands_info[brand]["categories"].add(p.category.name)
        
        # Convert sets to lists for JSON serialization
        for brand_info in brands_info.values():
            brand_info["categories"] = list(brand_info["categories"])
        
        return {
            "brands": list(brands_info.values()),
            "total_brands": len(brands_info)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching brands: {str(e)}"
        )


@router.get("/all-brands", response_model=BrandsResponse)
async def get_all_brands(
    category_ids: List[int] = Query(None, description="Filter by category IDs"),
    db: Session = Depends(get_db)
):
    """
    Get all available brands from the database.
    
    This endpoint returns all brands that exist in the database,
    grouped by category and with product counts.
    
    Args:
        category_ids: Optional list of category IDs to filter brands by category
        
    Returns:
        BrandsResponse: List of brands with their product counts and categories
    """
    try:
        # Get all products with brand information
        products_query = db.query(Product)
        if category_ids:
            products_query = products_query.filter(Product.category_id.in_(category_ids))
        
        products = products_query.all()
        
        # Extract brands from product attributes
        brands_info = {}
        
        for p in products:
            brand = None
            
            # Check all possible attribute types regardless of category name
            if p.cpu_attributes and p.cpu_attributes.brand:
                brand = p.cpu_attributes.brand
            elif p.cpu_cooler_attributes and p.cpu_cooler_attributes.brand:
                brand = p.cpu_cooler_attributes.brand
            elif p.gpu_attributes and p.gpu_attributes.brand:
                brand = p.gpu_attributes.brand
            elif p.motherboard_attributes and p.motherboard_attributes.brand:
                brand = p.motherboard_attributes.brand
            elif p.ram_attributes and p.ram_attributes.brand:
                brand = p.ram_attributes.brand
            elif p.storage_attributes and p.storage_attributes.brand:
                brand = p.storage_attributes.brand
            elif p.power_supply_attributes and p.power_supply_attributes.brand:
                brand = p.power_supply_attributes.brand
            elif p.case_attributes and p.case_attributes.brand:
                brand = p.case_attributes.brand
            elif p.mouse_attributes and p.mouse_attributes.brand:
                brand = p.mouse_attributes.brand
            elif p.monitor_attributes and p.monitor_attributes.brand:
                brand = p.monitor_attributes.brand
            elif p.keyboard_attributes and p.keyboard_attributes.brand:
                brand = p.keyboard_attributes.brand
            elif p.headset_attributes and p.headset_attributes.brand:
                brand = p.headset_attributes.brand
            elif p.mousepad_attributes and p.mousepad_attributes.brand:
                brand = p.mousepad_attributes.brand
            elif p.chair_attributes and p.chair_attributes.brand:
                brand = p.chair_attributes.brand
            elif p.microphone_attributes and p.microphone_attributes.brand:
                brand = p.microphone_attributes.brand
            elif p.camera_attributes and p.camera_attributes.brand:
                brand = p.camera_attributes.brand
            elif p.headphones_attributes and p.headphones_attributes.brand:
                brand = p.headphones_attributes.brand
            
            brand = brand or "Unknown"
            
            if brand not in brands_info:
                brands_info[brand] = {
                    "name": brand,
                    "product_count": 0,
                    "categories": set()
                }
            
            brands_info[brand]["product_count"] += 1
            if p.category:
                brands_info[brand]["categories"].add(p.category.name)
        
        # Convert to BrandInfo objects
        brand_list = []
        for brand_info in brands_info.values():
            brand_list.append(BrandInfo(
                name=brand_info["name"],
                product_count=brand_info["product_count"],
                categories=list(brand_info["categories"])
            ))
        
        # Sort brands by name
        brand_list.sort(key=lambda x: x.name.lower())
        
        return BrandsResponse(
            brands=brand_list,
            total_brands=len(brand_list)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching all brands: {str(e)}"
        ) 