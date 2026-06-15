import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../hooks/useProfile';

export const ProfileScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { profile, logout } = useProfile();

  const notifications = profile?.notifications ?? { sms: 4, voice: 2, email: 4, push: 10, whatsapp: 4 };
  const initials = profile?.initials ?? 'OP';
  const name = profile?.name ?? 'Cargando...';
  const status = profile?.status ?? '';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            Perfil
          </Typography>
        </View>
        <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '800', letterSpacing: 1 }}>
          HASGREEN
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.avatarGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Typography variant="display" style={{ color: activeColors.onPrimary, fontSize: 32, letterSpacing: -1 }}>{initials}</Typography>
            </LinearGradient>
            <View style={[styles.editBadge, { backgroundColor: activeColors.surfaceContainerLowest }]}>
              <MaterialIcons name="edit" size={14} color={activeColors.primary} />
            </View>
          </View>

          <View style={{ alignItems: 'center', marginTop: Spacing[4], gap: Spacing[1] }}>
            <Typography variant="headline" style={{ fontSize: 24, fontWeight: '800' }}>{name}</Typography>
            {!!status && (
              <View style={[styles.statusBadge, { backgroundColor: activeColors.surfaceContainerHighest }]}>
                <Typography variant="label" style={{ fontSize: 12, fontWeight: '600', color: activeColors.onSurfaceVariant, letterSpacing: 1 }}>{status}</Typography>
              </View>
            )}
          </View>
        </View>

        {/* Notification Usage Grid */}
        <Card layer="lowest" style={styles.usageCard}>
          <View style={styles.usageHeader}>
            <Typography variant="label" style={{ fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Uso de notificaciones</Typography>
            <MaterialIcons name="info" size={20} color={activeColors.outline} />
          </View>

          <View style={styles.usageGrid}>
            {[
              { icon: 'sms', label: 'SMS', value: notifications.sms },
              { icon: 'record-voice-over', label: 'Voice', value: notifications.voice },
              { icon: 'mail', label: 'Email', value: notifications.email },
              { icon: 'notifications-active', label: 'Push', value: notifications.push },
            ].map((item) => (
              <View key={item.label} style={[styles.usageItem, { backgroundColor: activeColors.surfaceContainerLow }]}>
                <MaterialIcons name={item.icon as any} size={24} color={activeColors.primary} />
                <Typography variant="display" style={{ fontSize: 24, marginVertical: Spacing[1] }}>{item.value}</Typography>
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
              </View>
            ))}

            <View style={[styles.usageItemWide, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
                <MaterialIcons name="chat" size={24} color={activeColors.primary} />
                <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>WhatsApp</Typography>
              </View>
              <Typography variant="display" style={{ fontSize: 24 }}>{notifications.whatsapp}</Typography>
            </View>
          </View>
        </Card>

        {/* Account Settings */}
        <Card layer="lowest" style={styles.settingsCard}>
          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
            onPress={() => router.push('/editar-cuenta' as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: activeColors.secondaryContainer }]}>
                <MaterialIcons name="manage-accounts" size={24} color={activeColors.secondary} />
              </View>
              <Typography variant="body" style={{ fontWeight: '500' }}>Editar datos de cuenta</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={activeColors.outline} />
          </Pressable>

          <View style={[styles.divider, { backgroundColor: activeColors.outlineVariant, opacity: 0.2 }]} />

          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
            onPress={() => router.push('/cambiar-contrasena' as any)}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.settingIconBox, { backgroundColor: activeColors.errorContainer, opacity: 0.8 }]}>
                <MaterialIcons name="lock-reset" size={24} color={activeColors.error} />
              </View>
              <Typography variant="body" style={{ fontWeight: '500' }}>Cambiar contraseña</Typography>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={activeColors.outline} />
          </Pressable>
        </Card>

        {/* Sign Out */}
        <View style={styles.signOutContainer}>
          <Pressable
            style={({ pressed }) => [styles.signOutBtn, { backgroundColor: activeColors.errorContainer, opacity: 0.8 }, pressed && { transform: [{ scale: 0.98 }] }]}
            onPress={logout}
          >
            <Typography variant="headline" style={{ color: activeColors.error, fontWeight: '700' }}>Cerrar sesión</Typography>
          </Pressable>
        </View>

      </ScrollView>
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
    paddingVertical: Spacing[4],
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: 120,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  avatarWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(104, 254, 79, 0.3)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
  usageCard: {
    padding: Spacing[6],
    marginBottom: Spacing[8],
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  usageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
  },
  usageItem: {
    flexBasis: '47%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
    borderRadius: Rounded.lg,
  },
  usageItemWide: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: Rounded.lg,
  },
  settingsCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: Spacing[8],
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing[6],
  },
  signOutContainer: {
    marginBottom: Spacing[4],
  },
  signOutBtn: {
    paddingVertical: Spacing[4],
    borderRadius: Rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
