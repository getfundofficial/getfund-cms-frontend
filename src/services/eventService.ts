import { api } from './api';

export interface CompanyEvent {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  event_type: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  date: string;
  name: string;
  type: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  event_date: string;
  event_type?: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  event_date?: string;
  event_type?: string;
}

class EventService {
  /**
   * Get all events
   */
  async getEvents(): Promise<CompanyEvent[]> {
    const response = await api.get('/events');
    return response.data.data;
  }

  /**
   * Get events by date range
   */
  async getEventsByDateRange(start: string, end: string): Promise<CompanyEvent[]> {
    const response = await api.get('/events', {
      params: { start, end },
    });
    return response.data.data;
  }

  /**
   * Get events for a specific month
   */
  async getEventsByMonth(year: number, month: number): Promise<CompanyEvent[]> {
    const response = await api.get('/events', {
      params: { year, month },
    });
    return response.data.data;
  }

  /**
   * Get a single event by ID
   */
  async getEvent(id: number): Promise<CompanyEvent> {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  }

  /**
   * Create a new event
   */
  async createEvent(data: CreateEventInput): Promise<CompanyEvent> {
    const response = await api.post('/events', data);
    return response.data.data;
  }

  /**
   * Update an event
   */
  async updateEvent(id: number, data: UpdateEventInput): Promise<CompanyEvent> {
    const response = await api.put(`/events/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/events/${id}`);
  }

  /**
   * Get Ghana public holidays for a given year
   */
  async getHolidays(year?: number): Promise<Holiday[]> {
    const params = year ? { year } : {};
    const response = await api.get('/holidays', { params });
    console.log('[EventService] Holidays response:', response.data);
    return response.data?.data || [];
  }
}

export const eventService = new EventService();
