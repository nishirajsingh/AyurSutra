const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  submitFeedback,
  getDashboardStats
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:id', getBooking);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/feedback', submitFeedback);

module.exports = router;