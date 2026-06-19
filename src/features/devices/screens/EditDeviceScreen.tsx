import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Modal, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useDevices } from '../hooks/useDevices';
import { usePatients } from '../../patients/hooks/usePatients';

import { DEVICE_TYPES } from './DevicesListScreen';

export function EditDeviceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadDevice, device, updateDevice, deleteDevice, loadDeviceTypes, deviceTypes, loadDevices, devices, isLoading } = useDevices();
  const { loadPatients, patients } = usePatients();

  // Estados locales para los campos editables
  const [deviceName, setDeviceName] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  // Selector de pacientes
  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
    loadDeviceTypes();
    loadDevices();
    if (id) {
      loadDevice(id).then(data => {
        if (data) {
          setDeviceName(data.device_name || '');
          setDeviceLocation(data.device_location || '');
          setSelectedPatientId(data.patient_id ? Number(data.patient_id) : null);
        }
      });
    }
  }, [id]);

  const assignedPatient = patients.find(p => Number(p.id) === selectedPatientId || Number(p.patient_id) === selectedPatientId);
  const patientDisplayName = assignedPatient ? `${assignedPatient.first_name} ${assignedPatient.last_name}` : 'Sin Paciente Asignado';
  const patientDisplayId = assignedPatient ? `ID: #${assignedPatient.patient_id || assignedPatient.id}` : 'No Asignado';

  const handleSave = () => {
    if (!deviceName.trim() || !deviceLocation.trim()) {
      alert("Por favor, completa el nombre y la ubicación del dispositivo.");
      return;
    }
    updateDevice(id || '1', {
      ...device,
      device_name: deviceName,
      device_location: deviceLocation,
      patient_id: selectedPatientId
    });
  };

  if (isLoading && !deviceName) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }
  const isDeviceActive = device?.device_status === 1 || device?.device_status === '1';
  const devType = device?.device_type || device?.device_type_id || '';
  
  const dynamicType = deviceTypes.find((t: any) => 
    (t.device_type_code && String(t.device_type_code) === String(devType)) ||
    (t.code && String(t.code) === String(devType)) ||
    (t.id && String(t.id) === String(device?.device_type_id)) ||
    (t.id && String(t.id) === String(device?.device_type)) ||
    (t.device_type_id && String(t.device_type_id) === String(device?.device_type_id)) ||
    (t.device_type_id && String(t.device_type_id) === String(device?.device_type))
  );

  const typeInfo = {
    label: dynamicType?.device_type_name || dynamicType?.name || dynamicType?.label || DEVICE_TYPES[devType]?.label || devType || 'Dispositivo IoT'
  };

  const deviceFromList = devices.find((d: any) => 
    (device?.device_unique_id && String(d.device_unique_id) === String(device.device_unique_id)) ||
    (d.id && String(d.id) === String(id)) || 
    (d.device_id && String(d.device_id) === String(id)) ||
    (d.device_unique_id && String(d.device_unique_id) === String(id))
  );

  const displayLabel = 
    deviceFromList?.device_description || 
    device?.device_description || 
    dynamicType?.device_type_name || 
    dynamicType?.device_description || 
    dynamicType?.device_type_description || 
    dynamicType?.name || 
    dynamicType?.label || 
    DEVICE_TYPES[devType]?.label || 
    devType || 
    'Dispositivo IoT';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest, borderBottomColor: activeColors.outlineVariant, borderBottomWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            Editar Dispositivo
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <Pressable onPress={() => deleteDevice(id || '1')} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
            <MaterialIcons name="delete" size={24} color={activeColors.error} />
          </Pressable>
          <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHigh, borderColor: 'rgba(8, 107, 0, 0.1)' }]}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-rfdgX9sTys4V6U8Jbk38jP1yIT7q9TZ83l2OMYc_StwVRjxhHAsf8U_vciyzH3yGO1Z3y9_VJMsRon2XLcpS14wHVQnb0u5QaqLNDeWqyKIBWFlQYCBQIPioAvDMSkdssL-lOc_Avz8VTTTLm91n_FoCKt6xUt37Sht-y0UGp7L0KypuW7iYZ4OLWMzVZiuuJNnWn8TnEQawyhNxYC4rDGq_ksV0BbSNSPspBy_zlkQzdIcWw6T-5bPASR0RySc9tpw8URsZDN9N' }}
              style={styles.avatarImage}
            />
          </View>
        </View>
      </View>
 
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Section Asymmetry */}
          <View style={styles.heroSection}>
            <View style={[styles.glowBlob, { backgroundColor: 'rgba(104, 254, 79, 0.2)' }]} />
            <View style={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing[2] }}>
                Tipo de Dispositivo
              </Typography>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3], flexWrap: 'wrap' }}>
                <Typography variant="headline" style={{ fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>
                  {displayLabel}
                </Typography>
                {device?.device_unique_id && (
                  <View style={[styles.typeBadge, { backgroundColor: activeColors.surfaceContainerHigh }]}>
                    <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 11, fontWeight: '700' }}>
                      UID: {device.device_unique_id}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            
            {/* Device Basics */}
            <View style={[styles.basicsCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <View style={{ position: 'relative' }}>
                <TextField label="Nombre del Dispositivo" value={deviceName} onChangeText={setDeviceName} editable={!isLoading} />
                <View style={styles.inputIcon}>
                  <MaterialIcons name="edit" size={20} color={activeColors.outlineVariant} />
                </View>
              </View>
              
              <View style={{ position: 'relative', marginTop: Spacing[4] }}>
                <TextField label="Ubicación Actual" value={deviceLocation} onChangeText={setDeviceLocation} editable={!isLoading} />
                <View style={styles.inputIcon}>
                  <MaterialIcons name="location-on" size={20} color={activeColors.outlineVariant} />
                </View>
              </View>
            </View>

            {/* Patient Assignment */}
            <Card layer="lowest" style={styles.patientCard}>
              <View style={[styles.patientGlow, { backgroundColor: 'rgba(143, 249, 164, 0.1)' }]} />
              
              <View style={styles.patientHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
                  <View style={[styles.personIconBox, { backgroundColor: 'rgba(8, 107, 0, 0.1)' }]}>
                    <MaterialIcons name="person" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Paciente Asignado</Typography>
                </View>
                <Pressable onPress={() => {
                  setPatientSearchQuery('');
                  setPatientModalVisible(true);
                }} disabled={isLoading}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>Cambiar</Typography>
                </Pressable>
              </View>

              <View style={[styles.patientSummary, { backgroundColor: activeColors.surfaceContainerLow }]}>
                <View style={[styles.patientAvatar, { backgroundColor: activeColors.primary }]}>
                  <Typography variant="headline" style={{ color: activeColors.onPrimary, fontSize: 20, fontWeight: '700' }}>
                    {patientDisplayName.charAt(0)}
                  </Typography>
                </View>
                <View>
                  <Typography variant="body" style={{ fontWeight: '700', fontSize: 16 }}>{patientDisplayName}</Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>{patientDisplayId}</Typography>
                </View>
              </View>
            </Card>

            {/* Device Status Summary */}
            <View style={styles.statusGrid}>
              <View style={[styles.statusBox, { backgroundColor: activeColors.surfaceContainerLow, borderLeftColor: isDeviceActive ? activeColors.primary : activeColors.outlineVariant, borderLeftWidth: 4 }]}>
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>Estado de Conexión</Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[2] }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDeviceActive ? activeColors.primary : activeColors.outline }} />
                  <Typography variant="body" style={{ color: isDeviceActive ? activeColors.primary : activeColors.onSurfaceVariant, fontWeight: '700' }}>
                    {isDeviceActive ? 'Activo' : 'Inactivo'}
                  </Typography>
                </View>
              </View>
              
              <View style={[styles.statusBox, { backgroundColor: activeColors.surfaceContainerLow, borderLeftColor: activeColors.outlineVariant, borderLeftWidth: 4 }]}>
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 }}>Última Señal</Typography>
                <Typography variant="body" style={{ fontWeight: '700' }}>
                  {device?.device_last_alert_timestamp ? new Date(device.device_last_alert_timestamp * 1000).toLocaleTimeString() : 'N/A'}
                </Typography>
              </View>
            </View>

            {/* Action Area */}
            <View style={styles.actionArea}>
              <Button 
                variant="primary"
                label={isLoading ? "Guardando..." : "Guardar Cambios"}
                leftIcon="save"
                onPress={handleSave}
                disabled={isLoading}
              />
              <Button 
                variant="secondary"
                label="Descartar ediciones"
                onPress={() => router.back()}
                disabled={isLoading}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL: Selector de Pacientes */}
      <Modal visible={patientModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Asignar Paciente</Typography>
              <Pressable onPress={() => setPatientModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>

            <View style={[styles.searchBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="search" size={20} color={activeColors.outline} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, color: activeColors.onSurface }}
                placeholder="Buscar paciente por nombre o ID..."
                placeholderTextColor={activeColors.outline}
                value={patientSearchQuery}
                onChangeText={setPatientSearchQuery}
              />
            </View>

            <FlatList
              data={patients.filter(p => 
                `${p.first_name} ${p.last_name}`.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                String(p.patient_id || p.id).includes(patientSearchQuery)
              )}
              keyExtractor={(item, index) => `${item.id || item.patient_id}-${index}`}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setSelectedPatientId(item.patient_id ? Number(item.patient_id) : Number(item.id));
                    setPatientModalVisible(false);
                  }}
                >
                  <Typography variant="body" style={{ fontWeight: '600' }}>
                    {item.first_name} {item.last_name}
                  </Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>
                    ID Paciente: #{item.patient_id || item.id}
                  </Typography>
                </Pressable>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
          </View>
        </View>
      </Modal>
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
    height: 64,
  },
  iconBtn: {
    padding: Spacing[2],
    borderRadius: Rounded.full,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    marginBottom: Spacing[10],
    position: 'relative',
  },
  glowBlob: {
    position: 'absolute',
    top: -16,
    left: -16,
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  typeBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
  formContainer: {
    gap: Spacing[8],
  },
  basicsCard: {
    padding: Spacing[6],
    borderRadius: Rounded.xl,
  },
  inputIcon: {
    position: 'absolute',
    right: Spacing[4],
    top: 40,
  },
  patientCard: {
    padding: Spacing[6],
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(171, 173, 174, 0.15)',
    elevation: 2,
    shadowColor: '#2c2f30',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
  },
  patientGlow: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  personIconBox: {
    width: 40,
    height: 40,
    borderRadius: Rounded.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
    padding: Spacing[4],
    borderRadius: Rounded.xl,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  statusBox: {
    flex: 1,
    padding: Spacing[4],
    borderRadius: Rounded.xl,
  },
  actionArea: {
    paddingTop: Spacing[4],
    gap: Spacing[4],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Rounded.xl,
    borderTopRightRadius: Rounded.xl,
    height: '70%',
    padding: Spacing[6],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  modalItem: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing[3],
    height: 48,
    marginBottom: Spacing[4],
  },
});
