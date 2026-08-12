import axios from 'axios';

// Normalise base URL:
// - Strip trailing slash and /api if present (in case VITE_API_URL ends with /api)
// - Then always append /api so every relative call like '/auth/login' works correctly
const rawBase = (import.meta.env.VITE_API_URL || 'https://mohitdecodes.onrender.com')
  .replace(/\/+$/, '')          // remove trailing slashes
  .replace(/\/api$/, '');       // remove trailing /api

const baseURL = rawBase + '/api';

const api = axios.create({
  baseURL,
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
