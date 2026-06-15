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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (data: any) => {
    setIsSaving(true);
    try {
      await UsersRepository.createUser(data);
      router.back();
    } catch (e) {
      console.error('Error creating user:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const updateUser = async (id: string, data: any) => {
    setIsSaving(true);
    try {
      await UsersRepository.updateUser(id, data);
      router.back();
    } catch (e) {
      console.error('Error updating user:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await UsersRepository.deleteUser(id);
      router.back();
    } catch (e) {
      console.error('Error deleting user:', e);
    }
  };

  return { users, isLoading, isSaving, createUser, updateUser, deleteUser, refetch: fetchUsers };
};
