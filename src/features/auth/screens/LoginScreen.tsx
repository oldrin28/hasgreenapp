import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, useColorScheme, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useAuth } from '../hooks/useAuth';

const { width, height } = Dimensions.get('window');

export function LoginScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Abstract Background Blur elements */}
      <View style={[styles.bgCircle1, { backgroundColor: activeColors.primaryContainer }]} />
      <View style={[styles.bgCircle2, { backgroundColor: activeColors.secondaryContainer }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Identity Section */}
        <View style={styles.identitySection}>
          <View style={[styles.logoBox, { backgroundColor: activeColors.surfaceContainerLowest, shadowColor: activeColors.shadow }]}>
            <MaterialIcons name="eco" size={36} color={activeColors.primary} />
          </View>
          <Typography variant="display" style={{ color: activeColors.primary, letterSpacing: -1 }}>
            HASGREEN
          </Typography>
          <Typography variant="label" style={{ color: activeColors.onSurfaceVariant, marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' }}>
            Smart IoT Ecosystem
          </Typography>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard} elevation="md" layer="lowest">
          <View style={styles.cardHeader}>
            <Typography variant="headline" style={{ fontSize: 24 }}>Bienvenido</Typography>
            <Typography variant="body" color="onSurfaceVariant">
              Ingresa tus credenciales para continuar
            </Typography>
          </View>

          <View style={styles.form}>
            <TextField
              label="Correo electrónico"
              leftIcon="mail"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            
            <TextField
              label="Contraseña"
              leftIcon="lock"
              rightIcon={secureText ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setSecureText(!secureText)}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              editable={!isLoading}
              rightLabel={
                <Pressable onPress={() => {}}>
                  <Typography variant="label" style={{ color: activeColors.primary, fontWeight: '600' }}>
                    ¿Olvidaste tu contraseña?
                  </Typography>
                </Pressable>
              }
            />
          </View>

          <Button 
            label={isLoading ? "Iniciando..." : "Iniciar Sesión"}
            variant="primary" 
            rightIcon="arrow-forward"
            onPress={() => login(email, password)}
            style={{ paddingVertical: 16 }}
            disabled={isLoading}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: activeColors.outlineVariant }]} />
            <View style={[styles.dividerTextContainer, { backgroundColor: activeColors.surfaceContainerLowest }]}>
              <Typography variant="label" style={{ color: activeColors.outline, fontSize: 10, textTransform: 'uppercase' }}>
                o continuar con
              </Typography>
            </View>
          </View>

          {/* Social Logins */}
          <View style={styles.socialRow}>
            <Pressable style={[styles.socialBtn, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <Typography variant="label" style={{ fontWeight: '600' }}>Google</Typography>
            </Pressable>
            <Pressable style={[styles.socialBtn, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="apple" size={20} color={activeColors.onSurface} style={{ marginRight: 8 }} />
              <Typography variant="label" style={{ fontWeight: '600' }}>Apple</Typography>
            </Pressable>
          </View>
        </Card>

        {/* Footer Link */}
        <View style={styles.footerLink}>
          <Typography variant="body" color="onSurfaceVariant">¿No tienes una cuenta?</Typography>
          <Pressable onPress={() => router.push('/(auth)/signup')} disabled={isLoading}>
            <Typography variant="body" style={{ color: activeColors.primary, fontWeight: '700', marginLeft: 4 }}>
              Crear nueva cuenta
            </Typography>
          </Pressable>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadges}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmKQsaZvPgIwUjLg7J0X_BqHwZfOOboMh4Xx3N1cHN5FQQrkw2wCI9OfJgY-Li5FXjgk9CQ9LZcAnRDWQmeiDhwefyruBHUef-XKbICvMfB3Un6c4YZJ1H-EDdtE4Bb12xDCEG55RmSikjT3bR_ww8yyxj4sWJoixhVJ-y_4Rc8Q4NsMmNGbWTCSn9jJvX-FAjfAsUJWJCzpIjSlcNeWHi6W92StmOfIAkXHrrCgAyvynEL6LQ23FOJT8n_zIPDXknxtyjJVxS0JqW' }}
            style={styles.badgeImg} resizeMode="contain"
          />
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk6x901ziO_uZ5AJ1AqB0ike6NgmI4hPOC3rcE95u3D1hzbAarwII0sz3nBuYjTArEB1BtEZKlHycLd_ryY1ucy5d9qYMRHPifB5ioYqXsdEA7PQAUtiTz38ClDqdCvR0adk5b7wbgIzvb4wTND5_OnZQhRWUN3vRMNbvsKrtDvuaXnoDg3IpMjfuFnHM3HXPP3wHUCwkrFETtea2ffObOxym4YJkJYSrws_SYkXQxwHOrzE2NSFXqUIUrK6BTHCtWIGl1NRF-f2YO' }}
            style={[styles.badgeImg, { height: 32 }]} resizeMode="contain"
          />
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxwPlfZSr4ZA1TnmdHEt0Ny1hL92_wzgd46syhFe3aWjPqm4BTeEtMHE44tRiV-zmRcn1cvZ9OfyS_NYeM6NqErZJuNWHHmZcx2NnTQVsOb_pihkHik57caAcdynhwtDUP0SGvLSzlwXkKTmm9cne1vwP2ey_xeQ0T-w6sKzwasS14KXEvo9aBODPvIo7gg5JQ88w5A2lsk7y2l4ubt0L9Awuouae4bSZlN7pbwzlinSaTqS98jDMa0MmevoVZNiCSFdXrwhjaIXjP' }}
            style={styles.badgeImg} resizeMode="contain"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bgCircle1: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    opacity: 0.1,
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    opacity: 0.1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  identitySection: {
    alignItems: 'center',
    marginBottom: Spacing[10],
  },
  logoBox: {
    padding: Spacing[3],
    borderRadius: Rounded.xl,
    marginBottom: Spacing[4],
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: Spacing[8],
  },
  cardHeader: {
    marginBottom: Spacing[8],
  },
  form: {
    marginBottom: Spacing[6],
  },
  dividerContainer: {
    position: 'relative',
    marginVertical: Spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.15,
  },
  dividerTextContainer: {
    paddingHorizontal: Spacing[4],
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing[4],
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: Rounded.lg,
    opacity: 0.9,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[8],
  },
  trustBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[6],
    marginTop: Spacing[12],
    opacity: 0.3,
  },
  badgeImg: {
    height: 24,
    width: 60,
  },
});
