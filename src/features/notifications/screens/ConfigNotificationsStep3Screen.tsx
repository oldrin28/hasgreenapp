import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';

export const ConfigNotificationsStep3Screen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { saveNotificationConfig, isSaving } = useNotifications();

  const [channels, setChannels] = useState({ sms: false, push: true, call: false, email: true, whatsapp: false });
  const [additionalInfo, setAdditionalInfo] = useState(false);

  const toggleChannel = (key: keyof typeof channels) => setChannels(prev => ({ ...prev, [key]: !prev[key] }));

  const channelList = [
    { key: 'sms' as const, icon: 'sms', label: 'Mensaje de texto (SMS)' },
    { key: 'push' as const, icon: 'notifications-active', label: 'Notificación push' },
    { key: 'call' as const, icon: 'call', label: 'Llamada telefónica' },
    { key: 'email' as const, icon: 'mail', label: 'Correo electrónico' },
    { key: 'whatsapp' as const, icon: 'chat', label: 'WhatsApp' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainer }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>HASGREEN</Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Progress Stepper (all active) */}
        <View style={styles.stepperContainer}>
          {[true, true, true].map((_, i) => (
            <View key={i} style={[styles.stepBar, { backgroundColor: activeColors.primary }]} />
          ))}
        </View>

        <View style={styles.pageHeader}>
          <Typography variant="headline" style={{ fontSize: 28, fontWeight: '800', letterSpacing: -1, marginBottom: Spacing[2] }}>
            Configurar Notificaciones - Paso 3
          </Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 16, fontWeight: '500' }}>Opciones de envío</Typography>
        </View>

        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: activeColors.surfaceContainerLowest }]}>
          <View style={[styles.summaryPill, { backgroundColor: activeColors.primary }]} />
          <View style={styles.summaryContent}>
            <View style={styles.summarySection}>
              <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing[2] }}>
                Resumen de selección
              </Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4], marginTop: Spacing[2] }}>
                <View style={[styles.summaryIconBox, { backgroundColor: activeColors.surfaceContainerLow }]}>
                  <MaterialIcons name="router" size={24} color={activeColors.primary} />
                </View>
                <View>
                  <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Sensor de Humedad GH-204</Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>ID: 9942-AX-01</Typography>
                </View>
              </View>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: 'rgba(171, 173, 174, 0.15)' }]} />
            <View style={styles.summarySection}>
              <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing[2] }}>Destinatario</Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3], marginTop: Spacing[2] }}>
                <View style={[styles.userIconBox, { backgroundColor: activeColors.surfaceContainerHigh }]}>
                  <MaterialIcons name="person" size={16} color={activeColors.onSurface} />
                </View>
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '600' }}>Ing. Carlos Mendoza</Typography>
              </View>
            </View>
          </View>
        </View>

        {/* Channels */}
        <View style={styles.channelsSection}>
          <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing[4], paddingHorizontal: Spacing[2] }}>
            Canales de comunicación
          </Typography>
          <View style={styles.channelsList}>
            {channelList.map((item) => (
              <Pressable key={item.key} style={[styles.channelItem, { backgroundColor: activeColors.surfaceContainerLowest }]} onPress={() => toggleChannel(item.key)}>
                <View style={styles.channelInfo}>
                  <MaterialIcons name={item.icon as any} size={24} color={channels[item.key] ? activeColors.primary : activeColors.onSurfaceVariant} />
                  <Typography variant="headline" style={{ fontSize: 16, fontWeight: '500' }}>{item.label}</Typography>
                </View>
                <Switch
                  value={channels[item.key]}
                  onValueChange={() => toggleChannel(item.key)}
                  trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }}
                  thumbColor={Colors.light.surfaceContainerLowest}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Additional Info Toggle */}
        <View style={[styles.additionalSettings, { borderTopColor: 'rgba(171, 173, 174, 0.15)' }]}>
          <View style={{ flex: 1 }}>
            <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Información adicional del paciente</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 4 }}>Adjuntar historial de mediciones recientes</Typography>
          </View>
          <Switch value={additionalInfo} onValueChange={setAdditionalInfo} trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }} thumbColor={Colors.light.surfaceContainerLowest} />
        </View>

        {/* Actions */}
        <View style={styles.actionArea}>
          <Pressable
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.98 }] }]}
            onPress={() => { saveNotificationConfig('device1', channels); router.push('/notificaciones'); }}
            disabled={isSaving}
          >
            <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 18 }}>
              {isSaving ? 'Guardando...' : 'Guardar configuración'}
            </Typography>
            <MaterialIcons name="check-circle" size={24} color={activeColors.onPrimary} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]} onPress={() => router.back()}>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontWeight: '500', fontSize: 14 }}>Volver al paso anterior</Typography>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing[6], paddingVertical: Spacing[4] },
  iconBtn: { padding: Spacing[2], marginLeft: -Spacing[2], borderRadius: Rounded.full },
  scrollContent: { padding: Spacing[6], paddingBottom: 96, maxWidth: 672, width: '100%', alignSelf: 'center' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], marginBottom: Spacing[8] },
  stepBar: { height: 4, width: 48, borderRadius: Rounded.full },
  pageHeader: { marginBottom: Spacing[10] },
  summaryCard: { flexDirection: 'row', borderRadius: Rounded.xl, elevation: 2, shadowColor: '#2c2f30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24, overflow: 'hidden', marginBottom: Spacing[8] },
  summaryPill: { width: 4 },
  summaryContent: { flex: 1, padding: Spacing[6] },
  summarySection: {},
  summaryIconBox: { width: 48, height: 48, borderRadius: Rounded.xl, alignItems: 'center', justifyContent: 'center' },
  summaryDivider: { height: 1, width: '100%', marginVertical: Spacing[6] },
  userIconBox: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  channelsSection: { marginBottom: Spacing[8] },
  channelsList: { gap: Spacing[3] },
  channelItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing[5], borderRadius: Rounded.xl, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  channelInfo: { flexDirection: 'row', alignItems: 'center', gap: Spacing[4] },
  additionalSettings: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing[8], borderTopWidth: 1, marginBottom: Spacing[12], paddingHorizontal: Spacing[2] },
  actionArea: { alignItems: 'center', gap: Spacing[3] },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], width: '100%', paddingVertical: 20, borderRadius: Rounded.xl, elevation: 4, shadowColor: '#086b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
  backBtn: { paddingVertical: Spacing[4], width: '100%', alignItems: 'center' },
});
