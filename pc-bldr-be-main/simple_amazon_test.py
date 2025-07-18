#!/usr/bin/env python3
"""
Simple Amazon parser test - just ASIN input, price and image output
"""
import asyncio
import sys
import os

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.amazon_parser import AmazonParser


async def test_asin(asin: str):
    """Test parsing a single ASIN and show price + images"""
    print(f"🔍 Тестування ASIN: {asin}")
    print("=" * 50)
    
    parser = AmazonParser()
    
    try:
        # Setup parser
        await parser.setup()
        
        # Parse the product
        result = await parser.parse_product_data(asin)
        
        # Show results
        print(f"📦 ASIN: {result['asin']}")
        
        if result['price']:
            print(f"💰 Ціна: ${result['price']} USD")
            print(f"🌍 Джерело: {result.get('source_domain', 'Невідомо')}")
            print(f"💱 Валюта: {result.get('currency', 'USD')}")
        else:
            print("❌ Ціна не знайдена")
        
        if result['rating']:
            print(f"⭐ Рейтинг: {result['rating']}/5")
        else:
            print("❌ Рейтинг не знайдений")
            
        if result['low_image_url']:
            print(f"🖼️ Мале зображення: {result['low_image_url']}")
        else:
            print("❌ Мале зображення не знайдене")
            
        if result['high_image_url']:
            print(f"🖼️ Велике зображення: {result['high_image_url']}")
        else:
            print("❌ Велике зображення не знайдене")
        
        # Success summary
        found_items = []
        if result['price']: found_items.append("ціна")
        if result['rating']: found_items.append("рейтинг")
        if result['low_image_url']: found_items.append("зображення")
        
        if found_items:
            print(f"\n✅ Знайдено: {', '.join(found_items)}")
        else:
            print(f"\n❌ Нічого не знайдено")
            
        return result
        
    except Exception as e:
        print(f"❌ Помилка: {e}")
        return None
        
    finally:
        await parser.cleanup()


async def main():
    """Main function"""
    print("🚀 Простий Amazon Parser Test")
    print("=" * 50)
    
    # Default ASIN for testing
    default_asin = "B081YW31GR"
    
    # Ask for ASIN
    user_input = input(f"Введіть ASIN код (або Enter для {default_asin}): ").strip()
    asin = user_input if user_input else default_asin
    
    print()
    await test_asin(asin)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Тест перервано")
    except Exception as e:
        print(f"❌ Помилка: {e}") 