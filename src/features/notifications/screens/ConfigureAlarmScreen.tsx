import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Switch, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotifications } from '../hooks/useNotifications';
import { useDevices } from '../../devices/hooks/useDevices';
import { DEVICE_TYPES } from '../../devices/screens/DevicesListScreen';

export const ConfigureAlarmScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  
  const { toggleAlarm, saveLocalAlarmData, isSaving } = useNotifications();
  const { loadCachedDevices, loadCachedDeviceTypes, devices, deviceTypes } = useDevices();

  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [enabledAlarms, setEnabledAlarms] = useState<Record<string, boolean>>({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCachedDevices();
      loadCachedDeviceTypes();
    }, [])
  );

  const alarmTypes = ['ALRM01', 'DISP01', 'ALRM', 'DISP'];

  // Filter devices to get only trigger buttons/sensors (exclude alarms and displays)
  const buttonDevices = useMemo(() => {
    return devices.filter((d: any) => !alarmTypes.includes(d.device_type));
  }, [devices]);

  // Filter devices to get only local alarms and displays
  const alarmDevices = useMemo(() => {
    return devices.filter((d: any) => alarmTypes.includes(d.device_type));
  }, [devices]);

  // Auto-select first device if none is selected
  useEffect(() => {
    if (!selectedDevice && buttonDevices.length > 0) {
      setSelectedDevice(buttonDevices[0]);
    }
  }, [buttonDevices, selectedDevice]);

  const parseTriggerList = (triggerList: any): string[] => {
    if (typeof triggerList === 'string') {
      try {
        const parsed = JSON.parse(triggerList);
        if (Array.isArray(parsed)) {
          return parsed.map((id: any) => String(id));
        }
        return triggerList && triggerList !== '0' ? [triggerList] : [];
      } catch (e) {
        return triggerList && triggerList !== '0' ? [triggerList] : [];
      }
    } else if (Array.isArray(triggerList)) {
      return triggerList.map((id: any) => String(id));
    }
    return [];
  };

  // Sync switches with selectedDevice's device_trigger_local_alarm array
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    const triggerArray = parseTriggerList(selectedDevice?.device_trigger_local_alarm);

    alarmDevices.forEach((d: any) => {
      const idStr = String(d.id);
      initialStates[idStr] = triggerArray.includes(idStr);
    });
    setEnabledAlarms(initialStates);
  }, [selectedDevice, devices]);

  const handleToggleAlarm = (id: string, val: boolean) => {
    setEnabledAlarms(prev => {
      const updated = { ...prev, [id]: val };
      
      if (selectedDevice) {
        const currentList = parseTriggerList(selectedDevice.device_trigger_local_alarm);
        let updatedList: string[];
        if (val) {
          updatedList = currentList.includes(id) ? currentList : [...currentList, id];
        } else {
          updatedList = currentList.filter((item: string) => item !== id);
        }
        
        setSelectedDevice({
          ...selectedDevice,
          device_trigger_local_alarm: updatedList
        });
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!selectedDevice) return;
    try {
      const devIdNum = Number(selectedDevice.id || 0);
      const activeAlarmIds = Object.keys(enabledAlarms)
        .filter((key) => enabledAlarms[key])
        .map((key) => Number(key));

      await saveLocalAlarmData(devIdNum, activeAlarmIds);
    } catch (error) {
      console.error('Error al guardar alarmas locales:', error);
    }
  };

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
            <Pressable 
              onPress={() => setIsModalVisible(true)}
              style={({ pressed }) => [styles.selectorArea, { backgroundColor: activeColors.surfaceContainerLow }, pressed && { opacity: 0.8 }]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
                <MaterialIcons name="router" size={24} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '600' }}>
                  {selectedDevice?.device_name || 'Selecciona un dispositivo'}
                </Typography>
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
            {alarmDevices.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <MaterialIcons name="notifications-off" size={48} color={activeColors.outline} />
                <Typography variant="body" color="onSurfaceVariant" style={{ textAlign: 'center', marginTop: Spacing[2] }}>
                  No hay alarmas o displays registrados en esta cuenta.
                </Typography>
              </View>
            ) : (
              alarmDevices.map((d: any) => {
                const idStr = String(d.id);
                const devType = d.device_type || '';
                const dynamicType = deviceTypes.find(
                  (t: any) => t.device_type_code === devType || t.code === devType
                );
                const typeLabel = dynamicType?.device_type_name || dynamicType?.name || dynamicType?.label || DEVICE_TYPES[devType]?.label || devType || 'Alarma';

                return (
                  <View key={idStr} style={[styles.alarmItem, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: activeColors.primary }]}>
                    <View style={{ flex: 1, marginRight: Spacing[4] }}>
                      <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>
                        {d.device_name || 'Sin nombre'}
                      </Typography>
                      <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 2 }}>
                        {typeLabel} - {d.device_location || 'Sin ubicación'}
                      </Typography>
                    </View>
                    <Switch 
                      value={!!enabledAlarms[idStr]} 
                      onValueChange={(v) => handleToggleAlarm(idStr, v)} 
                      trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }} 
                      thumbColor={Colors.light.surfaceContainerLowest} 
                    />
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Banner */}
        <View style={styles.bannerContainer}>
          <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.bannerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={{ zIndex: 10, paddingRight: Spacing[10] }}>
              <Typography variant="headline" style={{ color: activeColors.onPrimary, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                Gestiona qué botones activan tus alarmas
              </Typography>
              <Typography variant="body" style={{ color: 'rgba(211, 255, 193, 0.9)', fontSize: 14 }}>
                Vincula tus botones de pánico y sensores de asistencia para activar de manera automática las alarmas locales o displays vinculados ante cualquier emergencia.
              </Typography>
            </View>
            <MaterialIcons name="bolt" size={96} color={activeColors.onPrimary} style={styles.bannerIcon} />
          </LinearGradient>
        </View>

        {/* Save Button */}
        <View style={styles.actionArea}>
          <Pressable 
            onPress={handleSave}
            disabled={isSaving}
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.98 }] }, isSaving && { opacity: 0.7 }]}
          >
            <MaterialIcons name="save" size={20} color={activeColors.onPrimary} />
            <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 18 }}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Typography>
          </Pressable>
        </View>

      </ScrollView>

      {/* Custom Bottom Sheet Selector Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLow }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>
                Seleccionar Dispositivo
              </Typography>
              <Pressable onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} color={activeColors.onSurface} />
              </Pressable>
            </View>

            <FlatList
              data={buttonDevices}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ paddingBottom: Spacing[6] }}
              renderItem={({ item }) => {
                const isSelected = selectedDevice && String(selectedDevice.id) === String(item.id);
                return (
                  <Pressable
                    onPress={() => {
                      setSelectedDevice(item);
                      setIsModalVisible(false);
                    }}
                    style={[
                      styles.modalItem,
                      { backgroundColor: isSelected ? activeColors.surfaceContainerLowest : 'transparent' }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
                      <MaterialIcons name="radio-button-checked" size={20} color={isSelected ? activeColors.primary : activeColors.outline} />
                      <Typography variant="body" style={{ fontWeight: isSelected ? '700' : '500' }}>
                        {item.device_name || 'Dispositivo sin nombre'}
                      </Typography>
                    </View>
                    {isSelected && <MaterialIcons name="check" size={20} color={activeColors.primary} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>

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
  emptyCard: { padding: Spacing[8], alignItems: 'center', justifyContent: 'center', borderRadius: Rounded.xl },
  bannerContainer: { marginTop: Spacing[2], marginBottom: Spacing[10], borderRadius: 16, elevation: 4, shadowColor: '#086b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, overflow: 'hidden' },
  bannerGradient: { padding: Spacing[6], position: 'relative', overflow: 'hidden' },
  bannerIcon: { position: 'absolute', bottom: -16, right: -16, opacity: 0.1 },
  actionArea: { paddingBottom: Spacing[4] },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], paddingVertical: 16, borderRadius: Rounded.xl, elevation: 6, shadowColor: '#086b00', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: Rounded.xl, borderTopRightRadius: Rounded.xl, paddingHorizontal: Spacing[6], paddingTop: Spacing[6], maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[4] },
  closeBtn: { padding: Spacing[1] },
  modalItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing[4], borderRadius: Rounded.lg, marginVertical: Spacing[1] },
});
