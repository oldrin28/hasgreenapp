import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsers } from '../hooks/useUsers';
import { UsersRepository } from '../repository/UsersRepository';

export const EditUserScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { updateUser, deleteUser, isSaving } = useUsers();

  const [user, setUser] = useState<any>(null);
  const [notify, setNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      UsersRepository.getUserById(id).then(data => {
        if (data) {
          setUser(data);
          setNotify(data.guest_extra_info === 1);
        }
      }).catch(err => {
        Alert.alert('Error', err.message || 'Error al cargar los datos del usuario.');
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading && !user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </View>
    );
  }

  const handleUpdate = () => {
    updateUser(id || '1', {
      ...user,
      send_extra_info: notify ? 1 : 0
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLowest }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '700' }}>
            Gestión de Usuarios
          </Typography>
        </View>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
          onPress={() => {
            Alert.alert(
              'Eliminar Colaborador',
              '¿Estás seguro de que deseas eliminar este colaborador?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => deleteUser(user?.guest_email_address || '') }
              ]
            );
          }}
          disabled={isSaving}
        >
          <MaterialIcons name="delete" size={24} color={activeColors.error} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Page Introduction */}
          <View style={styles.pageIntro}>
            <Typography variant="display" style={{ fontSize: 28, letterSpacing: -1 }}>Editar Perfil</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2] }}>
              Visualice los detalles del colaborador y configure sus permisos de información adicional.
            </Typography>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>

            {/* Información del Colaborador (Informativa/Lectura) */}
            <View style={[styles.outerCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <Card layer="lowest" style={styles.innerCard}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.headerPill, { backgroundColor: activeColors.primary }]} />
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información del Colaborador</Typography>
                </View>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}>
                    <TextField 
                      label="Nombre" 
                      value={user?.guest_first_name || ''} 
                      editable={false} 
                    />
                  </View>
                  <View style={styles.col1}>
                    <TextField 
                      label="Apellido" 
                      value={user?.guest_last_name || ''} 
                      editable={false} 
                    />
                  </View>
                  <View style={styles.col2}>
                    <TextField 
                      label="Correo Electrónico" 
                      value={user?.guest_email_address || ''} 
                      editable={false} 
                    />
                  </View>
                  <View style={styles.col1}>
                    <TextField 
                      label="Estado" 
                      value={user?.guest_status === 1 ? 'Confirmado' : 'Pendiente'} 
                      editable={false} 
                    />
                  </View>
                  <View style={styles.col1}>
                    <TextField 
                      label="Fecha de registro" 
                      value={user?.guest_creation_timestamp ? new Date(user.guest_creation_timestamp * 1000).toLocaleDateString() : ''} 
                      editable={false} 
                    />
                  </View>
                </View>
              </Card>
            </View>

            {/* Preferencias (Editable) */}
            <View style={[styles.outerCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <Card layer="lowest" style={[styles.innerCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[4] }]}>
                <View style={{ flex: 1, gap: Spacing[1] }}>
                  <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Enviar información extra</Typography>
                  <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>
                    Habilita el envío de información adicional del paciente como medicamentos, dietas y cuidados especiales.
                  </Typography>
                </View>
                <Switch
                  value={notify}
                  onValueChange={setNotify}
                  trackColor={{ false: activeColors.surfaceContainerHighest, true: activeColors.primaryContainer }}
                  thumbColor={notify ? activeColors.primary : activeColors.surfaceContainerLowest}
                />
              </Card>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionArea}>
              <Pressable
                style={({ pressed }) => [styles.updateBtn, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={handleUpdate}
                disabled={isSaving}
              >
                <LinearGradient colors={[activeColors.primary, activeColors.primaryDim]} style={styles.gradientBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <MaterialIcons name="save" size={24} color={activeColors.onPrimary} />
                  <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 16 }}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </Typography>
                </LinearGradient>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.cancelBtn, { backgroundColor: activeColors.surfaceContainerHigh }, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={() => router.back()}
              >
                <Typography variant="headline" style={{ color: activeColors.primary, fontWeight: '700', fontSize: 16 }}>Cancelar</Typography>
              </Pressable>
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
  iconBtn: {
    padding: Spacing[2],
    borderRadius: Rounded.full,
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  pageIntro: {
    marginBottom: Spacing[10],
  },
  formContainer: {
    gap: Spacing[8],
  },
  outerCard: {
    padding: 4,
    borderRadius: Rounded.xl,
  },
  innerCard: {
    padding: Spacing[6],
    elevation: 0,
    shadowOpacity: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  headerPill: {
    width: 4,
    height: 24,
    borderRadius: Rounded.full,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[6],
  },
  col1: {
    width: '100%',
    minWidth: '45%',
    flex: 1,
  },
  col2: {
    width: '100%',
  },
  actionArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[4],
    paddingTop: Spacing[4],
  },
  updateBtn: {
    flex: 2,
    minWidth: 200,
    borderRadius: Rounded.xl,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  gradientBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: 16,
  },
  cancelBtn: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Rounded.xl,
    paddingVertical: 16,
  },
});
