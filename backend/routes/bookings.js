const express = require('express');
const Appointment = require('../models/Appointment');
const Therapy = require('../models/Therapy');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking (converts to appointment)
router.post('/', auth, async (req, res) => {
  try {
    const { practitioner, therapyType, date, time, duration, price, notes } = req.body;
    
    // Find therapy by name
    let therapy = await Therapy.findOne({ name: therapyType });
    if (!therapy) {
      // Create therapy if it doesn't exist
      therapy = new Therapy({
        name: therapyType,
        price: price || 2500,
        duration: duration || 60,
        description: `Traditional Ayurvedic ${therapyType} therapy`
      });
      await therapy.save();
    }
    
    // Check if practitioner exists
    const practitionerUser = await User.findById(practitioner);
    if (!practitionerUser || practitionerUser.role !== 'practitioner') {
      return res.status(400).json({
        success: false,
        message: 'Invalid practitioner'
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      practitioner,
      date: new Date(date),
      timeSlot: time,
      status: { $nin: ['cancelled', 'no-show'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user._id,
      practitioner,
      therapy: therapy._id,
      date: new Date(date),
      timeSlot: time,
      notes: notes || '',
      totalAmount: price || therapy.price,
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
      '📅 New Booking Request',
      `${req.user.name} has booked ${therapyType} on ${appointmentDate} at ${time}. Please review and confirm.`,
      'booking_request',
      appointment._id,
      'high'
    );
    
    // Notify patient about successful booking
    await createNotification(
      req.user._id,
      '📅 Booking Confirmed',
      `Your ${therapyType} session on ${appointmentDate} at ${time} has been booked successfully. The practitioner will confirm shortly.`,
      'booking_confirmation',
      appointment._id,
      'medium'
    );
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: appointment
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Booking failed',
      error: error.message
    });
  }
});

// Get bookings (returns appointments)
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
    
    res.json({
      success: true,
      count: appointments.length,
      data: {
        bookings: appointments
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;