import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: 'board_chairman' | 'board_member' | 'management' | 'historical_admin' | 'deputy_administrator' | 'financial_controller';
  image_url?: string;
  bio?: string;
  date_range?: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateTeamMemberInput {
  name: string;
  title: string;
  role: TeamMember['role'];
  image_url?: string;
  bio?: string;
  date_range?: string;
  display_order?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateTeamMemberInput {
  name?: string;
  title?: string;
  role?: TeamMember['role'];
  image_url?: string;
  bio?: string;
  date_range?: string;
  display_order?: number;
  status?: 'active' | 'inactive';
}

export const teamMembersService = {
  /**
   * Get all team members (for CMS admin - returns flat array including inactive)
   */
  async getAll(role?: string): Promise<TeamMember[]> {
    try {
      // Use all=true to get flat array of all members (including inactive) for CMS admin
      let url = `${API_URL}/team-members?all=true`;
      if (role) {
        url += `&role=${role}`;
      }
      console.log('[TeamMembersService] Fetching from:', url);
      const response = await axios.get(url);
      console.log('[TeamMembersService] Response:', response.data);

      return response.data.data || [];
    } catch (error) {
      console.error('[TeamMembersService] Error fetching team members:', error);
      throw error;
    }
  },

  /**
   * Get a single team member by ID
   */
  async getById(id: string): Promise<TeamMember> {
    const response = await axios.get(`${API_URL}/team-members/${id}`);
    return response.data.data;
  },

  /**
   * Create a new team member
   */
  async create(data: CreateTeamMemberInput): Promise<TeamMember> {
    const response = await axios.post(`${API_URL}/team-members`, data);
    return response.data.data;
  },

  /**
   * Update a team member
   */
  async update(id: string, data: UpdateTeamMemberInput): Promise<TeamMember> {
    const response = await axios.put(`${API_URL}/team-members/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a team member
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/team-members/${id}`);
  },

  /**
   * Update multiple team members' display order
   */
  async updateOrders(updates: Array<{ id: string; display_order: number }>): Promise<void> {
    await Promise.all(
      updates.map(({ id, display_order }) =>
        this.update(id, { display_order })
      )
    );
  },
};
