const Booking = require('../models/Booking');
const User = require('../models/User');

// Create new booking
exports.createBooking = async (req, res, next) => {
  try {
    const { practitioner, therapyType, date, time, duration, price, notes } = req.body;

    // Check if practitioner exists and is active
    const practitionerUser = await User.findById(practitioner);
    if (!practitionerUser || practitionerUser.role !== 'practitioner' || !practitionerUser.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid practitioner selected'
      });
    }

    // Check for conflicting bookings
    const existingBooking = await Booking.findOne({
      practitioner,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const booking = await Booking.create({
      patient: req.user.id,
      practitioner,
      therapy: therapyType,
      date: new Date(date),
      time,
      duration: duration || 60,
      amount: price,
      notes
    });

    await booking.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'practitioner', select: 'name specialization rating' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'practitioner') {
      query.practitioner = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('patient', 'name email phone age gender')
      .populate('practitioner', 'name specialization rating experience')
      .sort({ date: -1, time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('patient', 'name email phone age gender medicalHistory allergies')
      .populate('practitioner', 'name specialization rating experience consultationFee');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user has access to this booking
    if (req.user.role === 'patient' && booking.patient._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'practitioner' && booking.practitioner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, treatmentPlan, notes } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only practitioner or admin can update booking status
    if (req.user.role === 'practitioner' && booking.practitioner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    booking.status = status;
    if (treatmentPlan) booking.treatmentPlan = treatmentPlan;
    if (notes) booking.notes = notes;

    await booking.save();

    await booking.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'practitioner', select: 'name specialization' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

// Submit feedback
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only patient can submit feedback
    if (booking.patient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only completed bookings can have feedback
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for completed sessions'
      });
    }

    booking.feedback = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await booking.save();

    // Update practitioner rating
    const practitioner = await User.findById(booking.practitioner);
    const totalRating = (practitioner.rating * practitioner.totalRatings) + rating;
    practitioner.totalRatings += 1;
    practitioner.rating = totalRating / practitioner.totalRatings;
    await practitioner.save();

    res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'patient') {
      const totalBookings = await Booking.countDocuments({ patient: userId });
      const completedBookings = await Booking.countDocuments({ patient: userId, status: 'completed' });
      const upcomingBookings = await Booking.countDocuments({ 
        patient: userId, 
        status: { $in: ['pending', 'confirmed'] },
        date: { $gte: new Date() }
      });

      const recentBookings = await Booking.find({ patient: userId })
        .populate('practitioner', 'name specialization')
        .sort({ date: -1 })
        .limit(5);

      stats = {
        totalBookings,
        completedBookings,
        upcomingBookings,
        recentBookings
      };
    } else if (userRole === 'practitioner') {
      const totalPatients = await Booking.distinct('patient', { practitioner: userId }).length;
      const todayBookings = await Booking.countDocuments({
        practitioner: userId,
        date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      });
      const monthlyBookings = await Booking.countDocuments({
        practitioner: userId,
        date: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        }
      });

      const recentBookings = await Booking.find({ practitioner: userId })
        .populate('patient', 'name age gender')
        .sort({ date: -1 })
        .limit(5);

      stats = {
        totalPatients,
        todayBookings,
        monthlyBookings,
        recentBookings
      };
    }

    res.status(200).json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};