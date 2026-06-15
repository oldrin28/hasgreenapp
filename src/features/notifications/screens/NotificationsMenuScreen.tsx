import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const NotificationsMenuScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surface }]}>
        <View style={styles.topBarIcons}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="more-vert" size={24} color={activeColors.outline} />
          </Pressable>
        </View>
        <View style={styles.headerText}>
          <Typography variant="headline" style={{ fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            NOTIFICACIONES
          </Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '500', marginTop: 4 }}>
            Administre la configuración de alertas y avisos
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Option 1: Configurar Notificaciones */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            { backgroundColor: activeColors.surfaceContainerLowest },
            pressed && { transform: [{ scale: 0.98 }], elevation: 4, shadowOpacity: 0.1 }
          ]}
          onPress={() => router.push('/config-notificaciones-1')}
        >
          <View style={[styles.colorPillLeft, { backgroundColor: activeColors.primary }]} />
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(8, 107, 0, 0.15)' }]}>
            <MaterialIcons name="settings" size={28} color={activeColors.primary} />
          </View>
          <View style={styles.optionContent}>
            <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
              Configurar Notificaciones
            </Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
              Escoger qué tipo de notificaciones reciben los usuarios de cada botón.
            </Typography>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={activeColors.outlineVariant} />
        </Pressable>

        {/* Option 2: Configurar Alarmas */}
        <Pressable
          style={({ pressed }) => [
            styles.optionCard,
            { backgroundColor: activeColors.surfaceContainerLowest },
            pressed && { transform: [{ scale: 0.98 }], elevation: 4, shadowOpacity: 0.1 }
          ]}
          onPress={() => router.push('/configurar-alarma')}
        >
          <View style={[styles.colorPillLeft, { backgroundColor: activeColors.error }]} />
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(176, 37, 0, 0.15)' }]}>
            <MaterialIcons name="notifications-active" size={28} color={activeColors.error} />
          </View>
          <View style={styles.optionContent}>
            <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
              Configurar Alarmas
            </Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
              Gestionar qué alarmas se activan al presionar cada botón.
            </Typography>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={activeColors.outlineVariant} />
        </Pressable>

        {/* Descriptive Image Card */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpN5qdbnJXhAwq5vQuBqkO86_6ZysNF2f_7RGneEXLO5qBItpkIbOz2EZNhvnEo0xVkwdKlI0_NXrK4qz_zL51WB2U0Axiww1d8VukyhP7MXxJMaCu16Z0BCG5SXcaNA1N6yrNDvM7bbUDjT6nPKwzRP7JRutlHvGtSjIvlSj86hsb8zjmlr_fl0yadaZxgvMl3atlFD2HebbEEaG29S2zHVXukmm3d4GgMoAc0rXRSgEyIEA2Bz41uEC5IsPeIbID5c0V8dESw8DJ' }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
          <View style={styles.imageCardContent}>
            <View style={[styles.tag, { backgroundColor: activeColors.primary }]}>
              <Typography variant="label" style={{ color: activeColors.onPrimary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>SISTEMA ACTIVO</Typography>
            </View>
            <Typography variant="headline" style={{ color: Colors.light.surfaceContainerLowest, fontSize: 20, fontWeight: '700' }}>
              Gestión HASGREEN
            </Typography>
            <Typography variant="body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 }}>
              Control centralizado de dispositivos IoT para adultos mayores
            </Typography>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[4],
  },
  topBarIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  iconBtn: {
    padding: Spacing[2],
    marginLeft: -Spacing[2],
    marginRight: -Spacing[2],
    borderRadius: Rounded.full,
  },
  headerText: {},
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[12],
    gap: Spacing[6],
    maxWidth: 672,
    width: '100%',
    alignSelf: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[6],
    borderRadius: Rounded.xl,
    elevation: 2,
    shadowColor: '#2c2f30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  colorPillLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[5],
  },
  optionContent: {
    flex: 1,
    paddingRight: Spacing[4],
  },
  imageCard: {
    height: 256,
    borderRadius: Rounded.xl,
    overflow: 'hidden',
    position: 'relative',
    marginTop: Spacing[4],
  },
  imageCardContent: {
    position: 'absolute',
    bottom: Spacing[6],
    left: Spacing[6],
    right: Spacing[6],
    zIndex: 20,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Rounded.full,
    marginBottom: Spacing[2],
  },
});
