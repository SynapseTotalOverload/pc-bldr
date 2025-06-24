import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/';

// Default axios instance (non-protected)
const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Protected axios instance with Bearer token
const instancePr: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for protected instance to add Bearer token
instancePr.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for protected instance to handle token expiration
instancePr.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login or refresh token
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      // You can add redirect logic here if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('access_token');
};

export { instance, instancePr };
export default instance;
