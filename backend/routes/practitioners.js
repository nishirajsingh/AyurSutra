const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all practitioners
router.get('/', async (req, res) => {
  try {
    const { specialization, available } = req.query;
    
    let filter = { role: 'practitioner', isActive: true };
    if (specialization) {
      filter.specialization = new RegExp(specialization, 'i');
    }
    
    const practitioners = await User.find(filter)
      .select('-password')
      .sort({ name: 1 });
    
    // Add rating and appointment count for each practitioner
    const practitionersWithStats = await Promise.all(
      practitioners.map(async (practitioner) => {
        const appointmentCount = await Appointment.countDocuments({
          practitioner: practitioner._id,
          status: 'completed'
        });
        
        const feedbacks = await Feedback.find()
          .populate({
            path: 'appointment',
            match: { practitioner: practitioner._id }
          });
        
        const validFeedbacks = feedbacks.filter(f => f.appointment);
        const avgRating = validFeedbacks.length > 0 
          ? validFeedbacks.reduce((sum, f) => sum + f.rating, 0) / validFeedbacks.length 
          : 0;
        
        return {
          ...practitioner.toObject(),
          stats: {
            appointmentCount,
            avgRating: Math.round(avgRating * 10) / 10,
            reviewCount: validFeedbacks.length
          }
        };
      })
    );
    
    res.json(practitionersWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get practitioner by ID
router.get('/:id', async (req, res) => {
  try {
    const practitioner = await User.findOne({ 
      _id: req.params.id, 
      role: 'practitioner', 
      isActive: true 
    }).select('-password');
    
    if (!practitioner) {
      return res.status(404).json({ message: 'Practitioner not found' });
    }
    
    // Get practitioner stats
    const appointmentCount = await Appointment.countDocuments({
      practitioner: practitioner._id,
      status: 'completed'
    });
    
    const feedbacks = await Feedback.find()
      .populate({
        path: 'appointment',
        match: { practitioner: practitioner._id }
      })
      .populate('patient', 'name');
    
    const validFeedbacks = feedbacks.filter(f => f.appointment);
    const avgRating = validFeedbacks.length > 0 
      ? validFeedbacks.reduce((sum, f) => sum + f.rating, 0) / validFeedbacks.length 
      : 0;
    
    res.json({
      ...practitioner.toObject(),
      stats: {
        appointmentCount,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: validFeedbacks.length
      },
      reviews: validFeedbacks.slice(0, 5) // Latest 5 reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get practitioner dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const practitionerId = req.user._id;
    
    const [todayAppointments, totalPatients, monthlyRevenue, avgRating, pendingCount, completedToday] = await Promise.all([
      // Today's appointments
      Appointment.countDocuments({
        practitioner: practitionerId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['cancelled', 'no-show'] }
      }),
      
      // Total unique patients
      Appointment.distinct('patient', { practitioner: practitionerId }).then(patients => patients.length),
      
      // Get earnings from user profile
      User.findById(practitionerId).then(user => user?.earnings?.monthlyEarnings || 0),
      
      // Average rating
      Feedback.aggregate([
        {
          $lookup: {
            from: 'appointments',
            localField: 'appointment',
            foreignField: '_id',
            as: 'appointmentData'
          }
        },
        {
          $match: {
            'appointmentData.practitioner': practitionerId
          }
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' }
          }
        }
      ]).then(result => Math.round((result[0]?.avgRating || 4.5) * 10) / 10),
      
      // Pending appointments
      Appointment.countDocuments({
        practitioner: practitionerId,
        status: 'scheduled'
      }),
      
      // Completed today
      Appointment.countDocuments({
        practitioner: practitionerId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: 'completed'
      })
    ]);
    
    // Get practitioner name
    const practitioner = await User.findById(practitionerId).select('name specialization');
    
    res.json({
      todayAppointments,
      totalPatients,
      monthlyRevenue,
      avgRating,
      pendingCount,
      completedToday,
      remainingToday: todayAppointments - completedToday,
      practitionerName: practitioner?.name || 'Unknown',
      specialization: practitioner?.specialization || 'General Ayurveda'
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;