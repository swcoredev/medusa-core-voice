# Voice Assistants API Documentation (Extended)

## Base URL
```
http://localhost:9000
```

## Authentication
Currently no authentication required (development mode).

## Endpoints

### Voice Assistants API

#### 1. GET /api/voice-assistants
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

#### 2. GET /api/voice-assistants/:id
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

#### 3. POST /api/voice-assistants
Create new voice assistant.

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "category": "string (optional)",
  "price": "decimal (optional)",
  "developer_id": "uuid (optional)",
  "status": "string (optional, default: 'pending')"
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

#### 5. DELETE /api/voice-assistants/:id
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

### Developers API

#### 6. POST /api/developers/register
Register new developer.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Developer registered successfully"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Developer with this email already exists"
}
```

#### 7. GET /api/developers
Get all developers.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "count": 1
}
```

#### 8. POST /api/developers/assistants
Upload assistant by developer.

**Request Body:**
```json
{
  "developer_id": "uuid (required)",
  "name": "string (required)",
  "description": "string (optional)",
  "category": "string (optional)",
  "price": "decimal (optional)"
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
    "status": "pending",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Assistant uploaded successfully and pending approval"
}
```

#### 9. GET /api/developers/assistants
Get assistants by developer.

**Query Parameters:**
- `developer_id` (string, required): Developer UUID

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
  "count": 1
}
```

### Status Management API

#### 10. PUT /api/voice-assistants/:id/approve
Approve voice assistant.

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
    "status": "approved",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Voice assistant approved successfully"
}
```

#### 11. PUT /api/voice-assistants/:id/reject
Reject voice assistant.

**Parameters:**
- `id` (string, required): Voice assistant UUID

**Request Body:**
```json
{
  "reason": "string (optional)"
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
    "status": "rejected",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Voice assistant rejected successfully"
}
```

#### 12. PUT /api/voice-assistants/:id/publish
Publish voice assistant.

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
    "status": "published",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "message": "Voice assistant published successfully"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Assistant Status Flow

1. **pending** - Newly uploaded by developer, awaiting approval
2. **approved** - Approved by admin, ready for publication
3. **rejected** - Rejected by admin
4. **published** - Published and available to customers

## Example Usage

### Register a developer:
```bash
curl -X POST http://localhost:9000/api/developers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Dev",
    "email": "max@example.com"
  }'
```

### Upload assistant by developer:
```bash
curl -X POST http://localhost:9000/api/developers/assistants \
  -H "Content-Type: application/json" \
  -d '{
    "developer_id": "dev-001",
    "name": "HotelBot",
    "description": "Ассистент для бронирования номеров",
    "category": "hotel",
    "price": 49.99
  }'
```

### Approve assistant:
```bash
curl -X PUT http://localhost:9000/api/voice-assistants/{id}/approve
```

### Reject assistant:
```bash
curl -X PUT http://localhost:9000/api/voice-assistants/{id}/reject \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Описание слишком короткое"
  }'
```

### Publish assistant:
```bash
curl -X PUT http://localhost:9000/api/voice-assistants/{id}/publish
```

### Get developer's assistants:
```bash
curl "http://localhost:9000/api/developers/assistants?developer_id=dev-001"
```

## Database Schema

### developers table:
```sql
CREATE TABLE developers (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### voice_assistants table (updated):
```sql
CREATE TABLE voice_assistants (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2),
  developer_id VARCHAR(255) REFERENCES developers(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Managed Marketplace Flow

1. **Developer Registration**: Developers register via `/api/developers/register`
2. **Assistant Upload**: Developers upload assistants via `/api/developers/assistants` (status: pending)
3. **Admin Review**: Admin reviews and approves/rejects via `/api/voice-assistants/:id/approve` or `/api/voice-assistants/:id/reject`
4. **Publication**: Approved assistants are published via `/api/voice-assistants/:id/publish`
5. **Customer Access**: Published assistants are available to customers via `/api/voice-assistants`
