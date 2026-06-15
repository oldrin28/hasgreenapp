import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const ConfigNotificationsStep1Screen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const [selectedDevice, setSelectedDevice] = useState<string>('device1');

  const devices = [
    { id: 'device1', name: 'Bollo limpio (8319300)', description: 'Sensor de Humedad - Invernadero A' },
    { id: 'device2', name: 'Botón de mi casa (5630532)', description: 'Actuador Smart - Entrada Principal' },
    { id: 'device3', name: 'Válvula Riego Norte (9201844)', description: 'Control de Flujo - Sector 3' },
  ];

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
          />
        </View>

        {/* Device List */}
        <View style={styles.deviceList}>
          {devices.map((device) => (
            <Pressable
              key={device.id}
              style={[
                styles.deviceCard,
                { backgroundColor: activeColors.surfaceContainerLowest, borderColor: selectedDevice === device.id ? activeColors.primary : 'rgba(171, 173, 174, 0.15)' },
                selectedDevice === device.id && { backgroundColor: 'rgba(8, 107, 0, 0.05)' }
              ]}
              onPress={() => setSelectedDevice(device.id)}
            >
              <View style={[styles.devicePill, { backgroundColor: selectedDevice === device.id ? activeColors.primary : 'rgba(171, 173, 174, 0.3)' }]} />
              <View style={{ flex: 1 }}>
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.5 }}>{device.name}</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>{device.description}</Typography>
              </View>
              <View style={[styles.radioCircle, { borderColor: selectedDevice === device.id ? activeColors.primary : 'rgba(171, 173, 174, 0.3)' }, selectedDevice === device.id && { backgroundColor: activeColors.primary }]}>
                {selectedDevice === device.id && <MaterialIcons name="check" size={16} color={activeColors.onPrimary} />}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Action */}
        <View style={styles.actionBar}>
          <Pressable
            style={({ pressed }) => [styles.nextBtn, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.95 }] }]}
            onPress={() => router.push('/config-notificaciones-2')}
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
