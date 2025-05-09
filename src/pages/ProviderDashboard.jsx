const ProviderDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Service Provider Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Active Services Card */}
          <div className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary-900 mb-2">
              Active Services
            </h2>
            <p className="text-3xl font-bold text-primary-600">0</p>
            <p className="text-sm text-primary-700 mt-2">
              No active service requests
            </p>
          </div>

          {/* Completed Services Card */}
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              Completed Services
            </h2>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-green-700 mt-2">
              No completed services yet
            </p>
          </div>

          {/* Earnings Card */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Total Earnings
            </h2>
            <p className="text-3xl font-bold text-blue-600">$0</p>
            <p className="text-sm text-blue-700 mt-2">
              Start providing services to earn
            </p>
          </div>
        </div>

        {/* Service Requests Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Service Requests
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-center">
              No service requests at the moment
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="btn btn-primary">
              Update Service Availability
            </button>
            <button className="btn btn-secondary">
              View Service History
            </button>
          </div>
        </div>

        {/* Service Statistics */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Service Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Service Rating
              </h3>
              <p className="text-2xl font-bold text-gray-900">N/A</p>
              <p className="text-sm text-gray-600">
                No ratings yet
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Response Time
              </h3>
              <p className="text-2xl font-bold text-gray-900">N/A</p>
              <p className="text-sm text-gray-600">
                No data available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard; 