import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotifications } from '../hooks/useNotifications';

export const ConfigureAlarmScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { toggleAlarm } = useNotifications();

  const [alarm1, setAlarm1] = useState(true);
  const [alarm2, setAlarm2] = useState(true);
  const [alarm3, setAlarm3] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.background }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>
            HASGREEN
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.pageHeader}>
          <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800', letterSpacing: -1, marginBottom: Spacing[2] }}>
            Configurar Disparadores
          </Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
            Gestiona las alertas y activadores automáticos para tus dispositivos.
          </Typography>
        </View>

        {/* Device Selector */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: 'rgba(171, 173, 174, 0.1)' }]}>
            <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing[3] }}>
              Seleccionar Dispositivo
            </Typography>
            <Pressable style={({ pressed }) => [styles.selectorArea, { backgroundColor: activeColors.surfaceContainerLow }, pressed && { opacity: 0.8 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
                <MaterialIcons name="router" size={24} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '600' }}>Bollo limpio</Typography>
              </View>
              <MaterialIcons name="expand-more" size={24} color={activeColors.outline} />
            </Pressable>
          </View>
        </View>

        {/* Alarms List */}
        <View style={styles.section}>
          <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', marginBottom: Spacing[4], paddingHorizontal: Spacing[1] }}>
            Alertas Activas
          </Typography>
          <View style={styles.alarmList}>
            <View style={[styles.alarmItem, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.primary }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Alarma Mi casa gtw</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 2 }}>Activación por proximidad</Typography>
              </View>
              <Switch value={alarm1} onValueChange={(v) => { setAlarm1(v); toggleAlarm('1', v); }} trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }} thumbColor={Colors.light.surfaceContainerLowest} />
            </View>

            <View style={[styles.alarmItem, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.primary }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Alarma local</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 2 }}>Sirena de pánico vinculada</Typography>
              </View>
              <Switch value={alarm2} onValueChange={(v) => { setAlarm2(v); toggleAlarm('2', v); }} trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }} thumbColor={Colors.light.surfaceContainerLowest} />
            </View>

            <View style={[styles.alarmItem, { backgroundColor: activeColors.surfaceContainerLow, borderLeftColor: activeColors.outlineVariant, opacity: alarm3 ? 1 : 0.8 }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="headline" color={alarm3 ? 'onSurface' : 'onSurfaceVariant'} style={{ fontSize: 16, fontWeight: '700' }}>Modo Vacaciones</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 2 }}>Desactivado temporalmente</Typography>
              </View>
              <Switch value={alarm3} onValueChange={(v) => { setAlarm3(v); toggleAlarm('3', v); }} trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }} thumbColor={Colors.light.surfaceContainerLowest} />
            </View>
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.bannerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={{ zIndex: 10, paddingRight: Spacing[10] }}>
              <Typography variant="headline" style={{ color: activeColors.onPrimary, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                Optimización de Sensores
              </Typography>
              <Typography variant="body" style={{ color: 'rgba(211, 255, 193, 0.9)', fontSize: 14 }}>
                Tu dispositivo 'Bollo limpio' tiene una actualización de firmware disponible para mejorar los disparadores.
              </Typography>
            </View>
            <MaterialIcons name="bolt" size={96} color={activeColors.onPrimary} style={styles.bannerIcon} />
          </LinearGradient>
        </View>

        {/* Save Button */}
        <View style={styles.actionArea}>
          <Pressable style={({ pressed }) => [styles.saveBtn, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.98 }] }]}>
            <MaterialIcons name="save" size={20} color={activeColors.onPrimary} />
            <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 18 }}>Guardar Cambios</Typography>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing[6], height: 64 },
  iconBtn: { padding: Spacing[2], marginLeft: -Spacing[2], borderRadius: Rounded.full },
  scrollContent: { padding: Spacing[6], paddingBottom: 64, maxWidth: 672, width: '100%', alignSelf: 'center' },
  pageHeader: { marginBottom: Spacing[8] },
  section: { marginBottom: Spacing[8] },
  card: { padding: Spacing[6], borderRadius: Rounded.xl, borderWidth: 1, elevation: 2, shadowColor: '#2c2f30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24 },
  selectorArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing[4], borderRadius: Rounded.lg, borderWidth: 1, borderColor: 'transparent' },
  alarmList: { gap: Spacing[4] },
  alarmItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing[5], borderRadius: Rounded.xl, borderLeftWidth: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  bannerContainer: { marginTop: Spacing[2], marginBottom: Spacing[10], borderRadius: 16, elevation: 4, shadowColor: '#086b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, overflow: 'hidden' },
  bannerGradient: { padding: Spacing[6], position: 'relative', overflow: 'hidden' },
  bannerIcon: { position: 'absolute', bottom: -16, right: -16, opacity: 0.1 },
  actionArea: { paddingBottom: Spacing[4] },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], paddingVertical: 16, borderRadius: Rounded.xl, elevation: 6, shadowColor: '#086b00', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 },
});
