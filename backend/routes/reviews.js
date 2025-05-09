const express = require('express');
const router = express.Router();
const {
  createReview,
  getServiceReviews,
  getRecommendedServices,
  markReviewHelpful,
  getProviderReviews
} = require('../controllers/reviewController');

// All routes are now public
router.get('/service/:serviceId', getServiceReviews);
router.get('/recommended', getRecommendedServices);
router.post('/booking/:bookingId', createReview);
router.post('/:reviewId/helpful', markReviewHelpful);
router.get('/provider/:providerId', getProviderReviews);

module.exports = router; 