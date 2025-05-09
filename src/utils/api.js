import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Services API
export const servicesApi = {
  getAll: async () => {
    try {
      const response = await api.get('/services');
      return response;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/services', data);
      return response;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/services/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  uploadImages: async (id, images, options = {}) => {
    try {
      const formData = new FormData();
      if (Array.isArray(images)) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      } else {
        throw new Error('Images must be an array of files');
      }
      
      const response = await api.post(`/services/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...options
      });
      return response;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },
};

// Bookings API
export const bookingsApi = {
  getAll: async () => {
    try {
      const response = await api.get('/bookings');
      return response;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/bookings', data);
      return response;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  updatePayment: async (id, paymentStatus) => {
    try {
      const response = await api.patch(`/bookings/${id}/payment`, { paymentStatus });
      return response;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/bookings/${id}`, data);
      return response;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  cancel: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },
};

// Payments API
export const paymentsApi = {
  create: (data, token) => api.post('/payments', data, { headers: { Authorization: `Bearer ${token}` } }),
  verify: (id, token) => api.get(`/payments/${id}/verify`, { headers: { Authorization: `Bearer ${token}` } }),
  getHistory: (token) => api.get('/payments/history', { headers: { Authorization: `Bearer ${token}` } }),
};

// Reviews API
export const reviewsApi = {
  getAll: (token) => api.get('/reviews', { headers: { Authorization: `Bearer ${token}` } }),
  create: (data, token) => api.post('/reviews', data, { headers: { Authorization: `Bearer ${token}` } }),
  update: (id, data, token) => api.put(`/reviews/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  delete: (id, token) => api.delete(`/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};

// Analytics API
export const analyticsApi = {
  getDaily: (token) => api.get('/analytics/daily', { headers: { Authorization: `Bearer ${token}` } }),
  getMonthly: (token) => api.get('/analytics/monthly', { headers: { Authorization: `Bearer ${token}` } }),
  getYearly: (token) => api.get('/analytics/yearly', { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;