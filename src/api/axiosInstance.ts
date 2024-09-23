import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState(); // Get token from Zustand store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token if available
    }
    
    // Check if the request data is FormData
    if (config.data instanceof FormData) {
      // Set the correct content type for multipart/form-data
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;