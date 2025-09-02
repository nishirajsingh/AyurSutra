const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.getDashboardData = async (req, res, next) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Upcoming sessions
    const upcomingSessions = await Booking.find({
      patient: req.user.id,
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate('practitioner', 'name practitionerDetails')
    .sort({ date: 1, time: 1 })
    .limit(5);

    // Recent notifications
    const notifications = await Notification.find({
      user: req.user.id
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Progress data (mock for demo)
    const progressData = {
      sessionsCompleted: await Booking.countDocuments({
        patient: req.user.id,
        status: 'completed'
      }),
      totalSessions: await Booking.countDocuments({
        patient: req.user.id
      }),
      currentTreatment: {
        plan: 'Panchakarma Detox Program',
        progress: 65,
        nextSession: upcomingSessions[0] || null
      }
    };

    res.status(200).json({
      success: true,
      data: {
        upcomingSessions: upcomingSessions.map(session => ({
          id: session._id,
          therapy: session.therapyType,
          date: session.date,
          time: session.time,
          practitioner: session.practitioner.name,
          status: session.status
        })),
        notifications: notifications.map(notif => ({
          id: notif._id,
          message: notif.message,
          type: notif.type,
          isRead: notif.isRead,
          createdAt: notif.createdAt
        })),
        progress: progressData
      }
    });
  } catch (error) {
    next(error);
  }
};