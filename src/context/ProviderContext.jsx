import { createContext, useContext, useState, useEffect } from 'react';
import { servicesApi } from '../utils/api';

const ProviderContext = createContext(null);

export const ProviderProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getAll();
      setServices(response || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.response?.data?.message || 'Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const addService = async (newService) => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.create(newService);
      setServices(prev => [...prev, response]);
      return response;
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err.response?.data?.message || 'Failed to create service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.update(id, updates);
      setServices(prev =>
        prev.map(service =>
          service._id === id ? response : service
        )
      );
      return response;
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err.response?.data?.message || 'Failed to update service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await servicesApi.delete(id);
      setServices(prev => prev.filter(service => service._id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err.response?.data?.message || 'Failed to delete service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProviderContext.Provider
      value={{
        services,
        loading,
        error,
        addService,
        updateService,
        deleteService,
        refreshServices: fetchServices,
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within a ProviderProvider');
  }
  return context;
};