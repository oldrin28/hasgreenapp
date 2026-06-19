import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useUsers } from '../hooks/useUsers';

export const UsersListScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { users, refetch, isLoading } = useUsers();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const getStatusLabel = (status: number) => {
    return status === 1 ? 'Confirmado' : 'Pendiente';
  };

  const statusColors: Record<string, string> = {
    'Confirmado': activeColors.primaryContainer,
    'Pendiente': activeColors.surfaceContainerHighest,
  };

  const statusTextColors: Record<string, string> = {
    'Confirmado': activeColors.onPrimaryContainer,
    'Pendiente': activeColors.onSurfaceVariant,
  };

  const pillColors: Record<string, string> = {
    'Confirmado': activeColors.primary,
    'Pendiente': activeColors.outline,
  };

  if (isLoading && users.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="grid-view" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            HASGREEN
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <View style={[styles.avatarBox, { borderColor: 'rgba(8, 107, 0, 0.2)', backgroundColor: activeColors.surfaceVariant }]}>
            <MaterialIcons name="person" size={24} color={activeColors.onSurfaceVariant} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Page Header & Search */}
        <View style={styles.sectionHeader}>
          <View style={{ marginBottom: Spacing[6] }}>
            <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Usuarios</Typography>
            <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 14, marginTop: Spacing[1] }}>Gestiona el acceso y roles de los integrantes de tu red.</Typography>
          </View>

          <View style={[styles.searchBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant }]}>
            <MaterialIcons name="search" size={20} color={activeColors.outline} />
            <TextInput
              placeholder="Buscar usuarios..."
              placeholderTextColor={activeColors.outline}
              style={[styles.searchInput, { color: activeColors.onSurface }]}
            />
          </View>
        </View>

        {/* User Cards */}
        <View style={styles.gridContainer}>
          {users.map((user) => {
            const statusLabel = getStatusLabel(user.guest_status);
            const userName = `${user.guest_first_name || ''} ${user.guest_last_name || ''}`.trim() || 'Usuario sin nombre';
            return (
              <Card key={user.guest_account_id || user.guest_email_address} layer="lowest" style={styles.userCard}>
                <View style={[styles.activePill, { backgroundColor: pillColors[statusLabel] ?? activeColors.primary }]} />

                <View style={styles.cardHeader}>
                  <View style={[styles.userIcon, { backgroundColor: 'rgba(8, 107, 0, 0.1)' }]}>
                    <MaterialIcons name="person" size={28} color={activeColors.primary} />
                  </View>
                  <Pressable style={styles.moreBtn}>
                    <MaterialIcons name="more-vert" size={24} color={activeColors.outline} />
                  </Pressable>
                </View>

                <View style={{ marginBottom: Spacing[6] }}>
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>{userName}</Typography>
                  <View style={{ alignSelf: 'flex-start', marginTop: Spacing[2] }}>
                    <View style={[styles.roleBadge, { backgroundColor: statusColors[statusLabel] ?? activeColors.surfaceContainerHighest }]}>
                      <Typography variant="label" style={{ color: statusTextColors[statusLabel] ?? activeColors.onSurfaceVariant, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>{statusLabel}</Typography>
                    </View>
                  </View>
                </View>

                <View style={styles.contactInfo}>
                  <View style={styles.contactRow}>
                    <MaterialIcons name="mail" size={16} color={activeColors.onSurfaceVariant} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>{user.guest_email_address || 'Sin correo'}</Typography>
                  </View>
                  {user.guest_creation_timestamp && (
                    <View style={styles.contactRow}>
                      <MaterialIcons name="date-range" size={16} color={activeColors.onSurfaceVariant} />
                      <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                        Creado: {new Date(user.guest_creation_timestamp * 1000).toLocaleDateString()}
                      </Typography>
                    </View>
                  )}
                  <View style={styles.contactRow}>
                    <MaterialIcons name={user.guest_extra_info === 1 ? "check-circle" : "cancel"} size={16} color={user.guest_extra_info === 1 ? activeColors.primary : activeColors.outline} />
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                      Info extra paciente: {user.guest_extra_info === 1 ? 'Habilitado' : 'Deshabilitado'}
                    </Typography>
                  </View>
                </View>

                <View style={[styles.cardFooter, { borderTopColor: 'rgba(171, 173, 174, 0.15)' }]}>
                  <Pressable style={styles.editBtn} onPress={() => router.push({ pathname: '/editar-usuario', params: { id: user.guest_account_id } } as any)}>
                    <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '700' }}>Editar Perfil</Typography>
                    <MaterialIcons name="arrow-forward" size={16} color={activeColors.primary} />
                  </Pressable>
                </View>
              </Card>
            );
          })}

          {/* Add New User Placeholder */}
          <Pressable
            style={[styles.emptyState, { backgroundColor: 'rgba(239, 241, 242, 0.5)', borderColor: 'rgba(171, 173, 174, 0.3)' }]}
            onPress={() => router.push('/registrar-usuario' as any)}
          >
            <View style={[styles.emptyStateIcon, { backgroundColor: activeColors.surfaceContainerLowest }]}>
              <MaterialIcons name="group-add" size={24} color={activeColors.outline} />
            </View>
            <Typography variant="label" color="onSurfaceVariant" style={{ fontWeight: '500' }}>Añadir nuevo colaborador</Typography>
          </Pressable>
        </View>

      </ScrollView>

      {/* FAB */}
      <Pressable style={[styles.fab, { backgroundColor: activeColors.primary }]} onPress={() => router.push('/registrar-usuario' as any)}>
        <MaterialIcons name="add" size={32} color={activeColors.onPrimary} />
      </Pressable>
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
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: 100,
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
  },
  sectionHeader: {
    marginBottom: Spacing[8],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Rounded.xl,
    paddingHorizontal: Spacing[4],
    height: 48,
    gap: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: 'column',
    gap: Spacing[6],
  },
  userCard: {
    padding: Spacing[6],
    position: 'relative',
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    left: 0,
    top: 24,
    bottom: 24,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[6],
  },
  userIcon: {
    width: 56,
    height: 56,
    borderRadius: Rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Rounded.lg,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: Rounded.full,
  },
  contactInfo: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingTop: Spacing[6],
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyState: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Rounded.xl,
    padding: Spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyStateIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing[6],
    right: Spacing[6],
    width: 56,
    height: 56,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
