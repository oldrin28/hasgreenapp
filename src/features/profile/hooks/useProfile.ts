import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ProfileRepository } from '../repository/ProfileRepository';

export const useProfile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await ProfileRepository.getProfile();
      setProfile(data);
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: any) => {
    setIsSaving(true);
    try {
      await ProfileRepository.updateProfile(data);
    } catch (e) {
      console.error('Error updating profile:', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async (data: any) => {
    setIsSaving(true);
    try {
      await ProfileRepository.changePassword(data);
    } catch (e) {
      console.error('Error changing password:', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    try {
      await ProfileRepository.logout();
      router.replace('/login');
    } catch (e) {
      console.error('Error logging out:', e);
    }
  };

  const deleteAccount = async () => {
    setIsSaving(true);
    try {
      await ProfileRepository.deleteAccount();
      router.replace('/login');
    } catch (e) {
      console.error('Error deleting account:', e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  return { profile, isLoading, isSaving, updateProfile, changePassword, logout, deleteAccount, fetchProfile };
};

