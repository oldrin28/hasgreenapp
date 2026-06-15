import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Image, ActivityIndicator, TextInput, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded, Fonts } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { usePatients } from '../hooks/usePatients';
import { Country, State, City } from 'country-state-city';
import DateTimePicker from '@react-native-community/datetimepicker';

const ALL_COUNTRIES_CODES = Country.getAllCountries().map(c => ({
  name: c.name,
  code: c.phonecode.startsWith('+') ? c.phonecode : `+${c.phonecode}`,
  flag: c.flag || '🏳️',
  isoCode: c.isoCode
})).filter(c => c.code && c.code !== '+');

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' }
];

export function CreatePatientScreen() {
  const router = useRouter();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { createPatient, isLoading } = usePatients();

  // Estados locales para los campos del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientIdStr, setPatientIdStr] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [emailAddress, setEmailAddress] = useState('');
  const [mobilePhoneCountryCode, setMobilePhoneCountryCode] = useState('+57');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [fixedPhoneNumber, setFixedPhoneNumber] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [alergies, setAlergies] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Listados oficiales
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // Búsquedas dentro de modales
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPhoneQuery, setSearchPhoneQuery] = useState('');

  // Visibilidad de modales
  const [countryCodeModal, setCountryCodeModal] = useState(false);
  const [countryModal, setCountryModal] = useState(false);
  const [stateModal, setStateModal] = useState(false);
  const [cityModal, setCityModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [bloodTypeModal, setBloodTypeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Inicializar países
  useEffect(() => {
    setCountriesList(Country.getAllCountries());
    
    // Auto-seleccionar por defecto Colombia si existe
    const defaultCO = ALL_COUNTRIES_CODES.find(c => c.isoCode === 'CO');
    if (defaultCO) {
      setMobilePhoneCountryCode(defaultCO.code);
    }
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
    setState('');
    setCity('');
  }, [country]);

  // Cargar ciudades cuando cambie el estado
  useEffect(() => {
    if (state && country) {
      const matchedCountry = Country.getAllCountries().find(c => c.name === country);
      if (matchedCountry) {
        const matchedState = State.getStatesOfCountry(matchedCountry.isoCode).find(s => s.name === state);
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
    setCity('');
  }, [state, country]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setBirthDate(`${year}-${month}-${day}`);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Seleccionar Fecha';
    const onlyDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parts = onlyDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleCreate = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !patientIdStr.trim() ||
      !gender.trim() ||
      !birthDate.trim() ||
      !bloodType.trim() ||
      !emailAddress.trim() ||
      !mobilePhoneCountryCode.trim() ||
      !mobilePhoneNumber.trim() ||
      !country.trim() ||
      !state.trim() ||
      !city.trim() ||
      !address1.trim()
    ) {
      Alert.alert("Campos obligatorios", "Por favor, completa todos los campos marcados como obligatorios (*).");
      return;
    }

    createPatient({
      first_name: firstName,
      last_name: lastName,
      patient_id: patientIdStr,
      gender,
      birth_date: birthDate,
      blood_type: bloodType,
      email_address: emailAddress,
      mobile_phone_country_code: mobilePhoneCountryCode,
      mobile_phone_number: mobilePhoneNumber,
      fixed_phone_country_code: mobilePhoneCountryCode,
      fixed_phone_number: fixedPhoneNumber,
      country,
      state,
      city,
      address1,
      address2: address2 || '',
      address3: '',
      prescriptions,
      alergies,
      additional_info: additionalInfo
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.surface }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} disabled={isLoading}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.onSurface} />
          </Pressable>
          <Typography variant="headline" style={{ color: activeColors.primary, fontSize: 20, fontWeight: '800', letterSpacing: 1 }}>
            HASGREEN
          </Typography>
        </View>
        <Pressable>
          <MaterialIcons name="notifications" size={24} color={activeColors.onSurfaceVariant} />
        </Pressable>
      </View>
      <View style={{ height: 1, backgroundColor: activeColors.surfaceContainerLow }} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Header */}
          <View style={styles.heroHeader}>
            <Typography variant="display" style={{ fontSize: 28, marginBottom: Spacing[2] }}>Crear Nuevo Paciente</Typography>
            <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, lineHeight: 20 }}>
              Complete la información requerida para registrar un nuevo paciente en el sistema. Asegúrese de que los datos de contacto sean correctos.
            </Typography>
          </View>

          <View style={styles.formLayout}>
            
            {/* Left Column: Primary Data */}
            <View style={styles.leftColumn}>
              
              {/* Section 1: Personal Information */}
              <Card layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconBox, { backgroundColor: activeColors.primaryContainer, opacity: 0.8 }]}>
                    <MaterialIcons name="person" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 20 }}>Información Personal</Typography>
                </View>

                <View style={styles.grid2Col}>
                  <View style={styles.fieldGroup}>
                    <TextField label="Nombre *" placeholder="Ej. Juan Andrés" value={firstName} onChangeText={setFirstName} editable={!isLoading} />
                  </View>
                  <View style={styles.fieldGroup}>
                    <TextField label="Apellidos *" placeholder="Ej. Pérez García" value={lastName} onChangeText={setLastName} editable={!isLoading} />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <TextField label="Cédula / ID *" placeholder="Número de documento" value={patientIdStr} onChangeText={setPatientIdStr} editable={!isLoading} />
                </View>

                <View style={styles.grid2Col}>
                  <View style={styles.fieldGroup}>
                    <Typography variant="label" style={styles.fieldLabel}>Género *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => setGenderModal(true)}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={gender ? 'onSurface' : 'onSurfaceVariant'}>
                        {gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                  <View style={styles.fieldGroup}>
                    <Typography variant="label" style={styles.fieldLabel}>Tipo de Sangre *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => setBloodTypeModal(true)}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={bloodType ? 'onSurface' : 'onSurfaceVariant'}>
                        {bloodType || 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Typography variant="label" style={styles.fieldLabel}>Fecha de Nacimiento *</Typography>
                  <Pressable
                    style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                    onPress={() => setShowDatePicker(true)}
                    disabled={isLoading}
                  >
                    <Typography variant="body" color={birthDate ? 'onSurface' : 'onSurfaceVariant'}>
                      {formatDateDisplay(birthDate)}
                    </Typography>
                    <MaterialIcons name="calendar-today" size={20} color={activeColors.onSurfaceVariant} />
                  </Pressable>
                </View>
              </Card>

              {/* Section 2: Contact & Emergency */}
              <Card layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconBox, { backgroundColor: activeColors.primaryContainer, opacity: 0.8 }]}>
                    <MaterialIcons name="phone" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 20 }}>Contacto y Emergencia</Typography>
                </View>

                <View style={styles.fieldGroup}>
                  <TextField label="Correo Electrónico *" placeholder="paciente@ejemplo.com" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} editable={!isLoading} />
                </View>

                <View style={{ flexDirection: 'row', gap: Spacing[4], marginBottom: Spacing[6] }}>
                  <View style={{ width: 95 }}>
                    <Typography variant="label" style={styles.fieldLabel}>Cod. *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => {
                        setSearchPhoneQuery('');
                        setCountryCodeModal(true);
                      }}
                      disabled={isLoading}
                    >
                      <Typography variant="body">{mobilePhoneCountryCode || '+57'}</Typography>
                    </Pressable>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextField label="Móvil *" placeholder="300 000 0000" keyboardType="phone-pad" value={mobilePhoneNumber} onChangeText={setMobilePhoneNumber} editable={!isLoading} />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <TextField label="Teléfono Fijo" placeholder="(601) 000 0000" keyboardType="phone-pad" value={fixedPhoneNumber} onChangeText={setFixedPhoneNumber} editable={!isLoading} />
                </View>
              </Card>

              {/* Section 3: Location */}
              <Card layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.primary }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconBox, { backgroundColor: activeColors.primaryContainer, opacity: 0.8 }]}>
                    <MaterialIcons name="location-on" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 20 }}>Ubicación</Typography>
                </View>

                <View style={styles.grid3Col}>
                  <View style={styles.fieldGroup}>
                    <Typography variant="label" style={styles.fieldLabel}>País *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => {
                        setSearchQuery('');
                        setCountryModal(true);
                      }}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={country ? 'onSurface' : 'onSurfaceVariant'}>
                        {country || 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                  <View style={styles.fieldGroup}>
                    <Typography variant="label" style={[styles.fieldLabel, !country && { opacity: 0.5 }]}>Departamento *</Typography>
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
                      disabled={isLoading || !country}
                    >
                      <Typography variant="body" color={state ? 'onSurface' : 'onSurfaceVariant'}>
                        {state || 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                  <View style={styles.fieldGroup}>
                    <Typography variant="label" style={[styles.fieldLabel, !state && { opacity: 0.5 }]}>Ciudad *</Typography>
                    <Pressable
                      style={[
                        styles.selectBox,
                        { backgroundColor: state ? activeColors.surfaceContainerLowest : activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 },
                        !state && { opacity: 0.5 }
                      ]}
                      onPress={() => {
                        if (state) {
                          setSearchQuery('');
                          setCityModal(true);
                        }
                      }}
                      disabled={isLoading || !state}
                    >
                      <Typography variant="body" color={city ? 'onSurface' : 'onSurfaceVariant'}>
                        {city || 'Seleccionar'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={20} color={activeColors.onSurfaceVariant} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.grid2Col}>
                  <View style={styles.fieldGroup}>
                    <TextField label="Dirección Principal *" placeholder="Calle, Carrera, Transversal..." value={address1} onChangeText={setAddress1} editable={!isLoading} />
                  </View>
                  <View style={styles.fieldGroup}>
                    <TextField label="Dirección Adicional (Opcional)" placeholder="Apto, Bloque, Oficina..." value={address2} onChangeText={setAddress2} editable={!isLoading} />
                  </View>
                </View>
              </Card>

            </View>

            {/* Right Column: Medical Info & Actions */}
            <View style={styles.rightColumn}>
              
              {/* Medical Information */}
              <Card layer="lowest" style={[styles.sectionCard, { borderLeftWidth: 4, borderLeftColor: activeColors.error }]}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.iconBox, { backgroundColor: activeColors.error, opacity: 0.1 }]}>
                    <MaterialIcons name="medical-services" size={20} color={activeColors.error} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 20 }}>Resumen Médico</Typography>
                </View>

                <View style={styles.fieldGroup}>
                  <Typography variant="label" style={styles.fieldLabel}>Medicamentos Actuales</Typography>
                  <TextInput 
                    style={[styles.textArea, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, color: activeColors.onSurface }]} 
                    placeholder="Liste los medicamentos..." 
                    placeholderTextColor={activeColors.outline}
                    value={prescriptions}
                    onChangeText={setPrescriptions}
                    multiline 
                    numberOfLines={3}
                    editable={!isLoading}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" style={styles.fieldLabel}>Alergias Conocidas</Typography>
                  <TextInput 
                    style={[styles.textArea, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, color: activeColors.onSurface }]} 
                    placeholder="Liste las alergias..." 
                    placeholderTextColor={activeColors.outline}
                    value={alergies}
                    onChangeText={setAlergies}
                    multiline 
                    numberOfLines={3} 
                    editable={!isLoading}
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <Typography variant="label" style={styles.fieldLabel}>Información Adicional</Typography>
                  <TextInput 
                    style={[styles.textArea, { backgroundColor: activeColors.surfaceContainerLowest, borderColor: activeColors.outlineVariant, color: activeColors.onSurface }]} 
                    placeholder="Condiciones previas, notas..." 
                    placeholderTextColor={activeColors.outline}
                    value={additionalInfo}
                    onChangeText={setAdditionalInfo}
                    multiline 
                    numberOfLines={3} 
                    editable={!isLoading}
                  />
                </View>
              </Card>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                <Button 
                  variant="primary" 
                  label={isLoading ? "Registrando..." : "Registrar Paciente"} 
                  leftIcon="how-to-reg"
                  onPress={handleCreate}
                  disabled={isLoading}
                />

                <Button 
                  variant="secondary" 
                  label="Cancelar"
                  onPress={() => router.back()}
                  disabled={isLoading}
                />

                <View style={[styles.infoBox, { backgroundColor: activeColors.primaryContainer, borderColor: activeColors.primaryContainer }]}>
                  <MaterialIcons name="info" size={20} color={activeColors.primary} style={{ marginTop: 2 }} />
                  <Typography variant="body" style={{ color: activeColors.onPrimaryContainer, fontSize: 14, fontWeight: '500', marginLeft: Spacing[3], flex: 1 }}>
                    Todos los campos marcados como obligatorios (*) deben ser completados para registrar al paciente.
                  </Typography>
                </View>
              </View>

            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

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
                placeholder="Buscar por país o código..."
                placeholderTextColor={activeColors.outline}
                value={searchPhoneQuery}
                onChangeText={setSearchPhoneQuery}
              />
            </View>

            <FlatList
              data={ALL_COUNTRIES_CODES.filter(c => 
                c.name.toLowerCase().includes(searchPhoneQuery.toLowerCase()) || 
                c.code.includes(searchPhoneQuery)
              )}
              keyExtractor={(item, index) => `${item.code}-${item.isoCode}-${index}`}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setMobilePhoneCountryCode(item.code);
                    const matched = countriesList.find(c => c.isoCode === item.isoCode);
                    if (matched) {
                      setCountry(matched.name);
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
              data={countriesList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              keyExtractor={(item) => item.isoCode}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setCountry(item.name);
                    const matchingCode = ALL_COUNTRIES_CODES.find(c => c.isoCode === item.isoCode);
                    if (matchingCode) {
                      setMobilePhoneCountryCode(matchingCode.code);
                    }
                    setState('');
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
                    setState(item.name);
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

      {/* MODAL: Género */}
      <Modal visible={genderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest, height: '40%' }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Seleccionar Género</Typography>
              <Pressable onPress={() => setGenderModal(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>

            <FlatList
              data={GENDERS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setGender(item.value);
                    setGenderModal(false);
                  }}
                >
                  <Typography variant="body">{item.label}</Typography>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* MODAL: Tipo de Sangre */}
      <Modal visible={bloodTypeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: activeColors.surfaceContainerLowest, height: '60%' }]}>
            <View style={styles.modalHeader}>
              <Typography variant="headline">Tipo de Sangre</Typography>
              <Pressable onPress={() => setBloodTypeModal(false)}>
                <MaterialIcons name="close" size={24} color={activeColors.outline} />
              </Pressable>
            </View>

            <FlatList
              data={BLOOD_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.modalItem, pressed && { backgroundColor: activeColors.surfaceContainerLow }]}
                  onPress={() => {
                    setBloodType(item);
                    setBloodTypeModal(false);
                  }}
                >
                  <Typography variant="body">{item}</Typography>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* DATE PICKER */}
      {showDatePicker && (
        <DateTimePicker
          value={birthDate ? new Date(birthDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date(1900, 0, 1)}
          maximumDate={new Date()}
          onChange={onChangeDate}
        />
      )}
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
    paddingVertical: Spacing[4],
  },
  iconBtn: {
    padding: Spacing[2],
    borderRadius: Rounded.full,
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: 60,
    maxWidth: 1280, 
    alignSelf: 'center',
    width: '100%',
  },
  heroHeader: {
    marginBottom: Spacing[10],
  },
  formLayout: {
    flexDirection: 'column', 
    gap: Spacing[8],
  },
  leftColumn: {
    flex: 2, 
    gap: Spacing[8],
  },
  rightColumn: {
    flex: 1, 
    gap: Spacing[8],
  },
  sectionCard: {
    padding: Spacing[8],
    borderRadius: Rounded.xl,
    marginBottom: Spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[8],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid2Col: {
    flexDirection: 'column', 
    gap: Spacing[6],
  },
  grid3Col: {
    flexDirection: 'column', 
    gap: Spacing[6],
    marginBottom: Spacing[6],
  },
  fieldGroup: {
    marginBottom: Spacing[6],
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#595c5d', 
    marginBottom: Spacing[2],
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: Rounded.lg,
    borderWidth: 1,
    height: 56,
  },
  textArea: {
    padding: Spacing[4],
    borderRadius: Rounded.lg,
    borderWidth: 1,
    fontFamily: Fonts.body,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  actionsContainer: {
    gap: Spacing[4],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing[6],
    borderRadius: Rounded.xl,
    borderWidth: 1,
    opacity: 0.9,
    marginTop: Spacing[4],
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
