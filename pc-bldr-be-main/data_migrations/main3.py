import json
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.product import Product


def update_product_price_by_asin(asin: str, new_price: float):
    """
    Update product price by ASIN
    """
    db = SessionLocal()
    
    try:
        # Find product by ASIN
        stmt = select(Product).where(Product.asin == asin)
        product = db.scalar(stmt)
        
        if product:
            # Update price
            old_price = product.price
            product.price = new_price
            db.commit()
            print(f"Updated ASIN {asin}: {old_price} -> {new_price}")
            return True
        else:
            print(f"Product with ASIN {asin} not found")
            return False
            
    except Exception as e:
        print(f"Error updating ASIN {asin}: {e}")
        db.rollback()
        return False
    finally:
        db.close()


def update_prices_from_file(file_path: str):
    """
    Update product prices from JSON file
    Expected format: [{"asin": "B123456789", "price": 99.99}, ...]
    """
    try:
        # Load data from file
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not isinstance(data, list):
            print("Error: File should contain a list of objects")
            return
        
        success_count = 0
        skipped_count = 0
        total_count = len(data)
        
        print(f"Starting to update {total_count} products...")
        
        for item in data:
            if 'asin' in item and 'price' in item:
                asin = item['asin']
                price_value = item['price']
                
                # Handle null/None values
                if price_value is None:
                    print(f"Skipping ASIN {asin}: price is null/None")
                    skipped_count += 1
                    continue
                
                # Handle empty strings
                if isinstance(price_value, str) and price_value.strip() == '':
                    print(f"Skipping ASIN {asin}: price is empty string")
                    skipped_count += 1
                    continue
                
                try:
                    price = float(price_value)
                    
                    # Check for negative or zero prices
                    if price <= 0:
                        print(f"Skipping ASIN {asin}: price is {price} (must be positive)")
                        skipped_count += 1
                        continue
                    
                    if update_product_price_by_asin(asin, price):
                        success_count += 1
                        
                except (ValueError, TypeError) as e:
                    print(f"Skipping ASIN {asin}: invalid price value '{price_value}' - {e}")
                    skipped_count += 1
                    continue
                    
            else:
                print(f"Skipping item without asin or price: {item}")
                skipped_count += 1
        
        print(f"\nUpdate completed!")
        print(f"Successfully updated: {success_count}/{total_count} products")
        print(f"Skipped: {skipped_count} products")
        
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {file_path}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    # You can specify the file path here or pass it as command line argument
    file_path = "/Users/ulia/keepa_fastapi/main/pc-bldr/pc-bldr-be-main/data_migrations/detailed_product_data3.json"  # Change this to your file path
    
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    
    print(f"Using file: {file_path}")
    update_prices_from_file(file_path)