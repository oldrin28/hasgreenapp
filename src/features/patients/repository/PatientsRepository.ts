import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://ecs.hasgreen.org/api/v1.0';

export class PatientsRepository {
  static async getPatients(): Promise<any[]> {
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
        throw new Error(errorData.message || 'Error al obtener la lista de pacientes.');
      }

      const patients = await response.json();
      console.log('JSON de pacientes recibido:', JSON.stringify(patients, null, 2));
      
      // Almacenarlos localmente
      await AsyncStorage.setItem('patients_list', JSON.stringify(patients));
      
      return patients;
    } catch (error) {
      console.error('Error en PatientsRepository.getPatients:', error);
      throw error;
    }
  }

  static async getPatientById(id: string): Promise<any> {
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
        throw new Error(errorData.message || 'Error al obtener los datos del paciente.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en PatientsRepository.getPatientById:', error);
      throw error;
    }
  }

  static async createPatient(data: any): Promise<boolean> {
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
        throw new Error(errorData.message || 'Error al registrar el paciente.');
      }

      const res = await response.json();
      if (res.result === 'error') {
        throw new Error(res.message || 'Error al registrar el paciente.');
      }
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error) {
      console.error('Error en PatientsRepository.createPatient:', error);
      throw error;
    }
  }

  static async updatePatient(id: string, data: any): Promise<boolean> {
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
        throw new Error(errorData.message || 'Error al actualizar los datos del paciente.');
      }

      const res = await response.json();
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error) {
      console.error('Error en PatientsRepository.updatePatient:', error);
      throw error;
    }
  }

  static async deletePatient(id: string): Promise<boolean> {
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
        throw new Error(errorData.message || 'Error al eliminar el paciente.');
      }

      const res = await response.json();
      return res.result === 'success' || res.result === 'ok' || true;
    } catch (error) {
      console.error('Error en PatientsRepository.deletePatient:', error);
      throw error;
    }
  }
}
