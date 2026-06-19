import { useState } from 'react';
import { DevicesRepository } from '../repository/DevicesRepository';
import { useRouter } from 'expo-router';

export const useDevices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [device, setDevice] = useState<any>(null);
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const router = useRouter();

  const loadDevices = async () => {
    setIsLoading(true);
    try {
      const data = await DevicesRepository.getDevices();
      setDevices(data);
    } catch (error: any) {
      alert(error.message || 'Error al cargar los dispositivos.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCachedDevices = async () => {
    setIsLoading(true);
    try {
      const data = await DevicesRepository.getCachedDevices();
      setDevices(data);
    } catch (error: any) {
      console.error('Error al cargar dispositivos de la caché:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeviceTypes = async () => {
    try {
      const data = await DevicesRepository.getDeviceTypes();
      setDeviceTypes(data);
      return data;
    } catch (error: any) {
      console.error('Error al cargar tipos de dispositivos:', error);
    }
  };

  const loadCachedDeviceTypes = async () => {
    try {
      const data = await DevicesRepository.getCachedDeviceTypes();
      setDeviceTypes(data);
      return data;
    } catch (error: any) {
      console.error('Error al cargar tipos de dispositivos de la caché:', error);
    }
  };

  const loadDevice = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await DevicesRepository.getDeviceById(id);
      setDevice(data);
      return data;
    } catch (error: any) {
      alert(error.message || 'Error al cargar los datos del dispositivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const createDevice = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await DevicesRepository.createDevice(data);
      if (success) {
        alert('Dispositivo registrado exitosamente.');
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al registrar el dispositivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateDevice = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const success = await DevicesRepository.updateDevice(id, data);
      if (success) {
        alert('Dispositivo actualizado exitosamente.');
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el dispositivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDevice = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await DevicesRepository.deleteDevice(id);
      if (success) {
        alert('Dispositivo eliminado exitosamente.');
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el dispositivo.');
    } finally {
      setIsLoading(false);
    }
  };

  return { loadDevices, loadCachedDevices, loadDevice, createDevice, updateDevice, deleteDevice, loadDeviceTypes, loadCachedDeviceTypes, deviceTypes, devices, device, isLoading };
};
