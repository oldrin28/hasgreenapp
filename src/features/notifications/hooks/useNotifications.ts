import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { NotificationsRepository } from '../repository/NotificationsRepository';
import { DevicesRepository } from '../../devices/repository/DevicesRepository';

export const useNotifications = () => {
  const router = useRouter();
  const [alarms, setAlarms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAlarms = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await NotificationsRepository.getAlarms();
      setAlarms(data);
    } catch (e) {
      console.error('Error fetching alarms:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  const toggleAlarm = async (id: string, enabled: boolean) => {
    setAlarms((prev) => prev.map((a) => a.id === id ? { ...a, enabled } : a));
    try {
      await NotificationsRepository.updateAlarm(id, enabled);
    } catch (e) {
      console.error('Error updating alarm:', e);
      // Revert optimistic update
      setAlarms((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !enabled } : a));
    }
  };

  const [configLoading, setConfigLoading] = useState(false);

  const loadNotificationConfig = useCallback(async (deviceId: string, userId: string) => {
    setConfigLoading(true);
    try {
      const data = await NotificationsRepository.getNotificationsPerDevice(deviceId);
      const userConfig = data.find((item: any) => String(item.guest_account_id) === String(userId));
      return userConfig;
    } catch (e) {
      console.error('Error loading notification config:', e);
      return null;
    } finally {
      setConfigLoading(false);
    }
  }, []);

  const saveNotificationConfig = async (data: {
    device_id: number;
    extra_info: number;
    guest_account_id: number;
    notifications: string;
  }) => {
    setIsSaving(true);
    try {
      await NotificationsRepository.saveNotificationsData(data);
      alert('Configuración de notificaciones guardada exitosamente.');
    } catch (e: any) {
      alert(e.message || 'Error al guardar la configuración de notificaciones.');
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const saveLocalAlarmData = async (deviceId: number, alarmIds: number[]) => {
    setIsSaving(true);
    try {
      await NotificationsRepository.saveLocalAlarmData(deviceId, alarmIds);
      // Refresh the devices list to update cache with new trigger configurations
      await DevicesRepository.getDevices();
      alert('Configuración de alarmas locales guardada exitosamente.');
      router.back();
    } catch (e: any) {
      alert(e.message || 'Error al guardar la configuración de alarmas locales.');
    } finally {
      setIsSaving(false);
    }
  };

  return { alarms, isLoading, isSaving, configLoading, toggleAlarm, loadNotificationConfig, saveNotificationConfig, saveLocalAlarmData, refetch: fetchAlarms };
};
