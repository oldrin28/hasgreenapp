import { useState, useEffect } from 'react';
import { PatientsRepository } from '../repository/PatientsRepository';
import { useRouter } from 'expo-router';

export const usePatients = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [patient, setPatient] = useState<any>(null);
  const router = useRouter();

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await PatientsRepository.getPatients();
      setPatients(data);
    } catch (error: any) {
      alert(error.message || 'Error al cargar los pacientes.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatient = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await PatientsRepository.getPatientById(id);
      setPatient(data);
      return data;
    } catch (error: any) {
      alert(error.message || 'Error al cargar los datos del paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  const createPatient = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await PatientsRepository.createPatient(data);
      if (success) {
        alert('Paciente creado exitosamente.');
        await loadPatients();
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al crear el paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const success = await PatientsRepository.updatePatient(id, data);
      if (success) {
        alert('Datos del paciente actualizados exitosamente.');
        await loadPatients();
        router.replace('/(tabs)/pacientes');
      }
    } catch (error: any) {
      alert(error.message || 'Error al actualizar los datos del paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await PatientsRepository.deletePatient(id);
      if (success) {
        alert('Paciente eliminado exitosamente.');
        router.replace('/(tabs)/pacientes');
      }
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  return { loadPatients, loadPatient, createPatient, updatePatient, deletePatient, patients, patient, isLoading };
};
