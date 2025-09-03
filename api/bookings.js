const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Booking = require('../backend/src/models/Booking');
const User = require('../backend/src/models/User');

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB error:', err));
}

const getUser = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return await User.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url, method } = req;
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Create booking
    if (method === 'POST' && !url.includes('/status') && !url.includes('/feedback')) {
      const { practitioner, therapyType, date, time, duration, amount, notes } = req.body || {};
      
      const booking = await Booking.create({
        patient: user._id,
        practitioner,
        therapy: therapyType,
        date: new Date(date),
        time,
        duration: duration || 60,
        amount,
        notes
      });

      await booking.populate([
        { path: 'patient', select: 'name email phone' },
        { path: 'practitioner', select: 'name specialization' }
      ]);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: { booking }
      });
    }

    // Get my bookings
    if (url.includes('/my') && method === 'GET') {
      const query = user.role === 'patient' ? { patient: user._id } : { practitioner: user._id };
      
      const bookings = await Booking.find(query)
        .populate('patient', 'name email phone age gender')
        .populate('practitioner', 'name specialization')
        .sort({ date: -1 });

      return res.status(200).json({
        success: true,
        data: { bookings }
      });
    }

    // Dashboard stats
    if (url.includes('/dashboard-stats') && method === 'GET') {
      let stats = {};

      if (user.role === 'practitioner') {
        const totalPatients = await Booking.distinct('patient', { practitioner: user._id }).length;
        const todayBookings = await Booking.countDocuments({
          practitioner: user._id,
          date: {
            $gte: new Date().setHours(0, 0, 0, 0),
            $lt: new Date().setHours(23, 59, 59, 999)
          }
        });
        
        const monthlyRevenue = await Booking.aggregate([
          {
            $match: {
              practitioner: new mongoose.Types.ObjectId(user._id),
              status: 'completed',
              date: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        stats = {
          totalPatients,
          todayBookings,
          avgRating: user.rating || 0,
          totalRatings: user.totalRatings || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0
        };
      }

      return res.status(200).json({
        success: true,
        data: { stats }
      });
    }

    res.status(404).json({ success: false, message: 'Booking endpoint not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};