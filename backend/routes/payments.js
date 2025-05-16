const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleSuccessfulPayment,
  handleFailedPayment,
  getPaymentHistory
} = require('../controllers/paymentController');

// Error handling middleware
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => {
    console.error('Payment Error:', error);
    res.status(500).json({
      message: error.message,
      type: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  });
};

// Create payment intent
router.post('/create-intent/:bookingId', asyncHandler(createPaymentIntent));

// Handle successful payment
router.post('/success/:bookingId', asyncHandler(handleSuccessfulPayment));

// Handle failed payment
router.post('/failed/:bookingId', asyncHandler(handleFailedPayment));

// Get payment history
router.get('/history', getPaymentHistory);

module.exports = router; 