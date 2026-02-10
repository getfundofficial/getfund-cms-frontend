import { api } from './api';

export interface FooterConfig {
  id: number;
  logo_url: string;
  about_text: string;
  phone: string;
  email: string;
  address: string;
  office_hours_weekday: string;
  office_hours_weekend: string;
  background_color: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  quick_links: Array<{
    name: string;
    href: string;
    visible?: boolean;
  }>;
  is_active: boolean;
  updated_at: string;
}

export interface UpdateFooterConfigInput {
  logo_url?: string;
  about_text?: string;
  phone?: string;
  email?: string;
  address?: string;
  office_hours_weekday?: string;
  office_hours_weekend?: string;
  background_color?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
  quick_links?: Array<{
    name: string;
    href: string;
    visible?: boolean;
  }>;
}

export const footerService = {
  async getFooterConfig(): Promise<FooterConfig> {
    const response = await api.get<FooterConfig>('/footer-config');
    return response.data;
  },

  async updateFooterConfig(data: UpdateFooterConfigInput): Promise<FooterConfig> {
    const response = await api.put<FooterConfig>('/footer-config', data);
    return response.data;
  },
};
