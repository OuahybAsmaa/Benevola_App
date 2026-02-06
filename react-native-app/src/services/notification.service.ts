// src/services/notification.service.ts
import api from '../api/loginAPI'; 

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mission' | 'reminder' | 'confirmation' | 'achievement' | 'friend';
  title: string;
  description: string;
  isRead: boolean;
  data?: {
    missionId?: string;
    missionTitle?: string;
    senderId?: string;
    senderName?: string;
    messageId?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

class NotificationService {
  async getUserNotifications(
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
  ): Promise<NotificationsResponse> {
    try {
      const params: any = { page, limit };
      if (isRead !== undefined) {
        params.isRead = isRead;
      }

      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des notifications');
    }
  }
  
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du compteur');
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage comme lu');
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await api.patch('/notifications/read-all');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage de toutes les notifications');
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
}

export default new NotificationService();