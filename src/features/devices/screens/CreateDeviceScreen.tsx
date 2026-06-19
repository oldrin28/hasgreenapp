import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Image, Modal, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useDevices } from '../hooks/useDevices';
import { usePatients } from '../../patients/hooks/usePatients';
import { DEVICE_TYPES } from './DevicesListScreen';

export function CreateDeviceScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { createDevice, isLoading } = useDevices();
  const { loadPatients, patients } = usePatients();
  
  const { type, uid, raw } = useLocalSearchParams<{ type: string; uid: string; raw: string }>();

  // Estados locales para los campos obligatorios
  const [deviceName, setDeviceName] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  // Selector de pacientes modal
  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const assignedPatient = patients.find(p => Number(p.id) === selectedPatientId || Number(p.patient_id) === selectedPatientId);
  const patientDisplayName = assignedPatient ? `${assignedPatient.first_name} ${assignedPatient.last_name}` : 'Seleccionar un paciente...';

  const handleSave = () => {
    if (!type || !uid) {
      alert("Por favor, escanee el código QR del dispositivo primero.");
      return;
    }
    if (!deviceName.trim() || !deviceLocation.trim()) {
      alert("Por favor, completa el nombre y la ubicación física. Ambos campos son obligatorios.");
      return;
    }
    
    createDevice({
      device_type: type,
      device_unique_id: raw || (type + uid),
      device_name: deviceName,
      device_location: deviceLocation,
      patient_id: selectedPatientId
    });
  };

  const typeInfo = DEVICE_TYPES[type || ''] || { label: type || 'Dispositivo IoT', icon: 'developer-board' };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surface }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable 
            style={[styles.backButton, { backgroundColor: activeColors.surfaceContainerLow }]}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            Nuevo Dispositivo
          </Typography>
        </View>
        <View style={[styles.avatarBox, { borderColor: activeColors.outlineVariant, borderWidth: 1 }]}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgKbFmza5Yuo9bfMNmPnnvjyyTcKR0mvmjAkPYWTu9l7foi7bkW1mGHoJixuOPczGmdCxTblI-azOuW-UL-dq1BHoUK828Qgyn7rxt1fn5Oj1vPBWjNp0KujawpAYrpQoBdcfB6NDdNwgEAWYKgYavq_9if8Hux2C4k3N2zY1toRGGoF2wJXZkoLVk-DR2-xhbOWEauayZmWNVK8npSi6zuEjtlhEpaaYk02tTX6fKTWmhVrAXs5EcU9D62zxxzUDhlqSPtX38j-JT' }} 
            style={{ width: '100%', height: '100%' }} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <Card layer="low" style={styles.heroCard}>
          <View style={{ position: 'relative', zIndex: 10 }}>
            <Typography variant="display" style={{ fontSize: 24, marginBottom: Spacing[2] }}>Configuración de Hardware</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
              Complete los detalles del nuevo dispositivo en el ecosistema. Los campos de tipo e identificador único son leídos desde el código QR.
            </Typography>
          </View>
          <View style={[styles.blurCircle, { backgroundColor: activeColors.primaryContainer }]} />
        </Card>

        <View style={styles.formSection}>
          
          {/* Technical Identity Group - Conditional Rendering to prevent race conditions */}
          {type && uid ? (
            <View style={styles.rowGrid}>
              <View style={styles.gridCol}>
                <Typography variant="label" style={styles.fieldLabel}>Tipo de Dispositivo</Typography>
                <View style={[styles.readOnlyBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant }]}>
                  <MaterialIcons name={typeInfo.icon as any} size={20} color={activeColors.primary} />
                  <Typography variant="headline" style={{ fontSize: 14, marginLeft: Spacing[2], flex: 1 }} numberOfLines={1}>
                    {typeInfo.label}
                  </Typography>
                </View>
              </View>
              <View style={styles.gridCol}>
                <Typography variant="label" style={styles.fieldLabel}>Identificador Único (UID)</Typography>
                <View style={[styles.readOnlyBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant }]}>
                  <MaterialIcons name="fingerprint" size={20} color={activeColors.primary} />
                  <Typography variant="headline" style={{ fontSize: 14, marginLeft: Spacing[2], fontFamily: 'monospace' }}>
                    {uid}
                  </Typography>
                </View>
              </View>
            </View>
          ) : (
            <Card layer="lowest" style={{ padding: Spacing[6], alignItems: 'center', borderColor: activeColors.error, borderWidth: 1, borderRadius: Rounded.xl }}>
              <MaterialIcons name="warning" size={32} color={activeColors.error} style={{ marginBottom: Spacing[2] }} />
              <Typography variant="headline" style={{ fontSize: 16, marginBottom: Spacing[1], fontWeight: '700' }}>
                Falta Información del Hardware
              </Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ textAlign: 'center', marginBottom: Spacing[4], fontSize: 12 }}>
                Los parámetros de hardware no han sido cargados. Escanea el código QR del dispositivo para vincularlo.
              </Typography>
              <Button 
                variant="primary" 
                label="Escanear Código QR" 
                leftIcon="qr-code-scanner" 
                onPress={() => router.push('/escanear-qr')} 
              />
            </Card>
          )}

          {/* Device Details */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" style={styles.fieldLabel}>Nombre del Dispositivo (Obligatorio)</Typography>
            <TextField 
              placeholder="Ej: Monitor Sala Norte B2" 
              value={deviceName}
              onChangeText={setDeviceName}
              editable={!isLoading} 
            />
          </View>

          <View style={styles.fieldGroup}>
            <Typography variant="label" style={styles.fieldLabel}>Ubicación Física (Obligatorio)</Typography>
            <TextField 
              placeholder="Ej: Unidad de Cuidados Intensivos - Ala 3" 
              value={deviceLocation}
              onChangeText={setDeviceLocation}
              rightIcon="location-on" 
              editable={!isLoading} 
            />
          </View>

          {/* Assignment Section */}
          <View style={{ paddingTop: Spacing[4] }}>
            <Card layer="lowest" style={[styles.assignmentCard, { borderColor: activeColors.outlineVariant, borderWidth: 1 }]}>
              <View style={styles.assignmentHeader}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.primaryContainer }]}>
                  <MaterialIcons name="person-add" size={24} color={activeColors.primary} />
                </View>
                <View>
                  <Typography variant="headline" style={{ fontSize: 16 }}>Asignación (Opcional)</Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>Vincular dispositivo a un paciente activo</Typography>
                </View>
              </View>

              <Typography variant="label" style={styles.fieldLabel}>Paciente Asignado</Typography>
              <Pressable 
                style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow }]} 
                onPress={() => {
                  setPatientSearchQuery('');
                  setPatientModalVisible(true);
                }}
                disabled={isLoading}
              >
                <Typography variant="body" style={{ fontWeight: '500' }}>
                  {patientDisplayName}
                </Typography>
                <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.onSurfaceVariant} />
              </Pressable>
            </Card>
          </View>

        </View>

        {/* Main Action */}
        <View style={styles.actionSection}>
          <Button 
            variant="primary"
            label={isLoading ? "Guardando..." : "Guardar Dispositivo"}
            leftIcon="save"
            onPress={handleSave}
            disabled={isLoading}
          />
          <Typography variant="label" color="onSurfaceVariant" style={{ textAlign: 'center', marginTop: Spacing[4], fontSize: 12 }}>
            Al guardar, el dispositivo comenzará a transmitir datos cifrados inmediatamente.
          </Typography>
        </View>

      </ScrollView>

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
    paddingVertical: Spacing[4],
  },
  backButton: {
    padding: Spacing[2],
    borderRadius: Rounded.md,
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
    padding: Spacing[6],
    paddingBottom: 40,
    maxWidth: 672,
    alignSelf: 'center',
    width: '100%',
  },
  heroCard: {
    padding: Spacing[8],
    borderRadius: Rounded.xl,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: Spacing[6],
  },
  blurCircle: {
    position: 'absolute',
    right: -32,
    top: -32,
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.2,
  },
  formSection: {
    gap: Spacing[6],
  },
  rowGrid: {
    flexDirection: 'row',
    gap: Spacing[6],
  },
  gridCol: {
    flex: 1,
    gap: Spacing[2],
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#595c5d',
    marginLeft: Spacing[1],
    marginBottom: Spacing[2]
  },
  readOnlyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderWidth: 1,
    borderRadius: Rounded.xl,
    opacity: 0.6,
  },
  fieldGroup: {
    marginBottom: Spacing[1], 
  },
  assignmentCard: {
    padding: Spacing[6],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Rounded.sm,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: Rounded.xl,
  },
  actionSection: {
    paddingTop: Spacing[6],
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
