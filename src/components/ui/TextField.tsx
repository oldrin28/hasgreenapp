import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, useColorScheme, View, Text } from 'react-native';
import { Colors, Fonts, Rounded, Spacing } from '@/constants/theme';
import { Typography } from './Typography';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
  rightLabel?: React.ReactNode;
}

const addOpacityToHex = (hex: string, opacity: number) => {
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${hex}${alpha}`;
};

export const TextField: React.FC<TextFieldProps> = ({
  style,
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  rightLabel,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // Ghost border at 15%
  const ghostBorder = addOpacityToHex(activeColors.outlineVariant, 0.15);
  // Glow at 30%
  const glowColor = addOpacityToHex(activeColors.primaryContainer, 0.3);

  const borderColor = error
    ? activeColors.error
    : isFocused
    ? activeColors.primary
    : ghostBorder;

  return (
    <View style={styles.container}>
      {(label || rightLabel) && (
        <View style={styles.labelRow}>
          {label ? (
            <Typography variant="label" style={[styles.label, { color: error ? activeColors.error : activeColors.onSurfaceVariant }]}>
              {label}
            </Typography>
          ) : <View />}
          {rightLabel && rightLabel}
        </View>
      )}
      <View style={[styles.inputContainer, { borderColor, backgroundColor: activeColors.surfaceContainerLow }]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <MaterialIcons name={leftIcon} size={20} color={activeColors.outline} />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            { color: activeColors.onSurface, fontFamily: Fonts.body },
            leftIcon ? { paddingLeft: 0 } : undefined,
            rightIcon ? { paddingRight: 0 } : undefined,
            style,
          ]}
          placeholderTextColor={activeColors.outline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIconContainer}>
            <MaterialIcons name={rightIcon} size={20} color={activeColors.outline} />
          </Pressable>
        )}
      </View>
      {error && (
        <Typography variant="label" color="error" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[4],
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
    paddingHorizontal: Spacing[1],
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: Rounded.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    fontSize: 16,
  },
  leftIconContainer: {
    paddingLeft: Spacing[4],
    paddingRight: Spacing[3],
  },
  rightIconContainer: {
    paddingRight: Spacing[4],
    paddingLeft: Spacing[3],
  },
  errorText: {
    marginTop: Spacing[1],
  },
});
