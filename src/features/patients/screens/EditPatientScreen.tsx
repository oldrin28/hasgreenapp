import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, useColorScheme, Pressable, KeyboardAvoidingView, Platform, Image, ActivityIndicator, TextInput, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Spacing, Colors, Rounded } from '@/constants/theme';
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

export function EditPatientScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const { loadPatient, updatePatient, deletePatient, patient, isLoading } = usePatients();

  // Estados locales para los campos del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patientIdStr, setPatientIdStr] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [mobilePhoneCountryCode, setMobilePhoneCountryCode] = useState('');
  const [mobilePhoneNumber, setMobilePhoneNumber] = useState('');
  const [fixedPhoneNumber, setFixedPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
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
  }, [state, country]);

  // Cargar datos del backend
  useEffect(() => {
    if (id) {
      loadPatient(id).then((data) => {
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setPatientIdStr(data.patient_id || '');
          setGender(data.gender || '');
          
          let formattedBirthDate = data.birth_date || '';
          if (formattedBirthDate) {
            const d = new Date(formattedBirthDate);
            if (!isNaN(d.getTime())) {
              const day = String(d.getUTCDate()).padStart(2, '0');
              const month = String(d.getUTCMonth() + 1).padStart(2, '0');
              const year = d.getUTCFullYear();
              formattedBirthDate = `${day}/${month}/${year}`;
            }
          }
          setBirthDate(formattedBirthDate);

          setBloodType(data.blood_type || '');
          setEmailAddress(data.email_address || '');
          setMobilePhoneCountryCode(data.mobile_phone_country_code || '');
          setMobilePhoneNumber(data.mobile_phone_number || '');
          setFixedPhoneNumber(data.fixed_phone_number || '');
          setCountry(data.country || '');
          setState(data.state || '');
          setCity(data.city || '');
          setAddress1(data.address1 || '');
          setAddress2(data.address2 || '');
          setPrescriptions(data.prescriptions || '');
          setAlergies(data.alergies || '');
          setAdditionalInfo(data.additional_info || '');
        }
      });
    }
  }, [id]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setBirthDate(`${day}/${month}/${year}`);
    }
  };

  const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    return new Date(dateStr);
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Seleccionar Fecha';
    return dateStr;
  };

  const handleSave = () => {
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
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    let apiBirthDate = birthDate;
    if (birthDate && birthDate.includes('/')) {
      const parts = birthDate.split('/');
      if (parts.length === 3) {
        apiBirthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    updatePatient(id || '1', {
      first_name: firstName,
      last_name: lastName,
      patient_id: patientIdStr,
      gender,
      birth_date: apiBirthDate,
      blood_type: bloodType,
      email_address: emailAddress,
      mobile_phone_country_code: mobilePhoneCountryCode,
      mobile_phone_number: mobilePhoneNumber,
      fixed_phone_country_code: patient?.fixed_phone_country_code || mobilePhoneCountryCode,
      fixed_phone_number: fixedPhoneNumber,
      country,
      state,
      city,
      address1,
      address2: address2 || patient?.address2 || '',
      address3: patient?.address3 || '',
      prescriptions,
      alergies,
      additional_info: additionalInfo
    });
  };

  if (isLoading && !firstName) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: activeColors.background }]}>
        <ActivityIndicator size="large" color={activeColors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: activeColors.background }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing[4] }}>
          <Pressable onPress={() => router.back()} style={({pressed}) => [styles.iconBtn, pressed && { backgroundColor: activeColors.surfaceContainerLow }]} disabled={isLoading}>
            <MaterialIcons name="arrow-back" size={24} color={activeColors.onSurface} />
          </Pressable>
          <Typography variant="headline" style={{ fontSize: 20, fontWeight: '700' }}>
            Editar Paciente
          </Typography>
        </View>
        <Pressable 
          style={({pressed}) => [styles.deleteBtn, pressed && { backgroundColor: 'rgba(249, 86, 48, 0.1)' }]} 
          onPress={() => {
            Alert.alert(
              "Confirmar eliminación",
              "¿Está seguro de que desea eliminar este paciente? Esta acción no se puede deshacer.",
              [
                { text: "Cancelar", style: "cancel" },
                { 
                  text: "Eliminar", 
                  style: "destructive", 
                  onPress: () => deletePatient(id || '1') 
                }
              ]
            );
          }}
          disabled={isLoading}
        >
          <MaterialIcons name="delete" size={20} color={activeColors.error} />
          <Typography variant="label" style={{ color: activeColors.error, fontWeight: '600' }} className="hidden md:flex">
            Eliminar Paciente
          </Typography>
        </Pressable>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.mainGrid}>
            
            {/* Profile Summary (Left Sidebar) */}
            <View style={styles.sidebar}>
              <Card layer="lowest" style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatarBox, { backgroundColor: activeColors.surfaceContainerHigh }]}>
                    <Image 
                      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7HPwz1vFaWNh_OenBHJBJh3uPtdGu79xIm2eAYnQWcrgXsVCK57KeVsxZToXp6aP07kdMLyT2RKQDSs5knUlEDccBUNrjsRP5JI5MO8uQMDxRoubW_cvz2ikIKnh2TPhI8FXkfj79q7WTmI_MhTgLm7TVmdR7m0VfydPZBaivqXFunmr3b1ABKSFIScCgxSGynciMHtoySSHM508oK1WCkBfVRGuyn7_W1eCQyFFAV0EC--pJrmV9uERXwHfH4KxAu228NxoRjNYF' }}
                      style={styles.avatarImage}
                    />
                  </View>
                  <Pressable style={[styles.cameraBtn, { backgroundColor: activeColors.primary }]} disabled={isLoading}>
                    <MaterialIcons name="photo-camera" size={16} color={activeColors.onPrimary} />
                  </Pressable>
                </View>
                
                <Typography variant="headline" style={{ fontSize: 20, fontWeight: '700', marginBottom: 2 }}>{firstName || 'Elena'} {lastName || 'Rodriguez'}</Typography>
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14, fontWeight: '500' }}>Paciente ID: #{patientIdStr || id || 'N/A'}</Typography>
                
                <View style={styles.tagsContainer}>
                  <View style={[styles.tag, { backgroundColor: activeColors.secondaryContainer }]}>
                    <Typography variant="label" style={{ color: activeColors.onSecondaryContainer, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>Activo</Typography>
                  </View>
                  <View style={[styles.tag, { backgroundColor: activeColors.surfaceContainerHigh }]}>
                    <Typography variant="label" color="onSurfaceVariant" style={{ fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>Tipo {bloodType || 'A+'}</Typography>
                  </View>
                </View>
              </Card>

              <View style={[styles.statusBox, { backgroundColor: 'rgba(8, 107, 0, 0.05)', borderColor: 'rgba(171, 173, 174, 0.15)' }]}>
                <Typography variant="label" style={{ color: activeColors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: Spacing[3] }}>
                  Estado Vital
                </Typography>
                
                <View style={{ gap: Spacing[4] }}>
                  <View style={styles.statusRow}>
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>Última Visita</Typography>
                    <Typography variant="headline" style={{ fontSize: 14, fontWeight: '600' }}>12 Oct 2023</Typography>
                  </View>
                  <View style={styles.statusRow}>
                    <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 14 }}>Dispositivos</Typography>
                    <Typography variant="headline" style={{ fontSize: 14, fontWeight: '600' }}>3 Vinculados</Typography>
                  </View>
                </View>
              </View>
            </View>

            {/* Form Sections (Right Content) */}
            <View style={styles.formContent}>
              
              {/* Información Personal */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(104, 254, 79, 0.3)' }]}>
                    <MaterialIcons name="person" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información Personal</Typography>
                </View>
                
                <View style={styles.grid2Col}>
                  <View style={styles.col1}>
                    <TextField label="Nombre *" value={firstName} onChangeText={setFirstName} editable={!isLoading} />
                  </View>
                  <View style={styles.col1}>
                    <TextField label="Apellidos *" value={lastName} onChangeText={setLastName} editable={!isLoading} />
                  </View>
                  <View style={styles.col1}>
                    <TextField label="Cédula / ID *" value={patientIdStr} onChangeText={setPatientIdStr} editable={!isLoading} />
                  </View>
                  
                  <View style={styles.col1}>
                    <Typography variant="label" style={styles.fieldLabel}>Género *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => setGenderModal(true)}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={gender ? 'onSurface' : 'onSurfaceVariant'}>
                        {gender === 'M' ? 'Masculino' : gender === 'F' ? 'Femenino' : 'Seleccionar Género'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
                    </Pressable>
                  </View>

                  <View style={styles.col1}>
                    <Typography variant="label" style={styles.fieldLabel}>Fecha de Nacimiento *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => setShowDatePicker(true)}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={birthDate ? 'onSurface' : 'onSurfaceVariant'}>
                        {formatDateDisplay(birthDate)}
                      </Typography>
                      <MaterialIcons name="calendar-today" size={20} color={activeColors.outline} />
                    </Pressable>
                  </View>

                  <View style={styles.col1}>
                    <Typography variant="label" style={styles.fieldLabel}>Tipo de Sangre *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => setBloodTypeModal(true)}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={bloodType ? 'onSurface' : 'onSurfaceVariant'}>
                        {bloodType || 'Seleccionar Sangre'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Contacto */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(104, 254, 79, 0.3)' }]}>
                    <MaterialIcons name="contact-mail" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Contacto</Typography>
                </View>
                
                <View style={styles.grid2Col}>
                  <View style={styles.col2}>
                    <TextField label="Correo Electrónico *" value={emailAddress} onChangeText={setEmailAddress} keyboardType="email-address" editable={!isLoading} />
                  </View>
                  <View style={[styles.col2, { flexDirection: 'row', gap: Spacing[3] }]}>
                    <View style={{ width: 100 }}>
                      <Typography variant="label" style={styles.fieldLabel}>País *</Typography>
                      <Pressable
                        style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
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
                      <TextField label="Móvil *" value={mobilePhoneNumber} onChangeText={setMobilePhoneNumber} keyboardType="phone-pad" editable={!isLoading} />
                    </View>
                  </View>
                  <View style={styles.col2}>
                    <TextField label="Teléfono Fijo" value={fixedPhoneNumber} onChangeText={setFixedPhoneNumber} keyboardType="phone-pad" editable={!isLoading} />
                  </View>
                </View>
              </View>

              {/* Ubicación */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(104, 254, 79, 0.3)' }]}>
                    <MaterialIcons name="location-on" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Ubicación</Typography>
                </View>
                
                <View style={styles.grid3Col}>
                  <View style={styles.colThird}>
                    <Typography variant="label" style={styles.fieldLabel}>País *</Typography>
                    <Pressable
                      style={[styles.selectBox, { backgroundColor: activeColors.surfaceContainerLow, borderColor: activeColors.outlineVariant, borderWidth: 1 }]}
                      onPress={() => {
                        setSearchQuery('');
                        setCountryModal(true);
                      }}
                      disabled={isLoading}
                    >
                      <Typography variant="body" color={country ? 'onSurface' : 'onSurfaceVariant'}>
                        {country || 'Seleccionar País'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
                    </Pressable>
                  </View>
                  <View style={styles.colThird}>
                    <Typography variant="label" style={[styles.fieldLabel, !country && { opacity: 0.5 }]}>Estado / Depto *</Typography>
                    <Pressable
                      style={[
                        styles.selectBox,
                        { backgroundColor: country ? activeColors.surfaceContainerLow : activeColors.surfaceContainerHigh, borderColor: activeColors.outlineVariant, borderWidth: 1 },
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
                        {state || 'Seleccionar Estado'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
                    </Pressable>
                  </View>
                  <View style={styles.colThird}>
                    <Typography variant="label" style={[styles.fieldLabel, !state && { opacity: 0.5 }]}>Ciudad *</Typography>
                    <Pressable
                      style={[
                        styles.selectBox,
                        { backgroundColor: state ? activeColors.surfaceContainerLow : activeColors.surfaceContainerHigh, borderColor: activeColors.outlineVariant, borderWidth: 1 },
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
                        {city || 'Seleccionar Ciudad'}
                      </Typography>
                      <MaterialIcons name="arrow-drop-down" size={24} color={activeColors.outline} />
                    </Pressable>
                  </View>
                  <View style={styles.col2}>
                    <TextField label="Dirección Línea 1 *" value={address1} onChangeText={setAddress1} editable={!isLoading} />
                  </View>
                  <View style={styles.col2}>
                    <TextField label="Dirección Línea 2 (Opcional)" value={address2} onChangeText={setAddress2} editable={!isLoading} />
                  </View>
                </View>
              </View>

              {/* Información Médica */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconBox, { backgroundColor: 'rgba(104, 254, 79, 0.3)' }]}>
                    <MaterialIcons name="medical-information" size={20} color={activeColors.primary} />
                  </View>
                  <Typography variant="headline" style={{ fontSize: 18, fontWeight: '700' }}>Información Médica</Typography>
                </View>
                
                <View style={{ gap: Spacing[5] }}>
                  <TextField label="Medicamentos Actuales" value={prescriptions} onChangeText={setPrescriptions} editable={!isLoading} />
                  <TextField label="Alergias Conocidas" value={alergies} onChangeText={setAlergies} editable={!isLoading} />
                  <TextField label="Información Adicional" value={additionalInfo} onChangeText={setAdditionalInfo} placeholder="Notas sobre el historial médico del paciente..." editable={!isLoading} />
                </View>
              </View>

              {/* Action Button */}
              <View style={styles.actionArea}>
                <Button 
                  variant="primary"
                  label={isLoading ? "Guardando..." : "Guardar Cambios"}
                  leftIcon="save"
                  onPress={handleSave}
                  disabled={isLoading}
                />
                <Typography variant="body" color="onSurfaceVariant" style={{ fontSize: 12, textAlign: 'center', marginTop: Spacing[4], fontWeight: '500' }}>
                  Última actualización: Sincronizado
                </Typography>
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
                placeholder="Buscar por país o código (ej: +57)..."
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

      {/* MODAL: Estado */}
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
          value={parseDate(birthDate)}
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
    height: 64,
  },
  iconBtn: {
    padding: Spacing[2],
    borderRadius: Rounded.full,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Rounded.xl,
  },
  scrollContent: {
    padding: Spacing[6],
    paddingBottom: Spacing[10],
    maxWidth: 1024,
    width: '100%',
    alignSelf: 'center',
  },
  mainGrid: {
    flexDirection: 'column',
    gap: Spacing[8],
  },
  sidebar: {
    gap: Spacing[6],
  },
  profileCard: {
    padding: Spacing[6],
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#2c2f30',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing[4],
  },
  avatarBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: Spacing[2],
    borderRadius: Rounded.full,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: Spacing[2],
    marginTop: Spacing[4],
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Rounded.full,
  },
  statusBox: {
    padding: Spacing[6],
    borderRadius: Rounded.xl,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formContent: {
    flex: 1,
    gap: Spacing[10],
  },
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: Rounded.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[5],
  },
  grid3Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[5],
  },
  col1: {
    width: '100%',
    minWidth: '45%',
    flex: 1,
  },
  col2: {
    width: '100%',
  },
  colThird: {
    width: '100%',
    minWidth: '30%',
    flex: 1,
  },
  actionArea: {
    paddingTop: Spacing[6],
    borderTopWidth: 1,
    borderTopColor: 'rgba(171, 173, 174, 0.1)',
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
