const express = require('express');
const Appointment = require('../models/Appointment');
const Therapy = require('../models/Therapy');
const auth = require('../middleware/auth');

const router = express.Router();

// Get appointments
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'patient' 
      ? { patient: req.user._id }
      : { practitioner: req.user._id };
    
    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('practitioner', 'name email')
      .populate('therapy', 'name duration price')
      .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { practitioner, therapy, date, timeSlot, notes } = req.body;
    
    // Get therapy price
    const therapyDoc = await Therapy.findById(therapy);
    
    const appointment = new Appointment({
      patient: req.user._id,
      practitioner,
      therapy,
      date,
      timeSlot,
      notes: notes || '',
      totalAmount: therapyDoc ? therapyDoc.price : 1000,
      status: 'scheduled'
    });
    
    await appointment.save();
    
    // Create notification for practitioner
    const { createNotification } = require('./notifications');
    const appointmentDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    await createNotification(
      practitioner,
      '📅 New Appointment Request',
      `${req.user.name} has requested an appointment for ${therapyDoc.name} on ${appointmentDate} at ${timeSlot}. Please review and confirm the appointment.`,
      'appointment_request',
      appointment._id,
      'high'
    );
    
    // Also notify patient about successful booking
    await createNotification(
      req.user._id,
      '📅 Appointment Requested',
      `Your appointment request for ${therapyDoc.name} on ${appointmentDate} at ${timeSlot} has been sent to the practitioner. You will receive a confirmation once approved.`,
      'booking_confirmation',
      appointment._id,
      'medium'
    );
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ 
      message: 'Booking failed',
      error: error.message
    });
  }
});

// Get available slots
router.get('/slots/:practitionerId/:date', auth, async (req, res) => {
  try {
    const { practitionerId, date } = req.params;
    const bookedSlots = await Appointment.find({
      practitioner: practitionerId,
      date: new Date(date),
      status: { $nin: ['cancelled', 'no-show'] }
    }).select('timeSlot');
    
    const allSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const availableSlots = allSlots.filter(slot => 
      !bookedSlots.some(booking => booking.timeSlot === slot)
    );
    
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept appointment (practitioner only)
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('therapy', 'name');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.practitioner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    appointment.status = 'confirmed';
    appointment.confirmedAt = new Date();
    await appointment.save();
    
    // Notify patient with detailed confirmation
    const { createNotification } = require('./notifications');
    const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    await createNotification(
      appointment.patient._id,
      '✅ Appointment Confirmed!',
      `Great news! Dr. ${req.user.name} has confirmed your appointment for ${appointment.therapy.name} on ${appointmentDate} at ${appointment.timeSlot}. Please arrive 15 minutes early. Contact us if you need to reschedule.`,
      'confirmation',
      appointment._id,
      'high'
    );
    
    res.json({ message: 'Appointment accepted', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject appointment (practitioner only)
router.patch('/:id/reject', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('therapy', 'name');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.practitioner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'Rejected by practitioner';
    appointment.cancelledAt = new Date();
    await appointment.save();
    
    // Notify patient with detailed cancellation
    const { createNotification } = require('./notifications');
    const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    await createNotification(
      appointment.patient._id,
      '❌ Appointment Cancelled',
      `We're sorry, but Dr. ${req.user.name} had to cancel your appointment for ${appointment.therapy.name} scheduled on ${appointmentDate} at ${appointment.timeSlot}. Reason: ${reason || 'Schedule conflict'}. Please book a new appointment or contact us for assistance.`,
      'cancellation',
      appointment._id,
      'high'
    );
    
    res.json({ message: 'Appointment rejected', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending appointments for practitioner
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const pendingAppointments = await Appointment.find({
      practitioner: req.user._id,
      status: 'scheduled'
    })
    .populate('patient', 'name email phone')
    .populate('therapy', 'name duration price')
    .sort({ date: 1 });
    
    res.json(pendingAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete appointment and update earnings
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('therapy', 'name price');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.practitioner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    appointment.status = 'completed';
    appointment.completedAt = new Date();
    await appointment.save();
    
    // Update practitioner earnings
    const User = require('../models/User');
    const practitioner = await User.findById(req.user._id);
    
    if (practitioner && appointment.totalAmount) {
      const currentMonth = new Date().getMonth();
      const lastUpdatedMonth = practitioner.earnings?.lastUpdated ? new Date(practitioner.earnings.lastUpdated).getMonth() : -1;
      
      // Initialize earnings if not exists
      if (!practitioner.earnings) {
        practitioner.earnings = { totalEarnings: 0, monthlyEarnings: 0, lastUpdated: new Date() };
      }
      
      // Reset monthly earnings if it's a new month
      if (currentMonth !== lastUpdatedMonth) {
        practitioner.earnings.monthlyEarnings = 0;
      }
      
      practitioner.earnings.totalEarnings += appointment.totalAmount;
      practitioner.earnings.monthlyEarnings += appointment.totalAmount;
      practitioner.earnings.lastUpdated = new Date();
      
      await practitioner.save();
    }
    
    res.json({ message: 'Appointment completed and earnings updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    let filter = {};
    if (req.user.role === 'patient') {
      filter.patient = req.user._id;
    } else if (req.user.role === 'practitioner') {
      filter.practitioner = req.user._id;
    }
    
    const [totalAppointments, upcomingAppointments, completedAppointments, monthlyAppointments, todayAppointments] = await Promise.all([
      Appointment.countDocuments(filter),
      Appointment.countDocuments({ 
        ...filter, 
        date: { $gte: new Date() },
        status: { $nin: ['cancelled', 'completed', 'no-show'] }
      }),
      Appointment.countDocuments({ 
        ...filter, 
        status: 'completed' 
      }),
      Appointment.countDocuments({ 
        ...filter, 
        date: { $gte: startOfMonth }
      }),
      Appointment.countDocuments({
        ...filter,
        date: { $gte: startOfDay, $lte: endOfDay }
      })
    ]);
    
    res.json({
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      monthlyAppointments,
      todayAppointments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;