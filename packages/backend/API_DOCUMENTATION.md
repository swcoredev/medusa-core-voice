# Voice Assistants API Documentation

## Base URL
```
http://localhost:9000
```

## Authentication
Currently no authentication required (development mode).

## Endpoints

### 1. GET /api/voice-assistants
Get all voice assistants.

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

### 2. GET /api/voice-assistants/:id
Get specific voice assistant by ID.

**Parameters:**
- `id` (string, required): Voice assistant UUID

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

**Error Response (404):**
```json
{
  "success": false,
  "error": "Voice assistant not found"
}
```

### 3. POST /api/voice-assistants
Create new voice assistant.

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

**Error Response (400):**
```json
{
  "success": false,
  "error": "Name is required"
}
```

### 4. PUT /api/voice-assistants/:id
Update voice assistant.

**Parameters:**
- `id` (string, required): Voice assistant UUID

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

**Error Response (404):**
```json
{
  "success": false,
  "error": "Voice assistant not found"
}
```

### 5. DELETE /api/voice-assistants/:id
Delete voice assistant.

**Parameters:**
- `id` (string, required): Voice assistant UUID

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

**Error Response (404):**
```json
{
  "success": false,
  "error": "Voice assistant not found"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Example Usage

### Create a voice assistant:
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

### Get all voice assistants:
```bash
curl http://localhost:9000/api/voice-assistants
```

### Update a voice assistant:
```bash
curl -X PUT http://localhost:9000/api/voice-assistants/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Алиса Pro",
    "price": 39.99
  }'
```

### Delete a voice assistant:
```bash
curl -X DELETE http://localhost:9000/api/voice-assistants/{id}
```

## Database Schema

The `voice_assistants` table has the following structure:

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
