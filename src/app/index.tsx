import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { AuthRepository } from '@/features/auth/repository/AuthRepository';
import { Colors } from '@/constants/theme';

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const valid = await AuthRepository.checkSession();
        setHasSession(valid);
      } catch (error) {
        console.error('Error verifying session:', error);
        setHasSession(false);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6f7' }}>
        <ActivityIndicator size="large" color="#086b00" />
      </View>
    );
  }

  if (hasSession) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
