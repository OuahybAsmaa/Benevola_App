// src/services/push-notification.service.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from '../api/loginAPI';

class PushNotificationService {
  private notificationListener: Notifications.EventSubscription | null = null;
  private responseListener: Notifications.EventSubscription | null = null;

  async getExpoPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        return null;
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      if (Platform.OS === 'android') {
        await this.setupAndroidChannel();
      }

      return token;
    } catch (error) {
      return null;
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      let permissions = await Notifications.getPermissionsAsync();
      
      if (permissions.status !== 'granted') {
        permissions = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        
        if (permissions.status !== 'granted') {
          return null;
        }
      }

      const token = await this.getExpoPushToken();
      
      if (token) {
        await this.saveFcmToken(token);
      }

      return token;
    } catch (error) {
      return null;
    }
  }

  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7B68EE',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      showBadge: true,
      enableVibrate: true,
      enableLights: true,
      sound: 'default',
    });
  }

  async saveFcmToken(fcmToken: string): Promise<void> {
    try {
      await api.post('/auth/fcm-token', { fcmToken });
    } catch (error) {
      throw error;
    }
  }

  async removeFcmToken(): Promise<void> {
    try {
      await api.patch('/auth/fcm-token/remove');
    } catch (error) {
    }
  }

  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    this.notificationListener = Notifications.addNotificationReceivedListener(callback);
  }

  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ) {
    this.responseListener = Notifications.addNotificationResponseReceivedListener(callback);
  }

  removeListeners() {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }
    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    seconds: number = 1
  ): Promise<string> {
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    };

    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
  }
}

export default new PushNotificationService();