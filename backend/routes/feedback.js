const express = require('express');
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');

const router = express.Router();

// Create feedback
router.post('/', auth, async (req, res) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      patient: req.user._id
    });
    
    await feedback.save();
    await feedback.populate(['appointment', 'patient']);
    
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feedback for practitioner
router.get('/practitioner', auth, async (req, res) => {
  try {
    if (req.user.role !== 'practitioner') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const feedback = await Feedback.find()
      .populate({
        path: 'appointment',
        match: { practitioner: req.user._id },
        populate: { path: 'therapy', select: 'name' }
      })
      .populate('patient', 'name');
    
    const filteredFeedback = feedback.filter(f => f.appointment);
    res.json(filteredFeedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;