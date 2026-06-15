import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColors.primary,
        tabBarInactiveTintColor: activeColors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: activeColors.surfaceContainerLowest,
          borderTopWidth: 1,
          borderTopColor: 'rgba(171, 173, 174, 0.15)',
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} /> }} />
      <Tabs.Screen name="pacientes" options={{ title: 'Pacientes', tabBarIcon: ({ color }) => <MaterialIcons name="people" size={24} color={color} /> }} />
      <Tabs.Screen name="dispositivos" options={{ title: 'Dispositivos', tabBarIcon: ({ color }) => <MaterialIcons name="router" size={24} color={color} /> }} />
      <Tabs.Screen name="gateways" options={{ title: 'Gateways', tabBarIcon: ({ color }) => <MaterialIcons name="hub" size={24} color={color} /> }} />
      <Tabs.Screen name="usuarios" options={{ title: 'Usuarios', tabBarIcon: ({ color }) => <MaterialIcons name="manage-accounts" size={24} color={color} /> }} />
      <Tabs.Screen name="notificaciones" options={{ title: 'Notificaciones', tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={24} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <MaterialIcons name="account-circle" size={24} color={color} /> }} />
    </Tabs>
  );
}
