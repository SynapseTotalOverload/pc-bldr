import asyncio
import time
import logging
import re
import json
import random
from typing import Optional, Dict, Any, List
from sqlalchemy import select
from playwright.async_api import async_playwright, Browser, Page

from app.models import Product
from app.db.session import SessionLocal

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class AmazonParser:
    def __init__(self):
        """
        Initialize Amazon parser for image URLs only
        """
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        
        # Simple Amazon URLs
        self.amazon_urls = [
            'https://www.amazon.com/dp/{asin}',
            'https://m.amazon.com/dp/{asin}',
        ]
        
    async def setup(self):
        """Initialize Playwright browser with optimized settings for speed"""
        self.playwright = await async_playwright().start()
        
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-ipc-flooding-protection',
                '--disable-hang-monitor',
                '--disable-prompt-on-repost',
                '--disable-domain-reliability',
                '--disable-component-extensions-with-background-pages',
                '--disable-default-apps',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-background-networking',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-sync-preferences',
                '--disable-default-apps',
                '--disable-extensions-except',
                '--disable-logging',
                '--disable-remote-fonts',
                '--disable-speech-api',
                '--disable-webgl',
                '--disable-webgl2',
                '--disable-3d-apis',
                '--disable-accelerated-2d-canvas',
                '--disable-accelerated-jpeg-decoding',
                '--disable-accelerated-mjpeg-decode',
                '--disable-accelerated-video-decode',
                '--disable-gpu-sandbox',
                '--disable-software-rasterizer',
                '--disable-threaded-animation',
                '--disable-threaded-scrolling',
                '--disable-checker-imaging',
                '--disable-image-animation-resync',
                '--disable-new-content-rendering-timeout',
                '--disable-partial-raster',
                '--disable-zero-copy',
                '--ignore-gpu-blacklist',
                '--ignore-certificate-errors',
                '--ignore-ssl-errors',
                '--ignore-certificate-errors-spki-list',
                '--allow-running-insecure-content',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--force-color-profile=srgb',
                '--metrics-recording-only',
                '--no-default-browser-check',
                '--no-first-run',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-plugins',
                '--disable-css',
                '--disable-fonts',
                '--disable-animations',
                '--disable-video',
                '--disable-audio'
            ]
        )
        
        context = await self.browser.new_context(
            viewport={'width': 800, 'height': 600},  # Even smaller viewport
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            bypass_csp=True,
            ignore_https_errors=True
        )
        
        self.page = await context.new_page()
        
        # Set very fast timeouts
        self.page.set_default_timeout(5000)  # 5 seconds
        self.page.set_default_navigation_timeout(5000)
        
        logger.info("✅ Browser setup complete with speed optimizations")
        
    async def cleanup(self):
        """Close browser and cleanup resources"""
        if self.page:
            await self.page.close()
        if self.browser:
            await self.browser.close()
        if hasattr(self, 'playwright'):
            await self.playwright.stop()
    
    async def parse_product_images(self, asin: str) -> Dict[str, Any]:
        """Parse only product image URLs"""
        logger.info(f"Parsing images for product: {asin}")
        
        try:
            result = await self._try_amazon_urls(asin)
            if result and (result.get('low_image_url') or result.get('high_image_url')):
                logger.info(f"Successfully found images for {asin}")
                return result
            else:
                logger.warning(f"No images found for {asin}")
        except Exception as e:
            logger.debug(f"Parsing failed: {e}")
        
        return {
            'asin': asin,
            'low_image_url': None,
            'high_image_url': None,
            'source_domain': None
        }
    
    async def _try_amazon_urls(self, asin: str) -> Dict[str, Any]:
        """Try Amazon URLs to get images with optimized loading"""
        for url_template in self.amazon_urls:
            url = url_template.format(asin=asin)
            
            try:
                await self.page.goto(url, timeout=5000)  # 5 seconds
                
                # Wait for page to load completely
                await self.page.wait_for_load_state('domcontentloaded', timeout=3000)
                
                # Wait a bit more for images to load
                await asyncio.sleep(1.0)
                
                title = await self.page.title()
                
                # Check if page loaded successfully
                if 'robot' not in title.lower() and 'captcha' not in title.lower() and 'page not found' not in title.lower():
                    image_urls = await self._extract_image_urls()
                    
                    return {
                        'asin': asin,
                        'low_image_url': image_urls.get('low'),
                        'high_image_url': image_urls.get('high'),
                        'source_domain': 'amazon.com'
                    }
                    
            except Exception as e:
                logger.debug(f"Failed with URL {url}: {e}")
                continue
        
        raise Exception("All Amazon URLs failed")
    
    async def _extract_image_urls(self) -> Dict[str, Optional[str]]:
        """Extract image URLs from Amazon product page using fastest methods only"""
        image_urls = {'low': None, 'high': None}
        
        # Method 1: Try HTML content parsing (fastest)
        result = await self._extract_from_html()
        if result['high']:
            return result
        
        # Method 2: Try DOM selectors (fallback)
        result = await self._extract_from_dom()
        if result['high']:
            return result
        
        logger.warning("❌ No Amazon images found")
        return image_urls
    
    async def _extract_from_dom(self) -> Dict[str, Optional[str]]:
        """Extract images using DOM selectors"""
        image_urls = {'low': None, 'high': None}
        
        try:
            # Try main image selectors
            main_selectors = [
                '#landingImage',
                '#imgBlkFront',
                '.a-dynamic-image',
                '#main-image',
                '.a-dynamic-image-container img',
                '#main-image-container img',
                '.a-image-container img',
                '[data-image-latency="s-product-image"]'
            ]
            
            for selector in main_selectors:
                try:
                    img_locator = self.page.locator(selector).first
                    if await img_locator.count() > 0 and await img_locator.is_visible():
                        src = await img_locator.get_attribute('src')
                        data_src = await img_locator.get_attribute('data-src')
                        data_old_hires = await img_locator.get_attribute('data-old-hires')
                        
                        # Use data-old-hires if available, then data-src, then src
                        image_url = data_old_hires or data_src or src
                        
                        if image_url and 'amazon' in image_url:
                            logger.info(f"✅ Found image with DOM selector: {selector}")
                            image_urls['high'] = image_url
                            image_urls['low'] = self._create_thumbnail_url(image_url)
                            return image_urls
                            
                except Exception as e:
                    logger.debug(f"DOM extraction failed with {selector}: {e}")
                    continue
                    
        except Exception as e:
            logger.debug(f"DOM extraction failed: {e}")
        
        return image_urls
    
    async def _extract_from_html(self) -> Dict[str, Optional[str]]:
        """Extract images from HTML content using regex"""
        image_urls = {'low': None, 'high': None}
        
        try:
            # Get page HTML content
            html_content = await self.page.content()
            
            # Search for Amazon image URLs in HTML using regex
            import re
            
            # Pattern for Amazon image URLs
            amazon_image_patterns = [
                # Direct Amazon image URLs
                r'https://m\.media-amazon\.com/images/I/[A-Z0-9]+\._AC_[A-Z0-9_]+\.jpg',
                r'https://images-na\.ssl-images-amazon\.com/images/I/[A-Z0-9]+\._AC_[A-Z0-9_]+\.jpg',
                r'https://m\.media-amazon\.com/images/I/[A-Z0-9]+\.jpg',
                r'https://images-na\.ssl-images-amazon\.com/images/I/[A-Z0-9]+\.jpg',
                
                # URLs in src attributes
                r'src="(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'src="(https://images-na\.ssl-images-amazon\.com/images/I/[^"]+)"',
                
                # URLs in data-src attributes
                r'data-src="(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'data-src="(https://images-na\.ssl-images-amazon\.com/images/I/[^"]+)"',
                
                # URLs in data-old-hires attributes
                r'data-old-hires="(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'data-old-hires="(https://images-na\.ssl-images-amazon\.com/images/I/[^"]+)"',
                
                # URLs in data-a-dynamic-image (JSON format)
                r'data-a-dynamic-image="([^"]+)"',
                
                # URLs in JSON data
                r'"large":"(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'"large":"(https://images-na\.ssl-images-amazon\.com/images/I/[^"]+)"',
                r'"hiRes":"(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'"hiRes":"(https://images-na\.ssl-images-amazon\.com/images/I/[^"]+)"',
                
                # More specific patterns
                r'https://m\.media-amazon\.com/images/I/[A-Z0-9]+\._AC_SL\d+_\.jpg',
                r'https://images-na\.ssl-images-amazon\.com/images/I/[A-Z0-9]+\._AC_SL\d+_\.jpg',
                r'https://m\.media-amazon\.com/images/I/[A-Z0-9]+\._AC_UL\d+_\.jpg',
                r'https://images-na\.ssl-images-amazon\.com/images/I/[A-Z0-9]+\._AC_UL\d+_\.jpg',
                
                # Generic Amazon image patterns (more permissive)
                r'https://[^"]*amazon[^"]*images[^"]*\.jpg',
                r'https://[^"]*amazon[^"]*images[^"]*\.jpeg',
                r'https://[^"]*amazon[^"]*images[^"]*\.png',
                r'https://[^"]*amazon[^"]*images[^"]*\.webp',
                
                # Look for any image URL containing amazon
                r'https://[^"]*amazon[^"]*\.(jpg|jpeg|png|webp)',
                
                # Look for image URLs in any attribute
                r'[a-zA-Z-]+="[^"]*https://[^"]*amazon[^"]*\.(jpg|jpeg|png|webp)[^"]*"'
            ]
            
            found_images = []
            
            for pattern in amazon_image_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    # Clean up the URL
                    if match.startswith('"'):
                        match = match[1:]
                    if match.endswith('"'):
                        match = match[:-1]
                    
                    # Handle data-a-dynamic-image JSON format
                    if pattern == r'data-a-dynamic-image="([^"]+)"':
                        try:
                            import json
                            dynamic_data = json.loads(match)
                            for url in dynamic_data.keys():
                                if (url and 
                                    'amazon' in url.lower() and
                                    not url.endswith('.gif') and
                                    not 'sprite' in url.lower() and
                                    not 'icon' in url.lower() and
                                    len(url) > 50):
                                    found_images.append(url)
                        except json.JSONDecodeError:
                            continue
                    else:
                        # Skip small images, sprites, and gifs
                        if (match and 
                            'amazon' in match.lower() and
                            not match.endswith('.gif') and
                            not 'sprite' in match.lower() and
                            not 'icon' in match.lower() and
                            len(match) > 50):  # Skip very short URLs
                            
                            found_images.append(match)
            
            # Remove duplicates while preserving order
            unique_images = []
            seen = set()
            for img in found_images:
                if img not in seen:
                    unique_images.append(img)
                    seen.add(img)
            
            logger.info(f"Found {len(unique_images)} unique Amazon images in HTML")
            
            if unique_images:
                # Try to find the main product image
                main_image = None
                
                # Look for images with specific keywords in URL
                for img in unique_images:
                    if any(keyword in img.lower() for keyword in ['main', 'primary', 'landing', 'large', 'hiRes']):
                        main_image = img
                        break
                
                # If no main image found, take the first one
                if not main_image and unique_images:
                    main_image = unique_images[0]
                
                if main_image:
                    logger.info(f"✅ Found main product image from HTML")
                    image_urls['high'] = main_image
                    image_urls['low'] = self._create_thumbnail_url(main_image)
                    return image_urls
                    
        except Exception as e:
            logger.debug(f"HTML extraction failed: {e}")
        
        return image_urls
    
    async def _extract_from_network(self) -> Dict[str, Optional[str]]:
        """Extract images from network requests"""
        image_urls = {'low': None, 'high': None}
        
        try:
            # Get all image requests from network
            resources = await self.page.context.route("**/*")
            
            amazon_images = []
            for resource in resources:
                url = resource.url
                if ('amazon' in url and 
                    ('images-na.ssl-images-amazon.com' in url or 
                     'm.media-amazon.com' in url) and
                    any(ext in url for ext in ['.jpg', '.jpeg', '.png']) and
                    not url.endswith('.gif') and
                    not 'sprite' in url.lower()):
                    amazon_images.append(url)
            
            if amazon_images:
                # Take the first Amazon image found
                main_image = amazon_images[0]
                logger.info(f"✅ Found image from network requests")
                image_urls['high'] = main_image
                image_urls['low'] = self._create_thumbnail_url(main_image)
                return image_urls
                
        except Exception as e:
            logger.debug(f"Network extraction failed: {e}")
        
        return image_urls
    
    def _create_thumbnail_url(self, original_url: str) -> str:
        """Create thumbnail version of image URL"""
        try:
            if '._' in original_url:
                # Replace existing size modifier
                thumbnail_url = re.sub(r'(\._[A-Z]+\d+_)', '._AC_SX300_SY300_', original_url)
            else:
                # Add size modifier
                base, ext = original_url.rsplit('.', 1) if '.' in original_url else (original_url, 'jpg')
                thumbnail_url = f"{base}._AC_SX300_SY300_.{ext}"
            
            logger.info(f"📸 Created thumbnail: {thumbnail_url[:80]}...")
            return thumbnail_url
            
        except Exception as e:
            logger.debug(f"Thumbnail creation failed: {e}")
            return original_url

    async def parse_product_images_ultra_fast(self, asin: str) -> Dict[str, Any]:
        """Ultra-fast parsing only product image URLs"""
        logger.info(f"Ultra-fast parsing images for product: {asin}")
        
        try:
            result = await self._try_amazon_urls_ultra_fast(asin)
            if result and (result.get('low_image_url') or result.get('high_image_url')):
                logger.info(f"Successfully found images for {asin}")
                return result
            else:
                logger.warning(f"No images found for {asin}")
        except Exception as e:
            logger.debug(f"Ultra-fast parsing failed: {e}")
        
        return {
            'asin': asin,
            'low_image_url': None,
            'high_image_url': None,
            'source_domain': None
        }
    
    async def _try_amazon_urls_ultra_fast(self, asin: str) -> Dict[str, Any]:
        """Ultra-fast try Amazon URLs to get images"""
        for url_template in self.amazon_urls:
            url = url_template.format(asin=asin)
            
            try:
                await self.page.goto(url, timeout=3000)  # Very fast timeout
                
                # Minimal wait
                await asyncio.sleep(0.2)
                
                title = await self.page.title()
                
                # Quick check if page loaded
                if 'robot' not in title.lower() and 'captcha' not in title.lower():
                    image_urls = await self._extract_image_urls_ultra_fast()
                    
                    return {
                        'asin': asin,
                        'low_image_url': image_urls.get('low'),
                        'high_image_url': image_urls.get('high'),
                        'source_domain': 'amazon.com'
                    }
                    
            except Exception as e:
                logger.debug(f"Ultra-fast failed with URL {url}: {e}")
                continue
        
        raise Exception("All Amazon URLs failed")
    
    async def _extract_image_urls_ultra_fast(self) -> Dict[str, Optional[str]]:
        """Ultra-fast extract image URLs from HTML content only"""
        image_urls = {'low': None, 'high': None}
        
        try:
            # Get page HTML content
            html_content = await self.page.content()
            
            # Search for Amazon image URLs in HTML using regex
            import re
            
            # Fast patterns only
            fast_patterns = [
                r'https://m\.media-amazon\.com/images/I/[A-Z0-9]+\._AC_[A-Z0-9_]+\.jpg',
                r'https://images-na\.ssl-images-amazon\.com/images/I/[A-Z0-9]+\._AC_[A-Z0-9_]+\.jpg',
                r'data-old-hires="(https://m\.media-amazon\.com/images/I/[^"]+)"',
                r'data-old-hires="(https://images-na\.ssl-images-amazon\.com/images/I/[^"]+)"',
                r'https://[^"]*amazon[^"]*images[^"]*\.jpg'
            ]
            
            found_images = []
            
            for pattern in fast_patterns:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    # Clean up the URL
                    if match.startswith('"'):
                        match = match[1:]
                    if match.endswith('"'):
                        match = match[:-1]
                    
                    # Quick validation
                    if (match and 
                        'amazon' in match.lower() and
                        not match.endswith('.gif') and
                        len(match) > 50):
                        found_images.append(match)
                        break  # Take first match for speed
            
            if found_images:
                main_image = found_images[0]
                logger.info(f"✅ Found image ultra-fast")
                image_urls['high'] = main_image
                image_urls['low'] = self._create_thumbnail_url(main_image)
                return image_urls
                    
        except Exception as e:
            logger.debug(f"Ultra-fast extraction failed: {e}")
        
        return image_urls


async def actualize_images_with_playwright():
    """Main function to actualize product images only"""
    logger.info("Starting image actualization for products")
    
    parser = AmazonParser()
    await parser.setup()
    
    try:
        with SessionLocal() as db:
            # Get products without image data, sorted by ID in ascending order
            stmt = select(Product).where(
                (Product.low_image_url == None) |
                (Product.high_image_url == None)
            ).order_by(Product.id.asc())
            products: List[Product] = db.execute(stmt).scalars().all()
            
            if not products:
                logger.info("No products found to actualize images.")
                return

            logger.info(f"Found {len(products)} products needing images")

            # Process in larger batches with parallel processing
            batch_size = 100  # Increased from 50
            updated_count = 0
            successful_count = 0
            images_found_count = 0
            
            for i in range(0, len(products), batch_size):
                batch = products[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                total_batches = (len(products) + batch_size - 1) // batch_size
                
                logger.info(f"Processing batch {batch_num}/{total_batches}")
                
                # Process products in parallel within batch
                tasks = []
                for product in batch:
                    task = _process_single_product(parser, product)
                    tasks.append(task)
                
                # Wait for all products in batch to complete
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                # Process results
                for product, result in zip(batch, results):
                    try:
                        if isinstance(result, Exception):
                            logger.error(f"Error processing {product.asin}: {result}")
                            updated_count += 1
                            continue
                        
                        # Track if we got any images
                        got_images = False
                        
                        # Update product images
                        if result.get('low_image_url'):
                            product.low_image_url = result['low_image_url']
                            got_images = True
                            
                        if result.get('high_image_url'):
                            product.high_image_url = result['high_image_url']
                            got_images = True
                        
                        if got_images:
                            successful_count += 1
                            images_found_count += 1
                            logger.info(f"✅ Images found for {product.asin}")
                        else:
                            logger.warning(f"❌ No images found for {product.asin}")
                        
                        updated_count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing {product.asin}: {e}")
                        updated_count += 1
                        continue
                
                db.commit()
                logger.info(f"Batch {batch_num} completed. Images found: {images_found_count}/{updated_count}")
                
                # Minimal delay between batches
                if batch_num < total_batches:
                    delay = random.uniform(0.1, 0.3)  # Very short delay
                    logger.info(f"Sleeping {delay:.1f} seconds between batches...")
                    await asyncio.sleep(delay)
            
            success_rate = (successful_count / updated_count * 100) if updated_count > 0 else 0
            logger.info(f"Image actualization completed!")
            logger.info(f"Processed: {updated_count} products")
            logger.info(f"Successful: {successful_count} products ({success_rate:.1f}%)")
            logger.info(f"Images found: {images_found_count} products")
            
    except Exception as e:
        logger.error(f"Critical error: {e}")
        raise
    finally:
        await parser.cleanup()


async def actualize_images_with_multiple_browsers():
    """Main function to actualize product images with multiple browser instances"""
    logger.info("Starting image actualization with multiple browsers")
    
    try:
        with SessionLocal() as db:
            # Get products without image data, sorted by ID in ascending order
            stmt = select(Product).where(
                (Product.low_image_url == None) |
                (Product.high_image_url == None)
            ).order_by(Product.id.asc())
            products: List[Product] = db.execute(stmt).scalars().all()
            
            if not products:
                logger.info("No products found to actualize images.")
                return

            logger.info(f"Found {len(products)} products needing images")

            # Process with multiple browser instances
            num_browsers = 5  # Number of parallel browser instances
            batch_size = 20  # Smaller batches for multiple browsers
            updated_count = 0
            successful_count = 0
            images_found_count = 0
            
            for i in range(0, len(products), batch_size * num_browsers):
                batch = products[i:i + batch_size * num_browsers]
                batch_num = (i // (batch_size * num_browsers)) + 1
                total_batches = (len(products) + batch_size * num_browsers - 1) // (batch_size * num_browsers)
                
                logger.info(f"Processing batch {batch_num}/{total_batches}")
                
                # Create multiple browser instances
                browsers = []
                for _ in range(num_browsers):
                    parser = AmazonParser()
                    await parser.setup()
                    browsers.append(parser)
                
                # Distribute products among browsers
                tasks = []
                for j, product in enumerate(batch):
                    browser_index = j % num_browsers
                    parser = browsers[browser_index]
                    task = _process_single_product(parser, product)
                    tasks.append(task)
                
                # Wait for all products in batch to complete
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                # Process results
                for product, result in zip(batch, results):
                    try:
                        if isinstance(result, Exception):
                            logger.error(f"Error processing {product.asin}: {result}")
                            updated_count += 1
                            continue
                        
                        # Track if we got any images
                        got_images = False
                        
                        # Update product images
                        if result.get('low_image_url'):
                            product.low_image_url = result['low_image_url']
                            got_images = True
                            
                        if result.get('high_image_url'):
                            product.high_image_url = result['high_image_url']
                            got_images = True
                        
                        if got_images:
                            successful_count += 1
                            images_found_count += 1
                            logger.info(f"✅ Images found for {product.asin}")
                        else:
                            logger.warning(f"❌ No images found for {product.asin}")
                        
                        updated_count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing {product.asin}: {e}")
                        updated_count += 1
                        continue
                
                # Cleanup browsers
                for browser in browsers:
                    await browser.cleanup()
                
                db.commit()
                logger.info(f"Batch {batch_num} completed. Images found: {images_found_count}/{updated_count}")
                
                # Minimal delay between batches
                if batch_num < total_batches:
                    delay = random.uniform(0.1, 0.2)
                    logger.info(f"Sleeping {delay:.1f} seconds between batches...")
                    await asyncio.sleep(delay)
            
            success_rate = (successful_count / updated_count * 100) if updated_count > 0 else 0
            logger.info(f"Image actualization completed!")
            logger.info(f"Processed: {updated_count} products")
            logger.info(f"Successful: {successful_count} products ({success_rate:.1f}%)")
            logger.info(f"Images found: {images_found_count} products")
            
    except Exception as e:
        logger.error(f"Critical error: {e}")
        raise


async def _process_single_product(parser: AmazonParser, product: Product) -> Dict[str, Any]:
    """Process a single product with no delays for maximum speed"""
    try:
        logger.info(f"Processing: {product.asin}")
        result = await parser.parse_product_images(product.asin)
        
        # No delay between products for maximum speed
        return result
        
    except Exception as e:
        logger.error(f"Error processing {product.asin}: {e}")
        return {
            'asin': product.asin,
            'low_image_url': None,
            'high_image_url': None,
            'source_domain': None
        }


async def actualize_images_ultra_fast():
    """Ultra-fast image actualization with maximum optimization"""
    logger.info("Starting ULTRA-FAST image actualization")
    
    try:
        with SessionLocal() as db:
            # Get products without image data, sorted by ID in ascending order
            stmt = select(Product).where(
                (Product.low_image_url == None) |
                (Product.high_image_url == None)
            ).order_by(Product.id.asc())
            products: List[Product] = db.execute(stmt).scalars().all()
            
            if not products:
                logger.info("No products found to actualize images.")
                return

            logger.info(f"Found {len(products)} products needing images")

            # Ultra-fast processing with minimal delays
            batch_size = 200  # Much larger batches
            updated_count = 0
            successful_count = 0
            images_found_count = 0
            
            for i in range(0, len(products), batch_size):
                batch = products[i:i + batch_size]
                batch_num = (i // batch_size) + 1
                total_batches = (len(products) + batch_size - 1) // batch_size
                
                logger.info(f"Processing batch {batch_num}/{total_batches}")
                
                # Process products in parallel within batch
                tasks = []
                for product in batch:
                    task = _process_single_product_ultra_fast(product)
                    tasks.append(task)
                
                # Wait for all products in batch to complete
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                # Process results
                for product, result in zip(batch, results):
                    try:
                        if isinstance(result, Exception):
                            logger.error(f"Error processing {product.asin}: {result}")
                            updated_count += 1
                            continue
                        
                        # Track if we got any images
                        got_images = False
                        
                        # Update product images
                        if result.get('low_image_url'):
                            product.low_image_url = result['low_image_url']
                            got_images = True
                            
                        if result.get('high_image_url'):
                            product.high_image_url = result['high_image_url']
                            got_images = True
                        
                        if got_images:
                            successful_count += 1
                            images_found_count += 1
                            logger.info(f"✅ Images found for {product.asin}")
                        else:
                            logger.warning(f"❌ No images found for {product.asin}")
                        
                        updated_count += 1
                        
                    except Exception as e:
                        logger.error(f"Error processing {product.asin}: {e}")
                        updated_count += 1
                        continue
                
                db.commit()
                logger.info(f"Batch {batch_num} completed. Images found: {images_found_count}/{updated_count}")
                
                # No delay between batches for ultra-fast processing
                if batch_num < total_batches:
                    logger.info("Continuing to next batch immediately...")
            
            success_rate = (successful_count / updated_count * 100) if updated_count > 0 else 0
            logger.info(f"ULTRA-FAST image actualization completed!")
            logger.info(f"Processed: {updated_count} products")
            logger.info(f"Successful: {successful_count} products ({success_rate:.1f}%)")
            logger.info(f"Images found: {images_found_count} products")
            
    except Exception as e:
        logger.error(f"Critical error: {e}")
        raise


async def _process_single_product_ultra_fast(product: Product) -> Dict[str, Any]:
    """Process a single product with ultra-fast settings"""
    try:
        # Create a new parser instance for each product (minimal overhead)
        parser = AmazonParser()
        await parser.setup()
        
        logger.info(f"Processing: {product.asin}")
        result = await parser.parse_product_images_ultra_fast(product.asin)
        
        await parser.cleanup()
        return result
        
    except Exception as e:
        logger.error(f"Error processing {product.asin}: {e}")
        return {
            'asin': product.asin,
            'low_image_url': None,
            'high_image_url': None,
            'source_domain': None
        }


def run_image_actualization():
    """Synchronous wrapper to run the async image actualization"""
    asyncio.run(actualize_images_with_playwright())


def run_image_actualization_fast():
    """Synchronous wrapper to run the async image actualization with multiple browsers"""
    asyncio.run(actualize_images_with_multiple_browsers())


def run_image_actualization_ultra_fast():
    """Synchronous wrapper to run the ultra-fast async image actualization"""
    asyncio.run(actualize_images_ultra_fast())


def test_single_asin(asin: str):
    """Test image parsing for a single ASIN code"""
    async def _test():
        parser = AmazonParser()
        await parser.setup()
        
        try:
            logger.info(f"Testing ASIN: {asin}")
            result = await parser.parse_product_images(asin)
            
            logger.info("=== TEST RESULTS ===")
            logger.info(f"ASIN: {result['asin']}")
            logger.info(f"Low image URL: {result['low_image_url']}")
            logger.info(f"High image URL: {result['high_image_url']}")
            logger.info(f"Source domain: {result['source_domain']}")
            
            if result['high_image_url']:
                logger.info("✅ SUCCESS: Found images!")
            else:
                logger.info("❌ FAILED: No images found")
                
        except Exception as e:
            logger.error(f"Error testing ASIN {asin}: {e}")
        finally:
            await parser.cleanup()
    
    asyncio.run(_test())


def test_and_save_single_asin(asin: str):
    """Test image parsing for a single ASIN and save to database"""
    async def _test_and_save():
        parser = AmazonParser()
        await parser.setup()
        
        try:
            logger.info(f"Testing ASIN: {asin}")
            result = await parser.parse_product_images(asin)
            
            logger.info("=== TEST RESULTS ===")
            logger.info(f"ASIN: {result['asin']}")
            logger.info(f"Low image URL: {result['low_image_url']}")
            logger.info(f"High image URL: {result['high_image_url']}")
            logger.info(f"Source domain: {result['source_domain']}")
            
            if result['high_image_url']:
                logger.info("✅ SUCCESS: Found images!")
                
                # Save to database
                with SessionLocal() as db:
                    product = db.query(Product).filter(Product.asin == asin).first()
                    if product:
                        if result.get('low_image_url'):
                            product.low_image_url = result['low_image_url']
                        if result.get('high_image_url'):
                            product.high_image_url = result['high_image_url']
                        
                        db.commit()
                        logger.info(f"✅ Saved images to database for ASIN: {asin}")
                    else:
                        logger.warning(f"❌ Product with ASIN {asin} not found in database")
            else:
                logger.info("❌ FAILED: No images found")
                
        except Exception as e:
            logger.error(f"Error testing ASIN {asin}: {e}")
        finally:
            await parser.cleanup()
    
    asyncio.run(_test_and_save())


def debug_single_asin(asin: str):
    """Debug image parsing for a single ASIN with detailed logging"""
    async def _debug():
        parser = AmazonParser()
        await parser.setup()
        
        try:
            logger.info(f"🔍 DEBUGGING ASIN: {asin}")
            
            # Try each URL template
            for url_template in parser.amazon_urls:
                url = url_template.format(asin=asin)
                logger.info(f"🔗 Trying URL: {url}")
                
                try:
                    await parser.page.goto(url, timeout=5000)
                    await parser.page.wait_for_load_state('domcontentloaded', timeout=3000)
                    await asyncio.sleep(1.0)
                    
                    title = await parser.page.title()
                    logger.info(f"📄 Page title: {title}")
                    
                    if 'robot' in title.lower() or 'captcha' in title.lower() or 'page not found' in title.lower():
                        logger.warning(f"❌ Page blocked or not found")
                        continue
                    
                    # Get HTML content for debugging
                    html_content = await parser.page.content()
                    logger.info(f"📄 HTML length: {len(html_content)} characters")
                    
                    # Search for any Amazon image patterns
                    import re
                    amazon_patterns = [
                        r'https://m\.media-amazon\.com/images/I/[^"]+',
                        r'https://images-na\.ssl-images-amazon\.com/images/I/[^"]+',
                        r'data-src="[^"]*amazon[^"]*"',
                        r'data-old-hires="[^"]*amazon[^"]*"'
                    ]
                    
                    found_patterns = []
                    for pattern in amazon_patterns:
                        matches = re.findall(pattern, html_content, re.IGNORECASE)
                        if matches:
                            found_patterns.extend(matches[:3])  # Show first 3 matches
                    
                    if found_patterns:
                        logger.info(f"🔍 Found {len(found_patterns)} potential image patterns:")
                        for i, pattern in enumerate(found_patterns[:3]):
                            logger.info(f"   {i+1}. {pattern[:100]}...")
                    else:
                        logger.warning("❌ No Amazon image patterns found in HTML")
                    
                    # Try to extract images
                    result = await parser.parse_product_images(asin)
                    
                    logger.info("=== DEBUG RESULTS ===")
                    logger.info(f"ASIN: {result['asin']}")
                    logger.info(f"Low image URL: {result['low_image_url']}")
                    logger.info(f"High image URL: {result['high_image_url']}")
                    logger.info(f"Source domain: {result['source_domain']}")
                    
                    if result['high_image_url']:
                        logger.info("✅ SUCCESS: Found images!")
                        return
                    else:
                        logger.warning("❌ FAILED: No images found")
                        
                except Exception as e:
                    logger.error(f"Error with URL {url}: {e}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error debugging ASIN {asin}: {e}")
        finally:
            await parser.cleanup()
    
    asyncio.run(_debug())


if __name__ == "__main__":
    # Uncomment the line below to test a single ASIN
    # test_single_asin("B08N5WRWNW")  # Example ASIN
    run_image_actualization()
