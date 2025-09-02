const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: String,
  durations: [{
    minutes: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    popular: {
      type: Boolean,
      default: false
    }
  }],
  benefits: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Therapy', therapySchema);