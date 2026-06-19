import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useDevices } from '../../devices/hooks/useDevices';
import { DEVICE_TYPES } from '../../devices/screens/DevicesListScreen';

export const ConfigNotificationsStep1Screen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadCachedDevices, loadCachedDeviceTypes, devices, deviceTypes, isLoading } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadCachedDevices();
      loadCachedDeviceTypes();
    }, [])
  );

  const alarmTypes = ['ALRM01', 'DISP01', 'ALRM', 'DISP'];
  const filteredDevices = devices.filter((device: any) => {
    const isAlarm = alarmTypes.includes(device.device_type);
    const matchesSearch = !searchQuery || String(device.device_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return !isAlarm && matchesSearch;
  });

  useEffect(() => {
    if (!selectedDevice && filteredDevices.length > 0) {
      setSelectedDevice(String(filteredDevices[0].id || filteredDevices[0].device_unique_id));
    }
  }, [filteredDevices, selectedDevice]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainer }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>
            HASGREEN
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Progress Stepper */}
        <View style={styles.stepperContainer}>
          <View style={styles.step}>
            <View style={[styles.stepCircle, { backgroundColor: activeColors.primary }]}>
              <Typography variant="label" style={{ color: activeColors.onPrimary, fontWeight: '700' }}>1</Typography>
            </View>
            <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Dispositivo</Typography>
          </View>
          <View style={[styles.stepLine, { backgroundColor: activeColors.outlineVariant, opacity: 0.2 }]} />
          <View style={[styles.step, { opacity: 0.4 }]}>
            <View style={[styles.stepCircle, { backgroundColor: activeColors.surfaceContainerHighest }]}>
              <Typography variant="label" style={{ color: activeColors.onSurfaceVariant, fontWeight: '700' }}>2</Typography>
            </View>
            <Typography variant="label" style={{ color: activeColors.onSurfaceVariant, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Reglas</Typography>
          </View>
          <View style={[styles.stepLine, { backgroundColor: activeColors.outlineVariant, opacity: 0.2 }]} />
          <View style={[styles.step, { opacity: 0.4 }]}>
            <View style={[styles.stepCircle, { backgroundColor: activeColors.surfaceContainerHighest }]}>
              <Typography variant="label" style={{ color: activeColors.onSurfaceVariant, fontWeight: '700' }}>3</Typography>
            </View>
            <Typography variant="label" style={{ color: activeColors.onSurfaceVariant, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Canales</Typography>
          </View>
        </View>

        {/* Page Title */}
        <View style={styles.pageHeader}>
          <Typography variant="headline" style={{ fontSize: 28, fontWeight: '800', letterSpacing: -1, marginBottom: Spacing[2] }}>
            Configurar Notificaciones - Paso 1
          </Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 16 }}>
            Selecciona un dispositivo para gestionar sus alertas y estados.
          </Typography>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: 'rgba(171, 173, 174, 0.15)' }]}>
          <MaterialIcons name="search" size={24} color={activeColors.outline} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: activeColors.onSurface }]}
            placeholder="Buscar dispositivo..."
            placeholderTextColor={activeColors.outlineVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Device List */}
        <View style={styles.deviceList}>
          {isLoading && filteredDevices.length === 0 ? (
            <ActivityIndicator size="large" color={activeColors.primary} style={{ marginTop: Spacing[6] }} />
          ) : (
            filteredDevices.map((device: any) => {
              const devType = device.device_type || '';
              const dynamicType = deviceTypes.find(
                (t: any) => t.device_type_code === devType || t.code === devType
              );
              const typeLabel = dynamicType?.device_type_name || dynamicType?.name || dynamicType?.label || DEVICE_TYPES[devType]?.label || devType || 'Dispositivo IoT';
              const deviceIdStr = String(device.id || device.device_unique_id);

              return (
                <Pressable
                  key={deviceIdStr}
                  style={[
                    styles.deviceCard,
                    { backgroundColor: activeColors.surfaceContainerLowest, borderColor: selectedDevice === deviceIdStr ? activeColors.primary : 'rgba(171, 173, 174, 0.15)' },
                    selectedDevice === deviceIdStr && { backgroundColor: 'rgba(8, 107, 0, 0.05)' }
                  ]}
                  onPress={() => setSelectedDevice(deviceIdStr)}
                >
                  <View style={[styles.devicePill, { backgroundColor: selectedDevice === deviceIdStr ? activeColors.primary : 'rgba(171, 173, 174, 0.3)' }]} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.5 }}>
                      {device.device_name || 'Sin Nombre'}
                    </Typography>
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                      {typeLabel}
                    </Typography>
                  </View>
                  <View style={[styles.radioCircle, { borderColor: selectedDevice === deviceIdStr ? activeColors.primary : 'rgba(171, 173, 174, 0.3)' }, selectedDevice === deviceIdStr && { backgroundColor: activeColors.primary }]}>
                    {selectedDevice === deviceIdStr && <MaterialIcons name="check" size={16} color={activeColors.onPrimary} />}
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Action */}
        <View style={styles.actionBar}>
          <Pressable
            style={({ pressed }) => [styles.nextBtn, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.95 }] }]}
            onPress={() => router.push({ pathname: '/config-notificaciones-2', params: { deviceId: selectedDevice } } as any)}
            disabled={!selectedDevice}
          >
            <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>Siguiente Paso</Typography>
            <MaterialIcons name="arrow-forward" size={24} color={activeColors.onPrimary} />
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
  scrollContent: { padding: Spacing[6], paddingBottom: Spacing[12], maxWidth: 672, width: '100%', alignSelf: 'center' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing[8], paddingHorizontal: Spacing[2] },
  step: { alignItems: 'center', gap: Spacing[2] },
  stepCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepLine: { flex: 1, height: 2, marginHorizontal: Spacing[4] },
  pageHeader: { marginBottom: Spacing[10] },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], height: 56, borderRadius: Rounded.xl, borderWidth: 1, marginBottom: Spacing[8], elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchIcon: { marginRight: Spacing[3] },
  searchInput: { flex: 1, fontSize: 16, fontFamily: 'Inter' },
  deviceList: { gap: Spacing[4] },
  deviceCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing[6], gap: Spacing[6], borderRadius: Rounded.xl, borderWidth: 1, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  devicePill: { width: 4, height: 40, borderRadius: Rounded.full },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  actionBar: { marginTop: Spacing[12], alignItems: 'flex-end' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2], paddingHorizontal: Spacing[8], paddingVertical: 16, borderRadius: Rounded.xl, elevation: 4, shadowColor: '#086b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
});
