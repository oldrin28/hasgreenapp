import { useState } from 'react';
import { DevicesRepository } from '../repository/DevicesRepository';
import { useRouter } from 'expo-router';

export const useDevices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [device, setDevice] = useState<any>(null);
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
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateDevice = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const success = await DevicesRepository.updateDevice(id, data);
      if (success) {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDevice = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await DevicesRepository.deleteDevice(id);
      if (success) {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { loadDevices, loadDevice, createDevice, updateDevice, deleteDevice, devices, device, isLoading };
};
