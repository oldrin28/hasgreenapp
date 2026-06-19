import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useDevices } from '../hooks/useDevices';

export const DEVICE_TYPES: { [key: string]: { label: string; icon: string } } = {
  'WBBT01': { label: 'WBBT01 - Botón de pánico tipo pulsera con Bluetooth', icon: 'watch' },
  'WBBT': { label: 'WBBT01 - Botón de pánico tipo pulsera con Bluetooth', icon: 'watch' },
  'FD01': { label: 'FD01 - Detector de caídas', icon: 'personal-injury' },
  'PBRF01': { label: 'PBRF01 - Botón de pánico RF fijo', icon: 'radio-button-checked' },
  'PBRF': { label: 'PBRF01 - Botón de pánico RF fijo', icon: 'radio-button-checked' },
  'WBRF01': { label: 'WBRF01 - Botón de pánico RF tipo pulsera', icon: 'watch' },
  'WBRF': { label: 'WBRF01 - Botón de pánico RF tipo pulsera', icon: 'watch' },
  'CBRF01': { label: 'CBRF01 - Botón de pánico RF tipo llavero (pendiente)', icon: 'vpn-key' },
  'CBRF': { label: 'CBRF01 - Botón de pánico RF tipo llavero (pendiente)', icon: 'vpn-key' },
  'WGPS01': { label: 'WGPS01 - Pulsera GPS', icon: 'gps-fixed' },
  'WGPS': { label: 'WGPS01 - Pulsera GPS', icon: 'gps-fixed' },
  'PGPS01': { label: 'PGPS01 - GPS para mascotas', icon: 'pets' },
  'PGPS': { label: 'PGPS01 - GPS para mascotas', icon: 'pets' },
  'ALRM01': { label: 'ALRM01 - Alarma local', icon: 'notifications-active' },
  'ALRM': { label: 'ALRM01 - Alarma local', icon: 'notifications-active' },
  'DISP01': { label: 'DISP01 - Display con alarma local', icon: 'tv' },
  'DISP': { label: 'DISP01 - Display con alarma local', icon: 'tv' },
};

export function DevicesListScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadDevices, loadDeviceTypes, deviceTypes, devices, isLoading } = useDevices();
  const [activeTab, setActiveTab] = useState<'dispositivos' | 'alarmas'>('dispositivos');

  useFocusEffect(
    useCallback(() => {
      loadDevices();
      loadDeviceTypes();
    }, [])
  );

  const activeCount = devices.filter(d => d.device_status === 1 || d.device_status === '1').length;
  const inactiveCount = devices.length - activeCount;

  if (isLoading && devices.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <Pressable>
            <MaterialIcons name="grid-view" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, letterSpacing: -1, fontSize: 20, textTransform: 'uppercase' }}>
            HASGREEN
          </Typography>
        </View>
        <View style={[styles.avatarBox, { borderColor: activeColors.primary, borderWidth: 2, opacity: 0.8 }]}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw6VhNZP1sqM7giGI9JVZiPp3W9D8Wtoqk8qzBo4VUG01A3jggW4Q6QfvrhdVefVNIUeWMkA1lc7aKwGJbikyk46_FA2MYhdycebfKOU4lDnsBkbGFBSoDSQ4xlN-OtDPE34FWdBW0nkGk82mtJIUHxbRCbcOn8IPe4Dt6OeZEgpvSvtNf6kXODaZM8Pp_rfc8FF20yxRSA1mKLhnBftLDtvIrg4Q-IHnAs7q2fYP0BTN59SJXm1CcdG8sbVMM44fIdqClZNMequ1Y' }} 
            style={{ width: '100%', height: '100%' }} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Tab Bar */}
        <View style={styles.tabBarRow}>
          <View style={[styles.tabSegmentedControl, { backgroundColor: activeColors.surfaceContainerLow }]}>
            <Pressable 
              style={[styles.tabButton, activeTab === 'dispositivos' && styles.tabActive, activeTab === 'dispositivos' && { backgroundColor: activeColors.surfaceContainerLowest }]}
              onPress={() => setActiveTab('dispositivos')}
            >
              <Typography variant="label" style={{ color: activeTab === 'dispositivos' ? activeColors.primary : activeColors.onSurfaceVariant, fontWeight: '700' }}>Dispositivos</Typography>
            </Pressable>
            <Pressable 
              style={[styles.tabButton, activeTab === 'alarmas' && styles.tabActive, activeTab === 'alarmas' && { backgroundColor: activeColors.surfaceContainerLowest }]}
              onPress={() => setActiveTab('alarmas')}
            >
              <Typography variant="label" style={{ color: activeTab === 'alarmas' ? activeColors.primary : activeColors.onSurfaceVariant, fontWeight: '700' }}>Alarmas</Typography>
            </Pressable>
          </View>
          <Pressable style={[styles.filterButton, { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="filter-list" size={20} color={activeColors.onSurface} />
            <Typography variant="label" style={{ fontWeight: '500', marginLeft: Spacing[2] }}>Filtrar</Typography>
          </Pressable>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>
            {activeTab === 'dispositivos' ? 'Gestión de Red' : 'Control de Alarmas'}
          </Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontWeight: '500', marginTop: Spacing[1] }}>
            {activeTab === 'dispositivos' ? 'Monitorea el estado de los botones de pánico y dispositivos activos.' : 'Gestione las alertas y configuraciones de pánico.'}
          </Typography>
        </View>

        {(() => {
          const alarmTypes = ['ALRM01', 'DISP01', 'ALRM', 'DISP'];
          const filteredDevices = devices.filter((device: any) => {
            const isAlarm = alarmTypes.includes(device.device_type);
            return activeTab === 'alarmas' ? isAlarm : !isAlarm;
          });

          return (
            <View style={styles.devicesGrid}>
              {filteredDevices.map((device: any) => {
                const isActive = device.device_status === 1 || device.device_status === '1';
                const devType = device.device_type || '';
                
                const dynamicType = deviceTypes.find(
                  (t: any) => t.device_type_code === devType || t.code === devType
                );
                
                const typeInfo = {
                  label: dynamicType?.device_type_name || dynamicType?.name || dynamicType?.label || DEVICE_TYPES[devType]?.label || devType || 'Dispositivo IoT',
                  icon: dynamicType?.device_type_icon || dynamicType?.icon || DEVICE_TYPES[devType]?.icon || (
                    (devType.toLowerCase().includes('router') || 
                     devType.toLowerCase().includes('gateway') || 
                     String(device.device_name || '').toLowerCase().includes('casa')) ? 'router' : 'developer-board'
                  )
                };
                
                return (
                  <Pressable key={device.id || device.device_unique_id} onPress={() => router.push({ pathname: '/editar-dispositivo', params: { id: device.id } } as any)}>
                    <Card layer="lowest" elevation="sm" style={[styles.deviceCard, { borderLeftWidth: 4, borderLeftColor: isActive ? activeColors.primary : activeColors.outlineVariant }]}>
                      <View style={styles.cardTopRow}>
                        <View style={[styles.iconBox, { backgroundColor: activeColors.primaryContainer }]}>
                          <MaterialIcons name={typeInfo.icon as any} size={32} color={activeColors.primary} />
                        </View>
                        <View style={[styles.badge, { backgroundColor: isActive ? activeColors.primaryContainer : activeColors.surfaceContainerHigh }]}>
                          <Typography variant="label" style={{ color: isActive ? activeColors.onPrimaryContainer : activeColors.onSurfaceVariant, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>
                            {isActive ? 'ACTIVO' : 'INACTIVO'}
                          </Typography>
                        </View>
                      </View>
                      <View style={styles.cardMidRow}>
                        <Typography variant="headline" style={{ fontSize: 20 }}>{device.device_name || 'Sin Nombre'}</Typography>
                        <Typography variant="body" color="onSurfaceVariant" style={{ fontWeight: '500', fontSize: 14 }}>{typeInfo.label}</Typography>
                      </View>
                      <View style={[styles.cardBottomRow, { borderTopColor: activeColors.outlineVariant, opacity: 0.8 }]}>
                        <View style={styles.infoLine}>
                          <MaterialIcons name="person" size={18} color={activeColors.onSurfaceVariant} />
                          <Typography variant="label" color="onSurfaceVariant" style={{ fontWeight: '600', marginLeft: Spacing[3], fontSize: 12 }}>
                            Paciente ID: {device.patient_id || 'No Asignado'}
                          </Typography>
                        </View>
                        <View style={styles.infoLine}>
                          <MaterialIcons name="location-on" size={18} color={activeColors.onSurfaceVariant} />
                          <Typography variant="label" color="onSurfaceVariant" style={{ fontWeight: '600', marginLeft: Spacing[3], fontSize: 12 }}>
                            {device.device_location || 'Sin Ubicación'}
                          </Typography>
                        </View>
                      </View>
                    </Card>
                  </Pressable>
                );
              })}

              {filteredDevices.length === 0 && activeTab === 'alarmas' && (
                <Card layer="lowest" style={{ padding: Spacing[6], alignItems: 'center' }}>
                  <MaterialIcons name="notifications-active" size={48} color={activeColors.primary} style={{ marginBottom: Spacing[4] }} />
                  <Typography variant="headline" style={{ fontSize: 18, marginBottom: Spacing[2] }}>Sin Alarmas registradas</Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
                    No hay dispositivos de tipo alarma (ALRM01 / DISP01) en el sistema.
                  </Typography>
                </Card>
              )}

              {activeTab === 'dispositivos' && (
                /* Empty State / Add New */
                <Pressable onPress={() => router.push('/escanear-qr' as any)}>
                  <Card layer="low" style={[styles.deviceCard, styles.emptyStateCard, { borderColor: activeColors.outlineVariant, borderWidth: 2, borderStyle: 'dashed', opacity: 0.8 }]}>
                    <View style={[styles.emptyStateIconCircle, { backgroundColor: activeColors.surfaceContainerHigh }]}>
                      <MaterialIcons name="add" size={28} color={activeColors.outline} />
                    </View>
                    <Typography variant="headline" style={{ fontSize: 18, color: activeColors.onSurfaceVariant, marginTop: Spacing[4] }}>Nuevo Dispositivo</Typography>
                    <Typography variant="body" color="outline" style={{ fontSize: 12, textAlign: 'center', marginTop: Spacing[1], paddingHorizontal: Spacing[4] }}>Configura un nuevo sensor o gateway en la red.</Typography>
                  </Card>
                </Pressable>
              )}
            </View>
          );
        })()}

        {/* System Stats */}
        <View style={styles.statsRow}>
          <Card layer="lowest" style={styles.statMiniCard}>
            <View style={[styles.statVerticalBar, { backgroundColor: activeColors.primary }]} />
            <View style={styles.statContent}>
              <Typography variant="label" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1, color: activeColors.onSurfaceVariant }}>En Línea</Typography>
              <Typography variant="display" style={{ fontSize: 24, color: activeColors.primary }}>{activeCount}</Typography>
            </View>
          </Card>
          <Card layer="lowest" style={styles.statMiniCard}>
            <View style={[styles.statVerticalBar, { backgroundColor: activeColors.outlineVariant }]} />
            <View style={styles.statContent}>
              <Typography variant="label" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1, color: activeColors.onSurfaceVariant }}>Inactivos</Typography>
              <Typography variant="display" style={{ fontSize: 24, color: activeColors.onSurface }}>{inactiveCount}</Typography>
            </View>
          </Card>
          <Card layer="lowest" style={styles.statMiniCard}>
            <View style={[styles.statVerticalBar, { backgroundColor: activeColors.error }]} />
            <View style={styles.statContent}>
              <Typography variant="label" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1, color: activeColors.onSurfaceVariant }}>Alertas Críticas</Typography>
              <Typography variant="display" style={{ fontSize: 24, color: activeColors.error }}>00</Typography>
            </View>
          </Card>
        </View>

      </ScrollView>

      {/* FAB */}
      <Pressable style={[styles.fab, { backgroundColor: activeColors.primary }]} onPress={() => router.push('/escanear-qr' as any)}>
        <MaterialIcons name="add" size={32} color={activeColors.onPrimary} />
      </Pressable>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    padding: Spacing[4],
    paddingBottom: 120, 
  },
  tabBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  tabSegmentedControl: {
    flexDirection: 'row',
    padding: Spacing[1],
    borderRadius: Rounded.xl,
  },
  tabButton: {
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[2],
    borderRadius: Rounded.lg,
  },
  tabActive: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Rounded.lg,
  },
  sectionHeader: {
    marginBottom: Spacing[6],
  },
  devicesGrid: {
    flexDirection: 'column',
    gap: Spacing[6],
    marginBottom: Spacing[6],
  },
  deviceCard: {
    padding: Spacing[6],
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[6],
  },
  iconBox: {
    padding: Spacing[3],
    borderRadius: Rounded.xl,
    opacity: 0.8,
  },
  badge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
  cardMidRow: {
    marginBottom: Spacing[4],
  },
  cardBottomRow: {
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    gap: Spacing[3],
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[10],
  },
  emptyStateIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'column', 
    gap: Spacing[4],
  },
  statMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[5],
    gap: Spacing[4],
  },
  statVerticalBar: {
    width: 8,
    height: 48,
    borderRadius: Rounded.full,
  },
  statContent: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 96,
    right: Spacing[6],
    width: 56,
    height: 56,
    borderRadius: Rounded.xl, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
