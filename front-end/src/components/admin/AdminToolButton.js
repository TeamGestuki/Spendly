import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { withAlpha } from './adminTheme';

export default function AdminToolButton({
  title,
  description,
  icon = 'build-outline',
  color,
  onPress,
  loading = false,
  disabled = false,
  destructive = false,
  compact = false,
  style,
}) {
  const { colors } = useTheme();
  const resolvedColor = destructive
    ? colors.red
    : color || colors.accent;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.78}
      style={[
        styles.button,
        compact && styles.compact,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: isDisabled ? 0.58 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: withAlpha(
              resolvedColor,
              '16'
            ),
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={resolvedColor}
          />
        ) : (
          <Ionicons
            name={icon}
            size={21}
            color={resolvedColor}
          />
        )}
      </View>

      <View style={styles.textContainer}>
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
            numberOfLines={compact ? 1 : 3}
          >
            {description}
          </Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  compact: {
    minHeight: 66,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  description: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
  },
});
