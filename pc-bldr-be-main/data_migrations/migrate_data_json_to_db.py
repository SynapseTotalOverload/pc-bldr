import json
import sys
import os
from pathlib import Path
from typing import Dict, Any, Optional
import re

# Add the parent directory to the Python path to import app modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.attributes import (
    MonitorAttributes, CPUAttributes, GPUAttributes, MotherboardAttributes,
    RAMAttributes, StorageAttributes, PowerSupplyAttributes, CaseAttributes,
    CPUCoolerAttributes, MouseAttributes, KeyboardAttributes, HeadsetAttributes,
    MousepadAttributes, ChairAttributes, MicrophoneAttributes, CameraAttributes,
    HeadphonesAttributes
)

# Category mapping from JSON category to database category
CATEGORY_MAPPING = {
    "monitor": "Monitor",
    "cpu": "CPU", 
    "gpu": "GPU",
    "motherboard": "Motherboard",
    "ram": "RAM",
    "storage": "Storage",
    "power_supply": "Power Supply",
    "case": "Case",
    "cpu_cooler": "CPU Cooler",
    "mouse": "Mouse",
    "keyboard": "Keyboard",
    "headset": "Headset",
    "mousepad": "Mousepad",
    "chair": "Chair",
    "microphone": "Microphone",
    "camera": "Camera",
    "headphones": "Headphones"
}

def safe_int(value: Any) -> Optional[int]:
    """Safely convert value to integer"""
    if value is None:
        return None
    
    if isinstance(value, int):
        return value
    
    if isinstance(value, str):
        # Extract numbers from string like "1080p", "4K", "16 Ohm", etc.
        numbers = re.findall(r'\d+(?:\.\d+)?', value)
        if numbers:
            try:
                return int(float(numbers[0]))
            except (ValueError, TypeError):
                pass
    
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

def safe_float(value: Any) -> Optional[float]:
    """Safely convert value to float"""
    if value is None:
        return None
    
    if isinstance(value, (int, float)):
        return float(value)
    
    if isinstance(value, str):
        # Extract numbers from string like "27 Inches", "2.8 Millimeters", etc.
        numbers = re.findall(r'\d+(?:\.\d+)?', value)
        if numbers:
            try:
                return float(numbers[0])
            except (ValueError, TypeError):
                pass
    
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def extract_screen_size(size_str: str) -> Optional[float]:
    """Extract screen size from string like '27 Inches'"""
    return safe_float(size_str)

def create_monitor_attributes(product_id: int, overview: Dict[str, Any]) -> MonitorAttributes:
    """Create monitor attributes from overview data"""
    screen_size = None
    if "Screen Size" in overview:
        screen_size = extract_screen_size(overview["Screen Size"])
    model = overview.get("Model")
    if not model:
        model = overview.get("Model Name")
    
    return MonitorAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=model,
        screen_size=screen_size,
        resolution=overview.get("Resolution"),
        aspect_ratio=overview.get("Aspect Ratio"),
        screen_surface_description=overview.get("Screen Surface Description"),
        style=overview.get("Style")
    )

def create_cpu_attributes(product_id: int, overview: Dict[str, Any]) -> CPUAttributes:
    """Create CPU attributes from overview data"""
    return CPUAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        cores=safe_int(overview.get("Cores")),
        threads=safe_int(overview.get("Threads")),
        socket_type=overview.get("Socket Type"),
        base_speed=safe_float(overview.get("Base Speed")),
        turbo_speed=safe_float(overview.get("Turbo Speed")),
        architechture=overview.get("Architecture"),
        core_family=overview.get("Core Family"),
        integrated_graphics=overview.get("Integrated Graphics"),
        memory_type=overview.get("Memory Type"),
        memory_speed=safe_int(overview.get("Memory Speed")),
        series=overview.get("Series"),
        generation=overview.get("Generation")
    )

def create_gpu_attributes(product_id: int, overview: Dict[str, Any]) -> GPUAttributes:
    """Create GPU attributes from overview data"""
    return GPUAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        memory=safe_float(overview.get("Memory")),
        mem_interface=overview.get("Memory Interface"),
        length=safe_int(overview.get("Length")),
        interface=overview.get("Interface"),
        chipset=overview.get("Chipset"),
        base_clock=safe_int(overview.get("Base Clock")),
        clock_speed=safe_int(overview.get("Clock Speed")),
        frame_sync=overview.get("Frame Sync")
    )

def create_motherboard_attributes(product_id: int, overview: Dict[str, Any]) -> MotherboardAttributes:
    """Create motherboard attributes from overview data"""
    return MotherboardAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        chipset=overview.get("Chipset"),
        form_factor=overview.get("Form Factor"),
        socket_type=overview.get("Socket Type"),
        ram_slots=safe_int(overview.get("RAM Slots")),
        max_ram_support=safe_int(overview.get("Max RAM Support"))
    )

def create_ram_attributes(product_id: int, overview: Dict[str, Any]) -> RAMAttributes:
    """Create RAM attributes from overview data"""
    return RAMAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        total_memory=safe_int(overview.get("Total Memory")),
        one_unit_memory=safe_int(overview.get("One Unit Memory")),
        quantity=safe_int(overview.get("Quantity")),
        ram_type=overview.get("RAM Type"),
        ram_speed=safe_int(overview.get("RAM Speed")),
        cas_latency=overview.get("CAS Latency")
    )

def create_storage_attributes(product_id: int, overview: Dict[str, Any]) -> StorageAttributes:
    """Create storage attributes from overview data"""
    return StorageAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        capacity=safe_int(overview.get("Capacity")),
        mem_type=overview.get("Memory Type"),
        interface=overview.get("Interface"),
        cache_mem=safe_int(overview.get("Cache Memory")),
        form_factor=overview.get("Form Factor")
    )

def create_power_supply_attributes(product_id: int, overview: Dict[str, Any]) -> PowerSupplyAttributes:
    """Create power supply attributes from overview data"""
    return PowerSupplyAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        power=safe_int(overview.get("Power")),
        efficiency=overview.get("Efficiency"),
        color=overview.get("Color")
    )

def create_case_attributes(product_id: int, overview: Dict[str, Any]) -> CaseAttributes:
    """Create case attributes from overview data"""
    return CaseAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        side_panel=overview.get("Side Panel"),
        color=overview.get("Color")
    )

def create_cpu_cooler_attributes(product_id: int, overview: Dict[str, Any]) -> CPUCoolerAttributes:
    """Create CPU cooler attributes from overview data"""
    return CPUCoolerAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        fan_rpm_base=safe_int(overview.get("Fan RPM Base")),
        fan_rpm_max=safe_int(overview.get("Fan RPM Max")),
        noise_level_base=safe_float(overview.get("Noise Level Base")),
        noise_level_max=safe_float(overview.get("Noise Level Max")),
        color=overview.get("Color")
    )

def create_mouse_attributes(product_id: int, overview: Dict[str, Any]) -> MouseAttributes:
    """Create mouse attributes from overview data"""
    model = overview.get("Model")
    if not model:
        model = overview.get("Model Name")
    return MouseAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=model,
        color=overview.get("Color"),
        connectivity_technology=overview.get("Connectivity Technology"),
        special_feature=overview.get("Special Feature"),
        movement_detection_technology=overview.get("Movement Detection Technology"),
        number_of_buttons=safe_int(overview.get("Number of Buttons"))
    )

def create_keyboard_attributes(product_id: int, overview: Dict[str, Any]) -> KeyboardAttributes:
    """Create keyboard attributes from overview data"""
    return KeyboardAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        pattern=overview.get("Pattern"),
        compatible_devices=overview.get("Compatible Devices"),
        connectivity_technology=overview.get("Connectivity Technology"),
        keyboard_description=overview.get("Keyboard Description"),
        recommended_uses_for_product=overview.get("Recommended Uses for Product"),
        special_feature=overview.get("Special Feature"),
        number_of_keys=safe_int(overview.get("Number of Keys")),
        keyboard_backlighting_color_support=overview.get("Keyboard Backlighting Color Support"),
        color=overview.get("Color"),
        size=overview.get("Size"),
        style=overview.get("Style")
    )

def create_headset_attributes(product_id: int, overview: Dict[str, Any]) -> HeadsetAttributes:
    """Create headset attributes from overview data"""
    return HeadsetAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        color=overview.get("Color"),
        par_placement=overview.get("Ear Placement"),
        form_factor=overview.get("Form Factor"),
        impedance=safe_int(overview.get("Impedance")),
        size=overview.get("Size")
    )

def create_mousepad_attributes(product_id: int, overview: Dict[str, Any]) -> MousepadAttributes:
    """Create mousepad attributes from overview data"""
    return MousepadAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        color=overview.get("Color"),
        special_feature=overview.get("Special Feature"),
        recommended_uses_for_product=overview.get("Recommended Uses for Product"),
        material=overview.get("Material"),
        size=overview.get("Size"),
        style=overview.get("Style")
    )

def create_chair_attributes(product_id: int, overview: Dict[str, Any]) -> ChairAttributes:
    """Create chair attributes from overview data"""
    return ChairAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        color=overview.get("Color"),
        product_dimensions=overview.get("Product Dimensions"),
        size=overview.get("Size"),
        back_style=overview.get("Back Style")
    )

def create_microphone_attributes(product_id: int, overview: Dict[str, Any]) -> MicrophoneAttributes:
    """Create microphone attributes from overview data"""
    return MicrophoneAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        connectivity_technology=overview.get("Connectivity Technology"),
        connector_type=overview.get("Connector Type"),
        special_feature=overview.get("Special Feature"),
        compatible_devices=overview.get("Compatible Devices"),
        color=overview.get("Color"),
        included_components=overview.get("Included Components"),
        polar_pattern=overview.get("Polar Pattern")
    )

def create_camera_attributes(product_id: int, overview: Dict[str, Any]) -> CameraAttributes:
    """Create camera attributes from overview data"""
    return CameraAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        photo_sensor_technology=overview.get("Photo Sensor Technology"),
        video_capture_resolution=safe_int(overview.get("Video Capture Resolution")),
        maximum_aperture=safe_float(overview.get("Maximum Aperture")),
        flash_memory_type=overview.get("Flash Memory Type"),
        video_capture_format=overview.get("Video Capture Format"),
        supported_audio_format=overview.get("Supported Audio Format"),
        screen_size=safe_float(overview.get("Screen Size")),
        connectivity_technology=overview.get("Connectivity Technology"),
        color=overview.get("Color")
    )

def create_headphones_attributes(product_id: int, overview: Dict[str, Any]) -> HeadphonesAttributes:
    """Create headphones attributes from overview data"""
    return HeadphonesAttributes(
        product_id=product_id,
        brand=overview.get("Brand"),
        model=overview.get("Model"),
        color=overview.get("Color"),
        ear_placement=overview.get("Ear Placement"),
        form_factor=overview.get("Form Factor"),
        impedance=safe_int(overview.get("Impedance"))
    )

# Mapping of category to attribute creation function
ATTRIBUTE_CREATORS = {
    "monitor": create_monitor_attributes,
    "cpu": create_cpu_attributes,
    "gpu": create_gpu_attributes,
    "motherboard": create_motherboard_attributes,
    "ram": create_ram_attributes,
    "storage": create_storage_attributes,
    "power_supply": create_power_supply_attributes,
    "case": create_case_attributes,
    "cpu_cooler": create_cpu_cooler_attributes,
    "mouse": create_mouse_attributes,
    "keyboard": create_keyboard_attributes,
    "headset": create_headset_attributes,
    "mousepad": create_mousepad_attributes,
    "chair": create_chair_attributes,
    "microphone": create_microphone_attributes,
    "camera": create_camera_attributes,
    "headphones": create_headphones_attributes
}

def get_or_create_category(db: Session, category_name: str) -> Category:
    """Get existing category or create new one"""
    category = db.query(Category).filter(Category.name == category_name).first()
    if not category:
        category = Category(name=category_name)
        db.add(category)
        db.commit()
        db.refresh(category)
    return category

def load_products_from_json(json_file_path: str):
    """Load products from JSON file into database"""
    db = next(get_db())
    
    try:
        # Load JSON data
        with open(json_file_path, 'r', encoding='utf-8') as file:
            products_data = json.load(file)
        
        print(f"Loading {len(products_data)} products...")
        
        # Track statistics
        loaded_count = 0
        skipped_count = 0
        error_count = 0
        
        for i, product_data in enumerate(products_data):
            try:
                # Skip products with status != "success"
                if product_data.get("status") != "success":
                    skipped_count += 1
                    continue
                
                # Check if product already exists
                existing_product = db.query(Product).filter(Product.asin == product_data["asin"]).first()
                if existing_product:
                    print(f"Product {product_data['asin']} already exists, skipping...")
                    skipped_count += 1
                    continue
                
                # Get category from JSON
                json_category = product_data.get("category")
                if not json_category:
                    print(f"No category for product {product_data['asin']}")
                    skipped_count += 1
                    continue
                
                # Get database category name
                category_name = CATEGORY_MAPPING.get(json_category)
                if not category_name:
                    print(f"Unknown category: {json_category} for product {product_data['asin']}")
                    skipped_count += 1
                    continue
                
                category = get_or_create_category(db, category_name)
                
                # Create product
                product = Product(
                    asin=product_data["asin"],
                    title=product_data["title"],
                    price=product_data.get("price"),
                    rating=product_data.get("rating"),
                    low_image_url=product_data.get("low_image_url"),
                    high_image_url=product_data.get("high_image_url"),
                    display_name=product_data.get("title"),  # Use title as display_name
                    category_id=category.id
                )
                
                db.add(product)
                db.commit()
                db.refresh(product)
                
                # Create attributes if overview data exists
                if product_data.get("overview") and json_category in ATTRIBUTE_CREATORS:
                    print(f"Creating attributes for {json_category} product {product_data['asin']}")
                    attribute_creator = ATTRIBUTE_CREATORS[json_category]
                    attributes = attribute_creator(product.id, product_data["overview"])
                    db.add(attributes)
                    db.commit()
                    print(f"Successfully created attributes for {product_data['asin']}")
                else:
                    print(f"No overview data or no attribute creator for {json_category} product {product_data['asin']}")
                
                loaded_count += 1
                
                if (i + 1) % 100 == 0:
                    print(f"Processed {i + 1}/{len(products_data)} products...")
                    
            except Exception as e:
                print(f"Error processing product {product_data.get('asin', 'unknown')}: {str(e)}")
                error_count += 1
                db.rollback()
                continue
        
        print(f"\nLoading completed!")
        print(f"Loaded: {loaded_count} products")
        print(f"Skipped: {skipped_count} products")
        print(f"Errors: {error_count} products")
        
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Path to your JSON file
    json_file_path = "./detailed_product_data.json"
    
    if not os.path.exists(json_file_path):
        print(f"File not found: {json_file_path}")
        sys.exit(1)
    
    print("Starting product data loading...")
    load_products_from_json(json_file_path)