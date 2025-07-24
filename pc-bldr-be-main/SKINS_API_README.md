# Skins API Documentation

Цей документ описує API для роботи зі скінами CS:GO.

## Моделі даних

### Skin (Скін)
```python
{
    "id": int,
    "name": str,           # Коротка назва скіна
    "full_name": str,      # Повна назва скіна
    "weapon": str,         # Тип зброї
    "skin_name": str,      # Назва скіна
    "image_file": str,     # URL зображення (опціонально)
    "link": str,           # Посилання на деталі (опціонально)
    "category_id": int,    # ID категорії (1-6)
    "created_at": datetime,
    "updated_at": datetime,
    "category": SkinCategory  # Об'єкт категорії (опціонально)
}
```

### SkinCategory (Категорія скінів)
```python
{
    "id": int,
    "name": str,           # Назва категорії
    "created_at": datetime,
    "updated_at": datetime,
    "skins": List[Skin]    # Список скінів (опціонально)
}
```

## Категорії скінів

| ID | Назва | Опис |
|----|-------|------|
| 1 | knives | Ножі |
| 2 | gloves | Перчатки |
| 3 | pistols | Пістолети |
| 4 | rifles | Гвинтівки |
| 5 | smg | Пістолети-кулемети |
| 6 | heavy | Важка зброя |

## API Endpoints

### Скіни (Skins)

#### Створити скін
```http
POST /api/v1/skins/
```

**Тіло запиту:**
```json
{
    "name": "AK-47",
    "full_name": "AK-47 | Redline",
    "weapon": "AK-47",
    "skin_name": "Redline",
    "image_file": "https://example.com/ak47-redline.jpg",
    "link": "https://example.com/ak47-redline",
    "category_id": 4
}
```

#### Отримати скін за ID
```http
GET /api/v1/skins/{skin_id}
```

#### Отримати список скінів з пагінацією
```http
GET /api/v1/skins/?skip=0&limit=100&category_id=4&weapon=AK-47&query=redline&include_category=true
```

**Параметри запиту:**
- `skip` (int, опціонально): Кількість записів для пропуску (за замовчуванням: 0)
- `limit` (int, опціонально): Кількість записів для повернення (за замовчуванням: 100, максимум: 1000)
- `category_id` (int, опціонально): Фільтр за ID категорії (1-6)
- `weapon` (str, опціонально): Фільтр за типом зброї
- `query` (str, опціонально): Пошуковий запит (шукає в name, full_name, skin_name, weapon)
- `include_category` (bool, опціонально): Включити інформацію про категорію (за замовчуванням: false)

**Відповідь:**
```json
{
    "items": [
        {
            "id": 1,
            "name": "AK-47",
            "full_name": "AK-47 | Redline",
            "weapon": "AK-47",
            "skin_name": "Redline",
            "image_file": "https://example.com/ak47-redline.jpg",
            "link": "https://example.com/ak47-redline",
            "category_id": 4,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2024-01-01T00:00:00Z",
            "category": {
                "id": 4,
                "name": "rifles",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z"
            }
        }
    ],
    "total": 100,
    "skip": 0,
    "limit": 100,
    "has_more": false
}
```

#### Отримати скіни за типом зброї
```http
GET /api/v1/skins/weapon/{weapon}
```

#### Отримати скіни за категорією
```http
GET /api/v1/skins/category/{category_id}
```

#### Оновити скін
```http
PUT /api/v1/skins/{skin_id}
```

**Тіло запиту:**
```json
{
    "name": "Updated AK-47",
    "skin_name": "Updated Redline"
}
```

#### Видалити скін
```http
DELETE /api/v1/skins/{skin_id}
```

### Категорії скінів (Skin Categories)

#### Створити категорію
```http
POST /api/v1/skins/categories/
```

**Тіло запиту:**
```json
{
    "name": "new_category"
}
```

#### Отримати категорію за ID
```http
GET /api/v1/skins/categories/{category_id}
```

#### Отримати список категорій з пагінацією
```http
GET /api/v1/skins/categories/?skip=0&limit=100&query=rifle&include_skins=true
```

**Параметри запиту:**
- `skip` (int, опціонально): Кількість записів для пропуску (за замовчуванням: 0)
- `limit` (int, опціонально): Кількість записів для повернення (за замовчуванням: 100, максимум: 1000)
- `query` (str, опціонально): Пошуковий запит по назві категорії
- `include_skins` (bool, опціонально): Включити список скінів (за замовчуванням: false)

#### Оновити категорію
```http
PUT /api/v1/skins/categories/{category_id}
```

#### Видалити категорію
```http
DELETE /api/v1/skins/categories/{category_id}
```

**Примітка:** Категорію можна видалити тільки якщо вона не містить скінів.

## Приклади використання

### Отримати всі гвинтівки
```bash
curl "http://localhost:8000/api/v1/skins/?category_id=4&limit=50"
```

### Пошук скінів AK-47
```bash
curl "http://localhost:8000/api/v1/skins/?weapon=AK-47&query=redline"
```

### Отримати категорії зі скінами
```bash
curl "http://localhost:8000/api/v1/skins/categories/?include_skins=true"
```

### Створити новий скін
```bash
curl -X POST "http://localhost:8000/api/v1/skins/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "M4A4",
    "full_name": "M4A4 | Howl",
    "weapon": "M4A4",
    "skin_name": "Howl",
    "image_file": "https://example.com/m4a4-howl.jpg",
    "link": "https://example.com/m4a4-howl",
    "category_id": 4
  }'
```

## Тестування

Для тестування API використовуйте файл `test_skins_api.py`:

```bash
cd pc-bldr-be-main
python test_skins_api.py
```

Цей скрипт протестує всі основні функції API та виведе результати в консоль.

## Обробка помилок

API повертає стандартні HTTP коди статусу:

- `200` - Успішний запит
- `201` - Ресурс створено
- `400` - Помилка валідації або некоректний запит
- `404` - Ресурс не знайдено
- `500` - Внутрішня помилка сервера

Приклади помилок:

```json
{
    "detail": "Category with id 999 does not exist"
}
```

```json
{
    "detail": "Cannot delete category with 5 associated skins"
}
```

```json
{
    "detail": "category_id must be between 1 and 6"
}
``` 