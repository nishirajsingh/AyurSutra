const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all patients (practitioner only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { search, page = 1, limit = 20 } = req.query;
    
    let filter = { role: 'patient' };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ];
    }
    
    const patients = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Add appointment count for each patient
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({
          patient: patient._id,
          practitioner: req.user._id
        });
        
        const lastAppointment = await Appointment.findOne({
          patient: patient._id,
          practitioner: req.user._id
        }).sort({ date: -1 });
        
        return {
          ...patient.toObject(),
          appointmentCount,
          lastAppointment: lastAppointment?.date
        };
      })
    );
    
    const total = await User.countDocuments(filter);
    
    res.json({
      patients: patientsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient details (practitioner only)
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const patient = await User.findOne({ 
      _id: req.params.id, 
      role: 'patient' 
    }).select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get patient's appointment history with this practitioner
    const appointments = await Appointment.find({
      patient: patient._id,
      practitioner: req.user._id
    })
    .populate('therapy', 'name category')
    .sort({ date: -1 });
    
    // Get patient's feedback
    const feedbacks = await Feedback.find({
      patient: patient._id
    })
    .populate({
      path: 'appointment',
      match: { practitioner: req.user._id },
      populate: { path: 'therapy', select: 'name' }
    })
    .sort({ createdAt: -1 });
    
    const validFeedbacks = feedbacks.filter(f => f.appointment);
    
    res.json({
      patient,
      appointments,
      feedbacks: validFeedbacks,
      stats: {
        totalAppointments: appointments.length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient dashboard (patient only)
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [totalAppointments, upcomingAppointments, completedAppointments, monthlyAppointments] = await Promise.all([
      Appointment.countDocuments({ patient: req.user._id }),
      Appointment.countDocuments({ 
        patient: req.user._id, 
        date: { $gte: today },
        status: { $nin: ['cancelled', 'completed', 'no-show'] }
      }),
      Appointment.countDocuments({ 
        patient: req.user._id, 
        status: 'completed' 
      }),
      Appointment.countDocuments({ 
        patient: req.user._id, 
        date: { $gte: startOfMonth }
      })
    ]);
    
    res.json({
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      monthlyAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;