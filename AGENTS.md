# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Objetivo de la Aplicación (HASGREEN)

HASGREEN es un **sistema de alertas tempranas diseñado para adultos mayores**. Sus principales características y flujo de negocio son:
- **Dispositivos (Botones)**: El sistema permite registrar botones físicos de pánico o asistencia.
- **Gateways**: Receptores de red que captan la señal de radiofrecuencia (RF) cuando los botones son presionados.
- **Pacientes**: Cada botón puede estar asociado a un paciente que debe registrarse previamente en el sistema.
- **Usuarios y Notificaciones**: Los usuarios del sistema reciben notificaciones inmediatas cuando un paciente oprime un botón. Además, una cuenta propietaria puede invitar a otras cuentas para que formen parte de la red y reciban notificaciones de eventos.

## Regla de Mantenimiento de Directorio (¡CRÍTICO!)

**CADA VEZ que se agregue un archivo o carpeta nueva al proyecto, es obligatorio actualizar la sección `Project Directory Structure` en este archivo (`AGENTS.md`)** para mantener el índice del directorio sincronizado con la estructura real del código.

## Project Directory Structure

- **/assets**: Static assets like images and app icons.
- **/scripts**: Helper and utility scripts for the project.
- **/src/app**: Expo Router navigation. Contains all screens, layouts (`_layout.tsx`), y el árbol de navegación.
  - **/src/app/(auth)**: Rutas del flujo de autenticación (Login, Signup).
  - **/src/app/(tabs)**: Rutas principales de la app con barra de navegación inferior (Dashboard, Pacientes, Dispositivos, Gateways, Usuarios, Notificaciones, Perfil).
- **/src/components/ui**: Componentes de UI globales y reutilizables que siguen el sistema de diseño "Digital Greenhouse" (ej., `Button.tsx`, `Card.tsx`, `TextField.tsx`, `Typography.tsx`).
- **/src/constants**: Configuración global, como `theme.ts` que exporta los tokens de `Colors` (Claro y Oscuro), `Fonts`, `Spacing` y `Rounded`.
- **/src/features**: Módulos de negocio organizados por dominio. Cada uno contiene `screens/`, `hooks/` y `repository/`.
  - **/src/features/auth**: Flujo de autenticación (`LoginScreen`, `SignupScreen`, `useAuth`, `AuthRepository`).
  - **/src/features/dashboard**: Pantalla principal (`DashboardScreen`, `useDashboard`, `DashboardRepository`).
  - **/src/features/patients**: Gestión de pacientes (`PatientsListScreen`, `CreatePatientScreen`, `EditPatientScreen`, `usePatients`, `PatientsRepository`).
  - **/src/features/devices**: Gestión de dispositivos (`DevicesListScreen`, `CreateDeviceScreen`, `EditDeviceScreen`, `ScanQRScreen`, `useDevices`, `DevicesRepository`).
  - **/src/features/gateways**: Gestión de gateways (`GatewaysListScreen`, `CreateGatewayScreen`, `EditGatewayScreen`, `useGateways`, `GatewaysRepository`).
  - **/src/features/users**: Gestión de usuarios (`UsersListScreen`, `CreateUserScreen`, `EditUserScreen`, `useUsers`, `UsersRepository`).
  - **/src/features/profile**: Perfil y cuenta del usuario autenticado (`ProfileScreen`, `EditAccountScreen`, `ChangePasswordScreen`, `useProfile`, `ProfileRepository`).
  - **/src/features/notifications**: Configuración de notificaciones y alarmas (`NotificationsMenuScreen`, `ConfigNotificationsStep1Screen`, `ConfigNotificationsStep2Screen`, `ConfigNotificationsStep3Screen`, `ConfigureAlarmScreen`, `AlarmManagementScreen`, `useNotifications`, `NotificationsRepository`).
- **/src/hooks**: Custom React hooks globales utilizados en la aplicación.

## Reglas de Diseño Globales (¡CRÍTICO!)

Para **TODO LO QUE SE HAGA EN LA APP**, se deben cumplir estrictamente las siguientes reglas:
1. **USAR COMPONENTES GLOBALES**: Es obligatorio utilizar los componentes existentes en `/src/components/ui` (como `Typography`, `Button`, `TextField`, `Card`) para construir las vistas. NO crees estilos *ad-hoc* para elementos que ya tienen un componente global.
2. **TEMAS DINÁMICOS**: Se debe respetar el sistema de modo Oscuro y Claro. Extrae siempre los colores del objeto global `Colors[theme]` de `theme.ts` y nunca uses colores harcodeados (ej., `color: '#FFF'`).
3. **SIN BORDES**: El diseño general ("High-End") prohíbe el uso de líneas o bordes sólidos de 1px. Para separar los elementos visualmente, emplea la elevación ("ambient lift") usando los componentes `Card` con sus capas (`surfaceContainerLowest`, `surfaceContainerLow`) y los márgenes (`Spacing`).
4. **MANEJO DE ERRORES Y VALIDACIONES**: Todos los errores de red, fallos de lógica y validaciones de formularios deben manejarse de forma controlada mediante bloques `try-catch`, excepciones explícitas y mensajes informativos claros para el usuario (por ejemplo, indicando datos faltantes o incorrectos) de tal manera que la aplicación nunca se detenga o quede congelada (pantallas blancas o crashes). Además, al consumir un endpoint, siempre se debe validar la respuesta; si es exitosa en los casos de actualizar, crear o eliminar, se debe mostrar un mensaje de confirmación, y si no es exitosa, se debe lanzar una excepción explícita para que sea capturada y mostrada al usuario con el mensaje de error.

## Patrones de Desarrollo y Arquitectura

Para mantener la escalabilidad y legibilidad del código, debes aplicar los siguientes patrones de diseño de manera consistente:

### 1. Patrones de Lógica y Estado
- **Custom Hooks**: Extrae lógicas complejas (llamadas a API, geolocalización, animaciones, etc.) fuera de los componentes visuales para mantenerlos limpios y enfocados en la UI.
- **Compound Components**: Úsalos para crear componentes de UI complejos que comparten estado implícito de manera flexible (por ejemplo, menús desplegables, acordeones o modales).
- **Gestores de Estado (Context API / Provider)**: Centraliza estados globales como el usuario autenticado, configuraciones de idioma o el tema de la aplicación.
- **Patrón Repositorio (Repository)**: Abstrae las llamadas a tu backend o base de datos local (como SQLite o Async Storage). Coloca toda la lógica de obtención y mutación de datos en una capa separada, lo que simplifica cambiar tu proveedor de API en el futuro sin tocar la interfaz de usuario.

### 2. Patrones de Arquitectura y Estructura
- **Estructura Basada en Características (Feature-based)**: Agrupa los archivos relacionados funcionalmente (pantallas, componentes específicos, hooks, estado) dentro de una misma carpeta de la característica (feature).
- **Atomic Design**: Divide la UI de forma modular en **Átomos** (botones, textos básicos), **Moléculas** (inputs agrupados con etiquetas), **Organismos** (cabeceras complejas, barras de navegación), y **Plantillas/Pantallas** (la vista final ensamblada).

### 3. Patrones de UI y Navegación
- **Componentes Contenedor / Presentacional**: Separa aquellos componentes que manejan estado, llamadas a API o lógica pesada (*Contenedores*) de los que solo reciben datos a través de *props* para dibujar la interfaz (*Presentacionales* o "Dumb components").
- **Layouts Compartidos (Expo Router)**: Aprovecha al máximo el enrutador basado en archivos de Expo. Define patrones de diseño tipo Layout (`_layout.tsx`) para aplicar cabeceras comunes, pestañas (*Tabs*) y menús laterales (*Drawers*) de forma coherente en todo el árbol de navegación de la app.
