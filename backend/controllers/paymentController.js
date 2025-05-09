const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const { getIO } = require('../utils/socket');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('serviceId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.serviceId.price * 100, // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        serviceId: booking.serviceId._id.toString(),
        customerId: booking.customerId,
        providerId: booking.providerId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle successful payment
const handleSuccessfulPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'completed';
    await booking.save();

    // Notify provider about payment
    const io = getIO();
    io.to(`provider-${booking.providerId}`).emit('paymentReceived', {
      bookingId: booking._id,
      amount: booking.serviceId.price
    });

    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle failed payment
const handleFailedPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = 'failed';
    await booking.save();

    // Notify customer about failed payment
    const io = getIO();
    io.to(`customer-${booking.customerId}`).emit('paymentFailed', {
      bookingId: booking._id,
      message: 'Payment failed. Please try again.'
    });

    res.json({ message: 'Payment failed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const { userId, role } = req.query;
    const query = role === 'provider' ? { providerId: userId } : { customerId: userId };
    
    const bookings = await Booking.find(query)
      .populate('serviceId')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  handleSuccessfulPayment,
  handleFailedPayment,
  getPaymentHistory
}; 