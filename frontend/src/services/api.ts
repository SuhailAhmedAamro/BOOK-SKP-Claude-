import axios from 'axios';
import { ENV } from '../utils/env';

const API_URL = ENV.API_URL;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to signin
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

// Auth service methods
export const authService = {
  signIn: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/auth/signin', data);
    return response.data;
  },

  signUp: async (data: { email: string; password: string; name?: string }) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  setProfile: async (data: { background: 'Software' | 'Hardware' }) => {
    const response = await api.post('/api/user/profile', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  saveToken: (token: string, user: any) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearToken: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  }
};

export default api;
