import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useFonts as useManropeFonts, Manrope_400Regular, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { useFonts as useInterFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';

import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [manropeLoaded] = useManropeFonts({
    Manrope: Manrope_400Regular,
    ManropeBold: Manrope_700Bold,
  });

  const [interLoaded] = useInterFonts({
    Inter: Inter_400Regular,
    InterMedium: Inter_500Medium,
    InterSemiBold: Inter_600SemiBold,
  });

  const loaded = manropeLoaded && interLoaded;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const activeColors = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: activeColors.primary,
      background: activeColors.background,
      card: activeColors.surfaceContainerLowest,
      text: activeColors.onSurface,
      border: activeColors.surfaceContainer,
      notification: activeColors.error,
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: activeColors.primary,
      background: activeColors.background,
      card: activeColors.surfaceContainerLowest,
      text: activeColors.onSurface,
      border: activeColors.surfaceContainer,
      notification: activeColors.error,
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="crear-paciente" />
        <Stack.Screen name="editar-paciente" />
        <Stack.Screen name="nuevo-dispositivo" />
        <Stack.Screen name="editar-dispositivo" />
        <Stack.Screen name="registrar-gateway" />
        <Stack.Screen name="editar-gateway" />
        <Stack.Screen name="registrar-usuario" />
        <Stack.Screen name="editar-usuario" />
        <Stack.Screen name="config-notificaciones" />
        <Stack.Screen name="configurar-alarma" />
        <Stack.Screen name="escanear-qr" />
        <Stack.Screen name="permiso-camara" />
        <Stack.Screen name="editar-cuenta" />
        <Stack.Screen name="cambiar-contrasena" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
