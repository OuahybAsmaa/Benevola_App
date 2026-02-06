// src/api/notifications.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import API_BASE_URL from '../config/baseUrl';

const notificationsAPI = axios.create({
  baseURL: `${API_BASE_URL}/notifications`,
});

notificationsAPI.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const getUserNotifications = async (
  page: number = 1,
  limit: number = 20,
  isRead?: boolean,
): Promise<NotificationsResponse> => {
  const params: any = { page, limit };
  if (isRead !== undefined) {
    params.isRead = isRead;
  }

  const response = await notificationsAPI.get('/', { params });
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await notificationsAPI.get('/unread-count');
  return response.data.count;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await notificationsAPI.patch(`/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await notificationsAPI.patch('/read-all');
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await notificationsAPI.delete(`/${notificationId}`);
};

export default notificationsAPI;