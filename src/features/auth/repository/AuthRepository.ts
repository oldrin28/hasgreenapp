import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export interface LoginResponse {
  result: string;
  token: string;
  email: string;
  type: number;
  account_id: string;
  first_name: string;
  last_name: string;
}

export class AuthRepository {
  /**
   * Realiza login contra el endpoint /api/v1.0/login
   * @param email Correo electrónico
   * @param password Contraseña
   * @returns boolean si fue exitoso o arroja error
   */
  static async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error de credenciales o de red.');
      }

      const data: LoginResponse = await response.json();
      
      // Guardar todos los datos requeridos por la petición en AsyncStorage
      await AsyncStorage.setItem('user_token', data.token);
      await AsyncStorage.setItem('user_email', data.email);
      await AsyncStorage.setItem('user_type', String(data.type));
      await AsyncStorage.setItem('user_account_id', data.account_id);
      await AsyncStorage.setItem('user_first_name', data.first_name);
      await AsyncStorage.setItem('user_last_name', data.last_name);
      
      return true;
    } catch (error) {
      console.error('Error en AuthRepository.login:', error);
      throw error;
    }
  }

  static async checkSession(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('user_token');
      return !!token;
    } catch (e) {
      console.warn('Error validando token en checkSession:', e);
      return false;
    }
  }

  private static decodeBase64(input: string): string {
    let str = input.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    
    // Si Buffer está disponible en el entorno global de JS
    if (typeof globalThis !== 'undefined' && (globalThis as any).Buffer !== undefined) {
      return (globalThis as any).Buffer.from(str, 'base64').toString('utf8');
    }

    // Algoritmo JS simple de decodificación Base64
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    str = str.replace(/=+$/, '');
    for (let bc = 0, bs = 0, r1, r2, idx = 0; idx < str.length; idx++) {
      r2 = chars.indexOf(str.charAt(idx));
      if (r2 === -1) continue;
      bs = bc % 4 ? bs * 64 + r2 : r2;
      if (bc++ % 4) {
        r1 = (bs >> ((-2 * bc) & 6)) & 255;
        output += String.fromCharCode(r1);
      }
    }
    return output;
  }

  /**
   * Elimina los datos de sesión almacenados
   */
  static async logout(): Promise<void> {
    await AsyncStorage.clear();
  }

  static async signup(data: any): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/registeraccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address1: data.address,
          address2: '',
          address3: '',
          city: data.city,
          country: data.country,
          email_address: data.email,
          first_name: data.firstName,
          fixed_phone_country_code: data.phoneCode,
          fixed_phone_number: data.phone,
          last_name: data.lastName,
          mobile_phone_country_code: data.phoneCode,
          mobile_phone_number: data.phone,
          password1: data.password,
          push_token: '',
          state: data.state,
          sysadmin_email: data.email,
          time_zone: '',
          type: '1'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al registrar la cuenta.');
      }

      // Auto login after successful signup
      await this.login(data.email, data.password);
      return true;
    } catch (error) {
      console.error('Error en AuthRepository.signup:', error);
      throw error;
    }
  }
}
