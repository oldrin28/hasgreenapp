import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useGateways } from '../hooks/useGateways';

export function EditGatewayScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { updateGateway, deleteGateway, isLoading } = useGateways();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest, borderBottomColor: activeColors.outlineVariant, borderBottomWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Editar Gateway
          </Typography>
        </View>
        <Pressable onPress={() => deleteGateway('1')} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
          <MaterialIcons name="delete" size={24} color={activeColors.error} />
        </Pressable>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Section / Status Card */}
          <View style={styles.heroSection}>
            <Card layer="lowest" style={[styles.statusCard, { borderLeftColor: activeColors.primary, borderLeftWidth: 4 }]}>
              <View style={styles.statusCardTop}>
                <View>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                    Identificador Único
                  </Typography>
                  <Typography variant="headline" style={{ fontSize: 24, fontWeight: '700' }}>GW-7829-PRO</Typography>
                </View>
                <View style={[styles.activeBadge, { backgroundColor: 'rgba(8, 107, 0, 0.1)' }]}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700' }}>ACTIVO</Typography>
                </View>
              </View>

              <View style={styles.statusCardBottom}>
                <View style={styles.statusRow}>
                  <MaterialIcons name="router" size={16} color={activeColors.onSurfaceVariant} />
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>v2.4.1</Typography>
                </View>
                <View style={styles.statusRow}>
                  <MaterialIcons name="signal-cellular-alt" size={16} color={activeColors.onSurfaceVariant} />
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>4G LTE</Typography>
                </View>
              </View>
            </Card>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            
            <View style={styles.formField}>
              <TextField label="Nombre del Dispositivo" defaultValue="Gateway Principal Norte" editable={!isLoading} />
            </View>

            <View style={styles.formField}>
              <Typography variant="label" style={{ fontSize: 14, fontWeight: '600', marginBottom: Spacing[2], marginLeft: 4 }}>
                Ubicación Geográfica
              </Typography>
              <View style={[styles.mapContainer, { borderColor: activeColors.outlineVariant, backgroundColor: activeColors.surfaceContainer }]}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByrhR0xk5UWPn4rjxoNo1OKai47kNhKRJD_PM_0C40lZKDBsUDcetizhpcvSNyUylovd2A7LAa1kSIl1_iNqG8vhnKdW94jn8zfPNWOIvOxmejNE4hE1Dxb8meN5Ko3znloci1FWVk4iSlofZHKWTVe0p0Rv_ay7djb0qsHibjZ9CAdGKoE0iCdpUNi9atbZYK7t_sG21om1Nm_Res-zlgc_q_9xpRx0P-FY5crBWUNDEzkT65cXnUKsuJVApbY7CVcrEGRv5GNAS5' }}
                  style={[styles.mapImage, { opacity: 0.8 }]}
                />
                <View style={styles.mapPin}>
                  <MaterialIcons name="location-on" size={36} color={activeColors.primary} />
                </View>
                <View style={styles.mapOverlayLabel}>
                  <View style={[styles.glassPanel, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                    <Typography variant="label" style={{ fontSize: 12, fontWeight: '500', color: '#2c2f30' }}>Calle de la Tecnología, 14, Planta 2</Typography>
                    <Typography variant="label" style={{ fontSize: 12, fontWeight: '700', color: activeColors.primary, textTransform: 'uppercase' }}>Cambiar</Typography>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.grid2Col}>
              <View style={styles.col1}>
                <TextField label="Protocolo" defaultValue="Zigbee 3.0" editable={!isLoading} />
              </View>
              <View style={styles.col1}>
                <TextField label="Frecuencia" defaultValue="2.4 GHz" editable={!isLoading} />
              </View>
            </View>

            {/* Advanced Settings Toggle */}
            <Pressable style={({pressed}) => [
              styles.advancedSettings, 
              { backgroundColor: activeColors.surfaceContainerLow, borderColor: 'transparent' },
              pressed && { opacity: 0.8 }
            ]} disabled={isLoading}>
              <View style={styles.advancedLeft}>
                <View style={[styles.advancedIconBox, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                  <MaterialIcons name="settings-ethernet" size={20} color={activeColors.primary} />
                </View>
                <View>
                  <Typography variant="headline" style={{ fontSize: 14, fontWeight: '700' }}>Configuración IP Estática</Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12 }}>DHCP desactivado • 192.168.1.45</Typography>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={activeColors.outlineVariant} />
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Action Bar (Bottom) */}
      <View style={[styles.actionContainer, { backgroundColor: activeColors.background }]}>
        <View style={{ width: '100%', maxWidth: 768, alignSelf: 'center' }}>
          <Button 
            variant="primary"
            label={isLoading ? "Guardando..." : "Guardar Cambios"}
            leftIcon="save"
            onPress={() => updateGateway('1', {})}
            disabled={isLoading}
          />
        </View>
      </View>
      
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
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[12] * 2, // Extra space for fixed action bar
    maxWidth: 768,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    marginBottom: Spacing[8],
  },
  statusCard: {
    padding: Spacing[6],
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#2c2f30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
    borderRadius: Rounded.xl,
    overflow: 'hidden',
  },
  statusCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
  statusCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  formContainer: {
    gap: Spacing[6],
  },
  formField: {
    width: '100%',
  },
  mapContainer: {
    width: '100%',
    height: 160,
    borderRadius: Rounded.xl,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlayLabel: {
    position: 'absolute',
    bottom: Spacing[3],
    left: Spacing[3],
    right: Spacing[3],
  },
  glassPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Rounded.lg,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
  },
  col1: {
    width: '100%',
    minWidth: '45%',
    flex: 1,
  },
  advancedSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[4],
    borderRadius: Rounded.xl,
    borderWidth: 1,
    marginTop: Spacing[4],
  },
  advancedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  advancedIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[6],
    paddingBottom: Platform.OS === 'ios' ? Spacing[8] : Spacing[6],
    borderTopWidth: 1,
    borderTopColor: 'rgba(171, 173, 174, 0.1)',
  },
});
