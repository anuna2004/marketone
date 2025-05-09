import { useState } from 'react';
import { Link } from 'react-router-dom';
import { services, serviceCategories } from '../../utils/mockData';
import { Search, Filter, Star, ChevronDown } from 'lucide-react';

const ServiceCard = ({ service }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="relative h-48">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-primary-600">
        ${service.price}
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
          <p className="text-sm text-gray-600">{service.provider}</p>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Category: {service.category}</p>
        <Link
          to={`/customer/services/${service.id}`}
          className="block w-full btn btn-primary text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('price');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <button
                className="btn btn-secondary flex items-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="p-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border-gray-300 rounded-md"
                    >
                      <option value="">All Categories</option>
                      {serviceCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="btn btn-secondary"
            >
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {/* No Results Message */}
      {sortedServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No services found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Services; 