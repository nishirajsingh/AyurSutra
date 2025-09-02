const express = require('express');
const {
  getTherapies,
  getTherapy,
  createTherapy,
  updateTherapy
} = require('../controllers/therapyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getTherapies)
  .post(protect, authorize('admin'), createTherapy);

router.route('/:id')
  .get(getTherapy)
  .put(protect, authorize('admin'), updateTherapy);

module.exports = router;