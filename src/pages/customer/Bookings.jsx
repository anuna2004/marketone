import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, MapPin } from 'lucide-react';
import { bookingsApi } from '../../utils/api';
import api from '../../utils/api';

const ReviewModal = ({ isOpen, onClose, onSubmit, booking }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border-gray-300 rounded-md"
              rows={4}
              placeholder="Share your experience..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={rating === 0}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BookingCard = ({ booking, onReview }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleReview = (reviewData) => {
    onReview(booking._id, reviewData);
  };

  // Helper function to get service information
  const getServiceInfo = () => {
    // If service is populated as an object
    if (booking.service && typeof booking.service === 'object') {
      return {
        name: booking.service.name,
        price: booking.service.price,
      };
    }
    // If service is a string (ID) and we have serviceName
    if (booking.serviceName) {
      return {
        name: booking.serviceName,
        price: booking.amount,
      };
    }
    // If we have serviceId object
    if (booking.serviceId && typeof booking.serviceId === 'object') {
      return {
        name: booking.serviceId.name,
        price: booking.serviceId.price || booking.amount,
      };
    }
    // Final fallback
    return {
      name: 'Service Booking',
      price: booking.amount || 0,
    };
  };

  const serviceInfo = getServiceInfo();

  // Format price with proper decimal places and currency symbol
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '$0.00';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-800 bg-green-100';
      case 'pending':
        return 'text-yellow-800 bg-yellow-100';
      case 'completed':
        return 'text-blue-800 bg-blue-100';
      case 'cancelled':
        return 'text-red-800 bg-red-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {serviceInfo.name}
          </h3>
          <p className="text-sm text-gray-600">
            Booking ID: {booking._id?.substring(0, 8) || 'N/A'} • {formatPrice(serviceInfo.price)}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}
        >
          {booking.status}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <p>Scheduled Date: {new Date(booking.date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <p>Time: {booking.time || 'Time not specified'}</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <p>Location: {booking.location || 'Location not specified'}</p>
        </div>        <div className="mt-2">
          <p className="text-primary-600 font-medium">
            Price: {formatPrice(serviceInfo.price)}
          </p>
        </div>
        {booking.status.toLowerCase() === 'completed' && !booking.review && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Leave a Review
          </button>
        )}
        {booking.review && (
          <div className="mt-4 bg-gray-50 p-3 rounded">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= booking.review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">{booking.review.comment}</p>
          </div>
        )}
      </div>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReview}
        booking={booking}
      />
    </div>
  );
};

const Bookings = () => {
  const navigate = useNavigate();
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsApi.getAll();
      console.log('Fetched bookings:', response); // For debugging
      setBookingsList(response || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };  const handleReview = async (bookingId, reviewData) => {
    try {
      // Transform the data to match backend expectations
      const transformedData = {
        rating: reviewData.rating,
        review: reviewData.comment, // Change comment to review to match backend
      };

      // Create the review using the correct endpoint
      const response = await api.post(`/reviews/booking/${bookingId}`, transformedData);
      
      // Update the local state
      setBookingsList((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, review: response.data }
            : booking
        )
      );

      // Show success message
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      if (err.response?.data?.message) {
        alert(`Failed to submit review: ${err.response.data.message}`);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
        <button 
          onClick={() => navigate('/customer/services')}
          className="btn btn-primary"
        >
          Book New Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
          <button
            onClick={fetchBookings}
            className="ml-2 underline hover:text-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookingsList.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onReview={handleReview}
          />
        ))}
      </div>

      {/* No Bookings Message */}
      {!loading && !error && bookingsList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings found</p>
          <button 
            onClick={() => navigate('/customer/services')}
            className="mt-4 btn btn-primary"
          >
            Book a Service
          </button>
        </div>
      )}
    </div>
  );
};

export default Bookings;