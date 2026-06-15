import React from 'react';
import { Text, TextProps, StyleSheet, useColorScheme } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'display' | 'headline' | 'title' | 'body' | 'label';
  color?: keyof typeof Colors.light;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
  style,
  variant = 'body',
  color = 'onSurface',
  align = 'auto',
  children,
  ...props
}) => {
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const textColor = Colors[theme][color] as string;

  let fontFamily = Fonts.body;
  let fontSize = 16;
  let lineHeight = 24;
  let letterSpacing = 0;

  switch (variant) {
    case 'display':
      fontFamily = Fonts.headline;
      fontSize = 56;
      lineHeight = 64;
      break;
    case 'headline':
      fontFamily = Fonts.headline;
      fontSize = 32;
      lineHeight = 40;
      break;
    case 'title':
      fontFamily = Fonts.headline;
      fontSize = 22;
      lineHeight = 28;
      break;
    case 'body':
      fontFamily = Fonts.body;
      fontSize = 16;
      lineHeight = 24;
      break;
    case 'label':
      fontFamily = Fonts.label;
      fontSize = 11;
      lineHeight = 16;
      letterSpacing = 0.5;
      break;
  }

  return (
    <Text
      style={[
        {
          fontFamily,
          fontSize,
          lineHeight,
          letterSpacing,
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
