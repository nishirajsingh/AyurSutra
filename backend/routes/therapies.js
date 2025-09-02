const express = require('express');
const Therapy = require('../models/Therapy');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all therapies
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    
    let filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    const therapies = await Therapy.find(filter).sort({ popularity: -1, name: 1 });
    
    // Add booking count for each therapy
    const therapiesWithStats = await Promise.all(
      therapies.map(async (therapy) => {
        const bookingCount = await Appointment.countDocuments({
          therapy: therapy._id,
          status: { $nin: ['cancelled', 'no-show'] }
        });
        
        return {
          ...therapy.toObject(),
          bookingCount
        };
      })
    );
    
    res.json({ data: { therapies: therapiesWithStats } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get therapy by ID
router.get('/:id', async (req, res) => {
  try {
    const therapy = await Therapy.findOne({ _id: req.params.id, isActive: true });
    
    if (!therapy) {
      return res.status(404).json({ message: 'Therapy not found' });
    }
    
    const bookingCount = await Appointment.countDocuments({
      therapy: therapy._id,
      status: { $nin: ['cancelled', 'no-show'] }
    });
    
    res.json({ data: { therapy: {
      ...therapy.toObject(),
      bookingCount
    } } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create therapy (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const therapy = new Therapy(req.body);
    await therapy.save();
    res.status(201).json(therapy);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update therapy (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const therapy = await Therapy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!therapy) {
      return res.status(404).json({ message: 'Therapy not found' });
    }
    
    res.json(therapy);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get therapy categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Therapy.distinct('category', { isActive: true });
    res.json({ data: { categories } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;