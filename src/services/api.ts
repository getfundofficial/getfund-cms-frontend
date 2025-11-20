import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Use relative URL in development to leverage Vite proxy, absolute URL in production
const API_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  : '/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // For cookies
      timeout: 180000, // 180 seconds (3 minutes) - allows for database wake-up time
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public getApi(): AxiosInstance {
    return this.api;
  }
}

const apiService = new ApiService();
export const api = apiService.getApi();
