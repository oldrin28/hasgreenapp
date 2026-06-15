import React from 'react';
import { View, ViewProps, StyleSheet, useColorScheme } from 'react-native';
import { Colors, Rounded, Spacing } from '@/constants/theme';

interface CardProps extends ViewProps {
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  layer?: 'lowest' | 'low' | 'highest' | 'bright';
}

export const Card: React.FC<CardProps> = ({
  style,
  elevation = 'none',
  layer = 'lowest',
  children,
  ...props
}) => {
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const activeColors = Colors[theme];

  let backgroundColor: string = activeColors.surfaceContainerLowest;
  switch (layer) {
    case 'low':
      backgroundColor = activeColors.surfaceContainerLow;
      break;
    case 'highest':
      backgroundColor = activeColors.surfaceContainerHighest;
      break;
    case 'bright':
      backgroundColor = activeColors.surface;
      break;
  }

  const getShadow = () => {
    if (elevation === 'none') return {};
    
    // Using a tinted version of on_surface for ambient lift
    const shadowColor = activeColors.shadow;
    
    switch (elevation) {
      case 'sm':
        return {
          shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        };
      case 'md':
        return {
          shadowColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
          elevation: 8,
        };
      case 'lg':
        return {
          shadowColor,
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.1,
          shadowRadius: 32,
          elevation: 16,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor, borderRadius: Rounded.md },
        getShadow(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing[4],
    overflow: 'hidden', // Ensure contents respect border radius unless shadow is applied
  },
});
