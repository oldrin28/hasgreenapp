import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithDigest } from '../../../utils/digestAuth';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export class GatewaysRepository {
  static async getGateways(): Promise<any[]> {
    const action = 'Listar gateways (/gateways)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');

      const response = await fetch(`${API_URL}/gateways?account_id=${accountId || ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener la lista de gateways.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const gateways = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Lista de gateways obtenida exitosamente (${Array.isArray(gateways) ? gateways.length : 0} gateways) - Fecha/Hora: ${requestTime}`);
      return Array.isArray(gateways) ? gateways : [];
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getGatewayById(id: string): Promise<any> {
    const action = `Obtener detalle de gateway por ID (/gateway?gateway_id=${id})`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/gateway?gateway_id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener los datos del gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const gateway = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Datos del gateway cargados exitosamente - Fecha/Hora: ${requestTime}`);
      return gateway;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async createGateway(data: any): Promise<boolean> {
    const action = 'Registrar gateway (/registergateway)';
    const requestTime = new Date().toISOString();
    try {
      const payload = {
        gateway_location: String(data.gateway_location || ''),
        gateway_name: String(data.gateway_name || ''),
        gateway_unique_id: String(data.gateway_unique_id || '')
      };

      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/registergateway`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al registrar el gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al registrar el gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Gateway registrado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async updateGateway(id: string, data: any): Promise<boolean> {
    const action = `Actualizar gateway (/editgateway)`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/editgateway`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateway_id: Number(id || (data && data.gateway_id) || (data && data.id) || 0),
          gateway_location: String(data.gateway_location || ''),
          gateway_name: String(data.gateway_name || ''),
          //gateway_type: String(data.gateway_type || (data && data.type) || 'GTWY')
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al actualizar los datos del gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al actualizar el gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Gateway actualizado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async deleteGateway(id: string): Promise<boolean> {
    const action = `Eliminar gateway (/deletegateway)`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/deletegateway`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateway_id: String(id)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al eliminar el gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al eliminar el gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Gateway eliminado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async rebootGateway(ip: string): Promise<boolean> {
    const action = `Reiniciar gateway (http://${ip}/rt?non=)`;
    const requestTime = new Date().toISOString();
    try {
      const response = await fetchWithDigest(`http://${ip}/rt?non=`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorMsg = `HTTP Error ${response.status}`;
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: Gateway reiniciado exitosamente - Fecha/Hora: ${requestTime}`);
      return true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async resetGatewayIp(gatewayUniqueId: string, id: number): Promise<boolean> {
    const action = 'Reiniciar IP de gateway (/reset_gateway_ip)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/reset_gateway_ip`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateway_unique_id: gatewayUniqueId,
          id: Number(id),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al reiniciar la IP del gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al reiniciar la IP del gateway.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'IP de gateway reiniciada exitosamente'} - Fecha/Hora: ${requestTime}`);
      return true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }
}
