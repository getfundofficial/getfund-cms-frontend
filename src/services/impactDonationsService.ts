import { api } from './api';

export interface ImpactDonation {
  id: string;
  donation_type: string;
  donation_description?: string;
  amount: number;
  currency: 'GHS' | 'USD' | 'EUR';
  payment_reference?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  donor_email?: string;
  donor_phone?: string;
  donor_name?: string;
  donor_type: 'Individual' | 'Corporate' | 'Organization' | 'Anonymous';
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  is_anonymous: boolean;
  payment_method?: string;
  notes?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ImpactDonationsStats {
  pending: { count: number; total_amount: number };
  completed: { count: number; total_amount: number };
  failed: { count: number; total_amount: number };
  refunded: { count: number; total_amount: number };
}

export interface ImpactDonationsResponse {
  success: boolean;
  donations: ImpactDonation[];
  stats: ImpactDonationsStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateImpactDonationDto {
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
}

class ImpactDonationsService {
  async getDonations(params?: {
    donation_type?: string;
    payment_status?: string;
    search?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<ImpactDonationsResponse> {
    const response = await api.get('/impact-donations', { params });
    return response.data;
  }

  async updateDonation(id: string, data: UpdateImpactDonationDto): Promise<ImpactDonation> {
    const response = await api.patch('/impact-donations', { id, ...data });
    return response.data.data;
  }
}

export const impactDonationsService = new ImpactDonationsService();
