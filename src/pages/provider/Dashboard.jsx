import { useProvider } from '../../context/ProviderContext';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Plus,
  List,
  Settings,
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      {trend && (
        <div className="flex items-center text-sm text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const QuickAction = ({ title, description, icon: Icon, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
  >
    <div className={`p-3 rounded-full ${color} inline-block mb-4`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </button>
);

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { services = [], bookings = [] } = useProvider();

  const totalEarnings = services.reduce(
    (sum, service) =>
      sum +
      service.price *
        bookings.filter(
          (booking) =>
            booking.service === service.name &&
            booking.status === 'Completed'
        ).length,
    0
  );

  const todayBookings = bookings.filter(
    (booking) =>
      new Date(booking.date).toDateString() === new Date().toDateString()
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === 'Pending'
  );

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
        <button
          onClick={() => navigate('/provider/settings')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Services"
          value={services.length}
          icon={List}
          color="bg-primary-100"
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookings.length}
          icon={Calendar}
          color="bg-green-100"
        />
        <StatCard
          title="Pending Requests"
          value={pendingBookings.length}
          icon={Clock}
          color="bg-yellow-100"
        />
        <StatCard
          title="Total Earnings"
          value={`$${totalEarnings}`}
          icon={DollarSign}
          color="bg-blue-100"
          trend="+12% this month"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAction
            title="Add New Service"
            description="Create a new service listing"
            icon={Plus}
            onClick={() => navigate('/provider/services')}
            color="bg-primary-100"
          />
          <QuickAction
            title="View Today's Bookings"
            description="Check your schedule for today"
            icon={Calendar}
            onClick={() => navigate('/provider/bookings')}
            color="bg-green-100"
          />
          <QuickAction
            title="Manage Services"
            description="Edit or update your services"
            icon={List}
            onClick={() => navigate('/provider/services')}
            color="bg-blue-100"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {bookings.slice(0, 3).map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{booking.service}</p>
                <p className="text-sm text-gray-600">
                  {booking.customer} - {new Date(booking.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  booking.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard; 