from datetime import date, datetime, timedelta
from typing import List, Dict, Optional, Any
import logging
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.models.product_usage_log import ProductUsageLog
from app.models.product import Product
from app.models.category import Category
from app.schemas.product_usage_graph import (
    ProductUsageGraphRequest, 
    BrandUsageGraphRequest,
    ProductSpecificUsageRequest,
    DailyProductStats, 
    ProductUsageGraphResponse,
    BrandUsageGraphResponse,
    ProductSpecificUsageResponse
)

# Set up logging
logger = logging.getLogger(__name__)


class ProductUsageGraphService:
    
    @staticmethod
    def get_product_usage_for_graph(
        db: Session, 
        request: ProductUsageGraphRequest
    ) -> ProductUsageGraphResponse:
        """
        Generate graph data for product usage based on the request parameters
        """
        # Build base query for product usage logs (without join to avoid foreign key issues)
        query = db.query(ProductUsageLog)
        
        # Apply date range filter
        query = query.filter(
            and_(
                ProductUsageLog.usage_start_datetime <= datetime.combine(request.end_date, datetime.max.time()),
                or_(
                    ProductUsageLog.usage_end_datetime.is_(None),
                    ProductUsageLog.usage_end_datetime >= datetime.combine(request.start_date, datetime.min.time())
                )
            )
        )
        
        product_usages = query.all()
        
        # Get unique product IDs from usage logs
        product_ids_from_logs = list(set([usage.product_id for usage in product_usages]))
        
        # Get products info (including deleted ones that were active in the date range)
        products_query = db.query(Product).filter(Product.id.in_(product_ids_from_logs))
        if request.category_ids:
            products_query = products_query.filter(Product.category_id.in_(request.category_ids))
        
        products = products_query.all()
        products_info = {
            p.id: {
                'name': p.title or p.display_name or f"Product {p.id}",
                'category_id': p.category_id,
                'category_name': p.category.name if p.category else "Unknown",
                'created_at': p.created_at,
                'updated_at': p.updated_at
            }
            for p in products
        }
        
        # Add info for products that might have been deleted but still have usage logs
        for product_id in product_ids_from_logs:
            if product_id not in products_info:
                products_info[product_id] = {
                    'name': f"Deleted Product {product_id}",
                    'category_id': None,
                    'category_name': "Deleted",
                    'created_at': None,
                    'updated_at': None
                }
        
        # Get categories mapping
        categories = {}
        if request.category_ids:
            categories_data = db.query(Category).filter(Category.id.in_(request.category_ids)).all()
        else:
            categories_data = db.query(Category).all()
        
        categories = {str(cat.id): cat.name for cat in categories_data}
        
        # Generate daily statistics
        graph_data = []
        current_date = request.start_date
        
        while current_date <= request.end_date:
            daily_stats = {
                "date": current_date.isoformat(),
                "products": {},
                "deleted_products": {}
            }
            
            if request.group_by_category:
                # Group by category
                category_stats = {}
                for product_id, p_info in products_info.items():
                    category_name = p_info['category_name']
                    if category_name not in category_stats:
                        category_stats[category_name] = 0
                    
                    # Count active users for this product on current date
                    active_users = sum(
                        1 for usage in product_usages
                        if usage.product_id == product_id and
                        usage.usage_start_datetime <= current_date and
                        (usage.usage_end_datetime is None or usage.usage_end_datetime >= current_date)
                    )
                    
                    category_stats[category_name] += active_users
                
                daily_stats["products"] = category_stats
            else:
                # Individual products
                for product_id, p_info in products_info.items():
                    active_users_count = 0
                    
                    for usage in product_usages:
                        if usage.product_id == product_id:
                            # Check if product was active on current date
                            is_active_on_day = (
                                usage.usage_start_datetime <= current_date and
                                (usage.usage_end_datetime is None or usage.usage_end_datetime >= current_date)
                            )
                            
                            if is_active_on_day:
                                active_users_count += 1
                    
                    daily_stats["products"][p_info['name']] = active_users_count
            
            graph_data.append(DailyProductStats(**daily_stats))
            current_date += timedelta(days=1)
        
        # Calculate totals
        total_products = len(products_info)
        total_users = sum(
            1 for usage in product_usages
            if usage.usage_start_datetime <= request.end_date and
            (usage.usage_end_datetime is None or usage.usage_end_datetime >= request.start_date)
        )
        
        return ProductUsageGraphResponse(
            data=graph_data,
            categories=categories,
            total_products=total_products,
            total_users=total_users,
            date_range={
                "start_date": request.start_date.isoformat(),
                "end_date": request.end_date.isoformat()
            }
        )
    
    @staticmethod
    def get_available_categories(db: Session) -> List[Dict[str, Any]]:
        """
        Get list of available categories for filtering
        """
        categories = db.query(Category).all()
        return [
            {
                "id": cat.id,
                "name": cat.name,
                "product_count": len(cat.products)
            }
            for cat in categories
        ]
    
    @staticmethod
    def get_usage_summary(db: Session, days: int = 30) -> Dict[str, Any]:
        """
        Get summary statistics for the last N days
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        # Total active users
        total_active_users = db.query(func.count(func.distinct(ProductUsageLog.user_id))).filter(
            and_(
                ProductUsageLog.usage_start_datetime <= datetime.combine(end_date, datetime.max.time()),
                or_(
                    ProductUsageLog.usage_end_datetime.is_(None),
                    ProductUsageLog.usage_end_datetime >= datetime.combine(start_date, datetime.min.time())
                )
            )
        ).scalar()
        
        # Most used products (without join to avoid foreign key issues)
        usage_counts = db.query(
            ProductUsageLog.product_id,
            func.count(ProductUsageLog.id).label('usage_count')
        ).filter(
            ProductUsageLog.usage_start_datetime >= datetime.combine(start_date, datetime.min.time())
        ).group_by(ProductUsageLog.product_id).order_by(
            func.count(ProductUsageLog.id).desc()
        ).limit(10).all()
        
        # Get product details for the most used products
        product_ids = [usage.product_id for usage in usage_counts]
        products = db.query(Product).filter(Product.id.in_(product_ids)).all()
        products_dict = {p.id: p for p in products}
        
        most_used_products = []
        for usage in usage_counts:
            product = products_dict.get(usage.product_id)
            if product:
                most_used_products.append({
                    "name": product.title or product.display_name or f"Product {product.id}",
                    "usage_count": usage.usage_count
                })
            else:
                most_used_products.append({
                    "name": f"Deleted Product {usage.product_id}",
                    "usage_count": usage.usage_count
                })
        
        # Most used categories (without join to avoid foreign key issues)
        # First get product IDs with usage counts
        product_usage_counts = db.query(
            ProductUsageLog.product_id,
            func.count(ProductUsageLog.id).label('usage_count')
        ).filter(
            ProductUsageLog.usage_start_datetime >= datetime.combine(start_date, datetime.min.time())
        ).group_by(ProductUsageLog.product_id).all()
        
        # Get products for these IDs
        product_ids = [p.product_id for p in product_usage_counts]
        products = db.query(Product).filter(Product.id.in_(product_ids)).all()
        products_dict = {p.id: p for p in products}
        
        # Group by category
        category_counts = {}
        for product_usage in product_usage_counts:
            product = products_dict.get(product_usage.product_id)
            if product and product.category_id:
                if product.category_id not in category_counts:
                    category_counts[product.category_id] = 0
                category_counts[product.category_id] += product_usage.usage_count
        
        # Get top categories
        top_category_ids = sorted(category_counts.keys(), key=lambda x: category_counts[x], reverse=True)[:5]
        categories = db.query(Category).filter(Category.id.in_(top_category_ids)).all()
        categories_dict = {c.id: c for c in categories}
        
        most_used_categories = []
        for cat_id in top_category_ids:
            category = categories_dict.get(cat_id)
            if category:
                most_used_categories.append({
                    "name": category.name,
                    "usage_count": category_counts[cat_id]
                })
        

        
        return {
            "period_days": days,
            "total_active_users": total_active_users or 0,
            "most_used_products": most_used_products,
            "most_used_categories": most_used_categories
        }
    
    @staticmethod
    def get_brand_usage_for_graph(
        db: Session, 
        request: BrandUsageGraphRequest
    ) -> BrandUsageGraphResponse:
        """
        Generate graph data for product usage grouped by brands
        """
        # Build base query for product usage logs
        query = db.query(ProductUsageLog)
        
        # Apply date range filter
        query = query.filter(
            and_(
                ProductUsageLog.usage_start_datetime <= datetime.combine(request.end_date, datetime.max.time()),
                or_(
                    ProductUsageLog.usage_end_datetime.is_(None),
                    ProductUsageLog.usage_end_datetime >= datetime.combine(request.start_date, datetime.min.time())
                )
            )
        )
        
        product_usages = query.all()
        
        # Get unique product IDs from usage logs
        product_ids_from_logs = list(set([usage.product_id for usage in product_usages]))
        
        # Get products with their brand information
        products_query = db.query(Product).filter(Product.id.in_(product_ids_from_logs))
        if request.category_ids:
            products_query = products_query.filter(Product.category_id.in_(request.category_ids))
        
        products = products_query.all()
        
        # Get brand information for each product
        products_info = {}
        brands_info = {}
        
        logger.info(f"Processing {len(products)} products for brand usage graph")
        
        for p in products:
            # Get brand from attributes - check all possible attribute types
            brand = None
            
            # Check all possible attribute types regardless of category name
            if p.cpu_attributes and p.cpu_attributes.brand:
                brand = p.cpu_attributes.brand
            elif p.cpu_cooler_attributes and p.cpu_cooler_attributes.brand:
                brand = p.cpu_cooler_attributes.brand
            elif p.gpu_attributes and p.gpu_attributes.brand:
                brand = p.gpu_attributes.brand
            elif p.motherboard_attributes and p.motherboard_attributes.brand:
                brand = p.motherboard_attributes.brand
            elif p.ram_attributes and p.ram_attributes.brand:
                brand = p.ram_attributes.brand
            elif p.storage_attributes and p.storage_attributes.brand:
                brand = p.storage_attributes.brand
            elif p.power_supply_attributes and p.power_supply_attributes.brand:
                brand = p.power_supply_attributes.brand
            elif p.case_attributes and p.case_attributes.brand:
                brand = p.case_attributes.brand
            elif p.mouse_attributes and p.mouse_attributes.brand:
                brand = p.mouse_attributes.brand
            elif p.monitor_attributes and p.monitor_attributes.brand:
                brand = p.monitor_attributes.brand
            elif p.keyboard_attributes and p.keyboard_attributes.brand:
                brand = p.keyboard_attributes.brand
            elif p.headset_attributes and p.headset_attributes.brand:
                brand = p.headset_attributes.brand
            elif p.mousepad_attributes and p.mousepad_attributes.brand:
                brand = p.mousepad_attributes.brand
            elif p.chair_attributes and p.chair_attributes.brand:
                brand = p.chair_attributes.brand
            elif p.microphone_attributes and p.microphone_attributes.brand:
                brand = p.microphone_attributes.brand
            elif p.camera_attributes and p.camera_attributes.brand:
                brand = p.camera_attributes.brand
            elif p.headphones_attributes and p.headphones_attributes.brand:
                brand = p.headphones_attributes.brand
            
            brand = brand or "Unknown"
            
            # Log product processing for debugging
            logger.debug(f"Product {p.id}: category='{p.category.name if p.category else 'None'}', brand='{brand}'")
            
            products_info[p.id] = {
                'name': p.title or p.display_name or f"Product {p.id}",
                'brand': brand,
                'category_id': p.category_id,
                'category_name': p.category.name if p.category else "Unknown"
            }
            
            if brand not in brands_info:
                brands_info[brand] = {
                    'count': 0,
                    'products': []
                }
            brands_info[brand]['count'] += 1
            brands_info[brand]['products'].append(p.id)
        
        # Add info for products that might have been deleted but still have usage logs
        for product_id in product_ids_from_logs:
            if product_id not in products_info:
                products_info[product_id] = {
                    'name': f"Deleted Product {product_id}",
                    'brand': "Deleted",
                    'category_id': None,
                    'category_name': "Deleted"
                }
        
        # Filter brands if specified
        if request.brands:
            brands_info = {brand: info for brand, info in brands_info.items() if brand in request.brands}
        
        # Generate daily statistics
        graph_data = []
        current_date = request.start_date
        
        while current_date <= request.end_date:
            daily_stats = {
                "date": current_date.isoformat(),
                "products": {},
                "deleted_products": {}
            }
            
            # Group by brand
            brand_stats = {}
            for product_id, p_info in products_info.items():
                brand = p_info['brand']
                
                # Skip if brand is not in filtered brands
                if request.brands and brand not in request.brands:
                    continue
                
                if brand not in brand_stats:
                    brand_stats[brand] = 0
                
                # Count active users for this product on current date
                active_users = sum(
                    1 for usage in product_usages
                    if usage.product_id == product_id and
                    usage.usage_start_datetime <= current_date and
                    (usage.usage_end_datetime is None or usage.usage_end_datetime >= current_date)
                )
                
                brand_stats[brand] += active_users
            
            daily_stats["products"] = brand_stats
            graph_data.append(DailyProductStats(**daily_stats))
            current_date += timedelta(days=1)
        
        # Calculate totals
        total_products = len(products_info)
        total_users = sum(
            1 for usage in product_usages
            if usage.usage_start_datetime <= request.end_date and
            (usage.usage_end_datetime is None or usage.usage_end_datetime >= request.start_date)
        )
        
        logger.info(f"Brand usage graph generated: {len(brands_info)} brands, {total_products} products, {total_users} users")
        logger.debug(f"Brands found: {list(brands_info.keys())}")
        
        return BrandUsageGraphResponse(
            data=graph_data,
            brands=brands_info,
            total_products=total_products,
            total_users=total_users,
            date_range={
                "start_date": request.start_date.isoformat(),
                "end_date": request.end_date.isoformat()
            }
        )
    
    @staticmethod
    def get_specific_product_usage(
        db: Session, 
        request: ProductSpecificUsageRequest
    ) -> ProductSpecificUsageResponse:
        """
        Generate graph data for usage of a specific product
        """
        # Get product information
        product = db.query(Product).filter(Product.id == request.product_id).first()
        
        if not product:
            raise ValueError(f"Product with ID {request.product_id} not found")
        
        # Get brand information - check all possible attribute types
        brand = "Unknown"
        
        # Check all possible attribute types regardless of category name
        if product.cpu_attributes and product.cpu_attributes.brand:
            brand = product.cpu_attributes.brand
        elif product.cpu_cooler_attributes and product.cpu_cooler_attributes.brand:
            brand = product.cpu_cooler_attributes.brand
        elif product.gpu_attributes and product.gpu_attributes.brand:
            brand = product.gpu_attributes.brand
        elif product.motherboard_attributes and product.motherboard_attributes.brand:
            brand = product.motherboard_attributes.brand
        elif product.ram_attributes and product.ram_attributes.brand:
            brand = product.ram_attributes.brand
        elif product.storage_attributes and product.storage_attributes.brand:
            brand = product.storage_attributes.brand
        elif product.power_supply_attributes and product.power_supply_attributes.brand:
            brand = product.power_supply_attributes.brand
        elif product.case_attributes and product.case_attributes.brand:
            brand = product.case_attributes.brand
        elif product.mouse_attributes and product.mouse_attributes.brand:
            brand = product.mouse_attributes.brand
        elif product.monitor_attributes and product.monitor_attributes.brand:
            brand = product.monitor_attributes.brand
        elif product.keyboard_attributes and product.keyboard_attributes.brand:
            brand = product.keyboard_attributes.brand
        elif product.headset_attributes and product.headset_attributes.brand:
            brand = product.headset_attributes.brand
        elif product.mousepad_attributes and product.mousepad_attributes.brand:
            brand = product.mousepad_attributes.brand
        elif product.chair_attributes and product.chair_attributes.brand:
            brand = product.chair_attributes.brand
        elif product.microphone_attributes and product.microphone_attributes.brand:
            brand = product.microphone_attributes.brand
        elif product.camera_attributes and product.camera_attributes.brand:
            brand = product.camera_attributes.brand
        elif product.headphones_attributes and product.headphones_attributes.brand:
            brand = product.headphones_attributes.brand
        
        # Get usage logs for this specific product
        query = db.query(ProductUsageLog).filter(ProductUsageLog.product_id == request.product_id)
        
        # Apply date range filter
        query = query.filter(
            and_(
                ProductUsageLog.usage_start_datetime <= datetime.combine(request.end_date, datetime.max.time()),
                or_(
                    ProductUsageLog.usage_end_datetime.is_(None),
                    ProductUsageLog.usage_end_datetime >= datetime.combine(request.start_date, datetime.min.time())
                )
            )
        )
        
        product_usages = query.all()
        
        # Generate daily statistics
        graph_data = []
        current_date = request.start_date
        
        while current_date <= request.end_date:
            daily_stats = {
                "date": current_date.isoformat(),
                "products": {},
                "deleted_products": {}
            }
            
            # Count active users for this product on current date
            active_users = sum(
                1 for usage in product_usages
                if usage.usage_start_datetime <= current_date and
                (usage.usage_end_datetime is None or usage.usage_end_datetime >= current_date)
            )
            
            product_name = product.title or product.display_name or f"Product {product.id}"
            daily_stats["products"][product_name] = active_users
            
            graph_data.append(DailyProductStats(**daily_stats))
            current_date += timedelta(days=1)
        
        # Calculate total users
        total_users = len(product_usages)
        
        # Prepare product info
        product_info = {
            "id": product.id,
            "name": product.title or product.display_name or f"Product {product.id}",
            "brand": brand,
            "category": product.category.name if product.category else "Unknown",
            "price": product.price,
            "rating": product.rating,
            "asin": product.asin
        }
        
        return ProductSpecificUsageResponse(
            data=graph_data,
            product_info=product_info,
            total_users=total_users,
            date_range={
                "start_date": request.start_date.isoformat(),
                "end_date": request.end_date.isoformat()
            }
        ) 