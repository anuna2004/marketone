import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle, Calendar, Clock, MapPin, Mail, Phone, User } from 'lucide-react';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clearBooking } = useBooking();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error || 'Booking not found'}</p>
        <button
          onClick={() => navigate('/customer/services')}
          className="mt-4 btn btn-primary"
        >
          Browse Services
        </button>
      </div>
    );
  }

  const handleViewBookings = () => {
    clearBooking();
    navigate('/customer/bookings');
  };

  const handleBookAnother = () => {
    clearBooking();
    navigate('/customer/services');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600">
          Your service has been successfully booked. Here are the details:
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {booking.serviceId?.image ? (
                <img
                  src={booking.serviceId.image}
                  alt={booking.serviceId.title || 'Service'}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {booking.serviceId?.title || 'Service'}
              </h2>
              <p className="text-gray-600">{booking.serviceId?.provider?.name || 'Provider'}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">
                  {new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{booking.timeSlot || 'Anytime'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{booking.address || 'Address not specified'}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-lg font-semibold text-primary-600">
                ${booking.totalAmount || booking.serviceId?.price || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleViewBookings}
          className="btn btn-primary flex-1"
        >
          View My Bookings
        </button>
        <button
          onClick={handleBookAnother}
          className="btn btn-secondary flex-1"
        >
          Book Another Service
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation; 