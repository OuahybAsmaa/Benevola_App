// src/services/push-notification.service.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from '../api/loginAPI';

class PushNotificationService {
  private notificationListener: Notifications.EventSubscription | null = null;
  private responseListener: Notifications.EventSubscription | null = null;

  /**
   * ⭐ NOUVEAU: Obtenir le token Expo sans l'enregistrer
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn('⚠️ Les notifications push ne fonctionnent que sur des appareils physiques');
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.error('❌ Project ID manquant dans app.json');
        return null;
      }

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      console.log('✅ Expo Push Token obtenu:', token);

      // Configuration Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannel();
      }

      return token;
    } catch (error) {
      console.error('❌ Erreur obtention token:', error);
      return null;
    }
  }

  /**
   * Demander la permission et enregistrer le token (ANCIENNE MÉTHODE - gardée pour compatibilité)
   */
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
          console.warn('⚠️ Permissions non accordées');
          return null;
        }
      }

      const token = await this.getExpoPushToken();
      
      if (token) {
        // ⭐ Enregistrer immédiatement (ancienne version)
        await this.saveFcmToken(token);
      }

      return token;
    } catch (error) {
      console.error('❌ Erreur enregistrement notifications:', error);
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
      console.log('✅ Token FCM enregistré sur le serveur');
    } catch (error) {
      console.error('❌ Erreur sauvegarde token FCM:', error);
      throw error;
    }
  }

  async removeFcmToken(): Promise<void> {
    try {
      await api.patch('/auth/fcm-token/remove');
      console.log('✅ Token FCM supprimé du serveur');
    } catch (error) {
      console.error('❌ Erreur suppression token FCM:', error);
    }
  }

  /**
   * Écouter les notifications reçues
   */
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    this.notificationListener = Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Écouter les interactions avec les notifications
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void,
  ) {
    this.responseListener = Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Nettoyer les listeners
   */
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

  /**
   * Obtenir le badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Définir le badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Effacer toutes les notifications
   */
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  /**
   * Planifier une notification locale
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    seconds: number = 1
  ): Promise<string> {
    // Dans scheduleLocalNotification, modifiez juste la ligne du trigger :
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