const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    console.log('Registration request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      name, email, password, role, phone, address, dateOfBirth, gender, age,
      specialization, experience, qualification, licenseNumber, consultationFee
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const userData = {
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      address,
      dateOfBirth,
      gender,
      age
    };

    if (role === 'practitioner') {
      userData.specialization = specialization;
      userData.experience = experience;
      userData.qualification = qualification;
      userData.licenseNumber = licenseNumber;
      userData.consultationFee = consultationFee || 1000;
    }

    const user = await User.create(userData);
    user.lastLogin = new Date();
    await user.save();

    createSendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'phone', 'address', 'dateOfBirth', 'gender', 'age',
      'specialization', 'experience', 'qualification', 'consultationFee'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const passport = require('../config/passport');

exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

exports.googleCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    const token = signToken(req.user._id);
    
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user.getPublicProfile()))}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_error`);
  }
};

exports.completeGoogleProfile = async (req, res, next) => {
  try {
    const { phone, role, address, dateOfBirth, gender, age } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (age) user.age = age;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};