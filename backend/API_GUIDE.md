# AyurSutra Backend API Guide

## Overview
Complete backend API for AyurSutra Panchakarma Patient Management & Therapy Scheduling Software.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
Make sure `.env` file exists with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ayursutra
JWT_SECRET=ayursutra_jwt_secret_key_2024
NODE_ENV=development
```

### 3. Seed Database (Optional)
```bash
npm run seed
```

### 4. Start Server
```bash
npm start
# or for development
npm run dev
```

## Test Credentials (After Seeding)

### Admin
- Email: `admin@ayursutra.com`
- Password: `admin123`

### Practitioners
- Dr. Rajesh Sharma: `rajesh@ayursutra.com` / `doctor123`
- Dr. Priya Patel: `priya@ayursutra.com` / `doctor123`
- Dr. Amit Kumar: `amit@ayursutra.com` / `doctor123`

### Patients
- Aman Maurya: `aman@example.com` / `patient123`
- Sneha Gupta: `sneha@example.com` / `patient123`
- Rahul Singh: `rahul@example.com` / `patient123`
- Kavya Reddy: `kavya@example.com` / `patient123`

## API Endpoints

### Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient", // or "practitioner"
  "phone": "+91-9876543210",
  "address": "Delhi, India",
  "dateOfBirth": "1990-01-01"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+91-9876543210",
  "address": "Updated Address"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Practitioners (`/api/practitioners`)

#### Get All Practitioners
```http
GET /api/practitioners
# Optional query parameters:
# ?specialization=panchakarma
# ?available=true
```

#### Get Practitioner by ID
```http
GET /api/practitioners/:id
```

#### Get Practitioner Dashboard Stats
```http
GET /api/practitioners/:id/dashboard
Authorization: Bearer <practitioner_token>
```

### Patients (`/api/patients`)

#### Get All Patients (Practitioner Only)
```http
GET /api/patients
Authorization: Bearer <practitioner_token>
# Optional query parameters:
# ?search=john
# ?page=1&limit=20
```

#### Get Patient Details (Practitioner Only)
```http
GET /api/patients/:id
Authorization: Bearer <practitioner_token>
```

#### Get Patient Dashboard Stats
```http
GET /api/patients/dashboard/stats
Authorization: Bearer <patient_token>
```

### Therapies (`/api/therapies`)

#### Get All Therapies
```http
GET /api/therapies
# Optional query parameters:
# ?category=panchakarma
# ?minPrice=1000&maxPrice=5000
# ?search=massage
```

#### Get Therapy by ID
```http
GET /api/therapies/:id
```

#### Get Therapy Categories
```http
GET /api/therapies/categories/list
```

#### Create Therapy (Admin Only)
```http
POST /api/therapies
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Therapy",
  "description": "Therapy description",
  "duration": 60,
  "price": 2000,
  "category": "massage",
  "benefits": ["Benefit 1", "Benefit 2"],
  "contraindications": ["Condition 1"],
  "preparationInstructions": "Instructions",
  "aftercareInstructions": "Aftercare"
}
```

### Appointments (`/api/appointments`)

#### Get User Appointments
```http
GET /api/appointments
Authorization: Bearer <token>
```

#### Get Appointment by ID
```http
GET /api/appointments/:id
Authorization: Bearer <token>
```

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "practitioner": "practitioner_id",
  "therapy": "therapy_id",
  "date": "2024-01-15",
  "timeSlot": "10:00",
  "notes": "Optional notes"
}
```

#### Update Appointment Status
```http
PATCH /api/appointments/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed" // or "cancelled", "confirmed", etc.
}
```

#### Cancel Appointment
```http
PATCH /api/appointments/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Cancellation reason"
}
```

#### Get Available Slots
```http
GET /api/appointments/slots/:practitionerId/:date
Authorization: Bearer <token>
```

#### Get Dashboard Stats
```http
GET /api/appointments/stats/dashboard
Authorization: Bearer <token>
```

### Feedback (`/api/feedback`)

#### Create Feedback
```http
POST /api/feedback
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "appointment": "appointment_id",
  "rating": 5,
  "symptoms": ["stress", "fatigue"],
  "improvement": "much_better",
  "comments": "Excellent treatment!"
}
```

#### Get Practitioner Feedback
```http
GET /api/feedback/practitioner
Authorization: Bearer <practitioner_token>
```

### Notifications (`/api/notifications`)

#### Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
# Optional query parameters:
# ?page=1&limit=20
# ?unreadOnly=true
```

#### Mark Notification as Read
```http
PATCH /api/notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All Notifications as Read
```http
PATCH /api/notifications/mark-all-read
Authorization: Bearer <token>
```

#### Delete Notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

### Admin (`/api/admin`)

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <admin_token>
```

#### Get Recent Activities
```http
GET /api/admin/dashboard/activities
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
# Optional query parameters:
# ?role=patient&search=john&status=active
# ?page=1&limit=20
```

#### Update User Status
```http
PATCH /api/admin/users/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Get All Appointments (Admin View)
```http
GET /api/admin/appointments
Authorization: Bearer <admin_token>
# Optional query parameters:
# ?status=completed&practitioner=id&date=2024-01-15
# ?page=1&limit=20
```

#### Get Revenue Analytics
```http
GET /api/admin/analytics/revenue
Authorization: Bearer <admin_token>
# Optional query parameters:
# ?period=monthly (daily, monthly, yearly)
```

#### Get Therapy Analytics
```http
GET /api/admin/analytics/therapies
Authorization: Bearer <admin_token>
```

## Health Check
```http
GET /health
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

### User Roles
- `patient` - Can book appointments, view their data
- `practitioner` - Can manage their appointments, view patient data
- `admin` - Full system access

### Appointment Statuses
- `scheduled` - Initial booking
- `confirmed` - Confirmed by practitioner
- `in-progress` - Currently happening
- `completed` - Finished successfully
- `cancelled` - Cancelled by user/practitioner
- `no-show` - Patient didn't show up

### Payment Statuses
- `pending` - Payment not yet made
- `paid` - Payment completed
- `refunded` - Payment refunded

### Therapy Categories
- `panchakarma` - Traditional detox treatments
- `massage` - Various massage therapies
- `consultation` - Doctor consultations
- `herbal-treatment` - Herbal medicine treatments
- `yoga-therapy` - Yoga and meditation sessions

## Frontend Integration

### Setting up API calls in React:

```javascript
// api.js
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  // Auth
  login: (credentials) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }),
  
  // Protected requests
  getAppointments: (token) =>
    fetch(`${API_BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }),
  
  // Create appointment
  createAppointment: (token, appointmentData) =>
    fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(appointmentData)
    })
};
```

## Development Notes

1. **Database**: MongoDB with Mongoose ODM
2. **Authentication**: JWT tokens with 7-day expiry
3. **Password Hashing**: bcryptjs with salt rounds of 10
4. **Validation**: express-validator for input validation
5. **CORS**: Configured for localhost:3000 in development
6. **Error Handling**: Centralized error handling middleware
7. **Logging**: Request logging for debugging

## Production Deployment

1. Set `NODE_ENV=production`
2. Update CORS origins in server.js
3. Use secure JWT secret
4. Set up MongoDB Atlas or production database
5. Configure proper logging
6. Set up SSL/HTTPS
7. Use environment variables for all sensitive data

This backend provides a complete, production-ready API for the AyurSutra application with full authentication, authorization, and comprehensive functionality for managing patients, practitioners, appointments, and therapies.