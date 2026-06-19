import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { data, isLoading, fetchDashboardData } = useDashboard();
  const { fcmToken } = usePushNotifications();

  const handleTestNotification = async () => {
    console.log('[FIREBASE FCM] Native Device Push Token:', fcmToken);
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Prueba de Alerta HASGREEN 🔔",
          body: `Token FCM: ${fcmToken ? fcmToken.substring(0, 30) + '...' : 'No obtenido'}\n¡Sonido personalizado configurado!`,
          sound: 'notificacion',
        },
        trigger: {
          channelId: 'hasgreen_sound_channel',
        },
      });

      Alert.alert(
        "Token FCM & Notificación",
        `Push Token obtenido:\n\n${fcmToken || 'No disponible (use un dispositivo físico)'}\n\nNotificación de prueba enviada con éxito.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error al enviar notificación de prueba:', error);
      Alert.alert("Error", "No se pudo enviar la notificación de prueba.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  if (isLoading || !data) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  const renderCounterCard = (title: string, icon: keyof typeof MaterialIcons.glyphMap, value: number, color: string) => (
    <Card style={[styles.counterCard, { borderLeftWidth: 4, borderLeftColor: color }]} elevation="sm" layer="lowest">
      <View style={styles.counterHeader}>
        <Typography variant="label" style={{ textTransform: 'uppercase', fontSize: 10, letterSpacing: 1, color: activeColors.onSurfaceVariant }}>
          {title}
        </Typography>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <Typography variant="display" style={{ fontSize: 36 }}>{value}</Typography>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable>
            <MaterialIcons name="grid-view" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, letterSpacing: -1, fontSize: 20 }}>
            HASGREEN
          </Typography>
        </View>
        <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHighest }]}>
          <MaterialIcons name="person" size={20} color={activeColors.onSurfaceVariant} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Greeting & Action */}
        <View style={styles.greetingSection}>
          <View style={{ flex: 1 }}>
            <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Hola, {data.user.name}</Typography>
            <Typography variant="body" color="onSurfaceVariant">Estado actual de su infraestructura IoT</Typography>
          </View>
          <Button 
            label="Probar Notificación" 
            leftIcon="notification-important" 
            style={{ alignSelf: 'flex-start', marginTop: Spacing[4] }} 
            onPress={handleTestNotification}
          />
        </View>

        {/* Summary Counters */}
        <View style={styles.gridRow}>
          <View style={{ flex: 1, paddingRight: Spacing[2] }}>
            {renderCounterCard("Gateways", "router", data.gateways.total, activeColors.primary)}
          </View>
          <View style={{ flex: 1, paddingLeft: Spacing[2] }}>
            {renderCounterCard("Online", "wifi", data.gateways.online, activeColors.secondary)}
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={{ flex: 1, paddingRight: Spacing[2] }}>
            {renderCounterCard("Offline", "wifi-off", data.gateways.offline, activeColors.outline)}
          </View>
          <View style={{ flex: 1, paddingLeft: Spacing[2] }}>
            {renderCounterCard("Faulty", "report-problem", data.gateways.faulty, activeColors.error)}
          </View>
        </View>

        {/* Device Summary Row */}
        <Card elevation="sm" layer="lowest" style={[styles.deviceSummaryCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
          <View style={styles.deviceSummaryInner}>
            <View style={[styles.iconCircle, { backgroundColor: activeColors.primaryContainer }]}>
              <MaterialIcons name="developer-board" size={24} color={activeColors.primary} />
            </View>
            <View>
              <Typography variant="label" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Dispositivos</Typography>
              <Typography variant="display" style={{ fontSize: 28 }}>{data.devices.total}</Typography>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing[4], marginTop: Spacing[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[1] }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: activeColors.secondary }} />
              <Typography variant="label" style={{ color: activeColors.secondary, fontWeight: '700' }}>{data.devices.active} Activos</Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[1] }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: activeColors.outlineVariant }} />
              <Typography variant="label" style={{ color: activeColors.onSurfaceVariant, fontWeight: '700' }}>{data.devices.inactive} Inactivos</Typography>
            </View>
          </View>
        </Card>

        {/* Analytics Placeholder Card */}
        <Card elevation="sm" layer="lowest" style={styles.analyticsCard}>
          <View style={{ flex: 1, paddingRight: Spacing[4] }}>
            <Typography variant="headline">Estado Operacional</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>Rendimiento óptimo en el 98% de la red.</Typography>
          </View>
          <View style={styles.barsContainer}>
            {data.analytics.map((height: number, i: number) => (
              <View key={i} style={[styles.barBg, { backgroundColor: activeColors.primaryContainer }]}>
                <View style={[styles.barFill, { height: `${height}%`, backgroundColor: activeColors.primary }]} />
              </View>
            ))}
          </View>
        </Card>

        {/* Gateways List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Typography variant="headline" style={{ fontSize: 20 }}>Gateways Recientes</Typography>
            <Pressable onPress={() => router.push('/gateways')}>
              <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '600' }}>Ver todos</Typography>
            </Pressable>
          </View>
          {data.recentGateways.map((gtw: any, index: number) => (
            <Card key={index} layer="lowest" style={styles.listItem}>
              <View style={[styles.listIconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                <MaterialIcons name="router" size={20} color={activeColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography variant="headline" style={{ fontSize: 14 }}>{gtw.name}</Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing[2] }}>
                  <MaterialIcons name="location-on" size={12} color={activeColors.onSurfaceVariant} />
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>{gtw.location}</Typography>
                  <Typography variant="label" color="outline" style={{ fontSize: 12 }}>•</Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>IP: {gtw.ip}</Typography>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: gtw.status === 'Activo' ? activeColors.secondaryContainer : activeColors.surfaceContainerHigh }]}>
                <Typography variant="label" style={{ fontSize: 10, color: gtw.status === 'Activo' ? activeColors.onSecondaryContainer : activeColors.onSurfaceVariant, fontWeight: '700', textTransform: 'uppercase' }}>{gtw.status}</Typography>
              </View>
            </Card>
          ))}
        </View>

        {/* Devices List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Typography variant="headline" style={{ fontSize: 20 }}>Últimos Dispositivos</Typography>
            <Pressable onPress={() => router.push('/dispositivos')}>
              <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '600' }}>Ver todos</Typography>
            </Pressable>
          </View>
          {data.recentDevices.map((dev: any, index: number) => (
            <Card key={index} layer="lowest" style={styles.listItem}>
              <View style={[styles.listIconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                <MaterialIcons name="sensors" size={20} color={activeColors.secondary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Typography variant="headline" style={{ fontSize: 14 }}>{dev.name}</Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing[2] }}>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>Tipo: {dev.type}</Typography>
                  <Typography variant="label" color="outline" style={{ fontSize: 12 }}>•</Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>Ubicación: {dev.location}</Typography>
                  <Typography variant="label" color="outline" style={{ fontSize: 12 }}>•</Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>Paciente: {dev.patientName}</Typography>
                </View>
              </View>
              <View style={[styles.badge, { backgroundColor: dev.status === 'Activo' ? activeColors.secondaryContainer : activeColors.surfaceContainerHigh }]}>
                <Typography variant="label" style={{ fontSize: 10, color: dev.status === 'Activo' ? activeColors.onSecondaryContainer : activeColors.onSurfaceVariant, fontWeight: '700', textTransform: 'uppercase' }}>{dev.status}</Typography>
              </View>
            </Card>
          ))}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: 100, // Make room for tabs
  },
  greetingSection: {
    flexDirection: 'column', 
    marginBottom: Spacing[8],
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: Spacing[4],
  },
  counterCard: {
    height: 120,
    justifyContent: 'space-between',
    padding: Spacing[6],
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceSummaryCard: {
    padding: Spacing[6],
    marginBottom: Spacing[6],
  },
  deviceSummaryInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[6],
    marginBottom: Spacing[8],
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 48,
    alignItems: 'flex-end',
  },
  barBg: {
    width: 6,
    height: '100%',
    borderRadius: 3,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 3,
  },
  listSection: {
    marginBottom: Spacing[8],
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  listIconBox: {
    width: 40,
    height: 40,
    borderRadius: Rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
});
