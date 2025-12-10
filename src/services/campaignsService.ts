import { api } from './api';

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  goal_amount: number;
  raised_amount: number;
  currency: string;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  is_featured: boolean;
  display_order: number;
  button_text: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  percentage_funded?: number;
  days_left?: number;
}

export interface CreateCampaignDto {
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  goal_amount: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  status?: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  is_featured?: boolean;
  display_order?: number;
  button_text?: string;
}

export interface UpdateCampaignDto extends Partial<CreateCampaignDto> {}

class CampaignsService {
  async getAll(featured?: boolean): Promise<Campaign[]> {
    const params = featured !== undefined ? { featured: featured.toString() } : {};
    const response = await api.get('/campaigns', { params });
    return response.data.campaigns || [];
  }

  async getBySlug(slug: string): Promise<Campaign> {
    const response = await api.get(`/campaigns/${slug}`);
    return response.data.campaign;
  }

  async create(data: CreateCampaignDto): Promise<Campaign> {
    const response = await api.post('/campaigns', data);
    return response.data.campaign;
  }

  async update(slug: string, data: UpdateCampaignDto): Promise<Campaign> {
    const response = await api.put(`/campaigns/${slug}`, data);
    return response.data.campaign;
  }

  async delete(slug: string): Promise<void> {
    await api.delete(`/campaigns/${slug}`);
  }
}

export const campaignsService = new CampaignsService();
