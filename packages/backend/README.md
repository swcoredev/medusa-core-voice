# Medusa Core Voice Backend

## 🎯 Описание

Backend для маркетплейса голосовых AI-ассистентов, построенный на базе Medusa.js с кастомным Express сервером.

## 🚀 Быстрый запуск

### Запуск MVP сервера:
```bash
node simple-server-fixed.js
```

Сервер будет доступен по адресу: **http://localhost:9000**

## 📱 Voice Assistants API

### Base URL
```
http://localhost:9000
```

### Endpoints

#### 1. GET /api/voice-assistants
Получить всех голосовых ассистентов.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "category": "string",
      "price": "decimal",
      "developer_id": "uuid",
      "status": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "count": 2
}
```

#### 2. GET /api/voice-assistants/:id
Получить конкретного ассистента по ID.

**Parameters:**
- `id` (string, required): UUID ассистента

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "category": "string",
    "price": "decimal",
    "developer_id": "uuid",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

#### 3. POST /api/voice-assistants
Создать нового голосового ассистента.

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "category": "string (optional)",
  "price": "decimal (optional)",
  "developer_id": "uuid (optional)",
  "status": "string (optional, default: 'draft')"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "category": "string",
    "price": "decimal",
    "developer_id": "uuid",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Voice assistant created successfully"
}
```

#### 4. PUT /api/voice-assistants/:id
Обновить данные ассистента.

**Parameters:**
- `id` (string, required): UUID ассистента

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "price": "decimal (optional)",
  "developer_id": "uuid (optional)",
  "status": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "category": "string",
    "price": "decimal",
    "developer_id": "uuid",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Voice assistant updated successfully"
}
```

#### 5. DELETE /api/voice-assistants/:id
Удалить ассистента.

**Parameters:**
- `id` (string, required): UUID ассистента

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "category": "string",
    "price": "decimal",
    "developer_id": "uuid",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Voice assistant deleted successfully"
}
```

## 📊 Статус коды

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## �� Примеры использования

### Создать ассистента:
```bash
curl -X POST http://localhost:9000/api/voice-assistants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Алиса",
    "description": "Голосовой ассистент для дома",
    "category": "home",
    "price": 29.99,
    "status": "active"
  }'
```

### Получить всех ассистентов:
```bash
curl http://localhost:9000/api/voice-assistants
```

### Обновить ассистента:
```bash
curl -X PUT http://localhost:9000/api/voice-assistants/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Алиса Pro",
    "price": 39.99
  }'
```

### Удалить ассистента:
```bash
curl -X DELETE http://localhost:9000/api/voice-assistants/{id}
```

## 🗄️ База данных

### Структура таблицы voice_assistants:
```sql
CREATE TABLE voice_assistants (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2),
  developer_id VARCHAR(255) REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Тестирование

### Запуск тестов:
```bash
pnpm test
```

Тесты покрывают все CRUD операции и проверяют:
- Создание ассистентов
- Получение списка и конкретного ассистента
- Обновление данных
- Удаление ассистентов
- Валидацию входных данных
- Обработку ошибок

## 📁 Структура проекта

```
packages/backend/
├── src/
│   ├── controllers/
│   │   └── voiceAssistantController.ts
│   ├── models/
│   │   └── voiceAssistant.ts
│   ├── routes/
│   │   └── voiceAssistants.ts
│   └── tests/
│       └── voiceAssistants.test.ts
├── simple-server-fixed.js    # Рабочий MVP сервер
├── API_DOCUMENTATION.md      # Полная документация API
└── README.md                 # Этот файл
```

## 🔧 Разработка

### Установка зависимостей:
```bash
pnpm install
```

### Запуск в режиме разработки:
```bash
node simple-server-fixed.js
```

### Проверка здоровья системы:
```bash
curl http://localhost:9000/health
```

## 📝 Примечания

- Сервер использует PostgreSQL на порту 5433
- Все данные сохраняются в таблице `voice_assistants`
- API поддерживает CORS для интеграции с фронтендом
- UUID генерируется автоматически для новых ассистентов
- Timestamps обновляются автоматически при изменениях
