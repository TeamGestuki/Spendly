import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { withAlpha } from './adminTheme';

export default function AdminStatCard({
  label,
  value = 0,
  icon = 'stats-chart-outline',
  color,
  helperText,
  onPress,
  style,
}) {
  const { colors } = useTheme();
  const resolvedColor = color || colors.accent;
  const Wrapper =
    typeof onPress === 'function'
      ? TouchableOpacity
      : View;

  return (
    <Wrapper
      {...(typeof onPress === 'function'
        ? {
            onPress,
            activeOpacity: 0.78,
          }
        : {})}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            backgroundColor: withAlpha(
              resolvedColor,
              '18'
            ),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={resolvedColor}
        />
      </View>

      <Text
        style={[
          styles.value,
          { color: colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        {value ?? 0}
      </Text>

      <Text
        style={[
          styles.label,
          { color: colors.textSecondary },
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>

      {!!helperText && (
        <Text
          style={[
            styles.helper,
            { color: colors.textMuted },
          ]}
          numberOfLines={2}
        >
          {helperText}
        </Text>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    minHeight: 138,
    padding: 15,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  icon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
  },
  label: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
  },
  helper: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
  },
});
