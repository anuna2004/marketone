import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Settings } from 'lucide-react';
import { customerStats } from '../../utils/mockData';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
        <button
          onClick={() => navigate('/customer/settings')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Upcoming Bookings
          </h2>
          <p className="text-3xl font-bold text-primary-600">
            {customerStats.upcomingBookings}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Active service bookings
          </p>
        </div>

        {/* Last Booking Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Last Booking
          </h2>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {customerStats.lastBooking.service}
            </p>
            <p className="text-sm text-gray-600">
              Date: {customerStats.lastBooking.date}
            </p>
            <p className="text-sm text-gray-600">
              Status: {customerStats.lastBooking.status}
            </p>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/customer/services')}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book New Service
            </button>
            <button
              onClick={() => navigate('/customer/bookings')}
              className="w-full btn btn-secondary flex items-center justify-center"
            >
              <Clock className="h-5 w-5 mr-2" />
              View All Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">House Cleaning</p>
              <p className="text-sm text-gray-600">March 15, 2024</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
              Completed
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Plumbing Repair</p>
              <p className="text-sm text-gray-600">March 20, 2024</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 