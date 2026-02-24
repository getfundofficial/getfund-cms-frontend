import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePartnerInput {
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  category?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdatePartnerInput {
  name?: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  category?: string;
  display_order?: number;
  is_active?: boolean;
}

export const partnersService = {
  /**
   * Get all partners (for CMS admin - returns all including inactive)
   */
  async getAll(): Promise<Partner[]> {
    try {
      const url = `${API_URL}/partners?all=true`;
      console.log('[PartnersService] Fetching from:', url);
      const response = await axios.get(url);
      console.log('[PartnersService] Response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('[PartnersService] Error fetching partners:', error);
      throw error;
    }
  },

  /**
   * Get a single partner by ID
   */
  async getById(id: string): Promise<Partner> {
    const response = await axios.get(`${API_URL}/partners/${id}`);
    return response.data.data;
  },

  /**
   * Create a new partner
   */
  async create(data: CreatePartnerInput): Promise<Partner> {
    const response = await axios.post(`${API_URL}/partners`, data);
    return response.data.data;
  },

  /**
   * Update a partner
   */
  async update(id: string, data: UpdatePartnerInput): Promise<Partner> {
    const response = await axios.put(`${API_URL}/partners/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a partner
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/partners/${id}`);
  },

  /**
   * Update multiple partners' display order
   */
  async updateOrders(updates: Array<{ id: string; display_order: number }>): Promise<void> {
    await Promise.all(
      updates.map(({ id, display_order }) =>
        this.update(id, { display_order })
      )
    );
  },
};
