const express = require('express');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Therapy = require('../models/Therapy');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get dashboard statistics
router.get('/dashboard/stats', auth, adminAuth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalUsers,
      totalPatients,
      totalPractitioners,
      totalAppointments,
      monthlyAppointments,
      yearlyAppointments,
      totalRevenue,
      monthlyRevenue,
      activeTherapies,
      avgRating
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'patient', isActive: true }),
      User.countDocuments({ role: 'practitioner', isActive: true }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ 
        date: { $gte: startOfMonth },
        status: { $nin: ['cancelled', 'no-show'] }
      }),
      Appointment.countDocuments({ 
        date: { $gte: startOfYear },
        status: { $nin: ['cancelled', 'no-show'] }
      }),
      Appointment.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      Appointment.aggregate([
        { 
          $match: { 
            paymentStatus: 'paid',
            date: { $gte: startOfMonth }
          } 
        },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).then(result => result[0]?.total || 0),
      Therapy.countDocuments({ isActive: true }),
      Feedback.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]).then(result => Math.round((result[0]?.avgRating || 0) * 10) / 10)
    ]);

    res.json({
      totalUsers,
      totalPatients,
      totalPractitioners,
      totalAppointments,
      monthlyAppointments,
      yearlyAppointments,
      totalRevenue,
      monthlyRevenue,
      activeTherapies,
      avgRating
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent activities
router.get('/dashboard/activities', auth, adminAuth, async (req, res) => {
  try {
    const recentAppointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('practitioner', 'name')
      .populate('therapy', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentFeedbacks = await Feedback.find()
      .populate('patient', 'name')
      .populate({
        path: 'appointment',
        populate: { path: 'therapy', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      recentAppointments,
      recentUsers,
      recentFeedbacks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with pagination
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;
    
    let filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status) filter.isActive = status === 'active';
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
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

// Update user status
router.patch('/users/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments with filters
router.get('/appointments', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, practitioner, date } = req.query;
    
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (practitioner) filter.practitioner = practitioner;
    if (date) {
      const selectedDate = new Date(date);
      const nextDate = new Date(selectedDate);
      nextDate.setDate(selectedDate.getDate() + 1);
      filter.date = { $gte: selectedDate, $lt: nextDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('practitioner', 'name email')
      .populate('therapy', 'name price category')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
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

// Get revenue analytics
router.get('/analytics/revenue', auth, adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupBy, dateRange;
    const now = new Date();
    
    if (period === 'daily') {
      // Last 30 days
      dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupBy = {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' }
      };
    } else if (period === 'yearly') {
      // Last 5 years
      dateRange = new Date(now.getFullYear() - 5, 0, 1);
      groupBy = { year: { $year: '$date' } };
    } else {
      // Last 12 months (default)
      dateRange = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      groupBy = {
        year: { $year: '$date' },
        month: { $month: '$date' }
      };
    }

    const revenueData = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: dateRange },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get therapy analytics
router.get('/analytics/therapies', auth, adminAuth, async (req, res) => {
  try {
    const therapyStats = await Appointment.aggregate([
      {
        $match: {
          status: { $nin: ['cancelled', 'no-show'] }
        }
      },
      {
        $group: {
          _id: '$therapy',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'therapies',
          localField: '_id',
          foreignField: '_id',
          as: 'therapy'
        }
      },
      {
        $unwind: '$therapy'
      },
      {
        $project: {
          name: '$therapy.name',
          category: '$therapy.category',
          bookings: 1,
          revenue: 1
        }
      },
      { $sort: { bookings: -1 } }
    ]);

    res.json(therapyStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;