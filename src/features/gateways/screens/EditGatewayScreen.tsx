import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useGateways } from '../hooks/useGateways';

export function EditGatewayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadGateway, gateway, updateGateway, deleteGateway, isLoading } = useGateways();

  const [gatewayName, setGatewayName] = useState('');
  const [gatewayLocation, setGatewayLocation] = useState('');

  useEffect(() => {
    if (id) {
      loadGateway(id).then(data => {
        if (data) {
          setGatewayName(data.gateway_name || '');
          setGatewayLocation(data.gateway_location || '');
        }
      });
    }
  }, [id]);

  if (isLoading && !gatewayName) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  const isGatewayActive = gateway?.gateway_status === 1 || gateway?.gateway_status === '1';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest, borderBottomColor: activeColors.outlineVariant, borderBottomWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Editar Gateway
          </Typography>
        </View>
        <Pressable 
          onPress={() => {
            Alert.alert(
              'Eliminar Gateway',
              '¿Estás seguro de que deseas eliminar este gateway?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteGateway(id || '') }
              ]
            );
          }}
          style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} 
          disabled={isLoading}
        >
          <MaterialIcons name="delete" size={24} color={activeColors.error} />
        </Pressable>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Section / Status Card */}
          <View style={styles.heroSection}>
            <Card layer="lowest" style={[styles.statusCard, { borderLeftColor: isGatewayActive ? activeColors.primary : activeColors.outlineVariant, borderLeftWidth: 4 }]}>
              <View style={styles.statusCardTop}>
                <View>
                  <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                    Identificador Único (UID)
                  </Typography>
                  <Typography variant="headline" style={{ fontSize: 20, fontWeight: '700' }}>
                    {gateway?.gateway_unique_id || 'N/A'}
                  </Typography>
                </View>
                <View style={[styles.activeBadge, { backgroundColor: isGatewayActive ? 'rgba(8, 107, 0, 0.1)' : activeColors.surfaceContainerHigh }]}>
                  <Typography variant="label" style={{ color: isGatewayActive ? activeColors.primary : activeColors.outline, fontSize: 12, fontWeight: '700' }}>
                    {isGatewayActive ? 'ACTIVO' : 'INACTIVO'}
                  </Typography>
                </View>
              </View>

              <View style={styles.statusCardBottom}>
                <View style={styles.statusRow}>
                  <MaterialIcons name="router" size={16} color={activeColors.onSurfaceVariant} />
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                    {gateway?.gateway_firmware_version || 'N/A'}
                  </Typography>
                </View>
                <View style={styles.statusRow}>
                  <MaterialIcons name="wifi" size={16} color={activeColors.onSurfaceVariant} />
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                    {gateway?.gateway_connected_to || 'Desconectado'}
                  </Typography>
                </View>
                <View style={styles.statusRow}>
                  <MaterialIcons name="lan" size={16} color={activeColors.onSurfaceVariant} />
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                    {gateway?.gateway_ip_address || '0.0.0.0'}
                  </Typography>
                </View>
              </View>
            </Card>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.formField}>
              <TextField 
                label="Nombre del Dispositivo" 
                value={gatewayName} 
                onChangeText={setGatewayName} 
                editable={!isLoading} 
              />
            </View>
            <View style={styles.formField}>
              <TextField 
                label="Ubicación Física" 
                value={gatewayLocation} 
                onChangeText={setGatewayLocation} 
                editable={!isLoading} 
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Action Bar (Bottom) */}
      <View style={[styles.actionContainer, { backgroundColor: activeColors.background }]}>
        <View style={{ width: '100%', maxWidth: 768, alignSelf: 'center' }}>
          <Button 
            variant="primary"
            label={isLoading ? "Guardando..." : "Guardar Cambios"}
            leftIcon="save"
            onPress={() => updateGateway(id || '1', { 
              ...gateway, 
              gateway_name: gatewayName, 
              gateway_location: gatewayLocation 
            })}
            disabled={isLoading}
          />
        </View>
      </View>
      
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
    paddingBottom: Spacing[12] * 2,
    maxWidth: 768,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    marginBottom: Spacing[8],
  },
  statusCard: {
    padding: Spacing[6],
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#2c2f30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 2,
    borderRadius: Rounded.xl,
    overflow: 'hidden',
  },
  statusCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[4],
  },
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
  statusCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  formContainer: {
    gap: Spacing[6],
  },
  formField: {
    width: '100%',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing[6],
    paddingBottom: Platform.OS === 'ios' ? Spacing[8] : Spacing[6],
    borderTopWidth: 1,
    borderTopColor: 'rgba(171, 173, 174, 0.1)',
  },
});
