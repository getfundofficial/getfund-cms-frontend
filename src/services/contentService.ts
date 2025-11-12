import { api } from './api';
import { Content, DashboardStats } from '../types/content.types';

export const contentService = {
  async getAll(params?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Content[]> {
    const response = await api.get<Content[]>('/content', { params });
    return response.data;
  },

  async getById(id: string): Promise<Content> {
    const response = await api.get<Content>(`/content/${id}`);
    return response.data;
  },

  async create(data: Partial<Content>): Promise<Content> {
    const response = await api.post<Content>('/content', data);
    return response.data;
  },

  async update(id: string, data: Partial<Content>): Promise<Content> {
    const response = await api.put<Content>(`/content/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/content/${id}`);
  },

  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/content/stats');
    return response.data;
  },

  // Workflow actions
  async submit(id: string): Promise<Content> {
    const response = await api.post<Content>(`/content/${id}/submit`);
    return response.data;
  },

  async approve(id: string): Promise<Content> {
    const response = await api.post<Content>(`/content/${id}/approve`);
    return response.data;
  },

  async requestChanges(id: string, notes: string): Promise<Content> {
    const response = await api.post<Content>(`/content/${id}/request-changes`, { notes });
    return response.data;
  },

  async publish(id: string): Promise<Content> {
    const response = await api.post<Content>(`/content/${id}/publish`);
    return response.data;
  },

  async unpublish(id: string): Promise<Content> {
    const response = await api.post<Content>(`/content/${id}/unpublish`);
    return response.data;
  },
};
