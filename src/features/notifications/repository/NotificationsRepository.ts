export class NotificationsRepository {
  static async getNotificationConfig(deviceId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ deviceId, channels: { sms: true, push: true, email: false, voice: false, whatsapp: false } });
      }, 400);
    });
  }

  static async saveNotificationConfig(deviceId: string, config: any): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 600);
    });
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

  static async getAlarmManagement(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([]), 400);
    });
  }
}
