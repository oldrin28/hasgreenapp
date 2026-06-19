import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGateways } from '../hooks/useGateways';

export function GatewaysListScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadGateways, gateways, rebootGateway, isLoading } = useGateways();

  useFocusEffect(
    useCallback(() => {
      loadGateways();
    }, [])
  );

  if (isLoading && gateways.length === 0) {
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
          <MaterialIcons name="sensors" size={24} color={activeColors.primary} />
          <Typography variant="headline" style={{ color: activeColors.primary, letterSpacing: -1, fontSize: 20, fontWeight: '700' }}>
            IoT Monitor
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable>
            <MaterialIcons name="search" size={24} color={activeColors.onSurfaceVariant} />
          </Pressable>
          <Pressable>
            <MaterialIcons name="tune" size={24} color={activeColors.onSurfaceVariant} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Gateways</Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, marginTop: Spacing[1] }}>Administración y monitoreo de nodos centrales de red</Typography>
        </View>

        {/* Bento Grid Layout for Gateways */}
        <View style={styles.gridContainer}>
          {gateways.map((gateway: any) => {
            const isOnline = gateway.gateway_last_activity_timestamp && 
              (Date.now() / 1000 - gateway.gateway_last_activity_timestamp < 900); // 15 minutes
            
            return (
              <Card key={gateway.id || gateway.gateway_unique_id} layer="lowest" style={styles.gatewayCard}>
                <LinearGradient 
                  colors={isOnline ? [activeColors.primary, activeColors.primaryDim] : [activeColors.outlineVariant, activeColors.outline]} 
                  style={styles.activePill} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }} 
                />
                
                <View style={styles.cardHeader}>
                  <View>
                    <Typography variant="headline" style={{ fontSize: 20 }}>{gateway.gateway_name || 'Sin Nombre'}</Typography>
                    <Typography variant="label" color="outline" style={{ fontFamily: 'monospace', fontSize: 12, marginTop: Spacing[1], textTransform: 'uppercase', letterSpacing: 1 }}>
                      UID: {gateway.gateway_unique_id || 'N/A'}
                    </Typography>
                  </View>
                  <View style={[
                    styles.activeBadge, 
                    { 
                      backgroundColor: isOnline ? activeColors.primaryContainer : activeColors.surfaceContainerHigh, 
                      borderColor: isOnline ? activeColors.primary : activeColors.outline 
                    }
                  ]}>
                    <View style={[styles.dot, { backgroundColor: isOnline ? activeColors.primary : activeColors.outline }]} />
                    <Typography variant="label" style={{ color: isOnline ? activeColors.primary : activeColors.onSurfaceVariant, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>
                      {isOnline ? 'ACTIVO' : 'INACTIVO'}
                    </Typography>
                  </View>
                </View>

                <View style={styles.infoGroup}>
                  <View style={styles.infoRow}>
                    <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                      <MaterialIcons name="wifi" size={16} color={activeColors.onSurfaceVariant} />
                    </View>
                    <View>
                      <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Red Conectada</Typography>
                      <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>{gateway.gateway_connected_to || 'Desconectado'}</Typography>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                      <MaterialIcons name="lan" size={16} color={activeColors.onSurfaceVariant} />
                    </View>
                    <View>
                      <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Dirección IP</Typography>
                      <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>{gateway.gateway_ip_address || '0.0.0.0'}</Typography>
                    </View>
                  </View>
                  <View style={styles.infoRow}>
                    <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                      <MaterialIcons name="update" size={16} color={activeColors.onSurfaceVariant} />
                    </View>
                    <View>
                      <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Firmware</Typography>
                      <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>{gateway.gateway_firmware_version || 'N/A'}</Typography>
                    </View>
                  </View>
                </View>

                {/* Action Buttons Layout */}
                {(() => {
                  const ip = gateway.gateway_ip_address;
                  const isNoneOrEmpty = !ip || 
                                       ip.trim() === '' || 
                                       ip.trim().toLowerCase() === 'none';
                  const hasIp = !isNoneOrEmpty;

                  if (!hasIp) {
                    return (
                      <View style={{ gap: Spacing[3], marginTop: Spacing[6] }}>
                        {/* Conectar Gateway Button (Full-width Primary) */}
                        <Pressable 
                          style={[styles.actionBtnPrimary, { backgroundColor: activeColors.primary, marginTop: 0 }]} 
                          onPress={() => router.push({ 
                            pathname: '/conectar-gateway', 
                            params: { 
                              id: gateway.id, 
                              uid: gateway.gateway_unique_id, 
                              name: gateway.gateway_name 
                            } 
                          } as any)}
                        >
                          <MaterialIcons name="link" size={16} color={activeColors.onPrimary} />
                          <Typography variant="label" style={{ color: activeColors.onPrimary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                            Conectar Gateway
                          </Typography>
                        </Pressable>

                        {/* Editar Button (Full-width Secondary) */}
                        <Pressable 
                          style={[styles.actionBtnPrimary, { backgroundColor: activeColors.surfaceContainerHigh, marginTop: 0 }]} 
                          onPress={() => router.push({ pathname: '/editar-gateway', params: { id: gateway.id } } as any)}
                        >
                          <MaterialIcons name="edit" size={16} color={activeColors.primary} />
                          <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                            Editar
                          </Typography>
                        </Pressable>
                      </View>
                    );
                  } else {
                    return (
                      <View style={[styles.secondaryActionsRow, { marginTop: Spacing[6] }]}>
                        {/* Editar Button (Left Half) */}
                        <Pressable 
                          style={[styles.actionBtnSecondary, { backgroundColor: activeColors.surfaceContainerHigh }]} 
                          onPress={() => router.push({ pathname: '/editar-gateway', params: { id: gateway.id } } as any)}
                        >
                          <MaterialIcons name="edit" size={16} color={activeColors.primary} />
                          <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                            Editar
                          </Typography>
                        </Pressable>

                        {/* Reiniciar Button (Right Half) */}
                        <Pressable 
                          style={[styles.actionBtnSecondary, { backgroundColor: activeColors.surfaceContainerHigh }]} 
                          onPress={() => rebootGateway(gateway.gateway_ip_address)}
                          disabled={isLoading}
                        >
                          <MaterialIcons name="restart-alt" size={16} color={activeColors.error} />
                          <Typography variant="label" style={{ color: activeColors.error, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>
                            Reiniciar
                          </Typography>
                        </Pressable>
                      </View>
                    );
                  }
                })()}
              </Card>
            );
          })}

          {gateways.length === 0 && (
            <Card layer="lowest" style={{ padding: Spacing[6], alignItems: 'center' }}>
              <MaterialIcons name="sensors" size={48} color={activeColors.primary} style={{ marginBottom: Spacing[4] }} />
              <Typography variant="headline" style={{ fontSize: 18, marginBottom: Spacing[2] }}>Sin Gateways registrados</Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ textAlign: 'center' }}>
                No hay gateways registrados en el sistema para esta cuenta.
              </Typography>
            </Card>
          )}
        </View>

      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push({ pathname: '/escanear-qr', params: { mode: 'gateway' } } as any)}>
        <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.fabGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <MaterialIcons name="add" size={32} color={activeColors.onPrimary} />
        </LinearGradient>
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
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: 120, // Space for FAB and TabBar
  },
  sectionHeader: {
    marginBottom: Spacing[8],
  },
  gridContainer: {
    flexDirection: 'column',
    gap: Spacing[6],
  },
  gatewayCard: {
    padding: Spacing[6],
    position: 'relative',
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[6],
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: Rounded.full,
    borderWidth: 1,
    opacity: 0.9,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoGroup: {
    gap: Spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: Rounded.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimary: {
    marginTop: Spacing[6],
    width: '100%',
    paddingVertical: Spacing[3],
    borderRadius: Rounded.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginTop: Spacing[3],
    width: '100%',
  },
  actionBtnSecondary: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: Rounded.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
  },
  fab: {
    position: 'absolute',
    bottom: 96,
    right: Spacing[6],
    width: 56,
    height: 56,
    borderRadius: 24, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  fabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
