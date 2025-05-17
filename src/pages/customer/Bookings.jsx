import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Calendar, Clock, MapPin, DollarSign, Info, User } from 'lucide-react';
import { bookingsApi, reviewsApi } from '../../utils/api';

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
  const [showDetails, setShowDetails] = useState(false);

  const handleReview = (reviewData) => {
    onReview(booking._id, reviewData);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Debug: Log the entire booking object to see its structure
  console.log('Raw booking data:', JSON.stringify(booking, null, 2));

  // Get service information with proper fallbacks
  const getServiceInfo = () => {
    // If service is populated as an object
    if (booking.service && typeof booking.service === 'object') {
      return {
        name: booking.service.name || 'Service',
        price: booking.service.price,
        description: booking.service.description
      };
    }
    // If service is a string (ID) and we have serviceName/amount
    if (booking.serviceName) {
      return {
        name: booking.serviceName,
        price: booking.amount,
        description: booking.serviceDescription
      };
    }
    // Fallback to serviceId if available
    if (booking.serviceId) {
      return {
        name: booking.serviceId.name || 'Service',
        price: booking.amount,
        description: booking.serviceId.description
      };
    }
    // Final fallback
    return {
      name: 'Service Booking',
      price: null,
      description: ''
    };
  };

  const service = getServiceInfo();
  
  // Debug: Log the processed service info
  console.log('Processed service info:', service);
  
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {service.name}
            </h3>
            <p className="text-sm text-gray-500">
              Booking ID: {booking._id?.substring(0, 8) || 'N/A'} • {booking.providerId?.name || 'Unknown Provider'}
            </p>
          </div>
          <div className="flex items-center">
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(booking.status)} flex items-center space-x-1`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </span>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{formatDate(booking.date)}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium">{booking.time || 'Not specified'}</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">{formatPrice(service.price)}</p>
            </div>
          </div>
        </div>

        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center mb-4"
        >
          {showDetails ? 'Hide details' : 'View details'}
          <svg
            className={`ml-1 w-4 h-4 transition-transform ${showDetails ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Detailed Information */}
        {showDetails && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {/* Service Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-primary-600" />
                Service Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start text-sm">
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium">{service.name}</p>
                  </div>
                </div>
                {service.description && (
                  <div className="col-span-2 text-sm">
                    <p className="text-gray-500">Description</p>
                    <p className="font-medium">{service.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                Location Details
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {booking.address || 'Location not specified'}
                </p>
                {booking.notes && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 font-medium mb-1">Additional Notes:</p>
                    <p className="text-sm text-gray-600 bg-amber-50 p-2 rounded">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Provider Information */}
            {booking.providerId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary-600" />
                  Service Provider
                </h4>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium mr-3">
                    {booking.providerId.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-medium">{booking.providerId.name || 'Provider'}</p>
                    <p className="text-sm text-gray-500">
                      {booking.providerId.email || 'Contact information not available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Review Section */}
        {booking.status.toLowerCase() === 'completed' && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            {!booking.review ? (
              <button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                Rate this service
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= booking.review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">
                    Your rating
                  </span>
                </div>
                {booking.review.comment && (
                  <p className="text-sm text-gray-700 mt-2">
                    "{booking.review.comment}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
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
      setBookingsList(response || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (bookingId, reviewData) => {
    try {
      const response = await reviewsApi.create({ bookingId, ...reviewData });
      setBookingsList((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, review: response }
            : booking
        )
      );
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
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