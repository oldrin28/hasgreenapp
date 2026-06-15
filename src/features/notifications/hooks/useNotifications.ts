import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { NotificationsRepository } from '../repository/NotificationsRepository';

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

  const saveNotificationConfig = async (deviceId: string, config: any) => {
    setIsSaving(true);
    try {
      await NotificationsRepository.saveNotificationConfig(deviceId, config);
    } catch (e) {
      console.error('Error saving notification config:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return { alarms, isLoading, isSaving, toggleAlarm, saveNotificationConfig, refetch: fetchAlarms };
};
