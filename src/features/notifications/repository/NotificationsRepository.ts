import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export class NotificationsRepository {
  static async getNotificationsPerDevice(deviceId: string): Promise<any[]> {
    const action = `Obtener notificaciones por dispositivo (/get_notifications_per_device?device_id=${deviceId})`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/get_notifications_per_device?device_id=${deviceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener la configuración de notificaciones.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Configuración obtenida exitosamente (${Array.isArray(data) ? data.length : 0} registros) - Fecha/Hora: ${requestTime}`);
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getNotificationConfig(deviceId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ deviceId, channels: { sms: true, push: true, email: false, voice: false, whatsapp: false } });
      }, 400);
    });
  }

  static async saveNotificationsData(data: {
    device_id: number;
    extra_info: number;
    guest_account_id: number;
    notifications: string;
  }): Promise<boolean> {
    const action = 'Guardar configuración de notificaciones (/save_notifications_data)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/save_notifications_data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications_data: [data],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al guardar la configuración de notificaciones.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al guardar la configuración.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Configuración guardada exitosamente'} - Fecha/Hora: ${requestTime}`);
      return true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getAlarms(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Alerta Crítica', enabled: true, description: 'Activa inmediatamente al pulsar cualquier botón.' },
          { id: '2', name: 'Recordatorio de Chequeo', enabled: true, description: 'Notificación si no hay actividad en 2 horas.' },
          { id: '3', name: 'Alarma Silenciosa', enabled: false, description: 'Registro interno sin notificación de voz.' },
        ]);
      }, 400);
    });
  }

  static async updateAlarm(id: string, enabled: boolean): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 300);
    });
  }

  static async saveLocalAlarmData(deviceId: number, alarmIds: number[]): Promise<boolean> {
    const action = 'Guardar alarmas locales (/save_local_alarm_data)';
    const requestTime = new Date().toISOString();
    const payload = {
      alarms: alarmIds,
      device_id: deviceId,
    };
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/save_local_alarm_data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al guardar la configuración de alarmas locales.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al guardar la configuración.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Configuración guardada exitosamente'} - Fecha/Hora: ${requestTime}`);
      return true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async registerPushToken(tokenValue: string): Promise<any> {
    const action = 'Registrar push token (/register_push_token)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      if (!token) {
        console.warn(`[REGISTRAR TOKEN] No se pudo enviar el token porque no hay una sesión activa.`);
        return null;
      }

      const response = await fetch(`${API_URL}/register_push_token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokenValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al registrar el token push.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Token registrado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getAlarmManagement(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 400);
    });
  }
}
