import { Outlet, Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Menu, X, Home, List, History, Settings } from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = () => {
  const { role, switchRole } = useRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const customerNavItems = [
    { path: '/customer/dashboard', label: 'Dashboard', icon: Home },
    { path: '/customer/services', label: 'Browse Services', icon: List },
    { path: '/customer/bookings', label: 'Booking History', icon: History },
  ];

  const providerNavItems = [
    { path: '/provider/dashboard', label: 'Dashboard', icon: Home },
    { path: '/provider/services', label: 'Manage Services', icon: List },
    { path: '/provider/bookings', label: 'Bookings', icon: History },
  ];

  const navItems = role === 'customer' ? customerNavItems : providerNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {role === 'customer' ? 'Customer' : 'Provider'} Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={role}
                onChange={(e) => switchRole(e.target.value)}
                className="rounded-md border-gray-300 text-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-md ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-8 ${
            isSidebarOpen ? 'md:ml-64' : ''
          } transition-margin duration-200 ease-in-out`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 