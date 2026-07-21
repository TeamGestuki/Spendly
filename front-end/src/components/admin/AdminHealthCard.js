import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import {
  getAdminStatusConfig,
  withAlpha,
} from './adminTheme';

export default function AdminHealthCard({
  title,
  subtitle,
  status = 'healthy',
  value,
  icon = 'pulse-outline',
  color,
  style,
}) {
  const { colors } = useTheme();

  const config = getAdminStatusConfig(
    status,
    colors
  );

  const resolvedColor = color || config.color;

  return (
    <View
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
              '16'
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

      <View style={styles.body}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>

        {!!subtitle && (
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            {subtitle}
          </Text>
        )}

        {value !== undefined &&
          value !== null && (
            <Text
              style={[
                styles.value,
                { color: colors.textMuted },
              ]}
            >
              {String(value)}
            </Text>
          )}
      </View>

      <View
        style={[
          styles.status,
          {
            backgroundColor: withAlpha(
              resolvedColor,
              '14'
            ),
          },
        ]}
      >
        <Ionicons
          name={config.icon}
          size={14}
          color={resolvedColor}
        />

        <Text
          style={[
            styles.statusText,
            { color: resolvedColor },
          ]}
        >
          {config.label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
  },
  value: {
    marginTop: 5,
    fontSize: 10,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 99,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 9,
    fontWeight: '800',
  },
});
