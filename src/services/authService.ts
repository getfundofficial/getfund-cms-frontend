import { api } from './api';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await api.post<{ accessToken: string }>('/auth/refresh');
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
