import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import { withAlpha } from './adminTheme';

export default function AdminSectionCard({
  title,
  subtitle,
  icon,
  iconColor,
  children,
  noPadding = false,
  style,
  contentStyle,
  rightContent,
}) {
  const { colors } = useTheme();
  const resolvedIconColor =
    iconColor || colors.accent;

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
      {(title || subtitle || icon || rightContent) && (
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          {!!icon && (
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: withAlpha(
                    resolvedIconColor,
                    '16'
                  ),
                },
              ]}
            >
              <Ionicons
                name={icon}
                size={20}
                color={resolvedIconColor}
              />
            </View>
          )}

          <View style={styles.headerText}>
            {!!title && (
              <Text
                style={[
                  styles.title,
                  { color: colors.textPrimary },
                ]}
              >
                {title}
              </Text>
            )}

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
          </View>

          {!!rightContent && rightContent}
        </View>
      )}

      <View
        style={[
          !noPadding && styles.content,
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 19,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  headerText: {
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
  content: {
    padding: 15,
  },
});
