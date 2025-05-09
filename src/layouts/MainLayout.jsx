import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useState, useEffect } from 'react';
import {
  Home,
  User,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  Calendar,
  Users,
} from 'lucide-react';

const MainLayout = () => {
  const { role, switchRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isProviderRoute = location.pathname.startsWith('/provider');
  const isCustomerRoute = location.pathname.startsWith('/customer');

  // Redirect if role doesn't match route
  useEffect(() => {
    if (isProviderRoute && role !== 'provider') {
      navigate('/');
    } else if (isCustomerRoute && role !== 'customer') {
      navigate('/');
    }
  }, [isProviderRoute, isCustomerRoute, role, navigate]);

  const customerNavItems = [
    { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
    { icon: ShoppingBag, label: 'Services', path: '/customer/services' },
    { icon: Calendar, label: 'Bookings', path: '/customer/bookings' },
  ];

  const providerNavItems = [
    { icon: Home, label: 'Dashboard', path: '/provider/dashboard' },
    { icon: ShoppingBag, label: 'Services', path: '/provider/services' },
    { icon: Calendar, label: 'Bookings', path: '/provider/bookings' },
  ];

  const navItems = role === 'provider' ? providerNavItems : customerNavItems;

  const handleRoleSwitch = () => {
    const newRole = role === 'provider' ? 'customer' : 'provider';
    switchRole(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="ml-4 flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Service Marketplace
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRoleSwitch}
                className="btn btn-secondary"
              >
                Switch to {role === 'provider' ? 'Customer' : 'Provider'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsSidebarOpen(false);
                    }}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 ${
                        isActive
                          ? 'text-primary-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={() => {
                switchRole('customer');
                navigate('/');
              }}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Exit Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? 'ml-64' : ''
        } transition-all duration-300 ease-in-out`}
      >
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;