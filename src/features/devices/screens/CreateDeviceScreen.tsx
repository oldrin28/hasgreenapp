import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useDevices } from '../hooks/useDevices';

export function CreateDeviceScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { createDevice, isLoading } = useDevices();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
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
              Complete los detalles técnicos para integrar el nuevo monitor PBRF en el ecosistema de red.
            </Typography>
          </View>
          <View style={[styles.blurCircle, { backgroundColor: activeColors.primaryContainer }]} />
        </Card>

        <View style={styles.formSection}>
          
          {/* Technical Identity Group */}
          <View style={styles.rowGrid}>
            <View style={styles.gridCol}>
              <Typography variant="label" style={styles.fieldLabel}>Tipo de Dispositivo</Typography>
              <View style={[styles.readOnlyBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant }]}>
                <MaterialIcons name="router" size={20} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 16, marginLeft: Spacing[3] }}>PBRF</Typography>
              </View>
            </View>
            <View style={styles.gridCol}>
              <Typography variant="label" style={styles.fieldLabel}>Identificador Único (UID)</Typography>
              <View style={[styles.readOnlyBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant }]}>
                <MaterialIcons name="fingerprint" size={20} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 16, marginLeft: Spacing[3], fontFamily: 'monospace' }}>859673</Typography>
              </View>
            </View>
          </View>

          {/* Device Details */}
          <View style={styles.fieldGroup}>
            <Typography variant="label" style={styles.fieldLabel}>Nombre del Dispositivo</Typography>
            <TextField placeholder="Ej: Monitor Sala Norte B2" editable={!isLoading} />
          </View>

          <View style={styles.fieldGroup}>
            <Typography variant="label" style={styles.fieldLabel}>Ubicación Física</Typography>
            <TextField placeholder="Ej: Unidad de Cuidados Intensivos - Ala 3" rightIcon="location-on" editable={!isLoading} />
          </View>

          {/* Assignment Section */}
          <View style={{ paddingTop: Spacing[4] }}>
            <Card layer="lowest" style={[styles.assignmentCard, { borderColor: activeColors.outlineVariant, borderWidth: 1 }]}>
              <View style={styles.assignmentHeader}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.primaryContainer }]}>
                  <MaterialIcons name="person-add" size={24} color={activeColors.primary} />
                </View>
                <View>
                  <Typography variant="headline" style={{ fontSize: 16 }}>Asignación</Typography>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>Vincular dispositivo a un paciente activo</Typography>
                </View>
              </View>

              <Typography variant="label" style={styles.fieldLabel}>Paciente Asignado</Typography>
              <Pressable style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
                <Typography variant="body" style={{ fontWeight: '500' }}>Seleccionar un paciente...</Typography>
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
            onPress={() => createDevice({})}
            disabled={isLoading}
          />
          <Typography variant="label" color="onSurfaceVariant" style={{ textAlign: 'center', marginTop: Spacing[4], fontSize: 12 }}>
            Al guardar, el dispositivo comenzará a transmitir datos cifrados inmediatamente.
          </Typography>
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
});
