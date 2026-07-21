import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { withAlpha } from './adminTheme';

export default function AdminFilterBar({
  filters = [],
  value,
  onChange,
  style,
  contentContainerStyle,
}) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={[
        styles.content,
        contentContainerStyle,
      ]}
    >
      {filters.map((filter) => {
        const normalized =
          Array.isArray(filter)
            ? {
                value: filter[0],
                label: filter[1],
              }
            : filter;

        const isSelected =
          normalized.value === value;

        return (
          <TouchableOpacity
            key={String(normalized.value)}
            onPress={() => {
              if (typeof onChange === 'function') {
                onChange(normalized.value);
              }
            }}
            activeOpacity={0.76}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? withAlpha(colors.accent, '18')
                  : colors.surface,
                borderColor: isSelected
                  ? withAlpha(colors.accent, '55')
                  : colors.border,
              },
            ]}
          >
            {!!normalized.icon && (
              <Ionicons
                name={normalized.icon}
                size={15}
                color={
                  isSelected
                    ? colors.accent
                    : colors.textSecondary
                }
                style={styles.icon}
              />
            )}

            <Text
              style={[
                styles.label,
                {
                  color: isSelected
                    ? colors.accent
                    : colors.textSecondary,
                },
              ]}
            >
              {normalized.label}
            </Text>

            {normalized.count !== undefined &&
              normalized.count !== null && (
                <Text
                  style={[
                    styles.count,
                    {
                      color: isSelected
                        ? colors.accent
                        : colors.textMuted,
                    },
                  ]}
                >
                  {normalized.count}
                </Text>
              )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 13,
  },
  chip: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  count: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: '800',
  },
});
