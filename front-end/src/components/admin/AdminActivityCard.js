import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import {
  formatAdminDateTime,
  withAlpha,
} from './adminTheme';

export default function AdminActivityCard({
  activity,
  icon = 'time-outline',
  color,
  style,
}) {
  const { colors } = useTheme();
  const resolvedColor = color || colors.accent;

  const title =
    activity?.title ||
    activity?.action ||
    activity?.event ||
    'Actividad administrativa';

  const description =
    activity?.description ||
    activity?.details ||
    activity?.message ||
    '';

  const actor =
    activity?.admin?.email ||
    activity?.admin_email ||
    activity?.user?.email ||
    activity?.actor_email ||
    '';

  const date =
    activity?.created_at ||
    activity?.timestamp ||
    activity?.date;

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
          name={activity?.icon || icon}
          size={20}
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

        <View style={styles.metaRow}>
          {!!actor && (
            <Text
              style={[
                styles.meta,
                { color: colors.textMuted },
              ]}
              numberOfLines={1}
            >
              {actor}
            </Text>
          )}

          {!!date && (
            <Text
              style={[
                styles.date,
                { color: colors.textMuted },
              ]}
            >
              {formatAdminDateTime(date)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    marginBottom: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  icon: {
    width: 42,
    height: 42,
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
  description: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  meta: {
    flex: 1,
    marginRight: 10,
    fontSize: 10,
  },
  date: {
    fontSize: 10,
  },
});
