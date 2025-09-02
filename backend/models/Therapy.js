const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  duration: { type: Number, required: true }, // in minutes
  price: { type: Number, required: true },
  category: { type: String, enum: ['panchakarma', 'massage', 'consultation', 'herbal-treatment', 'yoga-therapy'], required: true },
  benefits: [String],
  contraindications: [String],
  preparationInstructions: String,
  aftercareInstructions: String,
  image: String,
  popularity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Therapy', therapySchema);