const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    
    const { name, email, password, role, phone, address, dateOfBirth } = req.body;
    
    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = { name, email, password, role, phone, address };
    
    if (dateOfBirth) {
      userData.dateOfBirth = new Date(dateOfBirth);
    }
    
    const user = new User(userData);
    await user.save();
    
    console.log('User created:', user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      data: { 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, data: { user: { id: user._id, name: user.name, email, role: user.role } } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Add real-time stats for practitioners
    if (user.role === 'practitioner') {
      const Appointment = require('../models/Appointment');
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const [totalAppointments, monthlyAppointments, completedAppointments] = await Promise.all([
        Appointment.countDocuments({ practitioner: user._id }),
        Appointment.countDocuments({ 
          practitioner: user._id, 
          date: { $gte: startOfMonth } 
        }),
        Appointment.countDocuments({ 
          practitioner: user._id, 
          status: 'completed' 
        })
      ]);
      
      user._doc.stats = {
        totalAppointments,
        monthlyAppointments,
        completedAppointments,
        earnings: user.earnings || { totalEarnings: 0, monthlyEarnings: 0 }
      };
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address, dateOfBirth, specialization, experience, qualification, consultationFee, availability } = req.body;
    
    const updateData = { name, phone, address, dateOfBirth };
    
    if (req.user.role === 'practitioner') {
      updateData.specialization = specialization;
      updateData.experience = experience;
      updateData.qualification = qualification;
      updateData.consultationFee = consultationFee;
      updateData.availability = availability;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;