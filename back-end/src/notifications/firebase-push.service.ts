// src/notifications/firebase-push.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { getMessaging } from '../config/firebase-admin.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: {
    type?: string;
    missionId?: string;
    missionTitle?: string;
    senderId?: string;
    senderName?: string;
    [key: string]: any;
  };
}

@Injectable()
export class FirebasePushService implements OnModuleInit {
  private readonly logger = new Logger(FirebasePushService.name);
  private messaging: any;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  onModuleInit() {
    try {
      this.messaging = getMessaging();
      this.logger.log('✅ Firebase messaging service initialized');
    } catch (error) {
      this.logger.warn('⚠️ Firebase messaging not available yet');
    }
  }

  private ensureMessaging() {
    if (!this.messaging) {
      this.messaging = getMessaging();
    }
    return this.messaging;
  }

  /**
   * Envoyer une notification push à un utilisateur
   */
  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload,
  ): Promise<boolean> {
    try {
      // Vérifier que Firebase est initialisé
      if (!this.messaging) {
        this.ensureMessaging();
      }

      if (!this.messaging) {
        this.logger.warn('⚠️ Firebase not initialized, skipping push notification');
        return false;
      }

      // Récupérer le token FCM de l'utilisateur
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'fcmToken', 'email'], // ⭐ Ajouter email pour debug
      });

      if (!user || !user.fcmToken) {
        this.logger.warn(`⚠️ No FCM token found for user ${userId} (${user?.email})`);
        return false;
      }

      this.logger.log(`📤 Sending push to ${user.email} with token: ${user.fcmToken.substring(0, 20)}...`);

      // Préparer le message pour Expo Push Notifications
      const message = {
        to: user.fcmToken,
        sound: 'default',
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
        priority: 'high',
        channelId: 'default',
        badge: 1,
      };

      this.logger.log('📦 Message payload:', JSON.stringify(message, null, 2));

      // ⭐ IMPORTANT : Utiliser l'API Expo Push Notifications
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data?.status === 'ok') {
        this.logger.log(`✅ Push notification sent successfully to ${user.email}`);
        return true;
      } else {
        this.logger.error(`❌ Push notification failed:`, result);
        
        // Si le token est invalide, le supprimer
        if (result.data?.details?.error === 'DeviceNotRegistered') {
          this.logger.warn(`❌ Invalid token for user ${userId}, removing it`);
          await this.usersRepository.update(userId, { fcmToken: null });
        }
        
        return false;
      }
    } catch (error: any) {
      this.logger.error(`❌ Error sending push notification: ${error.message}`);
      this.logger.error(error.stack);
      return false;
    }
  }

  /**
   * Envoyer une notification à plusieurs utilisateurs
   */
  async sendMulticastPushNotification(
    userIds: string[],
    payload: PushNotificationPayload,
  ): Promise<{ success: number; failure: number }> {
    try {
      // Récupérer tous les tokens FCM
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.fcmToken', 'user.email'])
        .where('user.id IN (:...userIds)', { userIds })
        .andWhere('user.fcmToken IS NOT NULL')
        .getMany();

      if (users.length === 0) {
        this.logger.warn('⚠️ No valid FCM tokens found');
        return { success: 0, failure: 0 };
      }

      this.logger.log(`📤 Sending multicast push to ${users.length} users`);

      // Envoyer à chaque utilisateur
      const results = await Promise.all(
        users.map(user => this.sendPushNotification(user.id, payload))
      );

      const success = results.filter(r => r).length;
      const failure = results.length - success;

      this.logger.log(`✅ Multicast sent: ${success} success, ${failure} failures`);

      return { success, failure };
    } catch (error: any) {
      this.logger.error(`❌ Error sending multicast notification: ${error.message}`);
      return { success: 0, failure: userIds.length };
    }
  }

  /**
   * Enregistrer un token FCM pour un utilisateur
   */
  async registerFcmToken(userId: string, fcmToken: string): Promise<void> {
    try {
      await this.usersRepository.update(userId, { fcmToken });
      this.logger.log(`✅ FCM token registered for user ${userId}`);
    } catch (error: any) {
      this.logger.error(`❌ Error registering FCM token: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer le token FCM d'un utilisateur (lors de la déconnexion)
   */
  async unregisterFcmToken(userId: string): Promise<void> {
    try {
      await this.usersRepository.update(userId, { fcmToken: null });
      this.logger.log(`✅ FCM token removed for user ${userId}`);
    } catch (error: any) {
      this.logger.error(`❌ Error removing FCM token: ${error.message}`);
      throw error;
    }
  }
}