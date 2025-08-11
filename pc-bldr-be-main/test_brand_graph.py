#!/usr/bin/env python3
"""
Test script for brand graph functionality
"""
import sys
import os
from datetime import date, timedelta
from pathlib import Path

# Add the parent directory to the Python path to import app modules
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.product_usage_graph_service import ProductUsageGraphService
from app.schemas.product_usage_graph import BrandUsageGraphRequest
from app.models.product import Product
from app.models.category import Category

def test_brand_graph():
    """Test the brand graph functionality"""
    print("Testing brand graph functionality...")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Get all categories
        categories = db.query(Category).all()
        print(f"Found {len(categories)} categories:")
        for cat in categories:
            print(f"  - ID {cat.id}: {cat.name}")
        
        # Get some products with their attributes
        products = db.query(Product).limit(10).all()
        print(f"\nFound {len(products)} products:")
        
        for p in products:
            brand = "Unknown"
            category_name = p.category.name if p.category else "None"
            
            # Check all possible attribute types
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
            
            print(f"  - Product {p.id}: {p.title} | Category: {category_name} | Brand: {brand}")
        
        # Test brand graph request
        end_date = date.today()
        start_date = end_date - timedelta(days=7)
        
        request = BrandUsageGraphRequest(
            start_date=start_date,
            end_date=end_date,
            category_ids=[1, 2, 3],  # CPU, CPU Cooler, GPU
            brands=None
        )
        
        print(f"\nTesting brand graph with request:")
        print(f"  - Date range: {start_date} to {end_date}")
        print(f"  - Category IDs: {request.category_ids}")
        print(f"  - Brands filter: {request.brands}")
        
        result = ProductUsageGraphService.get_brand_usage_for_graph(db, request)
        
        print(f"\nResult:")
        print(f"  - Total products: {result.total_products}")
        print(f"  - Total users: {result.total_users}")
        print(f"  - Brands found: {len(result.brands)}")
        
        for brand_name, brand_info in result.brands.items():
            print(f"    - {brand_name}: {brand_info['count']} products")
        
        print("\nTest completed successfully!")
        
    except Exception as e:
        print(f"Error during test: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_brand_graph() 