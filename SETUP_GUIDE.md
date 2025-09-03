# AyurSutra Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd ayursutra
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Database Setup
Choose one of the following options:

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Database will be created automatically at: `mongodb://localhost:27017/ayursutra`

#### Option B: MongoDB Atlas (Recommended)
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in step 4

### 4. Environment Configuration
Create a `.env` file in the `backend` folder with the following content:

```env
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000

# MongoDB - Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/ayursutra

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Google OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Optional)
EMAIL_FROM=noreply@ayursutra.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
```

### 5. Generate Secure Keys
Replace the placeholder values with secure random strings:
- `JWT_SECRET`: Use a long random string (32+ characters)
- `SESSION_SECRET`: Use a long random string (32+ characters)

### 6. Start the Application
```bash
# Start backend (from backend folder)
cd backend
npm run dev

# Start frontend (from root folder, new terminal)
npm start
```

### 7. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally OR
- Check your MongoDB Atlas connection string
- Verify network access in MongoDB Atlas

### Authentication Not Working
- Check if `.env` file exists in backend folder
- Verify JWT_SECRET and SESSION_SECRET are set
- Check browser console for errors

### Port Already in Use
- Kill processes on ports 3000 and 8000
- Or change PORT in .env file