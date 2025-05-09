import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { ShoppingBag, Users, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { switchRole } = useRole();

  const handleRoleSelect = (role) => {
    switchRole(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to Service Marketplace
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with trusted service providers or offer your expertise to
              customers in need.
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              I'm a Customer
            </h2>
            <p className="text-gray-600 mb-6">
              Find and book services from trusted providers in your area.
            </p>
            <button
              onClick={() => handleRoleSelect('customer')}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              Continue as Customer
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          {/* Provider Card */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              I'm a Provider
            </h2>
            <p className="text-gray-600 mb-6">
              Offer your services and grow your business with our platform.
            </p>
            <button
              onClick={() => handleRoleSelect('provider')}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              Continue as Provider
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={ShoppingBag}
              title="Wide Range of Services"
              description="Find everything from home services to professional expertise."
            />
            <FeatureCard
              icon={Users}
              title="Trusted Providers"
              description="All providers are verified and rated by our community."
            />
            <FeatureCard
              icon={ArrowRight}
              title="Easy Booking"
              description="Simple and secure booking process for all services."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 