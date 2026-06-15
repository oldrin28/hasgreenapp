import { useState } from 'react';
import { AuthRepository } from '../repository/AuthRepository';
import { useRouter } from 'expo-router';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await AuthRepository.login(email, password);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      alert(error.message || 'Credenciales incorrectas o error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await AuthRepository.signup(data);
      if (success) {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      alert(error.message || 'Error al intentar registrar la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, signup, isLoading };
};
