import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PermisoCamara() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Animated Visual Feedback Container */}
        <View style={styles.visualContainer}>
          
          {/* Background Decorative Element */}
          <View style={[styles.decorativeBlob, { backgroundColor: activeColors.primaryContainer, opacity: 0.2 }]} pointerEvents="none" />
          
          {/* Central Icon Card */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCard, { backgroundColor: activeColors.surfaceContainerLowest }]}>
              <MaterialIcons name="photo-camera" size={64} color={activeColors.primary} />
            </View>
            <View style={[styles.statusPill, { backgroundColor: activeColors.primary }]}>
              <MaterialIcons name="qr-code-scanner" size={20} color={activeColors.onPrimary} />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContent}>
            <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: Spacing[4], letterSpacing: -0.5 }}>
              Se necesita acceso a la cámara
            </Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 16, textAlign: 'center', lineHeight: 24, maxWidth: 280 }}>
              Para escanear el código QR del dispositivo, necesitamos tu permiso para usar la cámara.
            </Typography>
          </View>

          {/* Action Cluster */}
          <View style={styles.actionCluster}>
            <Pressable 
              style={({pressed}) => [styles.primaryBtnWrapper, pressed && { transform: [{ scale: 0.95 }] }]}
              onPress={() => router.back()}
            >
              <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.primaryBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>
                  Conceder Permiso
                </Typography>
                <MaterialIcons name="chevron-right" size={24} color={activeColors.onPrimary} />
              </LinearGradient>
            </Pressable>

            <Pressable 
              style={({pressed}) => [styles.cancelBtn, { backgroundColor: activeColors.surfaceContainerHigh }, pressed && { transform: [{ scale: 0.95 }] }]}
              onPress={() => router.back()}
            >
              <Typography variant="headline" style={{ color: activeColors.primary, fontWeight: '700', fontSize: 16 }}>
                Cancelar
              </Typography>
            </Pressable>
          </View>

          {/* Feature Card */}
          <View style={[styles.featureCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
            <View style={[styles.featureIconBox, { backgroundColor: activeColors.surfaceContainerLowest }]}>
              <MaterialIcons name="lock" size={20} color={activeColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="label" style={{ fontWeight: '700', fontSize: 14 }}>Privacidad garantizada</Typography>
              <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 4 }}>
                Solo usamos la cámara para la vinculación inicial del equipo IoT.
              </Typography>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Success Green "Safety" Footer Gradient */}
      <LinearGradient 
        colors={['rgba(8, 107, 0, 0.05)', activeColors.primary, 'rgba(8, 107, 0, 0.05)']} 
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
        style={styles.footerGradient} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: 64,
  },
  visualContainer: {
    width: '100%',
    maxWidth: 448, // max-w-md
    alignItems: 'center',
    position: 'relative',
  },
  decorativeBlob: {
    position: 'absolute',
    top: 0,
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  iconContainer: {
    marginBottom: Spacing[12],
    position: 'relative',
  },
  iconCard: {
    width: 128,
    height: 128,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#2c2f30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    transform: [{ rotate: '3deg' }],
  },
  statusPill: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Rounded.full,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 64,
  },
  actionCluster: {
    width: '100%',
    gap: Spacing[4],
  },
  primaryBtnWrapper: {
    width: '100%',
    borderRadius: Rounded.xl,
    elevation: 4,
    shadowColor: '#086b00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: 16,
    paddingHorizontal: Spacing[6],
  },
  cancelBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: Spacing[6],
    borderRadius: Rounded.xl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[4],
    width: '100%',
    marginTop: Spacing[12],
    padding: Spacing[6],
    borderRadius: Rounded.xl,
  },
  featureIconBox: {
    padding: Spacing[2],
    borderRadius: Rounded.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  footerGradient: {
    height: 6,
    width: '100%',
  }
});
