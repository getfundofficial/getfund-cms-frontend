import { api } from './api';

export interface Donation {
  id: string;
  donation_type: 'general' | 'campaign' | 'impact';
  donation_category?: string;
  donation_description?: string;
  donation_reason?: string;
  donation_frequency: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  payment_reference?: string;
  amount: number;
  currency: 'GHS' | 'USD' | 'EUR' | 'GBP';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  donor_email?: string;
  donor_phone?: string;
  donor_name?: string;
  donor_type: 'Individual' | 'Corporate' | 'GETFund Beneficiary' | 'Anonymous';
  campaign_id?: string;
  campaign_slug?: string;
  metadata?: Record<string, any>;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DonationsStats {
  pending: { count: number; total_amount: number };
  completed: { count: number; total_amount: number };
  failed: { count: number; total_amount: number };
  refunded: { count: number; total_amount: number };
}

export interface DonationsResponse {
  success: boolean;
  donations: Donation[];
  stats: DonationsStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateDonationDto {
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
}

class DonationsService {
  async getDonations(params?: {
    donation_type?: string;
    donation_category?: string;
    payment_status?: string;
    donor_type?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<DonationsResponse> {
    const response = await api.get('/donations', { params });
    return response.data;
  }

  async updateDonation(id: string, data: UpdateDonationDto): Promise<Donation> {
    const response = await api.patch('/donations', { id, ...data });
    return response.data.data;
  }
}

export const donationsService = new DonationsService();
