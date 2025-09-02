# AyurSutra Backend API

Backend API for AyurSutra - Panchakarma Patient Management & Therapy Scheduling Software.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Patients, Practitioners, and Admin roles
- **Booking System**: Therapy session booking with availability checking
- **Notifications**: Real-time notifications for bookings and updates
- **Therapy Management**: CRUD operations for therapy types and pricing
- **Dashboard APIs**: Statistics and insights for different user roles

## Tech Stack

- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet for security headers
- CORS for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Seed the database:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/feedback` - Add session feedback

### Practitioners
- `GET /api/practitioners` - Get all practitioners
- `GET /api/practitioners/:id` - Get practitioner details
- `GET /api/practitioners/available-slots` - Check availability
- `GET /api/practitioners/dashboard` - Practitioner dashboard stats

### Therapies
- `GET /api/therapies` - Get all therapies
- `GET /api/therapies/:id` - Get therapy details
- `POST /api/therapies` - Create therapy (Admin only)
- `PUT /api/therapies/:id` - Update therapy (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## Demo Credentials

### Admin
- Email: admin@ayursutra.com
- Password: admin123

### Patient
- Email: demo@ayursutra.com
- Password: demo123

### Practitioners
- Email: priya.sharma@ayursutra.com
- Password: password123

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ayursutra
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Security headers with Helmet
- Input validation and sanitization

## License

MIT License