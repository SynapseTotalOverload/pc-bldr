#!/usr/bin/env python3
"""
Test script for Skins API
Run this script to test the skins API endpoints
"""

import requests
import json
from typing import Dict, Any

# API base URL - adjust this to match your server
BASE_URL = "http://localhost:8000/api/v1"

def test_skin_category_endpoints():
    """Test skin category CRUD operations"""
    print("🧪 Testing Skin Category Endpoints...")
    
    # Test data
    category_data = {
        "name": "test_category"
    }
    
    # Create category
    print("  📝 Creating skin category...")
    response = requests.post(f"{BASE_URL}/skins/categories/", json=category_data)
    if response.status_code == 201:
        category = response.json()
        category_id = category["id"]
        print(f"    ✅ Created category with ID: {category_id}")
    else:
        print(f"    ❌ Failed to create category: {response.status_code} - {response.text}")
        return
    
    # Get category by ID
    print("  📖 Getting skin category by ID...")
    response = requests.get(f"{BASE_URL}/skins/categories/{category_id}")
    if response.status_code == 200:
        print(f"    ✅ Retrieved category: {response.json()['name']}")
    else:
        print(f"    ❌ Failed to get category: {response.status_code}")
    
    # Get all categories
    print("  📋 Getting all skin categories...")
    response = requests.get(f"{BASE_URL}/skins/categories/")
    if response.status_code == 200:
        categories = response.json()
        print(f"    ✅ Retrieved {categories['total']} categories")
    else:
        print(f"    ❌ Failed to get categories: {response.status_code}")
    
    # Update category
    print("  ✏️  Updating skin category...")
    update_data = {"name": "updated_test_category"}
    response = requests.put(f"{BASE_URL}/skins/categories/{category_id}", json=update_data)
    if response.status_code == 200:
        print(f"    ✅ Updated category: {response.json()['name']}")
    else:
        print(f"    ❌ Failed to update category: {response.status_code}")
    
    # Delete category
    print("  🗑️  Deleting skin category...")
    response = requests.delete(f"{BASE_URL}/skins/categories/{category_id}")
    if response.status_code == 200:
        print(f"    ✅ Deleted category")
    else:
        print(f"    ❌ Failed to delete category: {response.status_code}")


def test_skin_endpoints():
    """Test skin CRUD operations"""
    print("\n🧪 Testing Skin Endpoints...")
    
    # First, create a category for the skin
    category_data = {"name": "test_weapon_category"}
    response = requests.post(f"{BASE_URL}/skins/categories/", json=category_data)
    if response.status_code != 201:
        print("    ❌ Failed to create category for skin test")
        return
    
    category_id = response.json()["id"]
    
    # Test data
    skin_data = {
        "name": "Test Weapon",
        "full_name": "Test Weapon | Test Skin",
        "weapon": "Test Weapon",
        "skin_name": "Test Skin",
        "image_file": "https://example.com/test.jpg",
        "link": "https://example.com/test",
        "category_id": category_id
    }
    
    # Create skin
    print("  📝 Creating skin...")
    response = requests.post(f"{BASE_URL}/skins/", json=skin_data)
    if response.status_code == 201:
        skin = response.json()
        skin_id = skin["id"]
        print(f"    ✅ Created skin with ID: {skin_id}")
    else:
        print(f"    ❌ Failed to create skin: {response.status_code} - {response.text}")
        return
    
    # Get skin by ID
    print("  📖 Getting skin by ID...")
    response = requests.get(f"{BASE_URL}/skins/{skin_id}")
    if response.status_code == 200:
        print(f"    ✅ Retrieved skin: {response.json()['name']}")
    else:
        print(f"    ❌ Failed to get skin: {response.status_code}")
    
    # Get all skins with pagination
    print("  📋 Getting all skins with pagination...")
    response = requests.get(f"{BASE_URL}/skins/?limit=10&skip=0")
    if response.status_code == 200:
        skins = response.json()
        print(f"    ✅ Retrieved {len(skins['items'])} skins (total: {skins['total']})")
    else:
        print(f"    ❌ Failed to get skins: {response.status_code}")
    
    # Get skins by category
    print("  🏷️  Getting skins by category...")
    response = requests.get(f"{BASE_URL}/skins/category/{category_id}")
    if response.status_code == 200:
        skins = response.json()
        print(f"    ✅ Retrieved {len(skins)} skins for category {category_id}")
    else:
        print(f"    ❌ Failed to get skins by category: {response.status_code}")
    
    # Get skins by weapon
    print("  🔫 Getting skins by weapon...")
    response = requests.get(f"{BASE_URL}/skins/weapon/Test Weapon")
    if response.status_code == 200:
        skins = response.json()
        print(f"    ✅ Retrieved {len(skins)} skins for weapon 'Test Weapon'")
    else:
        print(f"    ❌ Failed to get skins by weapon: {response.status_code}")
    
    # Update skin
    print("  ✏️  Updating skin...")
    update_data = {"name": "Updated Test Weapon"}
    response = requests.put(f"{BASE_URL}/skins/{skin_id}", json=update_data)
    if response.status_code == 200:
        print(f"    ✅ Updated skin: {response.json()['name']}")
    else:
        print(f"    ❌ Failed to update skin: {response.status_code}")
    
    # Delete skin
    print("  🗑️  Deleting skin...")
    response = requests.delete(f"{BASE_URL}/skins/{skin_id}")
    if response.status_code == 200:
        print(f"    ✅ Deleted skin")
    else:
        print(f"    ❌ Failed to delete skin: {response.status_code}")
    
    # Clean up category
    requests.delete(f"{BASE_URL}/skins/categories/{category_id}")


def test_skin_filters():
    """Test skin filtering and search"""
    print("\n🧪 Testing Skin Filters and Search...")
    
    # Get skins with search query
    print("  🔍 Testing search functionality...")
    response = requests.get(f"{BASE_URL}/skins/?query=AK-47&limit=5")
    if response.status_code == 200:
        skins = response.json()
        print(f"    ✅ Search returned {len(skins['items'])} skins for 'AK-47'")
    else:
        print(f"    ❌ Search failed: {response.status_code}")
    
    # Get skins by category filter
    print("  🏷️  Testing category filter...")
    response = requests.get(f"{BASE_URL}/skins/?category_id=4&limit=5")  # rifles category
    if response.status_code == 200:
        skins = response.json()
        print(f"    ✅ Category filter returned {len(skins['items'])} skins for category 4")
    else:
        print(f"    ❌ Category filter failed: {response.status_code}")
    
    # Get skins with category information
    print("  📊 Testing include_category parameter...")
    response = requests.get(f"{BASE_URL}/skins/?include_category=true&limit=1")
    if response.status_code == 200:
        skins = response.json()
        if skins['items'] and 'category' in skins['items'][0]:
            print(f"    ✅ Category information included in response")
        else:
            print(f"    ⚠️  Category information not included")
    else:
        print(f"    ❌ Include category failed: {response.status_code}")


def main():
    """Main test function"""
    print("🚀 Starting Skins API Tests...")
    print("=" * 50)
    
    try:
        # Test if server is running
        response = requests.get(f"{BASE_URL}/skins/")
        if response.status_code != 200:
            print(f"❌ Server not responding properly: {response.status_code}")
            print("Make sure your FastAPI server is running on http://localhost:8000")
            return
        
        print("✅ Server is responding!")
        
        # Run tests
        test_skin_category_endpoints()
        test_skin_endpoints()
        test_skin_filters()
        
        print("\n" + "=" * 50)
        print("🎉 All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        print("Make sure your FastAPI server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")


if __name__ == "__main__":
    main() 