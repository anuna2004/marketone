import { useState, useEffect } from 'react';
import { bookingsApi } from '../../utils/api';
import { Check, X, Clock, Calendar, User } from 'lucide-react';

const BookingCard = ({ booking, onStatusChange }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.service}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <User className="h-4 w-4 mr-1" />
            {booking.customer}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
              booking.status
            )}`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onStatusChange(booking._id, 'confirmed');
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm
                </button>
                <button
                  onClick={() => {
                    onStatusChange(booking._id, 'completed');
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Completed
                </button>
                <button
                  onClick={() => {
                    onStatusChange(booking._id, 'cancelled');
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(booking.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {booking.time}
        </div>
      </div>
    </div>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsApi.getAll();
      setBookings(response || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      await bookingsApi.updateStatus(id, status);
      setBookings(prev =>
        prev.map(booking =>
          booking._id === id ? { ...booking, status } : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = (bookings || []).filter(
    (booking) => statusFilter === 'all' || booking.status === statusFilter
  );

  const pendingBookings = filteredBookings.filter(
    (booking) => booking.status === 'pending'
  );
  const otherBookings = filteredBookings.filter(
    (booking) => booking.status !== 'pending'
  );

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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchBookings}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Bookings</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="btn btn-secondary"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pending Bookings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onStatusChange={updateBookingStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Bookings */}
      {otherBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Other Bookings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onStatusChange={updateBookingStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Bookings Message */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No bookings found</p>
        </div>
      )}
    </div>
  );
};

export default Bookings; 