import React from 'react';
import { StyleSheet, View, useColorScheme, Pressable, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Button } from '@/components/ui/Button';

export function ScanQRScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  return (
    <View style={styles.container}>
      {/* Simulated Camera Background */}
      <View style={StyleSheet.absoluteFill}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80' }}
          style={styles.bgImage}
        />
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
        )}
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top App Bar */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[3] }}>
            <MaterialIcons name="qr-code-scanner" size={24} color={activeColors.primary} />
            <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
              IoT Monitor
            </Typography>
          </View>
          <View style={styles.avatarBox}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr5KfzEx5flo6IxT5F6WfsUxoU76vUjqlT5Tz3H2V77xe02fhL2Cl1cqWiojoq2mp54mPe8SUL2hO5Hnsx0hNzhZnEGOUyRfBOCOV9k3heel03k0AXvYuR_hjHtyo_umbV-QB9MZFSfvdRF901QWTEle8SwZUe2vv-ISqfUmXzdlwKIb2i3knapcwLNas-PAte3nRKRgoQn28AWWQkIRlCnKodnUYmhH50POoM6zntFEW4zXUyrpai6GORuzQ16rM_kskWnKraIs-X' }}
              style={styles.avatarImage}
            />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          
          <View style={styles.instructions}>
            <Typography variant="headline" style={{ color: Colors.light.surfaceContainerLowest, fontSize: 24, fontWeight: '800', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 }}>
              Escanear dispositivo
            </Typography>
            <Typography variant="body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center', marginTop: Spacing[2] }}>
              Alinea el código QR dentro del marco
            </Typography>
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerContainer}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft, { borderColor: activeColors.primaryContainer }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: activeColors.primaryContainer }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: activeColors.primaryContainer }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: activeColors.primaryContainer }]} />
              
              <View style={[styles.scanLine, { backgroundColor: activeColors.primaryContainer, shadowColor: activeColors.primaryContainer }]} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button 
              variant="primary"
              label="Encender Linterna"
              leftIcon="flashlight-on"
            />
            
            <Button 
              variant="secondary"
              label="Cancelar"
              onPress={() => router.back()}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
            />
          </View>
          
        </View>

        {/* Status Indicators */}
        <View style={styles.statusContainer}>
          <View style={styles.statusGrid}>
            
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, { backgroundColor: activeColors.primary }]} />
              <View>
                <Typography variant="label" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' }}>Estado</Typography>
                <Typography variant="body" style={{ color: Colors.light.surfaceContainerLowest, fontSize: 14, fontWeight: '500' }}>Buscando...</Typography>
              </View>
            </View>

            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, { backgroundColor: activeColors.primaryContainer }]} />
              <View>
                <Typography variant="label" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' }}>Red</Typography>
                <Typography variant="body" style={{ color: Colors.light.surfaceContainerLowest, fontSize: 14, fontWeight: '500' }}>IoT_Secure_X</Typography>
              </View>
            </View>
            
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
    backgroundColor: 'rgba(245, 246, 247, 0.95)',
    zIndex: 50,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e0e3e4',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  instructions: {
    marginBottom: Spacing[12],
  },
  scannerContainer: {
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[12],
  },
  scannerFrame: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: Rounded.xl,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: 4, borderLeftWidth: 4,
    borderTopLeftRadius: Rounded.xl,
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: 4, borderRightWidth: 4,
    borderTopRightRadius: Rounded.xl,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: 4, borderLeftWidth: 4,
    borderBottomLeftRadius: Rounded.xl,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: 4, borderRightWidth: 4,
    borderBottomRightRadius: Rounded.xl,
  },
  scanLine: {
    position: 'absolute',
    left: Spacing[6],
    right: Spacing[6],
    height: 2,
    top: '50%',
    opacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 4,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: Spacing[4],
  },
  statusContainer: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[6],
    alignItems: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    gap: Spacing[3],
    width: '100%',
    maxWidth: 448,
  },
  statusCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    padding: Spacing[4],
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: Rounded.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statusIndicator: {
    width: 8,
    height: 32,
    borderRadius: 4,
  },
});
