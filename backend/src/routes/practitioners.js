const express = require('express');
const {
  getPractitioners,
  getPractitioner,
  getAvailableSlots,
  getDashboardStats
} = require('../controllers/practitionerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPractitioners);
router.get('/available-slots', getAvailableSlots);
router.get('/dashboard', protect, authorize('practitioner'), getDashboardStats);
router.get('/:id', getPractitioner);

module.exports = router;