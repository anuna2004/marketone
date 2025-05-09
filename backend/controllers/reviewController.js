const Review = require('../models/Review');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Create a review
const createReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, review, images } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const newReview = await Review.create({
      serviceId: booking.serviceId,
      customerId: booking.customerId,
      providerId: booking.providerId,
      bookingId,
      rating,
      review,
      images
    });

    // Update service average rating
    await updateServiceRating(booking.serviceId);

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a service
const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const reviews = await Review.find({ serviceId, status: 'approved' })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ serviceId, status: 'approved' });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommended services
const getRecommendedServices = async (req, res) => {
  try {
    // Get top-rated services
    const recommendedServices = await Service.aggregate([
      {
        $match: {
          status: 'active'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'serviceId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' }
        }
      },
      {
        $match: {
          averageRating: { $gte: 4 },
          reviewCount: { $gte: 5 }
        }
      },
      {
        $sort: { averageRating: -1, reviewCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(recommendedServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service rating
const updateServiceRating = async (serviceId) => {
  try {
    const reviews = await Review.find({ serviceId, status: 'approved' });
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    await Service.findByIdAndUpdate(serviceId, {
      averageRating: averageRating || 0,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error('Error updating service rating:', error);
  }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpfulVotes += 1;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get provider reviews
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ providerId, status: 'approved' })
      .populate('serviceId', 'name category')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ providerId, status: 'approved' });

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getServiceReviews,
  getRecommendedServices,
  markReviewHelpful,
  getProviderReviews
}; 