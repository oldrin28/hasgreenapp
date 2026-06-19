import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useUsers } from '../hooks/useUsers';

export const CreateUserScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { createUser, isSaving } = useUsers();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [sendExtraInfo, setSendExtraInfo] = useState(false);

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert("Por favor, completa el nombre, apellido y correo electrónico.");
      return;
    }
    createUser({
      first_name: firstName,
      last_name: lastName,
      email: email,
      send_extra_info: sendExtraInfo ? 1 : 0
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Gestión de Usuarios
          </Typography>
        </View>
        <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHigh }]}>
          <MaterialIcons name="person" size={20} color={activeColors.onSurfaceVariant} />
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.pageIntro}>
            <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Nuevo Registro</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2] }}>
              Complete los campos esenciales para invitar a un nuevo colaborador a su red.
            </Typography>
          </View>

          <View style={styles.formContainer}>

            {/* Información del Colaborador */}
            <Card layer="lowest" style={styles.sectionCard}>
              <View style={[styles.statusPill, { backgroundColor: activeColors.primary }]} />
              <View style={styles.sectionHeader}>
                <MaterialIcons name="person" size={24} color={activeColors.primary} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información del Colaborador</Typography>
              </View>
              <View style={styles.grid2Col}>
                <View style={styles.col1}>
                  <TextField 
                    label="Nombre" 
                    placeholder="Ej. Juan Carlos" 
                    value={firstName} 
                    onChangeText={setFirstName} 
                  />
                </View>
                <View style={styles.col1}>
                  <TextField 
                    label="Apellido" 
                    placeholder="Ej. Pérez Rodríguez" 
                    value={lastName} 
                    onChangeText={setLastName} 
                  />
                </View>
                <View style={styles.col2}>
                  <TextField 
                    label="Correo Electrónico" 
                    placeholder="nombre@ejemplo.com" 
                    keyboardType="email-address" 
                    value={email} 
                    onChangeText={setEmail} 
                  />
                </View>
                <View style={[styles.col2, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing[4] }]}>
                  <View style={{ flex: 1, paddingRight: Spacing[4] }}>
                    <Typography variant="body" style={{ fontWeight: '600' }}>Enviar información extra</Typography>
                    <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 12 }}>
                      Habilita el envío de información adicional del paciente como medicamentos, dietas y cuidados especiales.
                    </Typography>
                  </View>
                  <Switch 
                    value={sendExtraInfo} 
                    onValueChange={setSendExtraInfo} 
                    trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }}
                    thumbColor={sendExtraInfo ? activeColors.onPrimary : activeColors.outline}
                  />
                </View>
              </View>
            </Card>

            {/* Submit */}
            <View style={styles.submitArea}>
              <Pressable
                style={({ pressed }) => [styles.submitBtn, { backgroundColor: activeColors.primary, shadowColor: activeColors.primary }, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <MaterialIcons name="person-add" size={24} color={activeColors.onPrimary} />
                <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>
                  {isSaving ? 'Registrando...' : 'Registrar Colaborador'}
                </Typography>
              </Pressable>
              <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, textAlign: 'center', marginTop: Spacing[4] }}>
                Al registrar, el usuario recibirá una invitación por correo electrónico.
              </Typography>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: 64,
  },
  backBtn: { padding: Spacing[2], borderRadius: Rounded.full },
  avatarBox: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  pageIntro: { marginBottom: Spacing[10] },
  formContainer: { gap: Spacing[8] },
  sectionCard: {
    padding: Spacing[8],
    position: 'relative',
    overflow: 'hidden',
  },
  statusPill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  grid2Col: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[6] },
  col1: { width: '100%', minWidth: '45%', flex: 1 },
  col2: { width: '100%' },
  submitArea: { paddingTop: Spacing[6] },
  submitBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[3],
    paddingVertical: 20,
    borderRadius: Rounded.xl,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
});
