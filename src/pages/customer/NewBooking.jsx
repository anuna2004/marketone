import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '../../components/PaymentForm';

const stripePromise = loadStripe('pk_test_51ROk9fPhBKjymCAAjWx2L1NrYDz9NtqwQJFLETT1TixdoaBJDZtyopwvrMyj3yxuPvtqYCDB22CBukpLsn1bUyd600tppq7ZB2');

const NewBooking = () => {
  const navigate = useNavigate();
  const { selectedService, updateBookingDetails } = useBooking();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    address: '',
    notes: '',
  });

  if (!selectedService) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No service selected</p>
        <button
          onClick={() => navigate('/customer/services')}
          className="mt-4 btn btn-primary"
        >
          Browse Services
        </button>
      </div>
    );
  }  const [step, setStep] = useState('details'); // 'details' or 'payment'
  const [bookingId, setBookingId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        serviceId: selectedService._id,
        ...formData
      };
      
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();
      setBookingId(booking._id);
      updateBookingDetails(formData);
      setStep('payment');
    } catch (error) {
      console.error('Error creating booking:', error);
      // You might want to show an error message to the user here
      alert('Failed to create booking. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };  const handlePaymentSuccess = async (paymentMethod) => {
    try {
      // First, create a payment intent
      const intentResponse = await fetch(`http://localhost:5000/api/payments/create-intent/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!intentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await intentResponse.json();

      // Then confirm the payment with Stripe
      const stripe = await stripePromise;
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (error) {
        throw new Error(error.message);
      }

      // If payment is successful, update the backend
      const successResponse = await fetch(`http://localhost:5000/api/payments/success/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!successResponse.ok) {
        throw new Error('Payment confirmed but failed to update booking');
      }

      navigate(`/customer/booking-confirmation/${bookingId}`);
    } catch (error) {
      setPaymentError(error.message);
    }
  };

  const handlePaymentError = (error) => {
    setPaymentError(error);
  };

  if (step === 'payment') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
          <div className="mb-6">
            <p className="text-gray-600">Amount to pay: ${selectedService.price}</p>
          </div>
          {paymentError && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
              {paymentError}
            </div>
          )}
          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={selectedService.price}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Service</h1>

      {/* Service Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Service Details
        </h2>
        <div className="space-y-2">
          <p className="text-gray-900 font-medium">{selectedService.name}</p>
          <p className="text-gray-600">{selectedService.description}</p>
          <p className="text-primary-600 font-semibold">
            ${selectedService.price}
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full pl-10 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  placeholder="Your phone number"
                  className="w-full pl-10 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  placeholder="Your email address"
                  className="w-full pl-10 border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Location
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter service address"
                className="w-full pl-10 border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Notes
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add any special instructions or requirements"
              className="w-full border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Method
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                id="card"
                className="h-4 w-4 text-primary-600 border-gray-300"
              />
              <label htmlFor="card" className="ml-3 flex items-center">
                <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">Credit/Debit Card</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBooking;