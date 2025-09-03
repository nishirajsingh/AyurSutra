const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  practitioner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapy: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'online']
  },
  transactionId: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 500
  },
  symptoms: [String],
  treatmentPlan: {
    type: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    submittedAt: {
      type: Date
    }
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ patient: 1, date: 1 });
bookingSchema.index({ practitioner: 1, date: 1 });
bookingSchema.index({ status: 1 });

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Virtual for formatted time
bookingSchema.virtual('formattedTime').get(function() {
  return this.time;
});

module.exports = mongoose.model('Booking', bookingSchema);