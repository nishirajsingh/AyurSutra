# AyurSutra API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient", // optional: patient, practitioner, admin
  "phone": "+91 9876543210"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+91 9876543210",
  "profile": {
    "age": 30,
    "gender": "Male",
    "address": "123 Street, City"
  }
}
```

## Booking Endpoints

### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "practitioner": "practitioner_id",
  "therapyType": "Abhyanga",
  "date": "2024-01-15",
  "time": "10:00",
  "duration": 60,
  "price": 150
}
```

### Get User Bookings
```http
GET /bookings
Authorization: Bearer <token>
```

### Get Booking Details
```http
GET /bookings/:id
Authorization: Bearer <token>
```

### Update Booking Status (Practitioner only)
```http
PUT /bookings/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed" // pending, confirmed, completed, cancelled
}
```

### Add Feedback (Patient only)
```http
PUT /bookings/:id/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent session",
  "symptoms": ["Reduced stress", "Better sleep"]
}
```

## Practitioner Endpoints

### Get All Practitioners
```http
GET /practitioners
```

### Get Practitioner Details
```http
GET /practitioners/:id
```

### Check Available Slots
```http
GET /practitioners/available-slots?practitionerId=<id>&date=2024-01-15
```

### Practitioner Dashboard (Practitioner only)
```http
GET /practitioners/dashboard
Authorization: Bearer <token>
```

## Patient Endpoints

### Patient Dashboard (Patient only)
```http
GET /patients/dashboard
Authorization: Bearer <token>
```

## Therapy Endpoints

### Get All Therapies
```http
GET /therapies
```

### Get Therapy Details
```http
GET /therapies/:id
```

### Create Therapy (Admin only)
```http
POST /therapies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Therapy",
  "description": "Therapy description",
  "icon": "🌿",
  "durations": [
    {
      "minutes": 60,
      "price": 150,
      "popular": true
    }
  ],
  "benefits": ["Benefit 1", "Benefit 2"]
}
```

## Notification Endpoints

### Get Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

### Mark Notification as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All Notifications as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

## Admin Endpoints

### Admin Dashboard (Admin only)
```http
GET /admin/dashboard
Authorization: Bearer <token>
```

### Get Users (Admin only)
```http
GET /admin/users?role=patient&page=1&limit=10
Authorization: Bearer <token>
```

### Update User Status (Admin only)
```http
PUT /admin/users/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": true
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Demo Credentials

### Admin
- Email: `admin@ayursutra.com`
- Password: `admin123`

### Patient
- Email: `demo@ayursutra.com`
- Password: `demo123`

### Practitioners
- Email: `priya.sharma@ayursutra.com`
- Password: `password123`

- Email: `rajesh.patel@ayursutra.com`
- Password: `password123`

- Email: `meera.singh@ayursutra.com`
- Password: `password123`