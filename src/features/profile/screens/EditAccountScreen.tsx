import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';

export const EditAccountScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { updateProfile, isSaving } = useProfile();

  const [alertsEnabled, setAlertsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.background }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            Perfil
          </Typography>
        </View>
        <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: 1 }}>
          HASGREEN
        </Typography>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.pageHeader}>
            <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800', letterSpacing: -1 }}>Editar Cuenta</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2], fontSize: 14 }}>
              Actualiza tu información personal y preferencias de contacto.
            </Typography>
          </View>

          <View style={styles.formContainer}>

            {/* Personal Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: activeColors.primary }]} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información Personal</Typography>
              </View>
              <View style={[styles.cardForm, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Nombre</Typography>
                    <TextField defaultValue="Ricardo" />
                  </View>
                  <View style={styles.col1}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Apellido</Typography>
                    <TextField defaultValue="Aranda" />
                  </View>
                </View>
              </View>
            </View>

            {/* Contact */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: activeColors.primary }]} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Contacto</Typography>
              </View>
              <View style={[styles.cardForm, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Email</Typography>
                  <View style={styles.inputWithIcon}>
                    <View style={styles.iconLeft}>
                      <MaterialIcons name="mail" size={20} color={activeColors.outline} />
                    </View>
                    <TextField defaultValue="ricardo.aranda@hasgreen.com" keyboardType="email-address" />
                  </View>
                </View>
                <View style={styles.grid3Col}>
                  <View style={styles.colThird}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Cód. País</Typography>
                    <TextField defaultValue="+57 (COL)" />
                  </View>
                  <View style={styles.colTwoThirds}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Celular</Typography>
                    <TextField defaultValue="300 123 4567" keyboardType="phone-pad" />
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Teléfono Fijo (Opcional)</Typography>
                  <TextField placeholder="N/A" keyboardType="phone-pad" />
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: activeColors.primary }]} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Ubicación</Typography>
              </View>
              <View style={[styles.cardForm, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>País</Typography>
                    <TextField defaultValue="Colombia" />
                  </View>
                  <View style={styles.col1}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Departamento/Estado</Typography>
                    <TextField defaultValue="Antioquia" />
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Ciudad</Typography>
                  <TextField defaultValue="Medellín" />
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Dirección</Typography>
                  <View style={styles.inputWithIcon}>
                    <View style={styles.iconLeft}>
                      <MaterialIcons name="location-on" size={20} color={activeColors.outline} />
                    </View>
                    <TextField defaultValue="Calle 10 # 43E - 20" />
                  </View>
                </View>
              </View>
            </View>

            {/* Alerts Toggle */}
            <View style={[styles.toggleCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Información Adicional</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 4 }}>
                  Habilitar alertas extendidas y reportes avanzados
                </Typography>
              </View>
              <Switch
                value={alertsEnabled}
                onValueChange={setAlertsEnabled}
                trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }}
                thumbColor={Colors.light.surfaceContainerLowest}
              />
            </View>

            {/* Save Button */}
            <View style={styles.actionArea}>
              <Pressable
                style={({ pressed }) => [styles.updateBtn, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={() => updateProfile({})}
                disabled={isSaving}
              >
                <View style={[styles.gradientBg, { backgroundColor: activeColors.primary }]}>
                  <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 18 }}>
                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                  </Typography>
                </View>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    height: 64,
  },
  iconBtn: { padding: Spacing[2], borderRadius: Rounded.full },
  scrollContent: {
    padding: Spacing[4],
    paddingBottom: Spacing[12],
    maxWidth: 672,
    width: '100%',
    alignSelf: 'center',
  },
  pageHeader: { marginBottom: Spacing[8], paddingHorizontal: Spacing[2] },
  formContainer: { gap: Spacing[8] },
  section: { gap: Spacing[4] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[2],
  },
  sectionIndicator: { width: 4, height: 24, borderRadius: 2 },
  cardForm: {
    padding: Spacing[6],
    borderRadius: Rounded.xl,
    borderWidth: 1,
    borderColor: 'rgba(171, 173, 174, 0.15)',
    elevation: 1,
    shadowColor: '#2c2f30',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    gap: Spacing[5],
  },
  fieldLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing[2] },
  fieldGroup: { width: '100%' },
  grid2Col: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[5] },
  grid3Col: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[5] },
  col1: { width: '100%', minWidth: '45%', flex: 1 },
  colThird: { width: '100%', minWidth: '30%', flex: 1 },
  colTwoThirds: { width: '100%', minWidth: '60%', flex: 2 },
  inputWithIcon: { position: 'relative' },
  iconLeft: { position: 'absolute', left: Spacing[4], top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[6],
    borderRadius: Rounded.xl,
  },
  actionArea: { paddingTop: Spacing[4], paddingBottom: Spacing[8] },
  updateBtn: {
    width: '100%',
    borderRadius: Rounded.xl,
    elevation: 8,
    shadowColor: '#086b00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  gradientBg: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
});
