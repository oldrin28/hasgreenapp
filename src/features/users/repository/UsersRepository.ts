import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

let cachedUsers: any[] = [];

export class UsersRepository {
  static async getUsers(): Promise<any[]> {
    const action = 'Listar cuentas invitadas (/getguestaccounts)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const accountId = await AsyncStorage.getItem('user_account_id');
      
      const response = await fetch(`${API_URL}/getguestaccounts?account_id=${accountId || ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener la lista de usuarios.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      const guestAccounts = res && Array.isArray(res.guest_accounts) ? res.guest_accounts : [];
      cachedUsers = guestAccounts;
      await AsyncStorage.setItem('users_cache', JSON.stringify(cachedUsers)).catch(() => {});
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Lista de usuarios obtenida exitosamente (${guestAccounts.length} usuarios) - Fecha/Hora: ${requestTime}`);
      return guestAccounts;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getCachedUsers(): Promise<any[]> {
    if (cachedUsers && cachedUsers.length > 0) {
      return cachedUsers;
    }
    const stored = await AsyncStorage.getItem('users_cache').catch(() => null);
    if (stored) {
      try {
        cachedUsers = JSON.parse(stored);
        return cachedUsers;
      } catch (e) {}
    }
    return [];
  }

  static async getUserById(id: string): Promise<any> {
    const action = `Obtener detalle de usuario por ID (${id})`;
    const requestTime = new Date().toISOString();
    try {
      // Como no hay endpoint directo para un solo usuario en este momento, podemos buscarlo en la lista.
      const list = await this.getUsers();
      const user = list.find(u => String(u.guest_account_id) === String(id));
      if (!user) {
        throw new Error('Usuario no encontrado.');
      }
      return user;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async createUser(data: any): Promise<{ success: boolean }> {
    const action = 'Invitar cuenta (/inviteaccount)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/inviteaccount`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extra_info: Number(data.send_extra_info),
          guest_account_email: String(data.email || '').trim(),
          guest_account_first_name: String(data.first_name || '').trim(),
          guest_account_last_name: String(data.last_name || '').trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al invitar al colaborador.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al invitar al colaborador.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Colaborador invitado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async updateUser(id: string, data: any): Promise<{ success: boolean }> {
    const action = 'Actualizar información extra de cuenta invitada (/updateguestextrainfo)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/updateguestextrainfo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_account_id: Number(id || (data && data.guest_account_id) || 0),
          extra_info: Number(data.send_extra_info)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al actualizar las preferencias del colaborador.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al actualizar las preferencias del colaborador.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Preferencias de colaborador actualizadas exitosamente'} - Fecha/Hora: ${requestTime}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async deleteUser(email: string): Promise<{ success: boolean }> {
    const action = 'Eliminar cuenta invitada (/remove_guest_account)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/remove_guest_account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guest_account_email: String(email || '').trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al eliminar al colaborador.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al eliminar al colaborador.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Colaborador eliminado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return { success: true };
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }
}
