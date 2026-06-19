import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export class PatientsRepository {
  static async getPatients(): Promise<any[]> {
    const action = 'Listar pacientes (/patients)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/patients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener la lista de pacientes.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const patients = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Lista de pacientes obtenida exitosamente (${Array.isArray(patients) ? patients.length : 0} pacientes) - Fecha/Hora: ${requestTime}`);
      
      // Almacenarlos localmente
      await AsyncStorage.setItem('patients_list', JSON.stringify(patients));
      
      return patients;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async getPatientById(id: string): Promise<any> {
    const action = `Obtener detalle de paciente por ID (/patient?patient_id=${id})`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/patient?patient_id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al obtener los datos del paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const patient = await response.json();
      console.log(`[ÉXITO] Acción: ${action} - Resultado: Datos del paciente cargados exitosamente - Fecha/Hora: ${requestTime}`);
      return patient;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async createPatient(data: any): Promise<boolean> {
    const action = 'Registrar paciente (/registerpatient)';
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/registerpatient`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          additional_info: String(data.additional_info || ''),
          address1: String(data.address1 || ''),
          address2: String(data.address2 || ''),
          address3: String(data.address3 || ''),
          alergies: String(data.alergies || ''),
          birth_date: String(data.birth_date || ''),
          blood_type: String(data.blood_type || ''),
          city: String(data.city || ''),
          country: String(data.country || ''),
          email_address: String(data.email_address || ''),
          first_name: String(data.first_name || ''),
          fixed_phone_country_code: String(data.fixed_phone_country_code || ''),
          fixed_phone_number: String(data.fixed_phone_number || ''),
          gender: String(data.gender || ''),
          last_name: String(data.last_name || ''),
          mobile_phone_country_code: String(data.mobile_phone_country_code || ''),
          mobile_phone_number: String(data.mobile_phone_number || ''),
          patient_id: String(data.patient_id || ''),
          prescriptions: String(data.prescriptions || ''),
          state: String(data.state || '')
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al registrar el paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al registrar el paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }
      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Paciente registrado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async updatePatient(id: string, data: any): Promise<boolean> {
    const action = `Actualizar paciente (/updatepatient)`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/updatepatient`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          additional_info: String(data.additional_info || ''),
          address1: String(data.address1 || ''),
          address2: String(data.address2 || ''),
          address3: String(data.address3 || ''),
          alergies: String(data.alergies || ''),
          birth_date: String(data.birth_date || ''),
          blood_type: String(data.blood_type || ''),
          city: String(data.city || ''),
          country: String(data.country || ''),
          email_address: String(data.email_address || ''),
          first_name: String(data.first_name || ''),
          fixed_phone_country_code: String(data.fixed_phone_country_code || data.mobile_phone_country_code || ''),
          fixed_phone_number: String(data.fixed_phone_number || ''),
          gender: String(data.gender || ''),
          last_name: String(data.last_name || ''),
          mobile_phone_country_code: String(data.mobile_phone_country_code || ''),
          mobile_phone_number: String(data.mobile_phone_number || ''),
          patient_id: String(id || ''),
          prescriptions: String(data.prescriptions || ''),
          state: String(data.state || '')
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al actualizar los datos del paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al actualizar el paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }
      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Paciente actualizado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }

  static async deletePatient(id: string): Promise<boolean> {
    const action = `Eliminar paciente (/deletepatient)`;
    const requestTime = new Date().toISOString();
    try {
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${API_URL}/deletepatient`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'token': token || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: id
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Error al eliminar el paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }

      const res = await response.json();
      if (res.result === 'error') {
        const errorMsg = res.message || 'Error al eliminar el paciente.';
        console.error(`[ERROR] Acción: ${action} - Resultado: ${errorMsg} - Fecha/Hora: ${requestTime}`);
        throw new Error(errorMsg);
      }
      console.log(`[ÉXITO] Acción: ${action} - Resultado: ${res.message || 'Paciente eliminado exitosamente'} - Fecha/Hora: ${requestTime}`);
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      throw error;
    }
  }
}
