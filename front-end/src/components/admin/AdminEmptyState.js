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

export default function AdminEmptyState({
  icon = 'file-tray-outline',
  title = 'No hay resultados',
  description = 'No se encontró información para mostrar.',
  actionLabel,
  onAction,
  compact = false,
  style,
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        compact && styles.compact,
        style,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: withAlpha(
              colors.textMuted,
              '12'
            ),
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={compact ? 28 : 36}
          color={colors.textMuted}
        />
      </View>

      <Text
        style={[
          styles.title,
          { color: colors.textPrimary },
        ]}
      >
        {title}
      </Text>

      {!!description && (
        <Text
          style={[
            styles.description,
            { color: colors.textSecondary },
          ]}
        >
          {description}
        </Text>
      )}

      {!!actionLabel && typeof onAction === 'function' && (
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={onAction}
          style={[
            styles.button,
            {
              backgroundColor: withAlpha(
                colors.accent,
                '16'
              ),
              borderColor: withAlpha(
                colors.accent,
                '55'
              ),
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.accent },
            ]}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 54,
  },
  compact: {
    paddingVertical: 30,
  },
  iconContainer: {
    width: 66,
    height: 66,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  button: {
    marginTop: 17,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 13,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
