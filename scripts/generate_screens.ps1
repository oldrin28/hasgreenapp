$screens = @(
  @{ name = "crear-paciente"; title = "Crear Paciente"; type = "Form" },
  @{ name = "editar-paciente"; title = "Editar Paciente"; type = "Form" },
  @{ name = "nuevo-dispositivo"; title = "Nuevo Dispositivo"; type = "Form" },
  @{ name = "editar-dispositivo"; title = "Editar Dispositivo"; type = "Form" },
  @{ name = "registrar-gateway"; title = "Registrar Gateway"; type = "Form" },
  @{ name = "editar-gateway"; title = "Editar Gateway"; type = "Form" },
  @{ name = "usuarios"; title = "Usuarios"; type = "List" },
  @{ name = "registrar-usuario"; title = "Registrar Usuario"; type = "Form" },
  @{ name = "editar-usuario"; title = "Editar Usuario"; type = "Form" },
  @{ name = "config-notificaciones"; title = "Notificaciones"; type = "Form" },
  @{ name = "configurar-alarma"; title = "Configurar Alarma"; type = "Form" },
  @{ name = "escanear-qr"; title = "Escanear QR"; type = "Camera" },
  @{ name = "permiso-camara"; title = "Permiso Cámara"; type = "Camera" },
  @{ name = "editar-cuenta"; title = "Editar Cuenta"; type = "Form" },
  @{ name = "cambiar-contrasena"; title = "Cambiar Contraseña"; type = "Form" }
)

$templateForm = @"
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { Spacing } from '@/constants/theme';

export default function __COMPONENT_NAME__() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Typography variant="display">__TITLE__</Typography>
        </View>

        <View style={styles.form}>
          <TextField label="Campo de ejemplo" placeholder="Ingresa el valor" />
        </View>

        <View style={styles.actions}>
          <Button label="Guardar" variant="primary" onPress={() => router.back()} />
          <Button label="Cancelar" variant="secondary" onPress={() => router.back()} style={styles.secondaryBtn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing[6], paddingBottom: Spacing[10] },
  header: { marginBottom: Spacing[8] },
  form: { marginBottom: Spacing[8] },
  actions: { gap: Spacing[4] },
  secondaryBtn: { marginTop: Spacing[4] }
});
"@

$templateList = @"
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/theme';

export default function __COMPONENT_NAME__() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Typography variant="display">__TITLE__</Typography>
          <Button label="+ Nuevo" onPress={() => router.push('/registrar-usuario')} />
        </View>
        <Button label="Volver" variant="secondary" onPress={() => router.back()} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card elevation="sm" style={styles.itemCard}>
          <View style={styles.itemContent}>
            <Typography variant="title">Usuario de Prueba</Typography>
            <Typography variant="label" color="onSurfaceVariant">Admin</Typography>
          </View>
          <Button label="Editar" variant="secondary" onPress={() => router.push('/editar-usuario')} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing[6], marginBottom: Spacing[4] },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[2] },
  scrollContent: { padding: Spacing[6], paddingBottom: Spacing[10] },
  itemCard: { marginBottom: Spacing[4], flexDirection: 'row', alignItems: 'center', padding: 0, paddingRight: Spacing[4] },
  itemContent: { flex: 1, padding: Spacing[4] }
});
"@

foreach ($screen in $screens) {
  $path = "src/app/$($screen.name).tsx"
  $componentName = ($screen.name -replace '-', ' ').Trim().Split(' ') | ForEach-Object { "$($_.Substring(0,1).ToUpper())$($_.Substring(1))" }
  $componentName = $componentName -join ''
  
  $content = ""
  if ($screen.type -eq "List") {
    $content = $templateList -replace "__COMPONENT_NAME__", $componentName -replace "__TITLE__", $screen.title
  } else {
    $content = $templateForm -replace "__COMPONENT_NAME__", $componentName -replace "__TITLE__", $screen.title
  }
  
  Set-Content -Path $path -Value $content -Encoding UTF8
  Write-Host "Created $path"
}
