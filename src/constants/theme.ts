import { Platform } from 'react-native';

const tintColorLight = '#086b00';
const tintColorDark = '#68fe4f';

export const Colors = {
  light: {
    primary: '#086b00',
    onPrimary: '#d3ffc1',
    primaryDim: '#065d00',
    primaryContainer: '#68fe4f',
    onPrimaryContainer: '#065e00',
    tertiaryContainer: '#07ebf8',
    onTertiaryContainer: '#005257',
    secondary: '#006a2f',
    onSecondary: '#ceffd1',
    secondaryContainer: '#8ff9a4',
    onSecondaryContainer: '#005f29',
    outline: '#757778',
    outlineVariant: '#abadae',
    error: '#b02500',
    onError: '#ffefec',
    errorContainer: '#f95630',
    tertiary: '#00666c',
    tertiaryDim: '#00595e',
    background: '#f5f6f7',
    onBackground: '#2c2f30',
    surface: '#f5f6f7',
    onSurface: '#2c2f30',
    surfaceVariant: '#dadddf',
    onSurfaceVariant: '#595c5d',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#eff1f2',
    surfaceContainer: '#e6e8ea',
    surfaceContainerHigh: '#e0e3e4',
    surfaceContainerHighest: '#dadddf',
    tint: tintColorLight,
    shadow: '#2c2f30', // Used for ambient lift (6-8% opacity)
  },
  dark: {
    primary: '#39D325',
    onPrimary: '#013A00',
    primaryDim: '#2BA81B',
    primaryContainer: '#055300',
    onPrimaryContainer: '#68fe4f',
    tertiaryContainer: '#004f54',
    onTertiaryContainer: '#07ebf8',
    secondary: '#55DF73',
    onSecondary: '#003916',
    secondaryContainer: '#005223',
    onSecondaryContainer: '#8ff9a4',
    outline: '#9b9d9e',
    outlineVariant: '#464748',
    error: '#FFB4A2',
    onError: '#690005',
    errorContainer: '#93000A',
    tertiary: '#4cd9e2',
    tertiaryDim: '#2bc0c9',
    background: '#0c0f10',
    onBackground: '#e0e3e4',
    surface: '#0c0f10',
    onSurface: '#e6e8ea',
    surfaceVariant: '#464748',
    onSurfaceVariant: '#dadddf',
    surfaceContainerLowest: '#0c0f10',
    surfaceContainerLow: '#151718',
    surfaceContainer: '#1d2021',
    surfaceContainerHigh: '#272a2b',
    surfaceContainerHighest: '#323536',
    tint: tintColorDark,
    shadow: '#000000', // Deep shadow
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  headline: 'Manrope',
  body: 'Inter',
  label: 'Inter',
};

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16, // spacing-4 from doc
  5: 20, // spacing-5 from doc
  6: 24, // spacing-6 from doc
  8: 32,
  10: 40,
  12: 48,
} as const;

export const Rounded = {
  sm: 8, // roundness: ROUND_EIGHT
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
