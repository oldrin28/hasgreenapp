import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
  const { loadGateways, isLoading } = useGateways();

  useEffect(() => {
    loadGateways();
  }, []);

  if (isLoading) {
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
          
          {/* Gateway Card 1 */}
          <Card layer="lowest" style={styles.gatewayCard}>
            <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.activePill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            
            <View style={styles.cardHeader}>
              <View>
                <Typography variant="headline" style={{ fontSize: 20 }}>GW-Principal-HQ</Typography>
                <Typography variant="label" color="outline" style={{ fontFamily: 'monospace', fontSize: 12, marginTop: Spacing[1], textTransform: 'uppercase', letterSpacing: 1 }}>UID: 4F:A2:C8:99:11:0B</Typography>
              </View>
              <View style={[styles.activeBadge, { backgroundColor: activeColors.primaryContainer, borderColor: activeColors.primary }]}>
                <View style={[styles.dot, { backgroundColor: activeColors.primary }]} />
                <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>ACTIVO</Typography>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="wifi" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Red Conectada</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>Corp_Main_5G</Typography>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="lan" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Dirección IP</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>192.168.1.105</Typography>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="update" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Firmware</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>v2.4.1-stable</Typography>
                </View>
              </View>
            </View>

            <Pressable style={[styles.manageBtn, { backgroundColor: activeColors.surfaceContainerHigh }]} onPress={() => router.push('/editar-gateway' as any)}>
              <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Gestionar Nodo</Typography>
            </Pressable>
          </Card>

          {/* Gateway Card 2 */}
          <Card layer="lowest" style={styles.gatewayCard}>
            <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.activePill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            
            <View style={styles.cardHeader}>
              <View>
                <Typography variant="headline" style={{ fontSize: 20 }}>GW-Almacen-Norte</Typography>
                <Typography variant="label" color="outline" style={{ fontFamily: 'monospace', fontSize: 12, marginTop: Spacing[1], textTransform: 'uppercase', letterSpacing: 1 }}>UID: 22:B1:C5:D3:E4:F5</Typography>
              </View>
              <View style={[styles.activeBadge, { backgroundColor: activeColors.primaryContainer, borderColor: activeColors.primary }]}>
                <View style={[styles.dot, { backgroundColor: activeColors.primary }]} />
                <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>ACTIVO</Typography>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="wifi" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Red Conectada</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>Warehouse_Guest</Typography>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="lan" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Dirección IP</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>10.0.0.42</Typography>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="update" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Firmware</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>v2.3.9-LTS</Typography>
                </View>
              </View>
            </View>

            <Pressable style={[styles.manageBtn, { backgroundColor: activeColors.surfaceContainerHigh }]} onPress={() => router.push('/editar-gateway' as any)}>
              <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Gestionar Nodo</Typography>
            </Pressable>
          </Card>

          {/* Gateway Card 3 */}
          <Card layer="lowest" style={[styles.gatewayCard, { borderColor: activeColors.outlineVariant, borderWidth: 1 }]}>
            <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.activePill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            
            <View style={styles.cardHeader}>
              <View>
                <Typography variant="headline" style={{ fontSize: 20 }}>GW-Laboratorio-C</Typography>
                <Typography variant="label" color="outline" style={{ fontFamily: 'monospace', fontSize: 12, marginTop: Spacing[1], textTransform: 'uppercase', letterSpacing: 1 }}>UID: AB:00:11:22:33:44</Typography>
              </View>
              <View style={[styles.activeBadge, { backgroundColor: activeColors.primaryContainer, borderColor: activeColors.primary }]}>
                <View style={[styles.dot, { backgroundColor: activeColors.primary }]} />
                <Typography variant="label" style={{ color: activeColors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>ACTIVO</Typography>
              </View>
            </View>

            <View style={styles.infoGroup}>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="settings-input-antenna" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Red Conectada</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>Lab_Private_Mesh</Typography>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="lan" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Dirección IP</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>172.16.2.14</Typography>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.iconBox, { backgroundColor: activeColors.surfaceContainer }]}>
                  <MaterialIcons name="update" size={16} color={activeColors.onSurfaceVariant} />
                </View>
                <View>
                  <Typography variant="label" color="outline" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Firmware</Typography>
                  <Typography variant="body" style={{ fontSize: 14, fontWeight: '500' }}>v2.4.5-beta</Typography>
                </View>
              </View>
            </View>

            <Pressable style={[styles.manageBtn, { backgroundColor: activeColors.surfaceContainerHigh }]} onPress={() => router.push('/editar-gateway' as any)}>
              <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Gestionar Nodo</Typography>
            </Pressable>
          </Card>

        </View>

      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => router.push('/registrar-gateway' as any)}>
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
  manageBtn: {
    marginTop: Spacing[6],
    width: '100%',
    paddingVertical: Spacing[3],
    borderRadius: Rounded.lg,
    alignItems: 'center',
    justifyContent: 'center',
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
