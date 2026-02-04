// src/hooks/useNotifications.ts (CORRIGÉ)
import { useState, useEffect, useCallback } from 'react';
import notificationService, { Notification, NotificationsResponse } from '../services/notification.service';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // Récupérer les notifications
  const fetchNotifications = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response: NotificationsResponse = await notificationService.getUserNotifications(pageNum);
      
      if (append) {
        setNotifications(prev => [...prev, ...response.notifications]);
      } else {
        setNotifications(response.notifications);
      }
      
      setUnreadCount(response.unreadCount);
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err: any) {
      console.error('❌ Erreur récupération notifications:', err);
      setError(err.message || 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer uniquement le nombre de notifications non lues
  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err: any) {
      console.error('❌ Erreur récupération count:', err);
    }
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markNotificationAsRead(notificationId);
      
      // Mettre à jour l'état local
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('❌ Erreur marquage comme lu:', err);
      throw err;
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllNotificationsAsRead();
      
      // Mettre à jour l'état local
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (err: any) {
      console.error('❌ Erreur marquage tout comme lu:', err);
      throw err;
    }
  }, []);

  // Supprimer une notification
  const deleteNotif = useCallback(async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Retirer de l'état local
      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Décrémenter le compteur si c'était non lu
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error('❌ Erreur suppression notification:', err);
      throw err;
    }
  }, [notifications]);

  // Charger plus de notifications (pagination)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, true);
    }
  }, [loading, hasMore, page, fetchNotifications]);

  // Charger les notifications au montage
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotif,
    loadMore,
  };
};