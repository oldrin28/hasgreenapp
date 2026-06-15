import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../hooks/useProfile';

export const ChangePasswordScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { changePassword, isSaving } = useProfile();

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Decorative blobs */}
      <View style={[styles.blob1, { backgroundColor: 'rgba(8, 107, 0, 0.05)' }]} pointerEvents="none" />
      <View style={[styles.blob2, { backgroundColor: 'rgba(143, 249, 164, 0.1)' }]} pointerEvents="none" />

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.background }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.onSurface, fontSize: 18, fontWeight: '700' }}>
            Perfil
          </Typography>
        </View>
        <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: 1 }}>
          HASGREEN
        </Typography>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>

            <View style={styles.pageHeader}>
              <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800', letterSpacing: -1, marginBottom: Spacing[3] }}>
                Nueva Contraseña
              </Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 22 }}>
                Crea una contraseña segura para proteger tu cuenta de HASGREEN.
              </Typography>
            </View>

            <View style={styles.formContainer}>

              {/* New Password */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="onSurfaceVariant" style={styles.fieldLabel}>Nueva contraseña</Typography>
                <View style={styles.inputWithIcon}>
                  <TextField placeholder="••••••••" secureTextEntry={!showNew} />
                  <Pressable style={styles.iconRight} onPress={() => setShowNew(!showNew)}>
                    <MaterialIcons name={showNew ? 'visibility-off' : 'visibility'} size={20} color={activeColors.outline} />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Typography variant="label" color="onSurfaceVariant" style={styles.fieldLabel}>Confirmar contraseña</Typography>
                <View style={styles.inputWithIcon}>
                  <TextField placeholder="••••••••" secureTextEntry={!showConfirm} />
                  <Pressable style={styles.iconRight} onPress={() => setShowConfirm(!showConfirm)}>
                    <MaterialIcons name={showConfirm ? 'visibility-off' : 'visibility'} size={20} color={activeColors.outline} />
                  </Pressable>
                </View>
              </View>

              {/* Security Guidance */}
              <View style={[styles.guidanceCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
                <MaterialIcons name="verified-user" size={24} color={activeColors.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>
                    FORTALEZA DE CONTRASEÑA
                  </Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, lineHeight: 18 }}>
                    Usa al menos 8 caracteres, incluyendo una letra mayúscula y un número para mayor seguridad.
                  </Typography>
                </View>
              </View>

              {/* Submit Button */}
              <View style={styles.actionArea}>
                <Pressable
                  style={({ pressed }) => [styles.updateBtn, pressed && { transform: [{ scale: 0.98 }] }]}
                  onPress={() => changePassword('', '')}
                  disabled={isSaving}
                >
                  <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.gradientBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>
                      {isSaving ? 'Cambiando...' : 'Cambiar contraseña'}
                    </Typography>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            {/* Secondary Action */}
            <View style={styles.secondaryAction}>
              <Pressable style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}>
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '600' }}>
                  ¿Olvidaste tu contraseña actual?
                </Typography>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  blob1: { position: 'absolute', top: '20%', right: '-5%', width: 300, height: 300, borderRadius: 150 },
  blob2: { position: 'absolute', bottom: '10%', left: '-10%', width: 250, height: 250, borderRadius: 125 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    height: 64,
  },
  iconBtn: { padding: Spacing[2], marginLeft: -Spacing[2], borderRadius: Rounded.full },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Spacing[8],
    paddingBottom: Spacing[12],
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Spacing[6],
  },
  contentWrapper: { width: '100%', maxWidth: 448 },
  pageHeader: { marginBottom: Spacing[10] },
  formContainer: { gap: Spacing[6] },
  fieldGroup: { width: '100%', gap: Spacing[2] },
  fieldLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: Spacing[1] },
  inputWithIcon: { position: 'relative', justifyContent: 'center' },
  iconRight: { position: 'absolute', right: Spacing[4], height: '100%', justifyContent: 'center', zIndex: 1 },
  guidanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    padding: Spacing[5],
    borderRadius: Rounded.xl,
    marginTop: Spacing[4],
  },
  actionArea: { paddingTop: Spacing[6] },
  updateBtn: {
    width: '100%',
    borderRadius: Rounded.xl,
    elevation: 4,
    shadowColor: '#086b00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  gradientBg: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  secondaryAction: { marginTop: Spacing[8], alignItems: 'center' },
  linkBtn: { paddingVertical: Spacing[2], paddingHorizontal: Spacing[4] },
});
