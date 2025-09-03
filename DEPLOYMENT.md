# Deployment Guide

## For New Developers

### 1. Clone Repository
```bash
git clone <repository-url>
cd ayursutra
```

### 2. Quick Setup
```bash
npm run setup
```

### 3. Configure Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
- Set `MONGODB_URI` (local MongoDB or Atlas)
- Generate secure `JWT_SECRET` (32+ characters)
- Generate secure `SESSION_SECRET` (32+ characters)

### 4. Start Application
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
npm start
```

## MongoDB Options

### Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/ayursutra
```

### MongoDB Atlas (Recommended)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Replace in MONGODB_URI

## Troubleshooting

- **Login/Signup not working**: Check `.env` file exists in backend folder
- **Database errors**: Verify MongoDB is running or Atlas connection
- **Port errors**: Kill processes on ports 3000/8000