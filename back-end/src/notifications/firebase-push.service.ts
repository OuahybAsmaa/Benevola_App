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
    } catch (error) {
    }
  }

  private ensureMessaging() {
    if (!this.messaging) {
      this.messaging = getMessaging();
    }
    return this.messaging;
  }

  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload,
  ): Promise<boolean> {
    try {
      if (!this.messaging) {
        this.ensureMessaging();
      }

      if (!this.messaging) {
        return false;
      }

      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'fcmToken', 'email'],
      });

      if (!user || !user.fcmToken) {
        return false;
      }

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

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data?.status === 'ok') {
        return true;
      } else {
        if (result.data?.details?.error === 'DeviceNotRegistered') {
          await this.usersRepository.update(userId, { fcmToken: null });
        }
        
        return false;
      }
    } catch (error: any) {
      return false;
    }
  }

  async sendMulticastPushNotification(
    userIds: string[],
    payload: PushNotificationPayload,
  ): Promise<{ success: number; failure: number }> {
    try {
      const users = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.fcmToken', 'user.email'])
        .where('user.id IN (:...userIds)', { userIds })
        .andWhere('user.fcmToken IS NOT NULL')
        .getMany();

      if (users.length === 0) {
        return { success: 0, failure: 0 };
      }

      const results = await Promise.all(
        users.map(user => this.sendPushNotification(user.id, payload))
      );

      const success = results.filter(r => r).length;
      const failure = results.length - success;

      return { success, failure };
    } catch (error: any) {
      return { success: 0, failure: userIds.length };
    }
  }

  async registerFcmToken(userId: string, fcmToken: string): Promise<void> {
    try {
      await this.usersRepository.update(userId, { fcmToken });
    } catch (error: any) {
      throw error;
    }
  }

  async unregisterFcmToken(userId: string): Promise<void> {
    try {
      await this.usersRepository.update(userId, { fcmToken: null });
    } catch (error: any) {
      throw error;
    }
  }
}