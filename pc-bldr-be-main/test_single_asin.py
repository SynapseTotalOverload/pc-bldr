#!/usr/bin/env python3
"""
Test script for single ASIN image parsing
Usage: python test_single_asin.py <ASIN> [--save] [--debug]
"""

import sys
import asyncio
import logging
from app.services.amazon_parser import AmazonParser, test_and_save_single_asin, debug_single_asin

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def test_asin(asin: str):
    """Test image parsing for a single ASIN"""
    parser = AmazonParser()
    await parser.setup()
    
    try:
        logger.info(f"Testing ASIN: {asin}")
        result = await parser.parse_product_images(asin)
        
        print("\n" + "="*50)
        print("TEST RESULTS")
        print("="*50)
        print(f"ASIN: {result['asin']}")
        print(f"Low image URL: {result['low_image_url']}")
        print(f"High image URL: {result['high_image_url']}")
        print(f"Source domain: {result['source_domain']}")
        
        if result['high_image_url']:
            print("✅ SUCCESS: Found images!")
        else:
            print("❌ FAILED: No images found")
        print("="*50)
            
    except Exception as e:
        logger.error(f"Error testing ASIN {asin}: {e}")
    finally:
        await parser.cleanup()


def main():
    if len(sys.argv) < 2:
        print("Usage: python test_single_asin.py <ASIN> [--save] [--debug]")
        print("Example: python test_single_asin.py B08N5WRWNW")
        print("Example: python test_single_asin.py B08N5WRWNW --save")
        print("Example: python test_single_asin.py B08N5WRWNW --debug")
        sys.exit(1)
    
    asin = sys.argv[1]
    save_to_db = "--save" in sys.argv
    debug_mode = "--debug" in sys.argv
    
    if debug_mode:
        print(f"🔍 Debugging ASIN {asin}...")
        debug_single_asin(asin)
    elif save_to_db:
        print(f"Testing ASIN {asin} and saving to database...")
        test_and_save_single_asin(asin)
    else:
        print(f"Testing ASIN {asin}...")
        asyncio.run(test_asin(asin))


if __name__ == "__main__":
    main() 