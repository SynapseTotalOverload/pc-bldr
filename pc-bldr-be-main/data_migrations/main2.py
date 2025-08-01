import json
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import select, or_, and_
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.product import Product
from app.crud.product import CRUDProduct


def get_products_without_price():
    """
    Get all products that don't have a price (price is None or 0)
    and save them to products.json
    """
    db = SessionLocal()
    crud_product = CRUDProduct()
    
    try:
        # Create a query to get products without price
        stmt = (
            select(Product)
            .where(
                or_(
                    Product.price.is_(None),
                    Product.price == 0
                )
            )
            .options(*crud_product._get_joinedload_attrs_option())
        )
        
        # Execute the query
        products = db.scalars(stmt).all()
        
        # Convert products to dictionary format
        products_data = []
        for product in products:
            product_dict = {
                "id": product.id,
                "asin": product.asin,
                "title": product.title,
                "price": product.price,
                "rating": product.rating,
                "low_image_url": product.low_image_url,
                "high_image_url": product.high_image_url,
                "display_name": product.display_name,
                "category_id": product.category_id,
                "created_at": product.created_at.isoformat() if product.created_at else None,
                "updated_at": product.updated_at.isoformat() if product.updated_at else None,
                "attributes": {}
            }
        
            
            products_data.append(product_dict)
        
        # Save to JSON file
        output_file = "products.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products_data, f, indent=2, ensure_ascii=False)
        
        print(f"Found {len(products_data)} products without price")
        print(f"Data saved to {output_file}")
        
        return products_data
        
    except Exception as e:
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    get_products_without_price()
