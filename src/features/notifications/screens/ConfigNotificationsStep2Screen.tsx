import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const ConfigNotificationsStep2Screen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const [selectedUser, setSelectedUser] = useState<string>('user1');

  const users = [
    { id: 'user1', name: 'Oldrin Pruebaquince', email: 'oldrin.test@hasgreen.io', phone: '+52 1 55 1234 5678' },
    { id: 'user2', name: 'user update uno dos', email: 'update.one@provider.com', phone: '+52 1 55 9876 5432' },
    { id: 'user3', name: 'Madelein Pérez', email: 'm.perez@service.net', phone: '+52 1 55 5555 1212' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainer }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>HASGREEN</Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Progress Stepper */}
        <View style={styles.stepperContainer}>
          {[true, true, false].map((active, i) => (
            <View key={i} style={[styles.stepBar, { backgroundColor: active ? activeColors.primary : activeColors.surfaceContainerHighest }]} />
          ))}
        </View>

        <View style={styles.pageHeader}>
          <Typography variant="headline" style={{ fontSize: 28, fontWeight: '800', letterSpacing: -1, marginBottom: Spacing[2] }}>
            Configurar Notificaciones - Paso 2
          </Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 16, fontWeight: '500' }}>
            Selecciona un usuario para continuar con la asignación
          </Typography>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: 'rgba(171, 173, 174, 0.15)' }]}>
          <MaterialIcons name="search" size={24} color={activeColors.outline} style={styles.searchIcon} />
          <TextInput style={[styles.searchInput, { color: activeColors.onSurface }]} placeholder="Buscar usuario..." placeholderTextColor={activeColors.outlineVariant} />
        </View>

        {/* User List */}
        <View style={styles.userList}>
          {users.map((user) => (
            <Pressable
              key={user.id}
              style={[styles.userCard, { backgroundColor: activeColors.surfaceContainerLowest, borderLeftColor: selectedUser === user.id ? activeColors.primary : activeColors.surfaceContainerHighest }]}
              onPress={() => setSelectedUser(user.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[5], flex: 1 }}>
                <View style={[styles.iconBox, { backgroundColor: selectedUser === user.id ? 'rgba(8, 107, 0, 0.15)' : activeColors.surfaceContainerLow }]}>
                  <MaterialIcons name="person" size={28} color={selectedUser === user.id ? activeColors.primary : activeColors.onSurfaceVariant} />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>{user.name}</Typography>
                  <View style={styles.userInfoRow}>
                    <MaterialIcons name="mail" size={16} color={activeColors.onSurfaceVariant} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>{user.email}</Typography>
                  </View>
                  <View style={styles.userInfoRow}>
                    <MaterialIcons name="call" size={16} color={activeColors.onSurfaceVariant} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>{user.phone}</Typography>
                  </View>
                </View>
              </View>
              <View style={[styles.chevronBtn, selectedUser === user.id && { backgroundColor: activeColors.surfaceContainerLow }]}>
                <MaterialIcons name="chevron-right" size={24} color={selectedUser === user.id ? activeColors.primary : activeColors.onSurfaceVariant} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Action */}
        <View style={styles.actionArea}>
          <Pressable
            style={({ pressed }) => [styles.nextBtn, { backgroundColor: activeColors.primary }, pressed && { transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/config-notificaciones-3')}
          >
            <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>Continuar al paso 3</Typography>
            <MaterialIcons name="arrow-forward" size={24} color={activeColors.onPrimary} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}>
            <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '600', fontSize: 14, textDecorationLine: 'underline' }}>Cancelar configuración</Typography>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing[6], paddingVertical: Spacing[4] },
  iconBtn: { padding: Spacing[2], marginLeft: -Spacing[2], borderRadius: Rounded.full },
  scrollContent: { padding: Spacing[6], paddingBottom: 96, maxWidth: 672, width: '100%', alignSelf: 'center' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], marginBottom: Spacing[8] },
  stepBar: { height: 4, width: 48, borderRadius: Rounded.full },
  pageHeader: { marginBottom: Spacing[10] },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], height: 56, borderRadius: Rounded.xl, borderWidth: 1, marginBottom: Spacing[8], elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchIcon: { marginRight: Spacing[3] },
  searchInput: { flex: 1, fontSize: 16, fontFamily: 'Inter' },
  userList: { gap: Spacing[4] },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing[5], borderRadius: Rounded.xl, borderLeftWidth: 4, elevation: 1, shadowColor: '#2c2f30', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.03, shadowRadius: 24 },
  iconBox: { width: 56, height: 56, borderRadius: Rounded.xl, alignItems: 'center', justifyContent: 'center' },
  userInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  chevronBtn: { padding: Spacing[2], borderRadius: Rounded.full },
  actionArea: { marginTop: Spacing[12], alignItems: 'center', gap: Spacing[4] },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing[2], width: '100%', paddingVertical: 16, borderRadius: Rounded.xl, elevation: 4, shadowColor: '#086b00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
  cancelBtn: { paddingVertical: Spacing[2], paddingHorizontal: Spacing[4] },
});
