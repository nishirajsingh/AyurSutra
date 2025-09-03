const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./src/config/passport');
require('dotenv').config();

// Debug environment variables
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Found' : 'Missing');
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Found' : 'Missing');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8001', 'http://127.0.0.1:3000', 'http://127.0.0.1:8001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'ayursutra_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found in environment variables');
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/patients', require('./src/routes/patients'));
app.use('/api/practitioners', require('./src/routes/practitioners'));
app.use('/api/bookings', require('./src/routes/bookings'));
app.use('/api/therapies', require('./src/routes/therapies'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/admin', require('./src/routes/admin'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Validation Error', 
      errors: Object.values(error.errors).map(e => e.message) 
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({ message: 'Duplicate entry found' });
  }
  
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message 
  });
});

const PORT = process.env.PORT || 8001;

// Export for Vercel serverless functions
module.exports = app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 AyurSutra Backend Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
  });
}