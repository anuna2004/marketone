import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { servicesApi } from '../../utils/api';
import { useBooking } from '../../context/BookingContext';
import { Star, Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectService } = useBooking();
  const [activeTab, setActiveTab] = useState('description');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const data = await servicesApi.getById(id);
        setService(data);
      } catch (err) {
        setError('Failed to load service details. Please try again later.');
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);
  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error || 'Service not found'}</p>
        <Link to="/customer/services" className="mt-4 btn btn-primary">
          Back to Services
        </Link>
      </div>
    );
  }

  const handleBookNow = () => {
    selectService({
      _id: service._id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      category: service.category,
      location: service.location
    });
    navigate('/customer/new-booking');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/customer/services" className="hover:text-primary-600">Services</Link>
        <span>/</span>
        <span className="text-gray-900">{service.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="space-y-6">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {service.title}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-gray-600">{service.rating}</span>
              </div>
              <span className="text-gray-600">|</span>
              <span className="text-gray-600">{service.category}</span>
            </div>
            <p className="text-lg font-semibold text-primary-600 mb-4">
              ${service.price}
            </p>
            <button
              onClick={handleBookNow}
              className="w-full btn btn-primary"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Right Column - Tabs and Details */}
        <div className="space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'availability'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Availability
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  About the Service
                </h2>
                <p className="text-gray-600">{service.description}</p>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About the Provider
                  </h3>
                  <p className="text-gray-600">{service.providerBio}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Customer Reviews
                </h2>
                {service.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-600">{review.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="font-medium text-gray-900">{review.user}</p>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Available Time Slots
                </h2>
                {service.availability.map((day) => (
                  <div key={day.date} className="border-b border-gray-200 pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {day.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            selectService(service);
                            navigate('/customer/new-booking', {
                              state: { selectedSlot: slot, selectedDate: day.date }
                            });
                          }}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:border-primary-500 hover:text-primary-600"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails; 