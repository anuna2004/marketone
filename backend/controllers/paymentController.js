const stripe = require('../config/stripe');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { getIO } = require('../utils/socket');

// Create payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    console.log('Creating payment intent for booking:', bookingId);
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      console.log('Booking not found:', bookingId);
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Fetch service details directly
    const service = await Service.findById(booking.serviceId);
    if (!service) {
      console.log('Service not found:', booking.serviceId);
      return res.status(404).json({ message: 'Service not found' });
    }
    
    console.log('Service details:', {
      id: service._id,
      name: service.name,
      price: service.price
    });

    if (!service.price) {
      console.log('Price not found for service:', service._id);
      return res.status(400).json({ message: 'Service price is not set' });
    }

    const amount = Math.round(service.price * 100); // Convert to cents
    console.log('Creating Stripe payment intent for amount:', amount);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        serviceId: service._id.toString()
      },
      payment_method_types: ['card']
    });

    console.log('Payment intent created successfully');

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ 
      message: 'Failed to create payment intent',
      error: error.message,
      type: error.type
    });
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