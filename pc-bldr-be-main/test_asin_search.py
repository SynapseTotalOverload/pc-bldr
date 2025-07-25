#!/usr/bin/env python3
"""
Test script for ASIN search functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.crud.product import product_crud
from sqlalchemy import text

def test_asin_search():
    """Test ASIN search functionality"""
    db = SessionLocal()
    try:
        # Get some sample ASINs
        result = db.execute(text("SELECT asin, title FROM product LIMIT 5"))
        samples = result.fetchall()
        
        print("=== Sample ASINs ===")
        for asin, title in samples:
            print(f"ASIN: {asin}, Title: {title[:50]}...")
        
        # Test search by ASIN
        if samples:
            test_asin = samples[0][0]
            print(f"\n=== Testing search by ASIN: {test_asin} ===")
            results, count = product_crud.get_multi(db, query=test_asin, page=1, page_size=5)
            print(f"Search by ASIN '{test_asin}': {count} total results")
            for i, product in enumerate(results):
                print(f"  {i+1}. ASIN: {product.asin}, Title: {product.title[:50]}...")
        
        # Test search by partial ASIN
        if samples:
            partial_asin = samples[0][0][:4]  # First 4 characters
            print(f"\n=== Testing search by partial ASIN: {partial_asin} ===")
            results, count = product_crud.get_multi(db, query=partial_asin, page=1, page_size=5)
            print(f"Search by partial ASIN '{partial_asin}': {count} total results")
            for i, product in enumerate(results):
                print(f"  {i+1}. ASIN: {product.asin}, Title: {product.title[:50]}...")
        
        # Test search by common ASIN pattern
        print(f"\n=== Testing search by 'B08' (common ASIN prefix) ===")
        results, count = product_crud.get_multi(db, query="B08", page=1, page_size=5)
        print(f"Search by 'B08': {count} total results")
        for i, product in enumerate(results):
            print(f"  {i+1}. ASIN: {product.asin}, Title: {product.title[:50]}...")
        
        # Test multi-word search with ASIN and brand
        print(f"\n=== Testing multi-word search: 'B08 AMD' ===")
        results, count = product_crud.get_multi(db, query="B08 AMD", page=1, page_size=5)
        print(f"Search by 'B08 AMD': {count} total results")
        for i, product in enumerate(results):
            print(f"  {i+1}. ASIN: {product.asin}, Title: {product.title[:50]}...")
        
        # Test multi-word search with ASIN and Intel
        print(f"\n=== Testing multi-word search: 'B08 Intel' ===")
        results, count = product_crud.get_multi(db, query="B08 Intel", page=1, page_size=5)
        print(f"Search by 'B08 Intel': {count} total results")
        for i, product in enumerate(results):
            print(f"  {i+1}. ASIN: {product.asin}, Title: {product.title[:50]}...")
        
        # Test direct SQL query to compare
        print(f"\n=== Direct SQL query for ASIN search ===")
        result = db.execute(text("SELECT asin, title FROM product WHERE asin ILIKE '%B08%' LIMIT 5"))
        sql_results = result.fetchall()
        print(f"Direct SQL search by 'B08': {len(sql_results)} results")
        for i, (asin, title) in enumerate(sql_results):
            print(f"  {i+1}. ASIN: {asin}, Title: {title[:50]}...")
        
    except Exception as e:
        print(f"Error testing ASIN search: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_asin_search()
