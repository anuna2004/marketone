const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleSuccessfulPayment,
  handleFailedPayment,
  getPaymentHistory
} = require('../controllers/paymentController');

// Create payment intent
router.post('/create-intent/:bookingId', createPaymentIntent);

// Handle successful payment
router.post('/success/:bookingId', handleSuccessfulPayment);

// Handle failed payment
router.post('/failed/:bookingId', handleFailedPayment);

// Get payment history
router.get('/history', getPaymentHistory);

module.exports = router; 