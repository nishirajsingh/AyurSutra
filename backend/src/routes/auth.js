const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  googleAuth,
  googleCallback,
  completeGoogleProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'practitioner', 'admin']).withMessage('Invalid role')
], register);

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', require('passport').authenticate('google', { failureRedirect: '/login' }), googleCallback);
router.put('/complete-profile', protect, completeGoogleProfile);

module.exports = router;