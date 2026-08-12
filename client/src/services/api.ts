import axios from 'axios';

// Strip trailing /api if Vercel env var has it (prevents /api/api/... double prefix)
const rawBase = import.meta.env.VITE_API_URL || 'https://mohitdecodes.onrender.com';
const BASE_URL = rawBase.endsWith('/api') ? rawBase.slice(0, -4) : rawBase;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
