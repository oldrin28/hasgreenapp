import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useUsers } from '../hooks/useUsers';

export const CreateUserScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { createUser, isSaving } = useUsers();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Gestión de Usuarios
          </Typography>
        </View>
        <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHigh }]}>
          <MaterialIcons name="person" size={20} color={activeColors.onSurfaceVariant} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.pageIntro}>
            <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Nuevo Registro</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2] }}>
              Complete los campos detallados para dar de alta un nuevo usuario en el sistema HASGREEN.
            </Typography>
          </View>

          <View style={styles.formContainer}>

            {/* Información Personal */}
            <Card layer="lowest" style={styles.sectionCard}>
              <View style={[styles.statusPill, { backgroundColor: activeColors.primary }]} />
              <View style={styles.sectionHeader}>
                <MaterialIcons name="badge" size={24} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información Personal</Typography>
              </View>
              <View style={styles.grid2Col}>
                <View style={styles.col1}><TextField label="Nombre" placeholder="Ej. Juan Carlos" /></View>
                <View style={styles.col1}><TextField label="Apellido" placeholder="Ej. Pérez Rodríguez" /></View>
                <View style={styles.col2}><TextField label="Número de Identificación" placeholder="DNI, Pasaporte o Cédula" /></View>
              </View>
            </Card>

            {/* Contacto */}
            <Card layer="lowest" style={styles.sectionCard}>
              <View style={[styles.statusPill, { backgroundColor: activeColors.primaryContainer }]} />
              <View style={styles.sectionHeader}>
                <MaterialIcons name="contact-mail" size={24} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Contacto</Typography>
              </View>
              <View style={styles.grid2Col}>
                <View style={styles.col2}><TextField label="Correo Electrónico" placeholder="nombre@ejemplo.com" keyboardType="email-address" /></View>
                <View style={[styles.col2, { flexDirection: 'row', gap: Spacing[4] }]}>
                  <View style={{ flex: 1 }}><TextField label="Cód. País" placeholder="+57" /></View>
                  <View style={{ flex: 2 }}><TextField label="Celular" placeholder="000 000 000" keyboardType="phone-pad" /></View>
                </View>
                <View style={styles.col2}><TextField label="Teléfono Fijo (Opcional)" placeholder="Número local" keyboardType="phone-pad" /></View>
              </View>
            </Card>

            {/* Ubicación */}
            <Card layer="lowest" style={styles.sectionCard}>
              <View style={[styles.statusPill, { backgroundColor: activeColors.secondary }]} />
              <View style={styles.sectionHeader}>
                <MaterialIcons name="location-on" size={24} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Ubicación</Typography>
              </View>
              <View style={styles.grid2Col}>
                <View style={styles.col1}><TextField label="País" placeholder="Colombia" /></View>
                <View style={styles.col1}><TextField label="Departamento / Provincia" placeholder="Estado o Región" /></View>
                <View style={styles.col2}><TextField label="Ciudad" placeholder="Nombre de la ciudad" /></View>
                <View style={styles.col2}><TextField label="Direcciones" placeholder="Calle, número, piso, puerta..." multiline numberOfLines={3} /></View>
              </View>
            </Card>

            {/* Submit */}
            <View style={styles.submitArea}>
              <Pressable
                style={({ pressed }) => [styles.submitBtn, { backgroundColor: activeColors.primary, shadowColor: activeColors.primary }, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={() => createUser({})}
                disabled={isSaving}
              >
                <MaterialIcons name="person-add" size={24} color={activeColors.onPrimary} />
                <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>
                  {isSaving ? 'Registrando...' : 'Registrar Usuario'}
                </Typography>
              </Pressable>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, textAlign: 'center', marginTop: Spacing[4] }}>
                Al registrar, el usuario recibirá un correo de bienvenida automático.
              </Typography>
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
  backBtn: { padding: Spacing[2], borderRadius: Rounded.full },
  avatarBox: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
    maxWidth: 896,
    width: '100%',
    alignSelf: 'center',
  },
  pageIntro: { marginBottom: Spacing[10] },
  formContainer: { gap: Spacing[8] },
  sectionCard: {
    padding: Spacing[8],
    position: 'relative',
    overflow: 'hidden',
  },
  statusPill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  grid2Col: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[6] },
  col1: { width: '100%', minWidth: '45%', flex: 1 },
  col2: { width: '100%' },
  submitArea: { paddingTop: Spacing[6] },
  submitBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingVertical: 20,
    borderRadius: Rounded.xl,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
});
