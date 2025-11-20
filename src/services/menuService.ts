import { api } from './api';

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  page_slug: string | null;
  order_index: number;
  is_active: boolean;
  item_type: 'menu' | 'cta';
  created_at: string;
  updated_at: string;
}

export interface CreateMenuItemInput {
  label: string;
  url: string;
  page_slug?: string;
  order_index: number;
  is_active?: boolean;
  item_type: 'menu' | 'cta';
}

export interface UpdateMenuItemInput {
  label?: string;
  url?: string;
  page_slug?: string | null;
  order_index?: number;
  is_active?: boolean;
}

export const menuService = {
  async getAll(includeInactive: boolean = false): Promise<MenuItem[]> {
    const params = includeInactive ? '?includeInactive=true' : '';
    const response = await api.get<MenuItem[]>(`/menu-items${params}`);
    return response.data;
  },

  async getById(id: number): Promise<MenuItem> {
    const response = await api.get<MenuItem>(`/menu-items/${id}`);
    return response.data;
  },

  async create(data: CreateMenuItemInput): Promise<MenuItem> {
    const response = await api.post<MenuItem>('/menu-items', data);
    return response.data;
  },

  async update(id: number, data: UpdateMenuItemInput): Promise<MenuItem> {
    const response = await api.put<MenuItem>(`/menu-items/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/menu-items/${id}`);
  },

  async reorder(items: Array<{ id: number; order_index: number }>): Promise<void> {
    await api.post('/menu-items/reorder', { items });
  },
};
