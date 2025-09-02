const User = require('../models/User');
const Booking = require('../models/Booking');
const Therapy = require('../models/Therapy');

exports.getDashboardStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Overview stats
    const totalPatients = await User.countDocuments({ role: 'patient', isActive: true });
    const totalPractitioners = await User.countDocuments({ role: 'practitioner', isActive: true });
    
    const todayBookings = await Booking.countDocuments({
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });

    const monthlyBookings = await Booking.find({
      date: { $gte: monthStart },
      status: 'completed'
    });

    const totalRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.price, 0);

    // Recent transactions
    const recentTransactions = await Booking.find({
      status: { $in: ['completed', 'pending'] }
    })
    .populate('patient', 'name')
    .populate('practitioner', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

    // System health (mock data for demo)
    const systemHealth = [
      { metric: 'Server Uptime', value: '99.9%', status: 'excellent' },
      { metric: 'Response Time', value: '120ms', status: 'good' },
      { metric: 'Error Rate', value: '0.1%', status: 'excellent' },
      { metric: 'Database Load', value: '65%', status: 'good' }
    ];

    res.status(200).json({
      success: true,
      data: {
        overview: [
          { 
            label: 'Total Revenue', 
            value: `₹${(totalRevenue / 100000).toFixed(1)}L`, 
            change: '+12%', 
            icon: '💰', 
            color: 'from-green-500 to-green-600' 
          },
          { 
            label: 'Active Patients', 
            value: totalPatients.toString(), 
            change: '+8%', 
            icon: '👥', 
            color: 'from-blue-500 to-blue-600' 
          },
          { 
            label: 'Practitioners', 
            value: totalPractitioners.toString(), 
            change: '+3%', 
            icon: '👨⚕️', 
            color: 'from-purple-500 to-purple-600' 
          },
          { 
            label: 'Sessions Today', 
            value: todayBookings.toString(), 
            change: '+15%', 
            icon: '📅', 
            color: 'from-orange-500 to-orange-600' 
          }
        ],
        systemHealth,
        recentTransactions: recentTransactions.map(booking => ({
          id: booking._id,
          patient: booking.patient.name,
          practitioner: booking.practitioner.name,
          amount: booking.price,
          therapy: booking.therapyType,
          date: booking.date,
          status: booking.status,
          paymentMethod: booking.paymentMethod || 'UPI',
          transactionId: booking.transactionId || `TXN${Date.now()}`
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { role, page = 1, limit = 10 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};