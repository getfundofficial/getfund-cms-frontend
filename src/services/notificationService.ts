import { api } from './api';

export interface NotificationCounts {
  passwordResetRequests: number;
}

const notificationService = {
  getCounts: async (): Promise<NotificationCounts> => {
    const response = await api.get<{ counts: NotificationCounts }>('/notifications/count');
    return response.data.counts;
  },
};

export default notificationService;
