// src/hooks/usePushNotifications.ts
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import pushNotificationService from '../services/push-notification.service';

interface UsePushNotificationsProps {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
  onTokenReceived?: (token: string) => void;
  registerToken?: boolean; 
}

export const usePushNotifications = ({
  onNotificationReceived,
  onNotificationTapped,
  onTokenReceived,
  registerToken = false, 
}: UsePushNotificationsProps = {}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionGranted(status === 'granted');

      if (status === 'granted') {
        try {
          const token = await pushNotificationService.getExpoPushToken(); 
          if (token) {
            setExpoPushToken(token);
            onTokenReceived?.(token);
          }
        } catch (error) {
        }
      }
    };

    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        onNotificationReceived?.(notification);
      },
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        setNotification(response.notification);
        onNotificationTapped?.(response);
      },
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const registerFcmToken = async (token?: string) => {
    try {
      const tokenToRegister = token || expoPushToken;
      if (!tokenToRegister) {
        return false;
      }
      
      await pushNotificationService.saveFcmToken(tokenToRegister);
      return true;
    } catch (error) {
      return false;
    }
  };

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
      return false;
    }
  };

  return {
    expoPushToken,
    notification,
    permissionGranted,
    requestPermissions,
    registerFcmToken, 
  };
};