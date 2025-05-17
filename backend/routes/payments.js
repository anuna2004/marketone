const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const {
  createPaymentIntent,
  handleSuccessfulPayment,
  handleFailedPayment,
  getPaymentHistory
} = require('../controllers/paymentController');

// Enhanced error handling middleware
const asyncHandler = fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error('=== PAYMENT ERROR ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('Request Body:', req.body);
    console.error('Request Params:', req.params);
    console.error('Error Stack:', error.stack);
    console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        type: error.type,
        code: error.code,
        stack: error.stack
      } : 'Internal server error',
      requestId: req.id
    });
  }
};

// Create payment intent
router.post('/create-intent/:bookingId', asyncHandler(createPaymentIntent));

// Handle successful payment
router.post('/success/:bookingId', asyncHandler(handleSuccessfulPayment));

// Handle failed payment
router.post('/failed/:bookingId', asyncHandler(handleFailedPayment));

// Get payment history
router.get('/history', getPaymentHistory);

// Test Stripe connection
router.get('/test-connection', async (req, res) => {
  try {
    console.log('Testing Stripe connection...');
    // Try to retrieve a balance to test the connection
    const balance = await stripe.balance.retrieve();
    res.json({
      success: true,
      message: 'Stripe connection successful',
      balance: balance.available[0]
    });
  } catch (error) {
    console.error('Stripe connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Stripe connection test failed',
      error: {
        message: error.message,
        type: error.type,
        code: error.code,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

module.exports = router; 