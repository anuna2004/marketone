import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const NewBooking = () => {
  const navigate = useNavigate();
  const { selectedService, updateBookingDetails } = useBooking();
  const [formData, setFormData] = useState({
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
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBookingDetails(formData);
    navigate('/customer/booking-confirmation');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Service</h1>

      {/* Service Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Service Details
        </h2>
        <div className="space-y-2">
          <p className="text-gray-900 font-medium">{selectedService.title}</p>
          <p className="text-gray-600">{selectedService.description}</p>
          <p className="text-primary-600 font-semibold">
            ${selectedService.price}
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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