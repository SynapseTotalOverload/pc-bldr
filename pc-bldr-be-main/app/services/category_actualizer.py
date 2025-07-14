import time
from sqlalchemy import select
import logging

from app.models import Product
from app.db.session import SessionLocal
from app.services.keepa import api, ensure_category

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def actualize_data():
    logger.info("Starting data actualization process")
    logger.info(f"Keepa API access key: {api.accesskey}")
    
    api.update_status()
    logger.info(f"Keepa tokens left: {api.tokens_left}")
    
    with SessionLocal() as db:
        try:
            # Get products without category_id
            stm = select(Product).where(Product.category_id == None)
            products: list[Product] = db.execute(stm).scalars().all()
            
            if not products:
                logger.info("No products found without category_id. Nothing to actualize.")
                return

            logger.info(f"Found {len(products)} products to actualize")

            products_asins_map = {prod.asin: prod for prod in products}
            products_asins = list(products_asins_map.keys())
            splited_lists_of_products_asins: list[list[Product]] = [products_asins[i:i+2] for i in range(0,len(products_asins),2)]

            logger.info(f"Split products into {len(splited_lists_of_products_asins)} batches of max 100 products each")

            for batch_idx, products_list in enumerate(splited_lists_of_products_asins, 1):
                logger.info(f"Processing batch {batch_idx}/{len(splited_lists_of_products_asins)} with {len(products_list)} products")
                
                try:
                    keepa_res = {res["asin"]: res for res in api.query(products_list, history=False, stats=1, rating=True)}
                    logger.info(f"Successfully retrieved data from Keepa for batch {batch_idx}")
                except Exception as e:
                    logger.error(f"Error scraping products data for batch {batch_idx}, saving already scraped info: {e}")
                    break
                
                updated_products = 0
                for product_asin in products_list:
                    product = products_asins_map[product_asin]
                    keepa_prod = keepa_res.get(product_asin)
                    
                    if not keepa_prod:
                        logger.warning(f"No Keepa data found for product ASIN: {product_asin}")
                        continue
                    
                    cur_prod_state = keepa_prod["stats_parsed"].get("current")
                    if cur_prod_state:
                        prod_rate = round(cur_prod_state.get("RATING", float(0)), 1) or None
                        prod_price: float = (
                            cur_prod_state.get("AMAZON") or 
                            cur_prod_state.get("NEW") or 
                            cur_prod_state.get("USED") or
                            None
                        )
                        
                        # Update product fields
                        product.rating = prod_rate
                        product.price = prod_price
                        
                        # Update image URLs
                        if images := keepa_prod.get('images'):
                            if image := images[0]:
                                product.low_image_url = f"https://m.media-amazon.com/images/I/{image.get('l')}"
                                product.high_image_url = f"https://m.media-amazon.com/images/I/{image.get('m')}"
                                
                        updated_products += 1
                        logger.debug(f"Updated product {product_asin}: rating={prod_rate}, price={prod_price}")
                    else:
                        logger.warning(f"No current stats found for product ASIN: {product_asin}")
                
                db.commit()
                logger.info(f"Batch {batch_idx} completed: updated {updated_products} products")
                
                # Sleep between batches to avoid rate limiting
                if batch_idx < len(splited_lists_of_products_asins):
                    logger.info("Sleeping for 60 seconds to avoid rate limiting...")
                    time.sleep(60)
                    
            logger.info("Data actualization process completed successfully")
            
        except Exception as e:
            db.rollback()
            logger.error(f"Critical error while processing categories from keepa: {e}")
            raise


if __name__ == "__main__":
    actualize_data()
