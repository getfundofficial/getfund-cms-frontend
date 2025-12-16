import { api } from './api';

export interface LotteryPrize {
  rank: number | string;
  amount: number;
  description: string;
  currency: string;
  count?: number;
  flip_description?: string;
}

export interface LotteryStep {
  step: number;
  title: string;
  description: string;
  flip_description?: string;
}

export interface LotteryConfig {
  id: number;
  prizes: LotteryPrize[];
  next_draw_date: string;
  draw_frequency: 'weekly' | 'monthly' | 'quarterly';
  how_it_works_steps: LotteryStep[];
  is_active: boolean;
  banner_color: string;
  section_title?: string;
  section_description?: string;
  prize_box_title?: string;
  sharing_enabled?: boolean;
  share_text?: string;
  share_hashtags?: string;
  updated_by?: string;
  updated_at: string;
  current_entries_count?: number;
}

export interface UpdateLotteryConfigDto {
  prizes?: LotteryPrize[];
  next_draw_date?: string;
  draw_frequency?: 'weekly' | 'monthly' | 'quarterly';
  how_it_works_steps?: LotteryStep[];
  is_active?: boolean;
  banner_color?: string;
  section_title?: string;
  section_description?: string;
  prize_box_title?: string;
  sharing_enabled?: boolean;
  share_text?: string;
  share_hashtags?: string;
}

export interface LotteryEntry {
  id: string;
  payment_reference: string;
  donation_amount: number;
  currency: string;
  donor_email: string;
  donor_phone?: string;
  donor_name?: string;
  campaign_id?: string;
  campaign_title?: string;
  draw_month: string;
  is_winner: boolean;
  is_valid: boolean;
  prize_rank?: number;
  prize_amount?: number;
  notified_at?: string;
  claimed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LotteryEntriesResponse {
  entries: LotteryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class LotteryService {
  async getConfig(): Promise<LotteryConfig> {
    const response = await api.get('/lottery/config');
    return response.data.config;
  }

  async updateConfig(data: UpdateLotteryConfigDto): Promise<LotteryConfig> {
    const response = await api.put('/lottery/config', data);
    return response.data.config;
  }

  async getEntries(params?: {
    draw_month?: string;
    is_winner?: boolean;
    campaign_id?: string;
    page?: number;
    limit?: number;
  }): Promise<LotteryEntriesResponse> {
    const response = await api.get('/lottery/entries', { params });
    return response.data;
  }
}

export const lotteryService = new LotteryService();
