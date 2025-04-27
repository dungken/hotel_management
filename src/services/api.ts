import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, AUTH_KEYS } from '@/constants';

interface ApiInstance extends AxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) as ApiInstance;

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(AUTH_KEYS.TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER);
      window.location.href = '/login';
    }
    
    // Improve error messages
    if (error.response?.data) {
      const errorData = error.response.data as any;
      if (errorData.message) {
        return Promise.reject({ 
          ...error, 
          message: errorData.message 
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
