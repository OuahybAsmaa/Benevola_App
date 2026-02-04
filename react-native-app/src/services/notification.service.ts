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
  /**
   * Récupérer les notifications de l'utilisateur
   */
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
      console.error('❌ Erreur getUserNotifications:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des notifications');
    }
  }

  /**
   * Récupérer le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count;
    } catch (error: any) {
      console.error('❌ Erreur getUnreadCount:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du compteur');
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur markNotificationAsRead:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage comme lu');
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      await api.patch('/notifications/read-all');
    } catch (error: any) {
      console.error('❌ Erreur markAllNotificationsAsRead:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage de toutes les notifications');
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
      console.error('❌ Erreur deleteNotification:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
}

// Export singleton
export default new NotificationService();