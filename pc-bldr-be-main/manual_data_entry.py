#!/usr/bin/env python3
"""
Manual data entry script for products when parsing fails
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.models import Product
from app.db.session import SessionLocal

def add_product_manually():
    """Add product data manually"""
    print("📝 Manual Product Data Entry")
    print("=" * 40)
    
    asin = input("Enter ASIN: ").strip()
    price = input("Enter price (or press Enter to skip): ").strip()
    rating = input("Enter rating (or press Enter to skip): ").strip()
    image_url = input("Enter image URL (or press Enter to skip): ").strip()
    
    with SessionLocal() as db:
        product = db.query(Product).filter(Product.asin == asin).first()
        
        if product:
            print(f"Product found: {product.title}")
            
            if price:
                product.price = float(price.replace('$', '').replace(',', ''))
                print(f"✅ Updated price: ${product.price}")
            
            if rating:
                product.rating = float(rating)
                print(f"✅ Updated rating: {product.rating}")
                
            if image_url:
                product.high_image_url = image_url
                product.low_image_url = image_url  # Same for both
                print(f"✅ Updated image URL")
            
            db.commit()
            print("✅ Product updated successfully!")
        else:
            print(f"❌ Product with ASIN {asin} not found")

if __name__ == "__main__":
    add_product_manually()
