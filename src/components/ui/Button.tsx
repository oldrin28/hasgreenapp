import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, useColorScheme, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Rounded, Spacing } from '@/constants/theme';
import { Typography } from './Typography';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  label: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({
  style,
  variant = 'primary',
  label,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  if (variant === 'primary') {
    const textColor = activeColors.onPrimary;
    return (
      <TouchableOpacity activeOpacity={0.8} style={[styles.buttonContainer, style]} {...props}>
        <LinearGradient
          colors={[activeColors.primary, activeColors.primaryDim]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.contentRow}>
            {leftIcon && <MaterialIcons name={leftIcon} size={20} color={textColor} style={{ marginRight: Spacing[2] }} />}
            <Typography variant="body" style={{ color: textColor, fontWeight: '600' }}>
              {label}
            </Typography>
            {rightIcon && <MaterialIcons name={rightIcon} size={20} color={textColor} style={{ marginLeft: Spacing[2] }} />}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const textColor = activeColors.primary;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.buttonContainer,
        { backgroundColor: activeColors.surfaceContainerHigh },
        style,
      ]}
      {...props}
    >
      <View style={styles.secondaryInner}>
        <View style={styles.contentRow}>
          {leftIcon && <MaterialIcons name={leftIcon} size={20} color={textColor} style={{ marginRight: Spacing[2] }} />}
          <Typography variant="body" style={{ color: textColor, fontWeight: '600' }}>
            {label}
          </Typography>
          {rightIcon && <MaterialIcons name={rightIcon} size={20} color={textColor} style={{ marginLeft: Spacing[2] }} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: Rounded.md,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryInner: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
