#!/usr/bin/env python3
"""
Test Amazon image parsing only
"""

import asyncio
import logging
from app.services.amazon_parser import AmazonParser

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

async def test_image_parsing():
    """Test parsing images from Amazon products"""
    test_asins = ["B083HZHPW6"]  # Test products
    
    logger.info("🧪 Testing Amazon image parsing")
    logger.info("=" * 50)
    
    parser = AmazonParser()
    await parser.setup()
    
    try:
        for asin in test_asins:
            logger.info(f"\n🔍 Testing ASIN: {asin}")
            logger.info("-" * 30)
            
            result = await parser.parse_product_images(asin)
            
            if result.get('high_image_url') or result.get('low_image_url'):
                logger.info(f"✅ SUCCESS - Images found for {asin}")
                
                if result.get('high_image_url'):
                    logger.info(f"🖼️  High quality: {result['high_image_url'][:60]}...")
                
                if result.get('low_image_url'):
                    logger.info(f"📸 Thumbnail: {result['low_image_url'][:60]}...")
                    
                logger.info(f"🌐 Source: {result.get('source_domain', 'Unknown')}")
                
            else:
                logger.warning(f"❌ FAILED - No images found for {asin}")
                
    except Exception as e:
        logger.error(f"Test failed: {e}")
    finally:
        await parser.cleanup()
        logger.info("\n🧹 Cleanup complete")

def run_test():
    """Run the image parsing test"""
    asyncio.run(test_image_parsing())

if __name__ == "__main__":
    run_test() 