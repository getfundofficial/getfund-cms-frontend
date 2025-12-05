import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    const url = role ? `${API_URL}/team-members?role=${role}` : `${API_URL}/team-members`;
    const response = await axios.get(url);

    // If no role specified, the API returns grouped data
    if (!role && response.data.data) {
      const { chairman, management, historical_admins } = response.data.data;
      const all: TeamMember[] = [];
      if (chairman) all.push(chairman);
      all.push(...management);
      all.push(...historical_admins);
      return all.sort((a, b) => a.display_order - b.display_order);
    }

    return response.data.data || [];
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
