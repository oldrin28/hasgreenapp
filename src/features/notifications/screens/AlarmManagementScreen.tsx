import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';

export const AlarmManagementScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}>
            <MaterialIcons name="grid-view" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>
            HASGREEN
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Tab Bar */}
        <View style={styles.tabBarContainer}>
          <View style={[styles.tabBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
            <Pressable style={styles.tabBtn}>
              <Typography variant="label" color="onSurfaceVariant" style={{ fontWeight: '500' }}>Dispositivos</Typography>
            </Pressable>
            <Pressable style={[styles.tabBtn, styles.activeTab, { backgroundColor: activeColors.surfaceContainerLowest }]}>
              <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '700' }}>Alarmas</Typography>
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: activeColors.surfaceContainerLowest }]}>
          <MaterialIcons name="search" size={24} color={activeColors.outlineVariant} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: activeColors.onSurface }]}
            placeholder="Buscar por dispositivo o tipo..."
            placeholderTextColor={activeColors.outlineVariant}
          />
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.primary }]}>
            <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>TIEMPO ACTIVO</Typography>
            <View style={styles.metricValueContainer}>
              <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800' }}>98</Typography>
              <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>%</Typography>
            </View>
          </View>
          <View style={[styles.metricCard, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.tertiary }]}>
            <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>RESPUESTA MEDIA</Typography>
            <View style={styles.metricValueContainer}>
              <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800' }}>1.2</Typography>
              <Typography variant="headline" style={{ color: activeColors.tertiary, fontSize: 18, fontWeight: '700' }}>s</Typography>
            </View>
          </View>
        </View>

        {/* Active Alarms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Alarmas Activas</Typography>
            <View style={[styles.badge, { backgroundColor: 'rgba(185, 41, 2, 0.1)' }]}>
              <Typography variant="label" style={{ color: activeColors.error, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>2 CRÍTICAS</Typography>
            </View>
          </View>

          <View style={styles.alarmsList}>
            {/* Alarm 1 */}
            <View style={[styles.alarmCard, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.error }]}>
              <View style={styles.alarmHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Typography variant="headline" style={{ fontSize: 20, fontWeight: '800' }}>Pánico - Emergencia</Typography>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                    <MaterialIcons name="router" size={14} color={activeColors.onSurfaceVariant} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '500' }}>Dispositivo: Hub-Central-04</Typography>
                  </View>
                </View>
                <View style={[styles.timeBadge, { backgroundColor: 'rgba(185, 41, 2, 0.05)' }]}>
                  <MaterialIcons name="schedule" size={14} color={activeColors.error} />
                  <Typography variant="label" style={{ color: activeColors.error, fontSize: 10, fontWeight: '700' }}>HACE 2 MIN</Typography>
                </View>
              </View>
              <View style={[styles.locationBox, { backgroundColor: activeColors.surfaceContainerLow }]}>
                <MaterialIcons name="location-on" size={20} color={activeColors.primary} />
                <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>Sector 7 - Planta Industrial Norte</Typography>
              </View>
              <View style={styles.actionRow}>
                <Pressable style={({ pressed }) => [styles.actionBtnPrimary, { backgroundColor: activeColors.primary }, pressed && { opacity: 0.9 }]}>
                  <Typography variant="label" style={{ color: activeColors.onPrimary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>GESTIONAR</Typography>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionBtnSecondary, { backgroundColor: activeColors.surfaceContainerHigh }, pressed && { backgroundColor: activeColors.surfaceContainerHighest }]}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>NOTIFICAR</Typography>
                </Pressable>
              </View>
            </View>

            {/* Alarm 2 */}
            <View style={[styles.alarmCard, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.errorContainer }]}>
              <View style={styles.alarmHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Typography variant="headline" style={{ fontSize: 20, fontWeight: '800' }}>Batería Muy Baja</Typography>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                    <MaterialIcons name="sensors" size={14} color={activeColors.onSurfaceVariant} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '500' }}>Sensor: Mov-Entrada-Principal</Typography>
                  </View>
                </View>
                <View style={[styles.timeBadge, { backgroundColor: 'rgba(249, 86, 48, 0.05)' }]}>
                  <MaterialIcons name="schedule" size={14} color={activeColors.errorContainer} />
                  <Typography variant="label" style={{ color: activeColors.errorContainer, fontSize: 10, fontWeight: '700' }}>HACE 15 MIN</Typography>
                </View>
              </View>
              <View style={[styles.locationBox, { backgroundColor: activeColors.surfaceContainerLow }]}>
                <MaterialIcons name="battery-1-bar" size={20} color={activeColors.primary} />
                <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>Nivel Crítico: 4% restante</Typography>
              </View>
              <View style={styles.actionRow}>
                <Pressable style={({ pressed }) => [styles.actionBtnPrimary, { backgroundColor: activeColors.primary }, pressed && { opacity: 0.9 }]}>
                  <Typography variant="label" style={{ color: activeColors.onPrimary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>GESTIONAR</Typography>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.actionBtnSecondary, { backgroundColor: activeColors.surfaceContainerHigh }, pressed && { backgroundColor: activeColors.surfaceContainerHighest }]}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>NOTIFICAR</Typography>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', marginBottom: Spacing[4], paddingHorizontal: Spacing[1] }}>
            Historial Reciente
          </Typography>
          <View style={[styles.historyContainer, { backgroundColor: activeColors.surfaceContainerLowest }]}>
            {[
              { title: 'Falsa Alarma - Puerta 3', subtitle: 'Resuelta por: Admin Carlos', time: 'Hoy, 14:20' },
              { title: 'Corte de Energía - Rack B', subtitle: 'Restablecido automáticamente', time: 'Hoy, 11:05' },
              { title: 'Test de Sistema Semanal', subtitle: 'Exitoso - Todo OK', time: 'Ayer, 09:00' },
            ].map((item, i, arr) => (
              <View key={i} style={[styles.historyItem, { borderBottomColor: activeColors.surfaceContainerHigh, borderBottomWidth: i < arr.length - 1 ? 1 : 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4], flex: 1 }}>
                  <View style={[styles.historyIcon, { backgroundColor: 'rgba(0, 106, 47, 0.1)' }]}>
                    <MaterialIcons name="check-circle" size={20} color={activeColors.secondary} />
                  </View>
                  <View>
                    <Typography variant="body" style={{ fontWeight: '700', fontSize: 14 }}>{item.title}</Typography>
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, fontWeight: '500' }}>{item.subtitle}</Typography>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 2 }}>RESUELTA</Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '600' }}>{item.time}</Typography>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* FAB */}
      <Pressable style={({ pressed }) => [styles.fab, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.95 }] }]}>
        <MaterialIcons name="add" size={32} color={activeColors.onPrimary} />
      </Pressable>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing[6], paddingVertical: Spacing[4] },
  iconBtn: { padding: Spacing[1] },
  scrollContent: { padding: Spacing[4], paddingBottom: 96, maxWidth: 1024, width: '100%', alignSelf: 'center' },
  tabBarContainer: { flexDirection: 'row', marginBottom: Spacing[6] },
  tabBar: { flexDirection: 'row', padding: Spacing[1], borderRadius: Rounded.xl },
  tabBtn: { paddingHorizontal: Spacing[6], paddingVertical: 10, borderRadius: Rounded.lg },
  activeTab: { elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], height: 56, borderRadius: Rounded.xl, marginBottom: Spacing[6], elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchIcon: { marginRight: Spacing[3] },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter' },
  metricsGrid: { flexDirection: 'row', gap: Spacing[4], marginBottom: Spacing[6] },
  metricCard: { flex: 1, padding: Spacing[5], borderRadius: Rounded.xl, borderLeftWidth: 4, justifyContent: 'space-between', minHeight: 128, elevation: 2, shadowColor: '#2c2f30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24 },
  metricValueContainer: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  section: { marginBottom: Spacing[6] },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing[4], paddingHorizontal: Spacing[1] },
  badge: { paddingHorizontal: Spacing[3], paddingVertical: Spacing[1], borderRadius: Rounded.full },
  alarmsList: { gap: Spacing[4] },
  alarmCard: { padding: Spacing[5], borderRadius: Rounded.xl, borderLeftWidth: 4, elevation: 2, shadowColor: '#2c2f30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24 },
  alarmHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing[4] },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing[2], paddingVertical: 4, borderRadius: Rounded.md },
  locationBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], padding: Spacing[3], borderRadius: Rounded.lg, marginBottom: Spacing[3] },
  actionRow: { flexDirection: 'row', gap: Spacing[3] },
  actionBtnPrimary: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: Rounded.lg, elevation: 2 },
  actionBtnSecondary: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: Rounded.lg },
  historyContainer: { borderRadius: Rounded.xl, elevation: 2, shadowColor: '#2c2f30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 24, overflow: 'hidden' },
  historyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing[4] },
  historyIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', bottom: Spacing[10], right: Spacing[6], width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, zIndex: 50 },
});
