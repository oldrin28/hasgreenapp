import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, PermissionsAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
// @ts-ignore
import WifiManager from 'react-native-wifi-reborn';
import { GatewaysRepository } from '../repository/GatewaysRepository';

export function ConnectGatewayScreen() {
  const router = useRouter();
  const { id, uid, name } = useLocalSearchParams<{ id: string; uid: string; name: string }>();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [wifiList, setWifiList] = useState<{ ssid: string; signal: number; secure: boolean }[]>([]);
  const [selectedSsid, setSelectedSsid] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Select WiFi, Step 2: Password
  const [customSsid, setCustomSsid] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Ubicación requerido',
            message: 'Para escanear las redes WiFi cercanas, la aplicación necesita acceso a su ubicación.',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error al solicitar permiso de ubicación:', err);
        return false;
      }
    }
    return true;
  };

  const triggerScan = async () => {
    setIsScanning(true);
    const action = 'Escanear redes WiFi desde el teléfono';
    const requestTime = new Date().toISOString();
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert('Permiso denegado', 'Se requiere el permiso de ubicación para escanear redes WiFi en Android.');
        setIsScanning(false);
        return;
      }

      let networks: any[] = [];
      let scannedSuccessfully = false;

      // Intentar escaneo nativo
      if (WifiManager) {
        try {
          if (Platform.OS === 'android' && typeof WifiManager.reScanAndLoadWifiList === 'function') {
            const list = await WifiManager.reScanAndLoadWifiList();
            console.log(`[ÉXITO] Acción: ${action} - Resultado: ${list.length} redes detectadas por el teléfono - Fecha/Hora: ${requestTime}`);
            
            const seenSsids = new Set<string>();
            const uniqueNetworks: any[] = [];
            
            for (const net of list) {
              const ssid = net.SSID;
              if (ssid && ssid.trim() !== '' && !seenSsids.has(ssid)) {
                seenSsids.add(ssid);
                uniqueNetworks.push({
                  ssid,
                  signal: Math.min(4, Math.max(1, Math.ceil((net.level + 100) / 10))),
                  secure: !!(net.capabilities && (net.capabilities.includes('WPA') || net.capabilities.includes('WEP')))
                });
              }
            }
            
            networks = uniqueNetworks;
            scannedSuccessfully = true;
          } else if (Platform.OS === 'ios' && typeof WifiManager.getCurrentWifiSSID === 'function') {
            const currentSsid = await WifiManager.getCurrentWifiSSID();
            console.log(`[ÉXITO] Acción: ${action} - Resultado: SSID actual obtenido en iOS - Fecha/Hora: ${requestTime}`);
            if (currentSsid) {
              networks = [{ ssid: currentSsid, signal: 4, secure: true }];
              scannedSuccessfully = true;
            }
          }
        } catch (err: any) {
          console.warn('El escaneo nativo falló. Usando redes de simulación para desarrollo:', err.message);
        }
      }

      // Fallback de desarrollo: si no estamos en un dispositivo físico con la librería nativa enlazada
      if (!scannedSuccessfully) {
        console.log(`[INFO] El escaneo nativo no tuvo éxito o no está soportado en este entorno - Fecha/Hora: ${requestTime}`);
        networks = [];
      }

      setWifiList(networks);
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      Alert.alert(
        'Error de Escaneo',
        'Ocurrió un error al intentar escanear las redes desde el teléfono.',
        [{ text: 'Aceptar' }]
      );
      setWifiList([]);
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    triggerScan();
  }, []);

  const handleSelectNetwork = (ssid: string) => {
    setSelectedSsid(ssid);
    setStep(2);
  };

  const handleConnect = async () => {
    if (!password) {
      Alert.alert('Error', 'Debe ingresar la contraseña de la red WiFi.');
      return;
    }

    setIsLoading(true);
    const action = 'Conectar y configurar Gateway';
    const requestTime = new Date().toISOString();

    // Extraer el UID real del gateway (removiendo el prefijo GTWY si existe)
    const gatewayUid = uid && uid.length > 4 && uid.startsWith('GTWY') ? uid.substring(4) : (uid || 'ECE3348A4B90');
    const targetGatewaySsid = `HASGREEN_${gatewayUid}`;
    const finalSsid = selectedSsid === 'custom' ? customSsid : selectedSsid;

    if (!finalSsid) {
      Alert.alert('Error', 'Nombre de red WiFi no válido.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Buscar la red del gateway en las redes detectadas por el teléfono
      setStatusMessage(`Buscando la red del gateway: ${targetGatewaySsid}...`);
      console.log(`[INFO] Buscando red del gateway: ${targetGatewaySsid}`);

      let found = false;
      if (WifiManager && Platform.OS === 'android') {
        try {
          const list = await WifiManager.reScanAndLoadWifiList();
          found = list.some((net: any) => net.SSID === targetGatewaySsid);
        } catch (scanErr) {
          console.warn('Error escaneando para buscar el gateway:', scanErr);
        }
      } else {
        // En iOS o simulador asumimos que la encontramos para continuar con el flujo
        found = true;
      }

      if (!found) {
        setStatusMessage('');
        setIsLoading(false);
        Alert.alert(
          'Red no encontrada',
          `No se encontró la red WiFi del gateway (${targetGatewaySsid}) cercana. Asegúrese de que el gateway esté encendido y en modo configuración.`
        );
        return;
      }

      // 2. Conectarse automáticamente a la red del gateway
      setStatusMessage(`Conectando a la red del gateway: ${targetGatewaySsid}...`);
      console.log(`[INFO] Conectando a: ${targetGatewaySsid}`);
      
      let connectionSuccess = false;
      if (WifiManager && Platform.OS === 'android') {
        try {
          // El gateway suele ser una red abierta, intentamos sin contraseña.
          await WifiManager.connectToProtectedSSID(targetGatewaySsid, "", false, true);
          connectionSuccess = true;
        } catch (connErr: any) {
          console.warn('Fallo al conectar a red abierta, intentando con contraseña por defecto "12345678":', connErr);
          try {
            await WifiManager.connectToProtectedSSID(targetGatewaySsid, "12345678", true, true);
            connectionSuccess = true;
          } catch (connErr2: any) {
            console.error('Error al conectar a la red del gateway:', connErr2);
          }
        }
      } else {
        connectionSuccess = true; // Simulado en iOS/entorno de desarrollo
      }

      if (!connectionSuccess) {
        setStatusMessage('');
        setIsLoading(false);
        Alert.alert(
          'Error de conexión',
          `No se pudo conectar automáticamente a la red del gateway (${targetGatewaySsid}). Intente conectarse manualmente desde los ajustes de su teléfono.`
        );
        return;
      }

      // Esperar un momento para estabilizar la conexión IP
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Consumir el endpoint para configurar el gateway
      setStatusMessage('Enviando configuración al Gateway...');
      console.log(`[INFO] Enviando configuración a http://192.168.4.1/wifi?`);

      const bodyParams = new URLSearchParams();
      bodyParams.append('s', finalSsid);
      bodyParams.append('p', password);
      bodyParams.append('server', 'eroblesdev.ddns.net');
      bodyParams.append('port', '1883');
      bodyParams.append('user', 'erobles');
      bodyParams.append('pass', 'qsqeis3');
      bodyParams.append('cert', 'ota_cert');
      bodyParams.append('name', gatewayUid);
      bodyParams.append('topic', 'home/');
      bodyParams.append('ota', '12345678');

      const response = await fetch('http://192.168.4.1/wifi?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP del Gateway: ${response.status}`);
      }

      console.log(`[ÉXITO] Acción: ${action} - Resultado: Configuración WiFi enviada exitosamente - Fecha/Hora: ${requestTime}`);
      
      // Reiniciar IP del gateway en el servidor
      setStatusMessage('Restableciendo IP del gateway en el servidor...');
      try {
        await GatewaysRepository.resetGatewayIp(uid || '', Number(id || 0));
      } catch (resetErr: any) {
        console.warn('Fallo al consumir reset_gateway_ip:', resetErr.message || resetErr);
      }

      setStatusMessage('');
      Alert.alert(
        '¡Configuración Exitosa!',
        'Los datos de red se enviaron al gateway exitosamente. El dispositivo se reiniciará para conectarse a internet.',
        [{ text: 'Aceptar', onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error(`[ERROR] Acción: ${action} - Resultado: ${error.message || error} - Fecha/Hora: ${requestTime}`);
      setStatusMessage('');
      Alert.alert(
        'Error de Configuración',
        'No se pudo enviar la configuración al gateway. Asegúrese de que su teléfono siga conectado a la red del gateway e intente de nuevo.',
        [{ text: 'Entendido' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalIcon = (signal: number) => {
    if (signal >= 4) return 'wifi';
    if (signal === 3) return 'wifi-tethering';
    return 'network-wifi-3-bar';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>
      
      {/* Header */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest, borderBottomColor: activeColors.outlineVariant, borderBottomWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable 
            onPress={() => {
              if (step === 2) {
                setStep(1);
              } else {
                router.back();
              }
            }} 
            style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} 
            disabled={isLoading}
          >
            <MaterialIcons name="arrow-back" size={24} color={activeColors.onSurface} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            {step === 1 ? 'Conectar Gateway' : 'Ingresar Contraseña'}
          </Typography>
        </View>
        <Typography variant="label" color="outline" style={{ fontSize: 12, fontFamily: 'monospace' }}>
          {name || 'Gateway'}
        </Typography>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {step === 1 ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.introCard}>
              <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', marginBottom: Spacing[2] }}>
                Paso 1: Seleccione una Red
              </Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
                Conéctese a la red SoftAP de su gateway, luego elija la red WiFi local a la que desea asociarlo.
              </Typography>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing[4] }}>
              <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>
                Redes Disponibles
              </Typography>
              <Pressable onPress={triggerScan} disabled={isScanning} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {isScanning ? (
                  <ActivityIndicator size="small" color={activeColors.primary} />
                ) : (
                  <>
                    <MaterialIcons name="refresh" size={16} color={activeColors.primary} />
                    <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '700' }}>Buscar</Typography>
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.listContainer}>
              {wifiList.map((network) => (
                <Card 
                  key={network.ssid} 
                  layer="lowest" 
                  style={[styles.networkCard, { borderColor: activeColors.outlineVariant }]}
                >
                  <Pressable 
                    onPress={() => handleSelectNetwork(network.ssid)}
                    style={styles.networkPressable}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
                      <MaterialIcons name={getSignalIcon(network.signal)} size={24} color={activeColors.primary} />
                      <Typography variant="headline" style={{ fontSize: 16, fontWeight: '600' }}>
                        {network.ssid}
                      </Typography>
                    </View>
                    <MaterialIcons name={network.secure ? 'lock' : 'chevron-right'} size={18} color={activeColors.outline} />
                  </Pressable>
                </Card>
              ))}

              <Card 
                layer="lowest" 
                style={[styles.networkCard, { borderColor: activeColors.outlineVariant, marginTop: Spacing[4] }]}
              >
                <View style={{ padding: Spacing[4] }}>
                  <Typography variant="label" style={{ marginBottom: Spacing[2], fontWeight: '700' }}>Otra Red (Oculta o No Encontrada)</Typography>
                  <View style={{ flexDirection: 'row', gap: Spacing[3] }}>
                    <View style={{ flex: 1 }}>
                      <TextField 
                        label="Nombre de Red (SSID)" 
                        placeholder="Ej: MiRedHogar" 
                        value={customSsid} 
                        onChangeText={setCustomSsid} 
                      />
                    </View>
                    <Pressable 
                      onPress={() => {
                        if (!customSsid.trim()) {
                          Alert.alert('Error', 'Ingrese el nombre de la red WiFi.');
                          return;
                        }
                        handleSelectNetwork('custom');
                      }}
                      style={[styles.connectBtnCustom, { backgroundColor: activeColors.primary }]}
                    >
                      <MaterialIcons name="arrow-forward" size={24} color={activeColors.onPrimary} />
                    </Pressable>
                  </View>
                </View>
              </Card>
            </View>
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.introCard}>
              <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', marginBottom: Spacing[2] }}>
                Paso 2: Contraseña de WiFi
              </Typography>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
                Ingrese la contraseña para conectarse a <Typography variant="body" style={{ fontWeight: '700' }}>{selectedSsid === 'custom' ? customSsid : selectedSsid}</Typography>.
              </Typography>
            </View>

            <View style={{ marginVertical: Spacing[6] }}>
              <TextField 
                label="Contraseña de Red WiFi" 
                placeholder="••••••••" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            <Button 
              variant="primary"
              label={isLoading ? "Enviando..." : "Conectar"}
              leftIcon="link"
              onPress={handleConnect}
              disabled={isLoading || !password}
            />
            {isLoading && statusMessage ? (
              <View style={{ marginTop: Spacing[4], alignItems: 'center', gap: Spacing[2] }}>
                <ActivityIndicator size="small" color={activeColors.primary} />
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, textAlign: 'center', fontWeight: '500' }}>
                  {statusMessage}
                </Typography>
              </View>
            ) : null}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
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
    paddingBottom: Spacing[10],
    maxWidth: 768,
    width: '100%',
    alignSelf: 'center',
  },
  introCard: {
    padding: Spacing[5],
    borderRadius: Rounded.xl,
    backgroundColor: 'rgba(8, 107, 0, 0.05)',
  },
  listContainer: {
    gap: Spacing[3],
  },
  networkCard: {
    borderRadius: Rounded.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  networkPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[4],
  },
  connectBtnCustom: {
    width: 56,
    height: 56,
    borderRadius: Rounded.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
