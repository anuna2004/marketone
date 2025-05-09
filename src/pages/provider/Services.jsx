import { useState, useEffect } from 'react';
import { useProvider } from '../../context/ProviderContext';
import ServiceModal from '../../components/ServiceModal';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';

const ServiceCard = ({ service, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      onDelete(service._id);
      setShowActions(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-600">{service.category}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(service);
                    setShowActions(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-primary-600">${service.price}</p>
        <div className="flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              service.status === 'active'
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-gray-600">{service.status}</span>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const { services = [], loading, error, addService, updateService, deleteService, refreshServices } = useProvider();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    refreshServices();
  }, []);

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteService(id);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Failed to delete service. Please try again.');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedService) {
        await updateService(selectedService._id, formData);
      } else {
        await addService(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refreshServices}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Manage Services</h2>
        <button
          onClick={handleAddService}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services && services.length > 0 ? (
          services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No services listed yet</p>
            <button
              onClick={handleAddService}
              className="mt-4 btn btn-primary"
            >
              Add Your First Service
            </button>
          </div>
        )}
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Services; 