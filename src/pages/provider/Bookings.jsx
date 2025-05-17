import { useState } from 'react';
import { useProvider } from '../../context/ProviderContext';
import { 
  Check, 
  X, 
  Clock, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Info,
  DollarSign,
  AlertCircle
} from 'lucide-react';

const BookingCard = ({ booking, onStatusChange }) => {
  const [showActions, setShowActions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {booking.service?.name || 'Service Booking'}
            </h3>
            <p className="text-sm text-gray-500">
              Booking ID: {booking._id?.substring(0, 8) || 'N/A'}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(
                booking.status
              )} flex items-center space-x-1`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </button>
            {showActions && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Update Status
                  </div>
                  <button
                    onClick={() => {
                      onStatusChange(booking._id, 'confirmed');
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Confirm Booking</span>
                  </button>
                  <button
                    onClick={() => {
                      onStatusChange(booking._id, 'completed');
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Check className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Mark as Completed</span>
                  </button>
                  <button
                    onClick={() => {
                      onStatusChange(booking._id, 'cancelled');
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          {/* Service Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2 text-primary-600" />
              Service Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium">
                    ${booking.service?.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
              <div className="flex items-start text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-500">Scheduled Date</p>
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
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{booking.address || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <User className="h-4 w-4 mr-2 text-primary-600" />
              Customer Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{booking.customerName || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{booking.customerPhone || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium break-all">{booking.customerEmail || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {booking.notes && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                Customer Notes
              </h4>
              <p className="text-sm text-amber-800">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Bookings = () => {
  const { 
    bookings = [], 
    loading, 
    error, 
    refreshBookings, 
    updateBookingStatus: updateStatus 
  } = useProvider();
  
  const [statusFilter, setStatusFilter] = useState('all');

  const updateBookingStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
    } catch (err) {
      console.error('Error updating booking:', err);
      // Error is already set in the context
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
          onClick={refreshBookings}
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