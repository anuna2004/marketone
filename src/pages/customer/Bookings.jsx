import { useState } from 'react';
import { bookings } from '../../utils/mockData';
import { Star } from 'lucide-react';

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
    onReview(booking.id, reviewData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
          <p className="text-sm text-gray-600">{booking.provider}</p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            booking.status === 'Completed'
              ? 'text-green-800 bg-green-100'
              : 'text-yellow-800 bg-yellow-100'
          }`}
        >
          {booking.status}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Date: {booking.date}</p>
        {booking.status === 'Completed' && !booking.review && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Leave a Review
          </button>
        )}
        {booking.review && (
          <div className="mt-2">
            <div className="flex items-center">
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
            <p className="text-sm text-gray-600 mt-1">{booking.review.comment}</p>
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
  const [bookingsList, setBookingsList] = useState(bookings);

  const handleReview = (bookingId, reviewData) => {
    setBookingsList((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, review: reviewData }
          : booking
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookingsList.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onReview={handleReview}
          />
        ))}
      </div>

      {/* No Bookings Message */}
      {bookingsList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings found</p>
          <button className="mt-4 btn btn-primary">Book a Service</button>
        </div>
      )}
    </div>
  );
};

export default Bookings; 