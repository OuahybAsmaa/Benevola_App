// src/notifications/notifications.service.ts (MODIFIÉ avec Push)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FirebasePushService } from './firebase-push.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private firebasePushService: FirebasePushService, 
  ) {}

  // Créer une notification
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationsRepository.create(createNotificationDto);
    return await this.notificationsRepository.save(notification);
  }

  async createMessageNotification(
    receiverId: string,
    senderName: string,
    missionTitle?: string,
    missionId?: string,
    senderId?: string, 
  ): Promise<Notification> {
    const description = missionTitle 
      ? `${senderName} vous a envoyé un message concernant "${missionTitle}"`
      : `${senderName} vous a envoyé un message`;

    const notification = await this.create({
      userId: receiverId,
      type: NotificationType.MESSAGE,
      title: 'Nouveau message',
      description,
      data: {
        senderId: senderId || receiverId, 
        senderName,
        missionId,
        missionTitle,
      },
    });

    try {
      await this.firebasePushService.sendPushNotification(receiverId, {
        title: 'Nouveau message',
        body: description,
        data: {
          type: 'message',
          missionId: missionId || '',
          missionTitle: missionTitle || '',
          senderId: senderId || '',
          senderName,
          notificationId: notification.id,
        },
      });
    } catch (error) {
      console.error('❌ Erreur envoi push notification:', error);
    }

    return notification;
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    isRead?: boolean,
  ): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
    hasMore: boolean;
  }> {
    const query = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (isRead !== undefined) {
      query.andWhere('notification.isRead = :isRead', { isRead });
    }

    const total = await query.getCount();
    const notifications = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    // Compter les notifications non lues
    const unreadCount = await this.notificationsRepository.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      notifications,
      total,
      unreadCount,
      hasMore: total > page * limit,
    };
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    return await this.notificationsRepository.save(notification);
  }

  // Marquer toutes les notifications d'un utilisateur comme lues
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  // Supprimer une notification
  async delete(notificationId: string): Promise<void> {
    await this.notificationsRepository.delete(notificationId);
  }

  // Compter les notifications non lues
  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationsRepository.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // Supprimer les anciennes notifications (> 30 jours)
  async deleteOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.notificationsRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :date', { date: thirtyDaysAgo })
      .andWhere('isRead = :isRead', { isRead: true })
      .execute();
  }
}