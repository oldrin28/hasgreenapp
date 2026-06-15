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

export function CreateGatewayScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { createGateway, isLoading } = useGateways();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest, borderBottomColor: activeColors.outlineVariant, borderBottomWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.onSurface} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Registrar Gateway
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[2] }}>
          <MaterialIcons name="sensors" size={20} color={activeColors.primary} />
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 14, fontWeight: '800', letterSpacing: -0.5 }}>
            IoT Monitor
          </Typography>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Page Introduction */}
          <View style={[styles.pageIntro, { backgroundColor: activeColors.surfaceContainerLow }]}>
            <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Configuración de Red</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2], fontSize: 14, lineHeight: 22 }}>
              Complete los detalles técnicos del nuevo concentrador para integrarlo en su ecosistema de monitoreo industrial.
            </Typography>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>

            {/* Section 1: Identidad del Dispositivo */}
            <Card layer="lowest" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="settings-ethernet" size={24} color={activeColors.primary} />
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Identidad del Dispositivo
                </Typography>
              </View>

              <View style={styles.grid2Col}>
                <View style={styles.col1}>
                  <View style={{ position: 'relative' }}>
                    <TextField label="Tipo de Dispositivo" defaultValue="GTWY" editable={false} />
                    <View style={styles.lockIcon}>
                      <MaterialIcons name="lock" size={16} color={activeColors.outlineVariant} />
                    </View>
                  </View>
                </View>
                <View style={styles.col1}>
                  <TextField label="Identificador Único (UID)" placeholder="00:1A:2B:3C:4D:5E" editable={!isLoading} />
                </View>
                <View style={styles.col2}>
                  <TextField label="Nombre del Gateway" placeholder="Ej: Concentrador Planta Norte A1" editable={!isLoading} />
                </View>
              </View>
            </Card>

            {/* Section 2: Ubicación Física */}
            <Card layer="lowest" style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="location-on" size={24} color={activeColors.primary} />
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Ubicación Física
                </Typography>
              </View>

              <View style={styles.col2}>
                <TextField label="Referencia de Ubicación" placeholder="Ej: Sala de Servidores, Rack 4" editable={!isLoading} />
              </View>
              
              <Pressable style={[styles.mapContainer, { borderColor: activeColors.outlineVariant, backgroundColor: activeColors.surfaceContainer }]} disabled={isLoading}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4XnyhxJuv4Xc0NwBx-UepiLOUt6dXzsiyo2hr_xA06j0IFV7ry0luBjRR-sBsz2wQsKheg7LTRWHY_GvnUWbvx9LBfStrWqwgEBXwvxQGPLbYxGC_55HnwAvfGSCIP_Uf56Kid3KIrNBpAZz6_8JEkimtFUzeYQ8gYnR3ALMqCaPVS0pZtQ_Z_Fp9g76gSg5-ZaxHJMQl57RLgaaAHw4kz838ZjvIw8-A7yHIKGdnOPrCftqocjmvDYWYJue6B-yRdbdQsnFpSZ6z' }}
                  style={[styles.mapImage, { opacity: 0.6 }]}
                />
                <View style={styles.mapOverlay}>
                  <View style={[styles.glassPanel, { backgroundColor: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }]}>
                    <MaterialIcons name="my-location" size={16} color={activeColors.primary} />
                    <Typography variant="label" style={{ fontWeight: '700', fontSize: 12, color: '#2c2f30' }}>Seleccionar en el mapa</Typography>
                  </View>
                </View>
              </Pressable>
            </Card>

            {/* Submit Button Area */}
            <View style={styles.actionArea}>
              <Button 
                variant="primary"
                label={isLoading ? "Guardando..." : "Guardar Gateway"}
                leftIcon="save"
                onPress={() => createGateway({})}
                disabled={isLoading}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: Spacing[10],
    maxWidth: 768,
    width: '100%',
    alignSelf: 'center',
  },
  pageIntro: {
    marginBottom: Spacing[8],
    padding: Spacing[6],
    borderRadius: Rounded.xl,
  },
  formContainer: {
    gap: Spacing[6],
  },
  sectionCard: {
    padding: Spacing[6],
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#2c2f30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
    gap: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[6],
  },
  col1: {
    width: '100%',
    minWidth: '45%',
    flex: 1,
  },
  col2: {
    width: '100%',
  },
  lockIcon: {
    position: 'absolute',
    right: Spacing[4],
    top: 40,
  },
  mapContainer: {
    width: '100%',
    height: 160,
    borderRadius: Rounded.lg,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Rounded.full,
    borderWidth: 1,
  },
  actionArea: {
    paddingTop: Spacing[4],
  },
});
