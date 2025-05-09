import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';

const Booking = () => {
  const navigate = useNavigate();
  const { 
    selectedService, 
    bookingDetails, 
    updateBookingDetails, 
    clearBooking,
    createBooking,
    loading,
    error 
  } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const { booking, payment } = await createBooking();
        navigate('/customer/booking/confirmation', { 
          state: { 
            bookingId: booking._id,
            paymentId: payment._id 
          }
        });
      } catch (err) {
        // Error is handled in the context
        console.error('Booking error:', err);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Date and Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <select
                  value={bookingDetails.date}
                  onChange={(e) =>
                    updateBookingDetails({ date: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a date</option>
                  {selectedService.availability.map((day) => (
                    <option key={day.date} value={day.date}>
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <select
                  value={bookingDetails.time}
                  onChange={(e) =>
                    updateBookingDetails({ time: e.target.value })
                  }
                  className="w-full border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a time</option>
                  {selectedService.availability
                    .find((day) => day.date === bookingDetails.date)
                    ?.slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Service Location
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={bookingDetails.address}
                onChange={(e) =>
                  updateBookingDetails({ address: e.target.value })
                }
                className="w-full border-gray-300 rounded-md"
                placeholder="Enter your address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                value={bookingDetails.instructions}
                onChange={(e) =>
                  updateBookingDetails({ instructions: e.target.value })
                }
                className="w-full border-gray-300 rounded-md"
                rows={4}
                placeholder="Any special instructions or requirements?"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Summary
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  Service: {selectedService.title}
                </p>
                <p className="text-gray-600">
                  Provider: {selectedService.provider}
                </p>
                <p className="text-gray-600">
                  Date: {new Date(bookingDetails.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Time: {bookingDetails.time}</p>
                <p className="text-gray-600">
                  Address: {bookingDetails.address}
                </p>
                {bookingDetails.instructions && (
                  <p className="text-gray-600">
                    Instructions: {bookingDetails.instructions}
                  </p>
                )}
                <p className="text-lg font-semibold text-primary-600">
                  Total: ${selectedService.price}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                step < 3 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Date & Time</span>
          <span className="text-sm text-gray-600">Location</span>
          <span className="text-sm text-gray-600">Confirmation</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className={`btn btn-primary ${
              currentStep === 1 ? 'w-full' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : currentStep === 3 ? 'Confirm Booking' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking; 