import { api } from './api';

export type UserRole = 'admin' | 'creator' | 'reviewer' | 'approver';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  full_name: string;
  role: UserRole;
  password?: string; // Optional - will be auto-generated if not provided
}

export interface UpdateUserData {
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
  password?: string; // Optional - only if changing password
}

export interface CreateUserResponse {
  message: string;
  user: User;
  generatedPassword?: string; // Only present if password was auto-generated
}

const userService = {
  // Get all users (admin only)
  getAll: async (): Promise<User[]> => {
    const response = await api.get<{ users: User[] }>('/users');
    return response.data.users;
  },

  // Get single user (admin only)
  getById: async (id: string): Promise<User> => {
    const response = await api.get<{ user: User }>(`/users/${id}`);
    return response.data.user;
  },

  // Create new user (admin only)
  create: async (data: CreateUserData): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>('/users', data);
    return response.data;
  },

  // Update user (admin only)
  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put<{ user: User }>(`/users/${id}`, data);
    return response.data.user;
  },

  // Deactivate user (admin only)
  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Reactivate user (admin only)
  reactivate: async (id: string): Promise<User> => {
    const response = await api.put<{ user: User }>(`/users/${id}`, {
      is_active: true,
    });
    return response.data.user;
  },

  // Reset password (admin only)
  resetPassword: async (id: string, newPassword: string): Promise<User> => {
    const response = await api.put<{ user: User }>(`/users/${id}`, {
      password: newPassword,
    });
    return response.data.user;
  },
};

export default userService;
