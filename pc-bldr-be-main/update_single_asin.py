#!/usr/bin/env python3
"""
Update single ASIN in database with Amazon parser
"""
import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.amazon_parser import AmazonParser
from app.models import Product
from app.db.session import SessionLocal
from sqlalchemy import select


async def update_single_asin(asin: str):
    """Update single ASIN in database"""
    print(f"🎯 Updating ASIN: {asin}")
    print("=" * 50)
    
    # Check if product exists in database
    with SessionLocal() as db:
        stmt = select(Product).where(Product.asin == asin)
        product = db.execute(stmt).scalar_one_or_none()
        
        if not product:
            print(f"❌ Product with ASIN {asin} not found in database")
            return False
        
        print(f"📦 Found product: {product.title[:60]}...")
        print(f"💰 Current price: ${product.price}" if product.price else "💰 Current price: not found")
        print(f"🖼️ Image: {'found' if product.low_image_url else 'not found'}")
        print()
    
    # Parse new data
    parser = AmazonParser()
    
    try:
        print("🚀 Parser starting...")
        await parser.setup()
        
        print("🔍 Extracting data from Amazon...")
        result = await parser.parse_product_data(asin)
        
        print("\n📊 PARSING RESULTS:")
        print("-" * 30)
        
        if result['price']:
            print(f"💰 New price: ${result['price']} {result.get('currency', 'USD')}")
            print(f"🌍 Source: {result.get('source_domain', 'Unknown')}")
        else:
            print("❌ Price not found")
        
        if result['rating']:
            print(f"⭐ Rating: {result['rating']}/5")
        else:
            print("❌ Rating not found")
            
        if result['low_image_url']:
            print(f"🖼️ Image: found")
        else:
            print("❌ Image not found")
        
        # Update database
        print("\n💾 DATABASE UPDATE:")
        print("-" * 30)
        
        updated_fields = []
        
        with SessionLocal() as db:
            # Get product again for update
            stmt = select(Product).where(Product.asin == asin)
            product = db.execute(stmt).scalar_one()
            
            # Update fields
            if result.get('price') is not None:
                old_price = product.price
                product.price = result['price']
                updated_fields.append(f"price: ${old_price} → ${result['price']}")
            
            if result.get('rating') is not None:
                old_rating = product.rating
                product.rating = result['rating']
                updated_fields.append(f"rating: {old_rating} → {result['rating']}")
                
            if result.get('low_image_url'):
                product.low_image_url = result['low_image_url']
                updated_fields.append("low image")
                
            if result.get('high_image_url'):
                product.high_image_url = result['high_image_url']
                updated_fields.append("high image")
            
            if updated_fields:
                db.commit()
                print("✅ Updated fields:")
                for field in updated_fields:
                    print(f"   • {field}")
                print(f"\n🎉 Product {asin} updated successfully!")
                return True
            else:
                print("❌ Nothing updated - data not found")
                return False
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
        
    finally:
        await parser.cleanup()


async def main():
    """Main function"""
    print("🔧 Updating single ASIN in database")
    print("=" * 50)
    
    # Get ASIN from command line or input
    if len(sys.argv) > 1:
        asin = sys.argv[1].strip()
    else:
        asin = input("Enter ASIN code: ").strip()
    
    if not asin:
        print("❌ ASIN code not provided")
        return
    
    print()
    success = await update_single_asin(asin)
    
    if success:
        print("\n🏁 Update completed successfully!")
    else:
        print("\n❌ Update failed")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Operation cancelled")
    except Exception as e:
        print(f"❌ Critical error: {e}")
        import traceback
        traceback.print_exc() 