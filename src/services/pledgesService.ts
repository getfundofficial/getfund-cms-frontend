import { api } from './api';

export interface Pledge {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  country: string;
  address?: string;
  donation_description: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PledgesResponse {
  success: boolean;
  pledges: Pledge[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdatePledgeDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_country_code?: string;
  phone_number?: string;
  country?: string;
  address?: string;
  donation_description?: string;
  status?: 'pending' | 'contacted' | 'completed' | 'cancelled';
  notes?: string;
}

class PledgesService {
  async getPledges(params?: {
    country?: string;
    status?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<PledgesResponse> {
    const response = await api.get('/pledges', { params });
    return response.data;
  }

  async getPledge(id: string): Promise<Pledge> {
    const response = await api.get(`/pledges/${id}`);
    return response.data.pledge;
  }

  async updatePledge(id: string, data: UpdatePledgeDto): Promise<Pledge> {
    const response = await api.put(`/pledges/${id}`, data);
    return response.data.pledge;
  }

  async deletePledge(id: string): Promise<void> {
    await api.delete(`/pledges/${id}`);
  }

  async exportPledges(params?: {
    country?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Blob> {
    const response = await api.get('/pledges/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
}

export const pledgesService = new PledgesService();
