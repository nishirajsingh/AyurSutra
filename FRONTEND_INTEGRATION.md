# Frontend Integration Guide

This guide shows how to integrate your React frontend with the AyurSutra backend API.

## Setup

1. Install axios for API calls:
```bash
npm install axios
```

2. Create an API service file:

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Authentication Integration

### Update Login Component

```javascript
// src/pages/Login.js
import api from '../services/api';

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password
    });
    
    const { token, data } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect based on role
    if (data.user.role === 'patient') navigate('/patient');
    else if (data.user.role === 'practitioner') navigate('/practitioner');
    else navigate('/admin');
    
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};
```

### Create Auth Context

```javascript
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, data } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Booking Integration

### Update Booking Component

```javascript
// src/pages/Booking.js
import api from '../services/api';

const [practitioners, setPractitioners] = useState([]);
const [therapies, setTherapies] = useState([]);

useEffect(() => {
  fetchPractitioners();
  fetchTherapies();
}, []);

const fetchPractitioners = async () => {
  try {
    const response = await api.get('/practitioners');
    setPractitioners(response.data.data.practitioners);
  } catch (error) {
    console.error('Error fetching practitioners:', error);
  }
};

const fetchTherapies = async () => {
  try {
    const response = await api.get('/therapies');
    setTherapies(response.data.data.therapies);
  } catch (error) {
    console.error('Error fetching therapies:', error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await api.post('/bookings', {
      practitioner: formData.practitioner,
      therapyType: formData.therapyType,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      price: calculatePrice() // implement price calculation
    });
    
    alert('Booking created successfully!');
    navigate('/patient');
  } catch (error) {
    alert(error.response?.data?.message || 'Booking failed');
  }
};
```

## Dashboard Integration

### Patient Dashboard

```javascript
// src/pages/PatientDashboard.js
import api from '../services/api';

const [dashboardData, setDashboardData] = useState(null);

useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/patients/dashboard');
    setDashboardData(response.data.data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

// Use dashboardData.upcomingSessions, dashboardData.notifications, etc.
```

### Practitioner Dashboard

```javascript
// src/pages/PractitionerDashboard.js
import api from '../services/api';

const [stats, setStats] = useState(null);

useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const response = await api.get('/practitioners/dashboard');
    setStats(response.data.data);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
};
```

## Notifications Integration

```javascript
// src/components/NotificationsWidget.js
import api from '../services/api';

const [notifications, setNotifications] = useState([]);

useEffect(() => {
  fetchNotifications();
}, []);

const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    setNotifications(response.data.data.notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

const markAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
    fetchNotifications(); // Refresh notifications
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};
```

## Environment Variables

Create a `.env` file in your React app:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Then update your API service:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

## Error Handling

Create a global error handler:

```javascript
// src/utils/errorHandler.js
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};
```

## Usage in Components

```javascript
import { handleApiError } from '../utils/errorHandler';

try {
  // API call
} catch (error) {
  const errorMessage = handleApiError(error);
  alert(errorMessage);
}
```

This integration will connect your existing React frontend with the new backend API, providing full authentication, booking, and dashboard functionality.