import { useState, useEffect } from 'react';
import { GatewaysRepository } from '../repository/GatewaysRepository';
import { useRouter } from 'expo-router';

export const useGateways = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loadGateways = async () => {
    setIsLoading(true);
    await GatewaysRepository.getGateways();
    setIsLoading(false);
  };

  const createGateway = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.createGateway(data);
      if (success) {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateGateway = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.updateGateway(id, data);
      if (success) {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGateway = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await GatewaysRepository.deleteGateway(id);
      if (success) {
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { loadGateways, createGateway, updateGateway, deleteGateway, isLoading };
};
