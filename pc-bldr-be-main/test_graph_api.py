#!/usr/bin/env python3
"""
Простий тестовий скрипт для перевірки API графіків використання продуктів
"""

import requests
import json
from datetime import date, timedelta

# Базовий URL API
BASE_URL = "http://localhost:8000/api/v1"

def test_categories_endpoint():
    """Тест ендпоінту для отримання категорій"""
    print("Тестування ендпоінту категорій...")
    url = f"{BASE_URL}/product-usage-graphs/categories"
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Отримано {data.get('total_categories', 0)} категорій")
            for cat in data.get('categories', [])[:5]:  # Показуємо перші 5
                print(f"  - {cat['name']} (ID: {cat['id']}, продуктів: {cat['product_count']})")
        else:
            print(f"Помилка: {response.text}")
    except Exception as e:
        print(f"Помилка запиту: {e}")

def test_summary_endpoint():
    """Тест ендпоінту зведеної статистики"""
    print("\nТестування ендпоінту зведеної статистики...")
    url = f"{BASE_URL}/product-usage-graphs/summary"
    params = {"days": 7}
    
    try:
        response = requests.get(url, params=params)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Період: {data.get('period_days')} днів")
            print(f"Активних користувачів: {data.get('total_active_users')}")
            print(f"Топ продуктів: {len(data.get('most_used_products', []))}")
            print(f"Топ категорій: {len(data.get('most_used_categories', []))}")
        else:
            print(f"Помилка: {response.text}")
    except Exception as e:
        print(f"Помилка запиту: {e}")

def test_quick_graph_endpoint():
    """Тест швидкого графіку"""
    print("\nТестування швидкого графіку...")
    url = f"{BASE_URL}/product-usage-graphs/quick-graph"
    params = {
        "days": 7,
        "group_by_category": True
    }
    
    try:
        response = requests.get(url, params=params)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Діапазон дат: {data.get('date_range', {})}")
            print(f"Всього продуктів: {data.get('total_products')}")
            print(f"Всього користувачів: {data.get('total_users')}")
            print(f"Днів даних: {len(data.get('data', []))}")
            
            # Показуємо перший день даних як приклад
            if data.get('data'):
                first_day = data['data'][0]
                print(f"Приклад даних за {first_day['date']}:")
                for product, count in list(first_day['products'].items())[:3]:
                    print(f"  - {product}: {count} користувачів")
        else:
            print(f"Помилка: {response.text}")
    except Exception as e:
        print(f"Помилка запиту: {e}")

def test_generate_graph_endpoint():
    """Тест основного ендпоінту генерації графіку"""
    print("\nТестування основного ендпоінту генерації графіку...")
    url = f"{BASE_URL}/product-usage-graphs/generate"
    
    end_date = date.today()
    start_date = end_date - timedelta(days=3)  # Короткий період для тесту
    
    payload = {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "group_by_category": False
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Діапазон дат: {data.get('date_range', {})}")
            print(f"Всього продуктів: {data.get('total_products')}")
            print(f"Всього користувачів: {data.get('total_users')}")
            print(f"Днів даних: {len(data.get('data', []))}")
        else:
            print(f"Помилка: {response.text}")
    except Exception as e:
        print(f"Помилка запиту: {e}")

def test_health_check():
    """Перевірка доступності сервера"""
    print("Перевірка доступності сервера...")
    try:
        response = requests.get("http://localhost:8000/docs")
        print(f"Сервер доступний: {response.status_code}")
        return True
    except Exception as e:
        print(f"Сервер недоступний: {e}")
        return False

def main():
    """Основна функція тестування"""
    print("=" * 60)
    print("ТЕСТУВАННЯ API ГРАФІКІВ ВИКОРИСТАННЯ ПРОДУКТІВ")
    print("=" * 60)
    
    if not test_health_check():
        print("Сервер недоступний. Переконайтеся, що FastAPI запущений на localhost:8000")
        return
    
    # Тестуємо ендпоінти в порядку зростання складності
    test_categories_endpoint()
    test_summary_endpoint()
    test_quick_graph_endpoint()
    test_generate_graph_endpoint()
    
    print("\n" + "=" * 60)
    print("ТЕСТУВАННЯ ЗАВЕРШЕНО")
    print("=" * 60)

if __name__ == "__main__":
    main() 