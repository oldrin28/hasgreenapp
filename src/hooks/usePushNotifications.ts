import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { NotificationsRepository } from '@/features/notifications/repository/NotificationsRepository';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async token => {
      if (token) {
        setFcmToken(token);
        try {
          await NotificationsRepository.registerPushToken(token);
        } catch (error) {
          console.error('[PUSH TOKEN REGISTRATION] Error al registrar en backend:', error);
        }
      }
    });

    // Handle incoming notifications when app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Handle user interaction with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User interacted with push notification:', response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return { fcmToken, notification };
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
    // Delete the channel first so Android re-registers it with the custom sound resource
    await Notifications.deleteNotificationChannelAsync('hasgreen_sound_channel');
    await Notifications.setNotificationChannelAsync('hasgreen_sound_channel', {
      name: 'HASGREEN Alerts',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'notificacion',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('[NOTIFICACIONES] No se concedió permiso para enviar notificaciones.');
      return null;
    }
    
    try {
      // Fetch native FCM device token directly
      token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('[FIREBASE FCM] Native Device Push Token obtenido:', token);
    } catch (error) {
      console.error('[FIREBASE FCM] Error al obtener el token nativo:', error);
    }
  } else {
    console.warn('[NOTIFICACIONES] Se debe utilizar un dispositivo físico para recibir notificaciones push.');
  }

  return token;
}
