// src/hooks/usePushNotifications.ts
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import pushNotificationService from '../services/push-notification.service';

interface UsePushNotificationsProps {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
  onTokenReceived?: (token: string) => void;
  registerToken?: boolean; // ⭐ NOUVEAU: contrôler l'enregistrement
}

export const usePushNotifications = ({
  onNotificationReceived,
  onNotificationTapped,
  onTokenReceived,
  registerToken = false, // ⭐ Par défaut, ne pas enregistrer
}: UsePushNotificationsProps = {}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      // Vérifier les permissions
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionGranted(status === 'granted');

      // Obtenir le token (sans l'enregistrer)
      if (status === 'granted') {
        try {
          const token = await pushNotificationService.getExpoPushToken(); // ⭐ Nouvelle méthode
          if (token) {
            setExpoPushToken(token);
            onTokenReceived?.(token);
          }
        } catch (error) {
          console.error('❌ Erreur obtention token:', error);
        }
      }
    };

    setupNotifications();

    // Écouter les notifications reçues
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📬 Notification reçue:', notification);
        setNotification(notification);
        onNotificationReceived?.(notification);
      },
    );

    // Écouter les interactions
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('👆 Notification tapée:', response);
        setNotification(response.notification);
        onNotificationTapped?.(response);
      },
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  // ⭐ Enregistrer le token manuellement
  const registerFcmToken = async (token?: string) => {
    try {
      const tokenToRegister = token || expoPushToken;
      if (!tokenToRegister) {
        console.warn('⚠️ Aucun token à enregistrer');
        return false;
      }
      
      await pushNotificationService.saveFcmToken(tokenToRegister);
      console.log('✅ Token FCM enregistré');
      return true;
    } catch (error) {
      console.error('❌ Erreur enregistrement token:', error);
      return false;
    }
  };

  // Demander les permissions et obtenir le token
  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      
      if (status === 'granted') {
        setPermissionGranted(true);
        const token = await pushNotificationService.getExpoPushToken();
        if (token) {
          setExpoPushToken(token);
          onTokenReceived?.(token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur demande permissions:', error);
      return false;
    }
  };

  return {
    expoPushToken,
    notification,
    permissionGranted,
    requestPermissions,
    registerFcmToken, // ⭐ NOUVEAU
  };
};