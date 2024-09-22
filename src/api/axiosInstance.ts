
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://your-backend-url.com', 
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
