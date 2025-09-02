const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getPractitioners = async (req, res, next) => {
  try {
    const practitioners = await User.find({ 
      role: 'practitioner', 
      isActive: true 
    }).select('name email practitionerDetails');

    res.status(200).json({
      success: true,
      count: practitioners.length,
      data: {
        practitioners
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPractitioner = async (req, res, next) => {
  try {
    const practitioner = await User.findOne({
      _id: req.params.id,
      role: 'practitioner',
      isActive: true
    }).select('name email practitionerDetails');

    if (!practitioner) {
      return res.status(404).json({
        success: false,
        message: 'Practitioner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        practitioner
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { practitionerId, date } = req.query;
    
    const practitioner = await User.findById(practitionerId);
    if (!practitioner || practitioner.role !== 'practitioner') {
      return res.status(404).json({
        success: false,
        message: 'Practitioner not found'
      });
    }

    // Get booked slots for the date
    const bookedSlots = await Booking.find({
      practitioner: practitionerId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('time');

    const bookedTimes = bookedSlots.map(booking => booking.time);
    const availableSlots = practitioner.practitionerDetails.availability.filter(
      slot => !bookedTimes.includes(slot)
    );

    res.status(200).json({
      success: true,
      data: {
        availableSlots,
        bookedSlots: bookedTimes
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's bookings
    const todayBookings = await Booking.find({
      practitioner: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).populate('patient', 'name');

    // This week's stats
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weekBookings = await Booking.find({
      practitioner: req.user.id,
      date: { $gte: weekStart },
      status: 'completed'
    });

    // Monthly revenue
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyBookings = await Booking.find({
      practitioner: req.user.id,
      date: { $gte: monthStart },
      status: 'completed'
    });

    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.price, 0);

    // Recent patients
    const recentPatients = await Booking.find({
      practitioner: req.user.id,
      status: 'completed'
    })
    .populate('patient', 'name email')
    .sort({ date: -1 })
    .limit(5);

    res.status(200).json({
      success: true,
      data: {
        todayBookings: todayBookings.length,
        weeklyBookings: weekBookings.length,
        monthlyRevenue,
        todaySchedule: todayBookings,
        recentPatients: recentPatients.map(booking => ({
          patient: booking.patient,
          therapy: booking.therapyType,
          date: booking.date
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};