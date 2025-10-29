# 📡 API Documentation - Todo List App

## 🔗 Base Configuration

```typescript
const API_BASE_URL = 'http://localhost:4000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds
```

## 📋 Endpoints

### 1. **GET /api/v1/notes**
Get all notes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Buy groceries",
      "content": "Buy groceries",
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. **GET /api/v1/notes/{id}**
Get single note by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Buy groceries",
    "content": "Buy groceries",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. **POST /api/v1/notes**
Create new note

**Request Body:**
```json
{
  "title": "New todo",
  "content": "New todo content",
  "completed": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "title": "New todo",
    "content": "New todo content",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. **PUT /api/v1/notes/{id}**
Update existing note

**Request Body:**
```json
{
  "title": "Updated todo",
  "content": "Updated content",
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Updated todo",
    "content": "Updated content",
    "completed": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. **DELETE /api/v1/notes/{id}**
Delete note

**Response:**
```json
{
  "success": true,
  "data": null
}
```

## 🛠️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## 🐛 Debug Features

### Console Logging
All API requests are logged in development mode:

```typescript
// Example console output
🚀 API GET: http://localhost:4000/api/v1/notes
📤 Request data: undefined
📥 Response: { success: true, data: [...] }
```

### API Status Component
Shows connection status and debug information:
- Connection indicator (wifi icon)
- Last sync time
- Retry button when disconnected

## 🧪 Testing

### Manual Testing with cURL

```bash
# Get all notes
curl -X GET http://localhost:4000/api/v1/notes

# Create new note
curl -X POST http://localhost:4000/api/v1/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test todo","content":"Test content","completed":false}'

# Update note
curl -X PUT http://localhost:4000/api/v1/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated todo","completed":true}'

# Delete note
curl -X DELETE http://localhost:4000/api/v1/notes/1
```

### Testing with Postman
1. Import the collection from `postman/` folder
2. Set base URL to `http://localhost:4000/api/v1`
3. Run the requests in sequence

## 🔧 Configuration

### Environment Variables
```typescript
// In services/api.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
```

### Timeout Configuration
```typescript
const API_TIMEOUT = 10000; // Adjust based on your needs
```

## 📱 Mobile Testing

### iOS Simulator
- Use `http://localhost:4000` (localhost works)
- Or use your computer's IP: `http://192.168.1.100:4000`

### Android Emulator
- Use `http://10.0.2.2:4000` (special IP for Android emulator)
- Or use your computer's IP: `http://192.168.1.100:4000`

### Physical Device
- Use your computer's IP address: `http://192.168.1.100:4000`
- Make sure both devices are on the same network

## 🚀 Production Considerations

1. **HTTPS**: Use HTTPS in production
2. **Authentication**: Add JWT tokens for user authentication
3. **Rate Limiting**: Implement rate limiting
4. **Caching**: Add response caching
5. **Error Monitoring**: Integrate with error tracking services
6. **Offline Support**: Implement offline-first architecture
