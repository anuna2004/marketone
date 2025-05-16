import { createContext, useContext, useState } from 'react';
import { bookingsApi, paymentsApi } from '../utils/api';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    address: '',
    instructions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  const { token } = useAuth();

  const selectService = (service) => {
    setSelectedService(service);
  };

  const updateBookingDetails = (details) => {
    setBookingDetails(prev => ({ ...prev, ...details }));
  };

  const clearBooking = () => {
    setSelectedService(null);
    setBookingDetails({
      date: '',
      time: '',
      address: '',
      instructions: ''
    });
    setError(null);
  };

  const createBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create booking
      const bookingResponse = await bookingsApi.create({
        serviceId: selectedService._id,
        ...bookingDetails
      }, token);

      // Process payment
      const paymentResponse = await paymentsApi.create({
        bookingId: bookingResponse.data._id,
        amount: selectedService.price,
        currency: 'USD'
      }, token);

      return {
        booking: bookingResponse.data,
        payment: paymentResponse.data
      };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      await bookingsApi.cancel(bookingId, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        selectedService,
        setSelectedService,
        bookingDetails,
        updateBookingDetails,
        clearBooking,
        createBooking,
        cancelBooking,
        selectService,
        loading,
        error
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};