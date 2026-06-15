import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsers } from '../hooks/useUsers';

export const EditUserScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { updateUser, deleteUser, isSaving } = useUsers();

  const [notify, setNotify] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Gestión de Usuarios
          </Typography>
        </View>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
          onPress={() => deleteUser('1')}
        >
          <MaterialIcons name="delete" size={24} color={activeColors.error} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Page Introduction */}
          <View style={styles.pageIntro}>
            <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Editar Perfil de Usuario</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2] }}>
              Actualiza la información de registro y preferencias de contacto del usuario seleccionado.
            </Typography>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>

            {/* Información Personal */}
            <View style={[styles.outerCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <Card layer="lowest" style={styles.innerCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.headerPill, { backgroundColor: activeColors.primary }]} />
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información Personal</Typography>
                </View>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}><TextField label="Nombre" placeholder="Ej. Juan" defaultValue="Oldrin" /></View>
                  <View style={styles.col1}><TextField label="Apellido" placeholder="Ej. Pérez" defaultValue="Pruebaquince" /></View>
                  <View style={styles.col2}><TextField label="Identificación" placeholder="Documento de identidad" defaultValue="1029384756" /></View>
                </View>
              </Card>
            </View>

            {/* Canales de Contacto */}
            <View style={[styles.outerCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <Card layer="lowest" style={styles.innerCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.headerPill, { backgroundColor: activeColors.primary }]} />
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Canales de Contacto</Typography>
                </View>
                <View style={styles.grid2Col}>
                  <View style={styles.col2}><TextField label="Email" placeholder="correo@dominio.com" keyboardType="email-address" defaultValue="oldrin.prueba@ejemplo.com" /></View>
                  <View style={styles.col1}><TextField label="Código de País" placeholder="+57" defaultValue="Colombia (+57)" /></View>
                  <View style={styles.col1}><TextField label="Teléfono Celular" placeholder="Número móvil" keyboardType="phone-pad" defaultValue="3001234567" /></View>
                  <View style={styles.col2}><TextField label="Teléfono Fijo" placeholder="Número local" keyboardType="phone-pad" defaultValue="6012345678" /></View>
                </View>
              </Card>
            </View>

            {/* Ubicación */}
            <View style={[styles.outerCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <Card layer="lowest" style={styles.innerCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.headerPill, { backgroundColor: activeColors.primary }]} />
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Ubicación y Domicilio</Typography>
                </View>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}><TextField label="País" placeholder="Ej. Colombia" defaultValue="Colombia" /></View>
                  <View style={styles.col1}><TextField label="Departamento/Estado" placeholder="Ej. Cundinamarca" defaultValue="Cundinamarca" /></View>
                  <View style={styles.col2}><TextField label="Ciudad" placeholder="Ej. Bogotá" defaultValue="Bogotá" /></View>
                  <View style={styles.col2}><TextField label="Direcciones" placeholder="Dirección completa..." multiline numberOfLines={3} defaultValue="Calle 100 # 15-20, Apto 502" /></View>
                </View>
              </Card>
            </View>

            {/* Preferencias */}
            <View style={[styles.outerCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <Card layer="lowest" style={[styles.innerCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[4] }]}>
                <View style={{ flex: 1, gap: Spacing[1] }}>
                  <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Notificar información adicional</Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                    Recibir alertas extendidas sobre el estado de los dispositivos vinculados.
                  </Typography>
                </View>
                <Switch
                  value={notify}
                  onValueChange={setNotify}
                  trackColor={{ false: activeColors.surfaceContainerHighest, true: activeColors.primaryContainer }}
                  thumbColor={notify ? activeColors.primary : activeColors.surfaceContainerLowest}
                />
              </Card>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionArea}>
              <Pressable
                style={({ pressed }) => [styles.updateBtn, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={() => updateUser('1', {})}
                disabled={isSaving}
              >
                <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.gradientBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <MaterialIcons name="save" size={24} color={activeColors.onPrimary} />
                  <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>
                    {isSaving ? 'Guardando...' : 'Actualizar Usuario'}
                  </Typography>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.cancelBtn, { backgroundColor: activeColors.surfaceContainerHigh }, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={() => router.back()}
              >
                <Typography variant="headline" style={{ color: activeColors.primary, fontWeight: '700', fontSize: 16 }}>Cancelar</Typography>
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
  iconBtn: {
    padding: Spacing[2],
    borderRadius: Rounded.full,
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
  },
  pageIntro: {
    marginBottom: Spacing[10],
  },
  formContainer: {
    gap: Spacing[8],
  },
  outerCard: {
    padding: 4,
    borderRadius: Rounded.xl,
  },
  innerCard: {
    padding: Spacing[6],
    elevation: 0,
    shadowOpacity: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  headerPill: {
    width: 4,
    height: 24,
    borderRadius: Rounded.full,
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
  actionArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
    paddingTop: Spacing[4],
  },
  updateBtn: {
    flex: 2,
    minWidth: 200,
    borderRadius: Rounded.xl,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  gradientBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: 16,
  },
  cancelBtn: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Rounded.xl,
    paddingVertical: 16,
  },
});
