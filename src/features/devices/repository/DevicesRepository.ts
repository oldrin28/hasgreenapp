import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

let cachedDevices: any[] = [];
let cachedDeviceTypes: any[] = [];

export class DevicesRepository {
  static async getDevices(): Promise<any[]> {
    const action = 'Listar dispositivos (/devices)';
    const requestTime = new Date().toISOString();
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
        const errorMsg = errorData.message || 'Error al obtener la lista de dispositivos.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const devices = await response.json();
      cachedDevices = Array.isArray(devices) ? devices : [];
      await AsyncStorage.setItem('devices_cache', JSON.stringify(cachedDevices)).catch(() => {});
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Lista de dispositivos obtenida exitosamente (${cachedDevices.length} dispositivos) - Fecha/Hora: ${requestTime}`);
      return cachedDevices;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getCachedDevices(): Promise<any[]> {
    if (cachedDevices && cachedDevices.length > 0) {
      return cachedDevices;
    }
    const stored = await AsyncStorage.getItem('devices_cache').catch(() => null);
    if (stored) {
      try {
        cachedDevices = JSON.parse(stored);
        return cachedDevices;
      } catch (e) {}
    }
    return [];
  }

  static async getDeviceById(id: string): Promise<any> {
    const action = `Obtener detalle de dispositivo por ID (/device?device_id=${id})`;
    const requestTime = new Date().toISOString();
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
        const errorMsg = errorData.message || 'Error al obtener los datos del dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const deviceData = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Datos del dispositivo cargados exitosamente - Fecha/Hora: ${requestTime}`);
      return deviceData;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async createDevice(data: any): Promise<boolean> {
    const action = 'Registrar dispositivo (/registerdevice)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/registerdevice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_name: String(data.device_name || ''),
          device_location: String(data.device_location || ''),
          device_trigger_local_alarm: "1",
          device_type: "1",
          device_unique_id: String(data.device_unique_id || ''),
          patient_id: data.patient_id ? String(data.patient_id) : ""
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al registrar el dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al registrar el dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Dispositivo registrado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async updateDevice(id: string, data: any): Promise<boolean> {
    const action = `Actualizar dispositivo (/updatedevice)`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      
      const payload: any = {
        device_id: String(data.device_id || id || ''),
        device_unique_id: String(data.device_unique_id || ''),
        device_name: String(data.device_name || ''),
        device_location: String(data.device_location || ''),
      };

      if (data.device_alert_message !== undefined && data.device_alert_message !== null) {
        payload.device_alert_message = String(data.device_alert_message);
      }
      if (data.device_topic !== undefined && data.device_topic !== null) {
        payload.device_topic = String(data.device_topic);
      }
      const devType = data.device_type !== undefined ? data.device_type : data.device_type_id;
      if (devType !== undefined && devType !== null) {
        payload.device_type = String(devType);
      }
      if (data.patient_id !== undefined && data.patient_id !== null) {
        payload.patient_id = String(data.patient_id);
      }

      const response = await fetch(`${API_URL}/updatedevice`, {
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
        const errorMsg = errorData.message || 'Error al actualizar los datos del dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al actualizar el dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Dispositivo actualizado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async deleteDevice(id: string): Promise<boolean> {
    const action = `Eliminar dispositivo (/deletedevice)`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/deletedevice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: id
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al eliminar el dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al eliminar el dispositivo.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Dispositivo eliminado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getDeviceTypes(): Promise<any[]> {
    const action = 'Listar tipos de dispositivos (/devicetypes)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/devicetypes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener los tipos de dispositivos.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const deviceTypes = await response.json();
      cachedDeviceTypes = Array.isArray(deviceTypes) ? deviceTypes : [];
      await AsyncStorage.setItem('device_types_cache', JSON.stringify(cachedDeviceTypes)).catch(() => {});
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Tipos de dispositivos obtenidos exitosamente (${cachedDeviceTypes.length} tipos) - Fecha/Hora: ${requestTime}`);
      return cachedDeviceTypes;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getCachedDeviceTypes(): Promise<any[]> {
    if (cachedDeviceTypes && cachedDeviceTypes.length > 0) {
      return cachedDeviceTypes;
    }
    const stored = await AsyncStorage.getItem('device_types_cache').catch(() => null);
    if (stored) {
      try {
        cachedDeviceTypes = JSON.parse(stored);
        return cachedDeviceTypes;
      } catch (e) {}
    }
    return [];
  }
}
