import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const propertyCode = localStorage.getItem('property_code');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (propertyCode) {
      config.headers['X-Property-Code'] = propertyCode;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
