import json
import os
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.product import Product
from app.models.attributes import (
    MouseAttributes,
    KeyboardAttributes,
    HeadsetAttributes,
    MousepadAttributes,
    MonitorAttributes,
    ChairAttributes,
)
from app.services.keepa import fetch_product_from_keepa
from app.crud.product import product_crud


class JSONAttributesParser:
    """Parser for JSON files containing product data with attributes"""
    
    def __init__(self, db: Session):
        self.db = db
        self.json_dir = os.path.join(os.path.dirname(__file__), "json")
        
        # Mapping of file names to category IDs and attribute models
        self.file_mapping = {
            "mouse-data (1).json": (9, MouseAttributes),  # Mouse
            "keyboard-data (5).json": (11, KeyboardAttributes),  # Keyboard
            "headset-data.json": (12, HeadsetAttributes),  # Headset
            "mousepad-data.json": (13, MousepadAttributes),  # Mousepad
            "monitor-data (2).json": (10, MonitorAttributes),  # Monitor
            "chair-data.json": (14, ChairAttributes),  # Chair
        }
    
    def parse_all_files(self):
        """Parse all JSON files and update products with attributes"""
        for filename, (category_id, attr_model) in self.file_mapping.items():
            filepath = os.path.join(self.json_dir, filename)
            if os.path.exists(filepath):
                print(f"Processing {filename}...")
                self.parse_file(filepath, category_id, attr_model)
            else:
                print(f"File {filename} not found")
    
    def parse_file(self, filepath: str, category_id: int, attr_model):
        """Parse a single JSON file and update products"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Track processed ASINs to avoid duplicates
            processed_asins = set()
            found_products = 0
            created_products = 0
            skipped_products = 0
            
            for item in data:
                asin = item.get('asin')
                if not asin:
                    continue
                
                # Skip if we've already processed this ASIN
                if asin in processed_asins:
                    print(f"Skipping duplicate ASIN: {asin}")
                    continue
                
                processed_asins.add(asin)
                
                # Check if product exists
                product = self.db.execute(
                    select(Product).where(Product.asin == asin)
                ).scalar_one_or_none()
                
                if not product:
                    print(f"Product with ASIN {asin} not found, creating...")
                    try:
                        # Create product from JSON data
                        product = self.create_product_from_json(item, category_id)
                        created_products += 1
                        print(f"Created product {asin}")
                    except Exception as e:
                        print(f"Failed to create product {asin}: {str(e)}")
                        skipped_products += 1
                        continue
                else:
                    found_products += 1
                    print(f"Found existing product {asin}, updating...")
                
                # Extract attributes based on category
                attrs_data = self.extract_attributes(item, category_id)
                if attrs_data:
                    try:
                        self.update_product_attributes(product, attr_model, attrs_data)
                        print(f"Successfully updated attributes for {asin}")
                    except Exception as e:
                        print(f"Failed to update attributes for {asin}: {str(e)}")
                        continue
            
            self.db.commit()
            print(f"Successfully processed {found_products} existing products from {filepath}")
            print(f"Created {created_products} new products")
            print(f"Skipped {skipped_products} products (failed to create)")
            
        except Exception as e:
            print(f"Error processing {filepath}: {str(e)}")
            self.db.rollback()

    def create_product_from_json(self, item: Dict[str, Any], category_id: int) -> Product:
        """Create a product from JSON data"""
        from app.models.product import Product
        
        # Extract basic product information
        name = item.get('name', '')
        asin = item.get('asin', '')
        product_link = item.get('productLink', '')
        image = item.get('image', '')
        rating_str = item.get('rating', '')
        
        # Parse rating
        rating = None
        if rating_str:
            try:
                rating = float(rating_str)
            except (ValueError, TypeError):
                pass
        
        # Extract price from product link or other fields if available
        price = None
        # You can add price extraction logic here if needed
        
        # Create product directly in database
        product = Product(
            asin=asin,
            title=name,
            category_id=category_id,
            price=price,
            rating=rating,
            low_image_url=image,
            high_image_url=image,
            display_name=name
        )
        
        self.db.add(product)
        self.db.flush()  # Get the ID without committing
        return product
    
    def parse_single_file(self, filename: str):
        """Parse a single JSON file for testing"""
        if filename not in self.file_mapping:
            print(f"File {filename} not found in mapping")
            return
        
        category_id, attr_model = self.file_mapping[filename]
        filepath = os.path.join(self.json_dir, filename)
        
        if os.path.exists(filepath):
            print(f"Processing {filename}...")
            self.parse_file(filepath, category_id, attr_model)
        else:
            print(f"File {filename} not found")
    
    def extract_brand_model(self, name: str) -> tuple[str, str]:
        """Extract brand and model from product name"""
        if not name:
            return '', ''
        
        # Try to extract brand and model from name
        parts = name.split(' ', 1)
        if len(parts) >= 2:
            return parts[0], parts[1]
        else:
            return parts[0], ''

    def extract_attributes(self, item: Dict[str, Any], category_id: int) -> Dict[str, Any]:
        """Extract attributes from JSON item based on category"""
        attrs = {}
        
        # Extract common fields
        name = item.get('name', '')
        brand, model = self.extract_brand_model(name)
        
        if brand:
            attrs['brand'] = brand
        if model:
            attrs['model'] = model
        
        # Extract category-specific attributes
        if category_id == 9:  # Mouse
            attrs.update({
                'connectivity_technology': item.get('connectivity', ''),
                'special_feature': item.get('sensor', ''),
                'movement_detection_technology': item.get('sensor', ''),
                'color': item.get('color', ''),
                'number_of_buttons': self.extract_number(item.get('number_of_buttons', '')),
                # Additional fields from JSON that we can use
                'brand': brand if brand else '',
                'model': model if model else '',
            })
        elif category_id == 11:  # Keyboard
            attrs.update({
                'pattern': item.get('layout', ''),
                'compatible_devices': 'PC',
                'connectivity_technology': item.get('connectivity', ''),
                'keyboard_description': item.get('name', ''),
                'recommended_uses_for_product': 'Gaming',
                'special_feature': item.get('switchType', ''),
                'number_of_keys': self.extract_number(item.get('number_of_keys', '')),
                'keyboard_backlighting_color_support': 'RGB',
                'color': item.get('color', ''),
                'size': item.get('layout', ''),
                'style': 'Gaming',
                # Additional fields from JSON
                'brand': brand if brand else '',
                'model': model if model else '',
            })
        elif category_id == 12:  # Headset
            attrs.update({
                'form_factor': item.get('type', ''),
                'par_placement': 'Over-Ear',  # Most gaming headsets are over-ear
                'color': item.get('color', ''),
                'impedance': self.extract_number(item.get('impedance', '')),
                'size': 'One Size',  # Most gaming headsets are one size
                # Additional fields from JSON
                'brand': brand if brand else '',
                'model': model if model else '',
            })
        elif category_id == 13:  # Mousepad
            attrs.update({
                'color': item.get('color', ''),
                'special_feature': item.get('special_feature', ''),
                'recommended_uses_for_product': 'Gaming',
                'material': item.get('material', ''),
                'size': item.get('size', ''),
                'style': item.get('style', ''),
                # Additional fields from JSON
                'brand': brand if brand else '',
                'model': model if model else '',
            })
        elif category_id == 10:  # Monitor
            attrs.update({
                'screen_size': self.extract_float(item.get('screen_size', '')),
                'resolution': item.get('resolution', ''),
                'aspect_ratio': item.get('aspect_ratio', ''),
                'screen_surface_description': item.get('screen_surface', ''),
                'style': item.get('style', ''),
                # Additional fields from JSON
                'brand': brand if brand else '',
                'model': model if model else '',
            })
        elif category_id == 14:  # Chair
            attrs.update({
                'color': item.get('color', ''),
                'product_dimensions': item.get('dimensions', ''),
                'size': item.get('size', ''),
                'back_style': item.get('back_style', ''),
                # Additional fields from JSON
                'brand': brand if brand else '',
                'model': model if model else '',
            })
        
        # Clean up empty values
        attrs = {k: v for k, v in attrs.items() if v is not None and v != ''}
        
        return attrs
    
    def update_product_attributes(self, product: Product, attr_model, attrs_data: Dict[str, Any]):
        """Update or create product attributes"""
        try:
            # Check if attributes already exist
            existing_attrs = self.db.execute(
                select(attr_model).where(attr_model.product_id == product.id)
            ).scalar_one_or_none()
            
            if existing_attrs:
                # Update existing attributes
                for key, value in attrs_data.items():
                    if hasattr(existing_attrs, key) and value is not None:
                        setattr(existing_attrs, key, value)
            else:
                # Create new attributes
                new_attrs = attr_model(product_id=product.id, **attrs_data)
                self.db.add(new_attrs)
            
            # Update product display_name if brand and model are available
            if attrs_data.get('brand') and attrs_data.get('model'):
                product.display_name = f"{attrs_data['brand']} {attrs_data['model']}"
            elif attrs_data.get('brand'):
                product.display_name = attrs_data['brand']
            elif attrs_data.get('model'):
                product.display_name = attrs_data['model']
                
        except Exception as e:
            # If there's a unique constraint violation, try to update existing attributes
            if "unique constraint" in str(e).lower() and "product_id" in str(e).lower():
                print(f"Attributes already exist for product {product.asin}, updating...")
                # Try to update existing attributes
                existing_attrs = self.db.execute(
                    select(attr_model).where(attr_model.product_id == product.id)
                ).scalar_one_or_none()
                
                if existing_attrs:
                    for key, value in attrs_data.items():
                        if hasattr(existing_attrs, key) and value is not None:
                            setattr(existing_attrs, key, value)
                else:
                    raise e
            else:
                raise e
    
    def extract_number(self, value: Any) -> Optional[int]:
        """Extract integer from string or return None"""
        if value is None or value == '':
            return None
        try:
            return int(str(value))
        except (ValueError, TypeError):
            return None
    
    def extract_float(self, value: Any) -> Optional[float]:
        """Extract float from string or return None"""
        if value is None or value == '':
            return None
        try:
            return float(str(value))
        except (ValueError, TypeError):
            return None


def parse_json_attributes(db: Session):
    """Main function to parse all JSON files and update product attributes"""
    parser = JSONAttributesParser(db)
    parser.parse_all_files()
    print("JSON attributes parsing completed!")


def parse_single_json_file(db: Session, filename: str):
    """Parse a single JSON file for testing"""
    parser = JSONAttributesParser(db)
    parser.parse_single_file(filename)
    print(f"JSON attributes parsing for {filename} completed!") 