import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Booking API calls
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getBooking: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  submitFeedback: (id, feedback) => api.put(`/bookings/${id}/feedback`, feedback),
  getDashboardStats: () => api.get('/bookings/dashboard-stats')
};

// User API calls
export const userAPI = {
  getPractitioners: (params) => api.get('/practitioners', { params }),
  getPatients: (params) => api.get('/patients', { params })
};

export default api;