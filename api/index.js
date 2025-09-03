const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'ayursutra_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB error:', err));
}

// Health check
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('../backend/src/routes/auth'));
app.use('/api/patients', require('../backend/src/routes/patients'));
app.use('/api/practitioners', require('../backend/src/routes/practitioners'));
app.use('/api/bookings', require('../backend/src/routes/bookings'));
app.use('/api/therapies', require('../backend/src/routes/therapies'));
app.use('/api/notifications', require('../backend/src/routes/notifications'));
app.use('/api/admin', require('../backend/src/routes/admin'));

module.exports = app;