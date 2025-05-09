import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Landing from '../pages/Landing';
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerServices from '../pages/customer/Services';
import CustomerBookings from '../pages/customer/Bookings';
import CustomerSettings from '../pages/customer/Settings';
import CustomerNewBooking from '../pages/customer/NewBooking';
import ServiceDetails from '../pages/customer/ServiceDetails';
import ProviderDashboard from '../pages/provider/Dashboard';
import ProviderServices from '../pages/provider/Services';
import ProviderBookings from '../pages/provider/Bookings';
import ProviderSettings from '../pages/provider/Settings';
import BookingConfirmation from '../pages/customer/BookingConfirmation';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'customer',
        children: [
          {
            path: 'dashboard',
            element: <CustomerDashboard />,
          },
          {
            path: 'services',
            element: <CustomerServices />,
          },
          {
            path: 'services/:id',
            element: <ServiceDetails />,
          },
          {
            path: 'bookings',
            element: <CustomerBookings />,
          },
          {
            path: 'new-booking',
            element: <CustomerNewBooking />,
          },
          {
            path: 'booking-confirmation',
            element: <BookingConfirmation />,
          },
          {
            path: 'settings',
            element: <CustomerSettings />,
          },
        ],
      },
      {
        path: 'provider',
        children: [
          {
            path: 'dashboard',
            element: <ProviderDashboard />,
          },
          {
            path: 'services',
            element: <ProviderServices />,
          },
          {
            path: 'bookings',
            element: <ProviderBookings />,
          },
          {
            path: 'settings',
            element: <ProviderSettings />,
          },
        ],
      },
    ],
  },
]);

export default router; 