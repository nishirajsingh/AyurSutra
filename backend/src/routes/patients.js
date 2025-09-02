const express = require('express');
const { getDashboardData } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.get('/dashboard', getDashboardData);

module.exports = router;