const express = require('express');
const router = express.Router();
const { getAnalytics, getDashboardSummary } = require('../controllers/analyticsController');

// All routes are now public
router.get('/', getAnalytics);
router.get('/dashboard', getDashboardSummary);

module.exports = router; 