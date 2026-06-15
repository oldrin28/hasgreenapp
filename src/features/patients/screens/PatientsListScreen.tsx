import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TextField } from '@/components/ui/TextField';
import { usePatients } from '../hooks/usePatients';

export function PatientsListScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadPatients, patients, isLoading } = usePatients();

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [])
  );

  if (isLoading) {
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable>
            <MaterialIcons name="grid-view" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, letterSpacing: -1, fontSize: 20 }}>
            HASGREEN
          </Typography>
        </View>
        <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHighest, borderColor: activeColors.primaryContainer, borderWidth: 2 }]}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDffDhidU59hcFCa8b5sF5CApkJvmW_aVzckh9KtBedAxL4EHzOtMjdUHpgiQ_6plVfle4kxH5dx26VQPb3II-xCjwLCV9RoWsHH78js8IAFdAYMH-k9SDhNUM37OItKIHDveeYfCd3zCxxYq4qEamOSgxV3BDht4DF6dqDuuvoW-XHEgjqlhXqOylfiO0L52qs4z-5VN0PVvkLCTyWpz1qwTd2pCNYjydZddrfupevYGf8_Dr0RKNgcaut_EV26qCeZtqZrw8hEEjP' }} 
            style={{ width: '100%', height: '100%' }} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerArea}>
          <View style={{ flex: 1, marginBottom: Spacing[4] }}>
            <Typography variant="display" style={{ fontSize: 28 }}>Pacientes ({patients.length})</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontWeight: '500' }}>Gestión de red hospitalaria HASGREEN</Typography>
          </View>
          <View style={{ flex: 1 }}>
            <TextField 
              leftIcon="search" 
              placeholder="Buscar paciente..." 
              style={{ borderRadius: Rounded.xl }}
            />
          </View>
        </View>

        {/* Bento Grid Layout - Main Patient Card */}
        {/* Bento Grid Layout - Patients Cards */}
        {patients.length === 0 ? (
          <Card layer="lowest" style={[styles.mainCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary, padding: Spacing[6] }]}>
            <Typography variant="body" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
              No hay pacientes registrados.
            </Typography>
          </Card>
        ) : (
          patients.map((patient: any) => (
            <Card key={patient.patient_id || patient.id} layer="lowest" style={[styles.mainCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
              <View style={styles.mainCardContent}>
                <View style={styles.patientPhotoContainer}>
                  <Image 
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGVO_rufSOVgeQXKR4PYy0lXOyMIc4BR5jX9LH-CMRhxZEVM12RiAHB67NtQ8MtmrldA1Q5Y0r9ywFR1c91fG_0uq0SO08UxLY4pyFnC62veIBgHJ8zNIlxpCf1SF6lgSRihoyGoZCqYztwt2GZorrSJmudHF4XQoAVIke_ISWDLP23VjczCnKDPGT0UR9Yd6Xi-7cf3I5zB2ac5lMLojceu2KoyeNLHrFF_tJI6iu7EOWJHWZxCs8vCGwce2arA543jCeaZuQLyuy' }} 
                    style={{ width: '100%', height: '100%' }} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: activeColors.primaryContainer }]}>
                      <Typography variant="label" style={{ color: activeColors.onPrimaryContainer, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>Paciente Activo</Typography>
                    </View>
                    <Typography variant="label" color="onSurfaceVariant" style={{ fontWeight: '500' }}>ID: {patient.patient_id || patient.id}</Typography>
                  </View>
                  <Typography variant="headline" style={{ fontSize: 24, marginBottom: Spacing[4] }}>{patient.first_name} {patient.last_name}</Typography>
                  
                  <View style={styles.infoRow}>
                    <MaterialIcons name="bloodtype" size={20} color={activeColors.primary} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, marginLeft: Spacing[2] }}>Sangre: <Typography variant="body" style={{ fontWeight: '700' }}>{patient.blood_type || 'N/A'}</Typography></Typography>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="call" size={20} color={activeColors.primary} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, marginLeft: Spacing[2] }}>
                      {patient.mobile_phone_country_code || patient.fixed_phone_country_code || ''} {patient.mobile_phone_number || patient.fixed_phone_number || 'N/A'}
                    </Typography>
                  </View>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="mail" size={20} color={activeColors.primary} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, marginLeft: Spacing[2] }}>{patient.email_address || 'N/A'}</Typography>
                  </View>
                </View>
              </View>
              
              <View style={[styles.mainCardFooter, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
                <View style={{ flexDirection: 'row', gap: Spacing[2] }}>
                  <View style={[styles.smallIconCircle, { backgroundColor: activeColors.primaryContainer }]}>
                    <MaterialIcons name="monitor-heart" size={16} color={activeColors.onPrimaryContainer} />
                  </View>
                  <View style={[styles.smallIconCircle, { backgroundColor: activeColors.tertiaryContainer, marginLeft: -Spacing[2] }]}>
                    <MaterialIcons name="device-thermostat" size={16} color={activeColors.onTertiaryContainer} />
                  </View>
                </View>
                <Pressable 
                  style={[styles.actionBtn, { backgroundColor: activeColors.primary }]}
                  onPress={() => router.push({ pathname: '/editar-paciente', params: { id: patient.patient_id || patient.id } } as any)}
                >
                  <MaterialIcons name="visibility" size={18} color={activeColors.onPrimary} />
                  <Typography variant="label" style={{ color: activeColors.onPrimary, fontWeight: '700', marginLeft: Spacing[2] }}>Ver Historial</Typography>
                </Pressable>
              </View>
            </Card>
          ))
        )}

        {/* Side Stats */}
        <View style={styles.statsGrid}>
          {/* Health Pulse Card */}
          <Card layer="lowest" style={styles.healthCard}>
            <Typography variant="label" style={{ textTransform: 'uppercase', fontSize: 10, letterSpacing: 1, color: activeColors.onSurfaceVariant, fontWeight: '700' }}>
              Estado Vital
            </Typography>
            <View style={styles.pulseRow}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Typography variant="display" style={{ fontSize: 36 }}>78</Typography>
                <Typography variant="label" color="onSurfaceVariant" style={{ fontWeight: '500', marginLeft: Spacing[1], marginBottom: Spacing[2] }}>BPM</Typography>
              </View>
              <View style={[styles.pulseBarsContainer, { backgroundColor: activeColors.primaryContainer, opacity: 0.8 }]}>
                 <View style={[styles.pulseBar, { height: '30%', backgroundColor: activeColors.primary }]} />
                 <View style={[styles.pulseBar, { height: '50%', backgroundColor: activeColors.primary }]} />
                 <View style={[styles.pulseBar, { height: '40%', backgroundColor: activeColors.primary }]} />
                 <View style={[styles.pulseBar, { height: '70%', backgroundColor: activeColors.primary }]} />
                 <View style={[styles.pulseBar, { height: '60%', backgroundColor: activeColors.primary }]} />
                 <View style={[styles.pulseBar, { height: '85%', backgroundColor: activeColors.primary }]} />
              </View>
            </View>
            <View style={[styles.statusIndicator, { borderTopColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="check-circle" size={16} color={activeColors.primary} />
              <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '700', marginLeft: Spacing[2] }}>Ritmo cardíaco estable</Typography>
            </View>
          </Card>

          {/* Last Update Card */}
          <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.updateCard}>
            <View style={styles.updateHeader}>
              <MaterialIcons name="update" size={32} color={activeColors.onPrimary} />
              <View style={[styles.syncBadge, { backgroundColor: activeColors.onPrimary }]}>
                <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>Sincronizado</Typography>
              </View>
            </View>
            <Typography variant="label" style={{ color: activeColors.onPrimary, opacity: 0.8, marginTop: Spacing[4] }}>Último reporte</Typography>
            <Typography variant="headline" style={{ color: activeColors.onPrimary, fontSize: 20 }}>Hace 12 minutos</Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing[4] }}>
              <Typography variant="label" style={{ color: activeColors.onPrimary, marginRight: Spacing[2] }}>Gateway: Node-04-HAS</Typography>
              <MaterialIcons name="wifi" size={14} color={activeColors.onPrimary} />
            </View>
          </LinearGradient>
        </View>

        {/* Patients List */}
        <View style={styles.listContainer}>
          <Typography variant="headline" style={{ fontSize: 20, marginBottom: Spacing[4] }}>Pacientes Recientes</Typography>
          
          <Pressable style={[styles.patientListItem, { backgroundColor: activeColors.surfaceContainerLowest }]} onPress={() => router.push('/editar-paciente' as any)}>
            <View style={[styles.initialsAvatar, { backgroundColor: activeColors.surfaceContainerHighest }]}>
              <Typography variant="headline" style={{ color: activeColors.primary }}>MS</Typography>
            </View>
            <View style={{ flex: 1, paddingHorizontal: Spacing[4] }}>
              <Typography variant="headline" style={{ fontSize: 16 }}>Maria Santos</Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12 }}>Sangre: O+ • Última visita: Ayer</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={activeColors.outline} />
          </Pressable>

          <Pressable style={[styles.patientListItem, { backgroundColor: activeColors.surfaceContainerLowest }]} onPress={() => router.push('/editar-paciente' as any)}>
            <View style={[styles.initialsAvatar, { backgroundColor: activeColors.surfaceContainerHighest }]}>
              <Typography variant="headline" style={{ color: activeColors.primary }}>RG</Typography>
            </View>
            <View style={{ flex: 1, paddingHorizontal: Spacing[4] }}>
              <Typography variant="headline" style={{ fontSize: 16 }}>Ricardo Gomez</Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12 }}>Sangre: B- • Última visita: 3 oct</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={activeColors.outline} />
          </Pressable>
        </View>

      </ScrollView>

      {/* FAB */}
      <Pressable style={[styles.fab, { backgroundColor: activeColors.primary }]} onPress={() => router.push('/crear-paciente' as any)}>
        <MaterialIcons name="add" size={28} color={activeColors.onPrimary} />
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
    padding: Spacing[6],
    paddingBottom: 120, // Extra space for FAB and Tabs
  },
  headerArea: {
    flexDirection: 'column',
    marginBottom: Spacing[6],
  },
  mainCard: {
    padding: 0,
    marginBottom: Spacing[6],
    overflow: 'hidden',
  },
  mainCardContent: {
    flexDirection: 'row',
    padding: Spacing[6],
    flexWrap: 'wrap', 
    gap: Spacing[6],
  },
  patientPhotoContainer: {
    width: 100,
    height: 100,
    borderRadius: Rounded.xl,
    overflow: 'hidden',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Rounded.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  mainCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderTopWidth: 1,
  },
  smallIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Rounded.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing[4],
    marginBottom: Spacing[6],
  },
  healthCard: {
    flex: 1,
    padding: Spacing[6],
  },
  pulseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing[2],
  },
  pulseBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    width: 80,
    padding: 2,
    gap: 2,
    borderRadius: Rounded.sm,
  },
  pulseBar: {
    flex: 1,
    borderRadius: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
  },
  updateCard: {
    flex: 1,
    padding: Spacing[6],
    borderRadius: Rounded.xl,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  syncBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Rounded.sm,
    opacity: 0.9,
  },
  listContainer: {
    marginTop: Spacing[4],
  },
  patientListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    marginBottom: Spacing[3],
    borderRadius: Rounded.xl,
  },
  initialsAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 100, // Above nav bar
    right: Spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
