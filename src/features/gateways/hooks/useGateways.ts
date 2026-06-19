import { useState } from 'react';
import { GatewaysRepository } from '../repository/GatewaysRepository';
import { useRouter } from 'expo-router';

export const useGateways = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gateways, setGateways] = useState<any[]>([]);
  const [gateway, setGateway] = useState<any>(null);
  const router = useRouter();

  const loadGateways = async () => {
    setIsLoading(true);
    try {
      const data = await GatewaysRepository.getGateways();
      setGateways(data);
    } catch (error: any) {
      alert(error.message || 'Error al cargar los gateways.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGateway = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await GatewaysRepository.getGatewayById(id);
      setGateway(data);
      return data;
    } catch (error: any) {
      alert(error.message || 'Error al cargar los datos del gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  const createGateway = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.createGateway(data);
      if (success) {
        alert('Gateway registrado exitosamente.');
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al registrar el gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGateway = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.updateGateway(id, data);
      if (success) {
        alert('Gateway actualizado exitosamente.');
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGateway = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.deleteGateway(id);
      if (success) {
        alert('Gateway eliminado exitosamente.');
        router.back();
      }
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  const rebootGateway = async (ip: string) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.rebootGateway(ip);
      if (success) {
        alert('Comando de reinicio enviado exitosamente.');
      }
    } catch (error: any) {
      alert(error.message || 'Error al reiniciar el gateway.');
    } finally {
      setIsLoading(false);
    }
  };

  return { loadGateways, loadGateway, createGateway, updateGateway, deleteGateway, rebootGateway, gateways, gateway, isLoading };
};
