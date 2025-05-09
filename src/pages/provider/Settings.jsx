import { useState } from 'react';
import { User, Bell, Lock, CreditCard, Building, Clock } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-primary-100 rounded-lg mr-3">
        <Icon className="h-5 w-5 text-primary-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    bookingUpdates: true,
    promotions: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Provider Settings</h1>

      {/* Profile Settings */}
      <SettingsSection title="Profile Settings" icon={User}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md"
              placeholder="Enter your business name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full border-gray-300 rounded-md"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Business Settings */}
      <SettingsSection title="Business Settings" icon={Building}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Address
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md"
              placeholder="Enter your business address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Area
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md"
              placeholder="Enter your service area"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Hours
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                className="w-full border-gray-300 rounded-md"
                placeholder="Opening time"
              />
              <input
                type="time"
                className="w-full border-gray-300 rounded-md"
                placeholder="Closing time"
              />
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection title="Notification Preferences" icon={Bell}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive updates via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </SettingsSection>

      {/* Security Settings */}
      <SettingsSection title="Security" icon={Lock}>
        <div className="space-y-4">
          <button className="btn btn-secondary">Change Password</button>
          <button className="btn btn-secondary">Enable Two-Factor Authentication</button>
        </div>
      </SettingsSection>

      {/* Payment Settings */}
      <SettingsSection title="Payment Methods" icon={CreditCard}>
        <div className="space-y-4">
          <button className="btn btn-secondary">Add Payment Method</button>
          <button className="btn btn-secondary">View Payment History</button>
          <button className="btn btn-secondary">Set Up Payout Schedule</button>
        </div>
      </SettingsSection>

      {/* Availability Settings */}
      <SettingsSection title="Availability" icon={Clock}>
        <div className="space-y-4">
          <button className="btn btn-secondary">Set Working Hours</button>
          <button className="btn btn-secondary">Manage Time Off</button>
          <button className="btn btn-secondary">Set Service Capacity</button>
        </div>
      </SettingsSection>
    </div>
  );
};

export default Settings; 