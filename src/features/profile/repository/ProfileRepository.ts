import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export class ProfileRepository {
  static async getProfile(): Promise<any> {
    const action = 'Obtener datos de cuenta (/getaccountdata)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');

      if (!accountId) {
        throw new Error('No se encontró el ID de la cuenta.');
      }

      const response = await fetch(`${API_URL}/getaccountdata?account_id=${accountId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener los datos de la cuenta.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al obtener los datos de la cuenta.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: Datos de la cuenta obtenidos exitosamente - Fecha/Hora: ${requestTime}`);
      return res.data;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async updateProfile(data: any): Promise<{ success: boolean }> {
    const action = 'Actualizar datos de cuenta (/updateaccountdata)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');

      if (!accountId) {
        throw new Error('No se encontró el ID de la cuenta.');
      }

      const response = await fetch(`${API_URL}/updateaccountdata`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: accountId,
          address1: data.address1 || '',
          address2: data.address2 || '',
          address3: data.address3 || '',
          city: data.city || '',
          country: data.country || '',
          email_address: data.email_address || '',
          first_name: data.first_name || '',
          fixed_phone_country_code: data.fixed_phone_country_code || '',
          fixed_phone_number: data.fixed_phone_number || '',
          last_name: data.last_name || '',
          mobile_phone_country_code: data.mobile_phone_country_code || '',
          mobile_phone_number: data.mobile_phone_number || '',
          state: data.state || '',
          test_mode: data.test_mode !== undefined ? Number(data.test_mode) : 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al actualizar los datos de la cuenta.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al actualizar los datos de la cuenta.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Datos de la cuenta actualizados exitosamente'} - Fecha/Hora: ${requestTime}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async changePassword(data: any): Promise<{ success: boolean }> {
    const action = 'Cambiar contraseña (/updateaccountdata)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');

      if (!accountId) {
        throw new Error('No se encontró el ID de la cuenta.');
      }

      const response = await fetch(`${API_URL}/updateaccountdata`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: accountId,
          address1: data.address1 || '',
          address2: data.address2 || '',
          address3: data.address3 || '',
          city: data.city || '',
          country: data.country || '',
          email_address: data.email_address || '',
          first_name: data.first_name || '',
          fixed_phone_country_code: data.fixed_phone_country_code || '',
          fixed_phone_number: data.fixed_phone_number || '',
          last_name: data.last_name || '',
          mobile_phone_country_code: data.mobile_phone_country_code || '',
          mobile_phone_number: data.mobile_phone_number || '',
          state: data.state || '',
          test_mode: data.test_mode !== undefined ? Number(data.test_mode) : 0,
          password1: data.password1 || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al actualizar la contraseña.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al actualizar la contraseña.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Contraseña actualizada exitosamente'} - Fecha/Hora: ${requestTime}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async logout(): Promise<{ success: boolean }> {
    const action = 'Cerrar sesión (/logout)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al cerrar sesión en el servidor.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
      } else {
        const res = await response.json();
        console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Sesión cerrada exitosamente'} - Fecha/Hora: ${requestTime}`);
      }
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
    } finally {
      // Borrar absolutamente toda la información localmente
      await AsyncStorage.clear();
    }
    return { success: true };
  }

  static async deleteAccount(): Promise<boolean> {
    const action = 'Eliminar cuenta (/deleteaccount)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');

      if (!accountId) {
        throw new Error('No se encontró el ID de la cuenta.');
      }

      const response = await fetch(`${API_URL}/deleteaccount`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: accountId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al eliminar la cuenta.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al eliminar la cuenta.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Cuenta eliminada exitosamente'} - Fecha/Hora: ${requestTime}`);

      // Limpiar datos de sesión local
      const keys = [
        'user_token',
        'user_email',
        'user_type',
        'user_account_id',
        'user_first_name',
        'user_last_name',
      ];
      await AsyncStorage.multiRemove(keys);

      return true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }
}

