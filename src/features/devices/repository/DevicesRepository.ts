import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export class DevicesRepository {
  static async getDevices(): Promise<any[]> {
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');
      
      const response = await fetch(`${API_URL}/devices?account_id=${accountId || ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener la lista de dispositivos.');
      }

      const devices = await response.json();
      console.log('JSON de dispositivos recibido:', JSON.stringify(devices, null, 2));
      return Array.isArray(devices) ? devices : [];
    } catch (error) {
      console.error('Error en DevicesRepository.getDevices:', error);
      throw error;
    }
  }

  static async getDeviceById(id: string): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/device?device_id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener los datos del dispositivo.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en DevicesRepository.getDeviceById:', error);
      throw error;
    }
  }

  static async createDevice(data: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  static async updateDevice(id: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  static async deleteDevice(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
}
