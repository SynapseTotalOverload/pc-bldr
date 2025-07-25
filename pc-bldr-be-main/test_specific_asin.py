#!/usr/bin/env python3
"""
Test script for specific ASIN search
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.crud.product import product_crud
from sqlalchemy import text

def test_specific_asin():
    """Test specific ASIN search"""
    db = SessionLocal()
    try:
        target_asin = "B09G5Y1QGP"
        
        # Check if ASIN exists in database
        print(f"=== Checking if ASIN '{target_asin}' exists ===")
        result = db.execute(text("SELECT asin, title FROM product WHERE asin = :asin"), {"asin": target_asin})
        product = result.fetchone()
        
        if product:
            print(f"✅ ASIN found in database: {product[0]}")
            print(f"   Title: {product[1]}")
        else:
            print(f"❌ ASIN '{target_asin}' not found in database")
            
            # Check for similar ASINs
            result = db.execute(text("SELECT asin, title FROM product WHERE asin ILIKE :asin LIMIT 5"), {"asin": f"%{target_asin}%"})
            similar = result.fetchall()
            if similar:
                print(f"   Similar ASINs found:")
                for asin, title in similar:
                    print(f"   - {asin}: {title[:50]}...")
            else:
                print(f"   No similar ASINs found")
        
        # Test search with exact ASIN
        print(f"\n=== Testing search with exact ASIN: '{target_asin}' ===")
        results, count = product_crud.get_multi(db, query=target_asin, page=1, page_size=5)
        print(f"Search results: {count} total")
        for i, product in enumerate(results):
            print(f"  {i+1}. ASIN: {product.asin}, Title: {product.title[:50]}...")
        
        # Test direct SQL search
        print(f"\n=== Direct SQL search ===")
        result = db.execute(text("SELECT asin, title FROM product WHERE asin ILIKE :asin"), {"asin": f"%{target_asin}%"})
        sql_results = result.fetchall()
        print(f"Direct SQL results: {len(sql_results)}")
        for i, (asin, title) in enumerate(sql_results):
            print(f"  {i+1}. ASIN: {asin}, Title: {title[:50]}...")
        
        # Test case sensitivity
        print(f"\n=== Testing case sensitivity ===")
        result = db.execute(text("SELECT asin, title FROM product WHERE asin = :asin"), {"asin": target_asin.lower()})
        lower_result = result.fetchone()
        print(f"Lowercase search: {'Found' if lower_result else 'Not found'}")
        
        result = db.execute(text("SELECT asin, title FROM product WHERE asin = :asin"), {"asin": target_asin.upper()})
        upper_result = result.fetchone()
        print(f"Uppercase search: {'Found' if upper_result else 'Not found'}")
        
    except Exception as e:
        print(f"Error testing specific ASIN: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_specific_asin() 