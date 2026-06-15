import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, Modal, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Spacing, Colors, Rounded } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { Country, State, City } from 'country-state-city';

// Extraer códigos telefónicos oficiales de la librería country-state-city
// Mapeamos los países a objetos con nombre, código telefónico (phonecode) y bandera (flag)
const ALL_COUNTRIES_CODES = Country.getAllCountries().map(c => ({
  name: c.name,
  code: c.phonecode.startsWith('+') ? c.phonecode : `+${c.phonecode}`,
  flag: c.flag || '🏳️',
  isoCode: c.isoCode
})).filter(c => c.code && c.code !== '+');

export function SignupScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { signup, isLoading } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identification, setIdentification] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  // Estados del Formulario de Localización
  const [selectedCountryCode, setSelectedCountryCode] = useState({ name: 'Colombia', code: '+57', flag: '🇨🇴', isoCode: 'CO' });
  const [selectedCountry, setSelectedCountry] = useState<{ isoCode: string, name: string } | null>(null);
  const [selectedState, setSelectedState] = useState<{ isoCode: string, name: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Listados oficiales
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // Búsquedas dentro de modales
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPhoneQuery, setSearchPhoneQuery] = useState('');

  // Modales
  const [countryCodeModal, setCountryCodeModal] = useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);

  // Cargar lista de países al iniciar
  useEffect(() => {
    setCountriesList(Country.getAllCountries());
    
    // Auto-seleccionar por defecto Colombia si existe en la lista mapeada
    const defaultCO = ALL_COUNTRIES_CODES.find(c => c.isoCode === 'CO');
    if (defaultCO) {
      setSelectedCountryCode(defaultCO);
    }
  }, []);

  // Cargar estados cuando cambie el país
  useEffect(() => {
    if (selectedCountry) {
      setStatesList(State.getStatesOfCountry(selectedCountry.isoCode));
      // Auto-select the corresponding phone country code
      const matchingCode = ALL_COUNTRIES_CODES.find(c => c.isoCode === selectedCountry.isoCode);
      if (matchingCode) {
        setSelectedCountryCode(matchingCode);
      }
    } else {
      setStatesList([]);
    }
    setSelectedState(null);
    setSelectedCity('');
  }, [selectedCountry]);

  // Cargar ciudades cuando cambie el estado
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setCitiesList(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    } else {
      setCitiesList([]);
    }
    setSelectedCity('');
  }, [selectedState]);

  const SectionHeader = ({ icon, title }: { icon: keyof typeof MaterialIcons.glyphMap, title: string }) => (
    <View style={styles.sectionHeader}>
      <MaterialIcons name={icon} size={24} color={activeColors.primary} style={{ marginRight: Spacing[3] }} />
      <Typography variant="headline">{title}</Typography>
    </View>
  );

  // Filtros de búsqueda para modales
  const filteredCountries = countriesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStates = statesList.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCities = citiesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPhoneCodes = ALL_COUNTRIES_CODES.filter(c => 
    c.name.toLowerCase().includes(searchPhoneQuery.toLowerCase()) || 
    c.code.includes(searchPhoneQuery)
  );

  const handleSignup = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !identification.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !phone.trim() ||
      !selectedCountry ||
      !selectedState ||
      !selectedCity ||
      !address.trim()
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    signup({
      firstName,
      lastName,
      identification,
      email,
      password,
      phoneCode: selectedCountryCode.code,
      phone,
      country: selectedCountry.name,
      state: selectedState.name,
      city: selectedCity,
      address,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeColors.background }]} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surfaceContainerLow }]}>
        <View style={styles.topBarLeft}>
          <Pressable onPress={() => router.back()} style={{ padding: 4 }} disabled={isLoading}>
            <MaterialIcons name="grid-view" size={24} color={activeColors.primary} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, marginLeft: Spacing[4], fontSize: 18 }}>
            HASGREEN
          </Typography>
        </View>
        <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHighest, borderColor: activeColors.primaryContainer }]}>
          <MaterialIcons name="person" size={24} color={activeColors.outline} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerArea}>
          <Typography variant="display" style={{ fontSize: 36, letterSpacing: -1 }}>Crear Cuenta</Typography>
          <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 18, marginTop: Spacing[2] }}>
            Comienza tu viaje en el ecosistema digital de monitoreo.
          </Typography>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, { backgroundColor: activeColors.primary, flex: 1 }]} />
          <View style={[styles.stepDot, { backgroundColor: activeColors.primary, opacity: 0.3, flex: 1 }]} />
          <View style={[styles.stepDot, { backgroundColor: activeColors.primary, opacity: 0.1, flex: 1 }]} />
        </View>

        {/* Section 1: Información Personal */}
        <Card elevation="md" layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
          <SectionHeader icon="person" title="Información Personal" />
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: Spacing[2] }}>
              <TextField 
                label="Nombre *" 
                placeholder="Ej: Juan" 
                value={firstName}
                onChangeText={setFirstName}
                editable={!isLoading} 
              />
            </View>
            <View style={{ flex: 1, paddingLeft: Spacing[2] }}>
              <TextField 
                label="Apellido *" 
                placeholder="Ej: Pérez" 
                value={lastName}
                onChangeText={setLastName}
                editable={!isLoading} 
              />
            </View>
          </View>
          <TextField 
            label="Identificación *" 
            placeholder="Número de documento" 
            value={identification}
            onChangeText={setIdentification}
            editable={!isLoading} 
          />
        </Card>

        {/* Section 2: Acceso */}
        <Card elevation="md" layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
          <SectionHeader icon="lock" title="Acceso" />
          <TextField 
            label="Email *" 
            placeholder="usuario@ejemplo.com" 
            leftIcon="mail" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={email}
            onChangeText={setEmail}
            editable={!isLoading} 
          />
          <View style={styles.row}>
            <View style={{ flex: 1, paddingRight: Spacing[2] }}>
              <TextField 
                label="Password *" 
                placeholder="••••••••" 
                secureTextEntry={secureText}
                rightIcon={secureText ? 'visibility-off' : 'visibility'}
                onRightIconPress={() => setSecureText(!secureText)}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: Spacing[2] }}>
              <TextField 
                label="Confirm Password *" 
                placeholder="••••••••" 
                secureTextEntry={secureText} 
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPassword && password !== confirmPassword ? "Las contraseñas no coinciden" : undefined}
                editable={!isLoading} 
              />
            </View>
          </View>
        </Card>

        {/* Section 3: Contacto y Ubicación */}
        <Card elevation="md" layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
          <SectionHeader icon="location-on" title="Contacto/Ubicación" />
          
          {/* Teléfono Celular con Selector de Código de País */}
          <Typography variant="label" style={styles.fieldLabel}>Celular</Typography>
          <View style={{ flexDirection: 'row', gap: Spacing[2], marginBottom: Spacing[4] }}>
            <Pressable
              style={[styles.selectBox, { width: 95, backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
              onPress={() => {
                setSearchPhoneQuery('');
                setCountryCodeModal(true);
              }}
              disabled={isLoading}
            >
              <Typography variant="body">{selectedCountryCode.flag} {selectedCountryCode.code}</Typography>
            </Pressable>
            <View style={{ flex: 1 }}>
              <TextField
                placeholder="300 000 0000"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* País (Selector) */}
          <Typography variant="label" style={styles.fieldLabel}>País</Typography>
          <Pressable
            style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1, marginBottom: Spacing[4] }]}
            onPress={() => {
              setSearchQuery('');
              setCountryModal(true);
            }}
            disabled={isLoading}
          >
            <Typography variant="body" color={selectedCountry ? 'onSurface' : 'onSurfaceVariant'}>
              {selectedCountry ? selectedCountry.name : 'Seleccionar País'}
            </Typography>
            <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
          </Pressable>

          {/* Departamento (Selector, bloqueado si no hay país) */}
          <Typography variant="label" style={[styles.fieldLabel, !selectedCountry && { opacity: 0.5 }]}>Departamento</Typography>
          <Pressable
            style={[
              styles.selectBox,
              { backgroundColor: selectedCountry ? activeColors.surfaceContainerLow : activeColors.surfaceContainerHigh, borderColor: activeColors.outlineVariant, borderWidth: 1, marginBottom: Spacing[4] },
              !selectedCountry && { opacity: 0.5 }
            ]}
            onPress={() => {
              if (selectedCountry) {
                setSearchQuery('');
                setStateModal(true);
              }
            }}
            disabled={isLoading || !selectedCountry}
          >
            <Typography variant="body" color={selectedState ? 'onSurface' : 'onSurfaceVariant'}>
              {selectedState ? selectedState.name : 'Seleccionar Departamento'}
            </Typography>
            <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
          </Pressable>

          {/* Ciudad (Selector, bloqueado si no hay departamento) */}
          <Typography variant="label" style={[styles.fieldLabel, !selectedState && { opacity: 0.5 }]}>Ciudad</Typography>
          <Pressable
            style={[
              styles.selectBox,
              { backgroundColor: selectedState ? activeColors.surfaceContainerLow : activeColors.surfaceContainerHigh, borderColor: activeColors.outlineVariant, borderWidth: 1, marginBottom: Spacing[4] },
              !selectedState && { opacity: 0.5 }
            ]}
            onPress={() => {
              if (selectedState) {
                setSearchQuery('');
                setCityModal(true);
              }
            }}
            disabled={isLoading || !selectedState}
          >
            <Typography variant="body" color={selectedCity ? 'onSurface' : 'onSurfaceVariant'}>
              {selectedCity || 'Seleccionar Ciudad'}
            </Typography>
            <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
          </Pressable>

          <TextField
            label="Dirección"
            placeholder="Calle, Carrera, Edificio..."
            leftIcon="map"
            value={address}
            onChangeText={setAddress}
            editable={!isLoading}
          />
        </Card>

        {/* Submit Section */}
        <View style={styles.submitSection}>
          <Typography variant="body" color="onSurfaceVariant" style={{ textAlign: 'center', marginBottom: Spacing[6], fontSize: 14 }}>
            Al hacer clic en Registrar, aceptas nuestros <Typography variant="body" style={{ color: activeColors.primary, fontWeight: '700' }}>Términos y Condiciones</Typography> y la <Typography variant="body" style={{ color: activeColors.primary, fontWeight: '700' }}>Política de Privacidad</Typography>.
          </Typography>

          <Button 
            label={isLoading ? "Registrando..." : "Registrar"}
            variant="primary" 
            rightIcon="arrow-forward"
            onPress={handleSignup}
            style={{ width: '100%', paddingVertical: 16, marginBottom: Spacing[6] }}
            disabled={isLoading}
          />

          <Pressable onPress={() => router.back()} disabled={isLoading}>
            <Typography variant="body" style={{ color: activeColors.onSurfaceVariant, fontWeight: '500' }}>
              ¿Ya tienes una cuenta? <Typography variant="body" style={{ color: activeColors.primary, fontWeight: '700' }}>Inicia sesión</Typography>
            </Typography>
          </Pressable>
        </View>

      </ScrollView>

      {/* MODAL: Códigos de País */}
      <Modal visible={countryCodeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Código de País</Typography>
              <Pressable onPress={() => setCountryCodeModal(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>

            <View style={[styles.searchBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant }]}>
              <MaterialIcons name="search" size={20} color={activeColors.outline} style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, color: activeColors.onSurface }}
                placeholder="Buscar por país o código (ej: +57)..."
                placeholderTextColor={activeColors.outline}
                value={searchPhoneQuery}
                onChangeText={setSearchPhoneQuery}
              />
            </View>

            <FlatList
              data={filteredPhoneCodes}
              keyExtractor={(item, index) => `${item.code}-${item.isoCode}-${index}`}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setSelectedCountryCode(item);
                    const matchingCountry = countriesList.find(c => c.isoCode === item.isoCode);
                    if (matchingCountry) {
                      setSelectedCountry({ isoCode: matchingCountry.isoCode, name: matchingCountry.name });
                    }
                    setCountryCodeModal(false);
                  }}
                >
                  <Typography variant="body">{item.flag}  {item.name} ({item.code})</Typography>
                </Pressable>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
          </View>
        </View>
      </Modal>

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
              data={filteredCountries}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setSelectedCountry({ isoCode: item.isoCode, name: item.name });
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

      {/* MODAL: Departamento */}
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
              data={filteredStates}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setSelectedState({ isoCode: item.isoCode, name: item.name });
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
              data={filteredCities}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setSelectedCity(item.name);
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[4],
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[12],
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  headerArea: {
    marginBottom: Spacing[8],
    marginTop: Spacing[4],
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: Spacing[4],
    marginBottom: Spacing[10],
  },
  stepDot: {
    height: 6,
    borderRadius: 3,
  },
  sectionCard: {
    marginBottom: Spacing[8],
    padding: Spacing[8],
    borderRadius: Rounded.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[8],
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing[2],
  },
  submitSection: {
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: Spacing[4],
    borderRadius: Rounded.md,
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: Spacing[2],
    paddingHorizontal: Spacing[1],
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
