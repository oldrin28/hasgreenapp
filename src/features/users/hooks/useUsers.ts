import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { UsersRepository } from '../repository/UsersRepository';

export const useUsers = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UsersRepository.getUsers();
      setUsers(data);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCachedUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await UsersRepository.getCachedUsers();
      setUsers(data);
    } catch (e) {
      console.error('Error loading cached users:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    UsersRepository.getCachedUsers().then(data => {
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        fetchUsers();
      }
    });
  }, [fetchUsers]);

  const createUser = async (data: any) => {
    setIsSaving(true);
    try {
      await UsersRepository.createUser(data);
      alert('Colaborador invitado exitosamente.');
      router.back();
    } catch (e: any) {
      alert(e.message || 'Error al registrar al colaborador.');
      console.error('Error creating user:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const updateUser = async (id: string, data: any) => {
    setIsSaving(true);
    try {
      await UsersRepository.updateUser(id, data);
      alert('Colaborador actualizado exitosamente.');
      router.back();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar al colaborador.');
      console.error('Error updating user:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (email: string) => {
    try {
      await UsersRepository.deleteUser(email);
      alert('Colaborador eliminado exitosamente.');
      router.back();
    } catch (e: any) {
      alert(e.message || 'Error al eliminar al colaborador.');
      console.error('Error deleting user:', e);
    }
  };

  return { users, isLoading, isSaving, createUser, updateUser, deleteUser, refetch: fetchUsers, loadCachedUsers };
};
