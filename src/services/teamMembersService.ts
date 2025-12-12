import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: 'board_chairman' | 'board_member' | 'management' | 'historical_admin';
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
   * Get all team members
   */
  async getAll(role?: string): Promise<TeamMember[]> {
    try {
      const url = role ? `${API_URL}/team-members?role=${role}` : `${API_URL}/team-members`;
      console.log('[TeamMembersService] Fetching from:', url);
      const response = await axios.get(url);
      console.log('[TeamMembersService] Response:', response.data);

      // If no role specified, the API returns grouped data
      if (!role && response.data.data) {
        const { chairman, management = [], historical_admins = [] } = response.data.data;
        const all: TeamMember[] = [];
        if (chairman) all.push(chairman);
        if (Array.isArray(management)) all.push(...management);
        if (Array.isArray(historical_admins)) all.push(...historical_admins);
        console.log('[TeamMembersService] Combined members:', all.length);
        return all.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      }

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
