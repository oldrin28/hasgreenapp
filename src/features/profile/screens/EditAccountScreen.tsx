import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Switch, ActivityIndicator, Modal, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded, Fonts } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import { Country, State, City } from 'country-state-city';

export const EditAccountScreen = () => {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { profile, updateProfile, isSaving, isLoading, fetchProfile } = useProfile();

  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phone, setPhone] = useState('');
  const [fixedPhone, setFixedPhone] = useState('');
  const [country, setCountry] = useState('');
  const [stateName, setStateName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Listados oficiales
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // Búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Modales
  const [countryModal, setCountryModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);

  // Inicializar países
  useEffect(() => {
    setCountriesList(Country.getAllCountries());
  }, []);

  // Cargar estados cuando cambie el país
  useEffect(() => {
    if (country) {
      const matchedCountry = Country.getAllCountries().find(c => c.name === country);
      if (matchedCountry) {
        setStatesList(State.getStatesOfCountry(matchedCountry.isoCode));
      } else {
        setStatesList([]);
      }
    } else {
      setStatesList([]);
    }
  }, [country]);

  // Cargar ciudades cuando cambie el estado
  useEffect(() => {
    if (stateName && country) {
      const matchedCountry = Country.getAllCountries().find(c => c.name === country);
      if (matchedCountry) {
        const matchedState = State.getStatesOfCountry(matchedCountry.isoCode).find(s => s.name === stateName);
        if (matchedState) {
          setCitiesList(City.getCitiesOfState(matchedCountry.isoCode, matchedState.isoCode));
        } else {
          setCitiesList([]);
        }
      } else {
        setCitiesList([]);
      }
    } else {
      setCitiesList([]);
    }
  }, [stateName, country]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setEmail(profile.email_address || '');
      setPhoneCode(profile.mobile_phone_country_code || profile.fixed_phone_country_code || '');
      setPhone(profile.mobile_phone_number || '');
      setFixedPhone(profile.fixed_phone_number || '');
      setCountry(profile.country || '');
      setStateName(profile.state || '');
      setCity(profile.city || '');
      setAddress(profile.address1 || '');
    }
  }, [profile]);

  const handleUpdate = async () => {
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        mobile_phone_country_code: phoneCode,
        mobile_phone_number: phone,
        fixed_phone_country_code: phoneCode,
        fixed_phone_number: fixedPhone,
        country: country,
        state: stateName,
        city: city,
        address1: address,
        address2: profile?.address2 || '',
        address3: profile?.address3 || '',
        test_mode: profile?.test_mode !== undefined ? (profile.test_mode === '1' || profile.test_mode === 1 ? 1 : 0) : 0
      });
      Alert.alert('Éxito', 'Los datos de la cuenta se han actualizado correctamente.', [
        { text: 'Aceptar', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudieron actualizar los datos de la cuenta.');
    }
  };

  if (isLoading && !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={activeColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.background }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 18, fontWeight: '700' }}>
            Perfil
          </Typography>
        </View>
        <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '900', letterSpacing: 1 }}>
          HASGREEN
        </Typography>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={styles.pageHeader}>
            <Typography variant="headline" style={{ fontSize: 32, fontWeight: '800', letterSpacing: -1 }}>Editar Cuenta</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ marginTop: Spacing[2], fontSize: 14 }}>
              Actualiza tu información personal y preferencias de contacto.
            </Typography>
          </View>

          <View style={styles.formContainer}>

            {/* Personal Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: activeColors.primary }]} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información Personal</Typography>
              </View>
              <View style={[styles.cardForm, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Nombre</Typography>
                    <TextField value={firstName} onChangeText={setFirstName} />
                  </View>
                  <View style={styles.col1}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Apellido</Typography>
                    <TextField value={lastName} onChangeText={setLastName} />
                  </View>
                </View>
              </View>
            </View>

            {/* Contact */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: activeColors.primary }]} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Contacto</Typography>
              </View>
              <View style={[styles.cardForm, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Email</Typography>
                  <View style={styles.inputWithIcon}>
                    <View style={styles.iconLeft}>
                      <MaterialIcons name="mail" size={20} color={activeColors.outline} />
                    </View>
                    <TextField value={email} onChangeText={setEmail} keyboardType="email-address" />
                  </View>
                </View>
                <View style={styles.grid3Col}>
                  <View style={styles.colThird}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Cód. País</Typography>
                    <TextField value={phoneCode} onChangeText={setPhoneCode} />
                  </View>
                  <View style={styles.colTwoThirds}>
                    <Typography variant="label" color="outline" style={styles.fieldLabel}>Celular</Typography>
                    <TextField value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Teléfono Fijo (Opcional)</Typography>
                  <TextField value={fixedPhone} onChangeText={setFixedPhone} keyboardType="phone-pad" />
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIndicator, { backgroundColor: activeColors.primary }]} />
                <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Ubicación</Typography>
              </View>
              <View style={[styles.cardForm, { backgroundColor: activeColors.surfaceContainerLowest }]}>
                <View style={styles.grid2Col}>
                  <View style={styles.col1}>
                    <Typography variant="label" style={styles.fieldLabel}>País</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => {
                        setSearchQuery('');
                        setCountryModal(true);
                      }}
                    >
                      <Typography variant="body" color={country ? 'onSurface' : 'onSurfaceVariant'}>
                        {country || 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                  <View style={styles.col1}>
                    <Typography variant="label" style={styles.fieldLabel}>Departamento/Estado</Typography>
                    <Pressable
                      style={[
                        styles.selectBox,
                        { backgroundColor: country ? activeColors.surfaceContainerLowest : activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 },
                        !country && { opacity: 0.5 }
                      ]}
                      onPress={() => {
                        if (country) {
                          setSearchQuery('');
                          setStateModal(true);
                        }
                      }}
                      disabled={!country}
                    >
                      <Typography variant="body" color={stateName ? 'onSurface' : 'onSurfaceVariant'}>
                        {stateName || 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" style={styles.fieldLabel}>Ciudad</Typography>
                  <Pressable
                    style={[
                      styles.selectBox,
                      { backgroundColor: stateName ? activeColors.surfaceContainerLowest : activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 },
                      !stateName && { opacity: 0.5 }
                    ]}
                    onPress={() => {
                      if (stateName) {
                        setSearchQuery('');
                        setCityModal(true);
                      }
                    }}
                    disabled={!stateName}
                  >
                    <Typography variant="body" color={city ? 'onSurface' : 'onSurfaceVariant'}>
                      {city || 'Seleccionar'}
                    </Typography>
                    <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                  </Pressable>
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" color="outline" style={styles.fieldLabel}>Dirección</Typography>
                  <View style={styles.inputWithIcon}>
                    <View style={styles.iconLeft}>
                      <MaterialIcons name="location-on" size={20} color={activeColors.outline} />
                    </View>
                    <TextField value={address} onChangeText={setAddress} />
                  </View>
                </View>
              </View>
            </View>

            {/* Alerts Toggle */}
            <View style={[styles.toggleCard, { backgroundColor: activeColors.surfaceContainerLow }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="headline" style={{ fontSize: 16, fontWeight: '700' }}>Información Adicional</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, marginTop: 4 }}>
                  Habilitar alertas extendidas y reportes avanzados
                </Typography>
              </View>
              <Switch
                value={alertsEnabled}
                onValueChange={setAlertsEnabled}
                trackColor={{ false: activeColors.outlineVariant, true: activeColors.primary }}
                thumbColor={Colors.light.surfaceContainerLowest}
              />
            </View>

            {/* Save Button */}
            <View style={styles.actionArea}>
              <Pressable
                style={({ pressed }) => [styles.updateBtn, pressed && { transform: [{ scale: 0.98 }] }]}
                onPress={handleUpdate}
                disabled={isSaving}
              >
                <View style={[styles.gradientBg, { backgroundColor: activeColors.primary }]}>
                  <Typography variant="headline" style={{ color: activeColors.onPrimary, fontWeight: '700', fontSize: 18 }}>
                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                  </Typography>
                </View>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL: País */}
      <Modal visible={countryModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Seleccionar País</Typography>
              <Pressable onPress={() => setCountryModal(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>
            
            <View style={[styles.searchBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="search" size={20} color={activeColors.outline} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, color: activeColors.onSurface }}
                placeholder="Buscar país..."
                placeholderTextColor={activeColors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={countriesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setCountry(item.name);
                    setStateName('');
                    setCity('');
                    setCountryModal(false);
                  }}
                >
                  <Typography variant="body">{item.flag}  {item.name}</Typography>
                </Pressable>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL: Estado / Depto */}
      <Modal visible={stateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Seleccionar Departamento</Typography>
              <Pressable onPress={() => setStateModal(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>

            <View style={[styles.searchBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="search" size={20} color={activeColors.outline} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, color: activeColors.onSurface }}
                placeholder="Buscar departamento..."
                placeholderTextColor={activeColors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={statesList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setStateName(item.name);
                    setCity('');
                    setStateModal(false);
                  }}
                >
                  <Typography variant="body">{item.name}</Typography>
                </Pressable>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL: Ciudad */}
      <Modal visible={cityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Seleccionar Ciudad</Typography>
              <Pressable onPress={() => setCityModal(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>

            <View style={[styles.searchBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="search" size={20} color={activeColors.outline} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, color: activeColors.onSurface }}
                placeholder="Buscar ciudad..."
                placeholderTextColor={activeColors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={citiesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setCity(item.name);
                    setCityModal(false);
                  }}
                >
                  <Typography variant="body">{item.name}</Typography>
                </Pressable>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
          </View>
        </View>
      </Modal>
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
  iconBtn: { padding: Spacing[2], borderRadius: Rounded.full },
  scrollContent: {
    padding: Spacing[4],
    paddingBottom: Spacing[12],
    maxWidth: 672,
    width: '100%',
    alignSelf: 'center',
  },
  pageHeader: { marginBottom: Spacing[8], paddingHorizontal: Spacing[2] },
  formContainer: { gap: Spacing[8] },
  section: { gap: Spacing[4] },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[2],
  },
  sectionIndicator: { width: 4, height: 24, borderRadius: 2 },
  cardForm: {
    padding: Spacing[6],
    borderRadius: Rounded.xl,
    borderWidth: 1,
    borderColor: 'rgba(171, 173, 174, 0.15)',
    elevation: 1,
    shadowColor: '#2c2f30',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    gap: Spacing[5],
  },
  fieldLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing[2] },
  fieldGroup: { width: '100%' },
  grid2Col: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[5] },
  grid3Col: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[5] },
  col1: { width: '100%', minWidth: '45%', flex: 1 },
  colThird: { width: '100%', minWidth: '30%', flex: 1 },
  colTwoThirds: { width: '100%', minWidth: '60%', flex: 2 },
  inputWithIcon: { position: 'relative' },
  iconLeft: { position: 'absolute', left: Spacing[4], top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing[6],
    borderRadius: Rounded.xl,
  },
  actionArea: { paddingTop: Spacing[4], paddingBottom: Spacing[8] },
  updateBtn: {
    width: '100%',
    borderRadius: Rounded.xl,
    elevation: 8,
    shadowColor: '#086b00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  gradientBg: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: Rounded.lg,
    borderWidth: 1,
    height: 56,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Rounded.xl,
    borderTopRightRadius: Rounded.xl,
    height: '70%',
    padding: Spacing[6],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  modalItem: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing[3],
    height: 48,
    marginBottom: Spacing[4],
  },
});
