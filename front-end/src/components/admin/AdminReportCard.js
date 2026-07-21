import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';
import {
  formatAdminDate,
  getAdminStatusConfig,
  withAlpha,
} from './adminTheme';

export default function AdminReportCard({
  report,
  onPress,
  showChevron = true,
  style,
}) {
  const { colors } = useTheme();

  const status = getAdminStatusConfig(
    report?.status,
    colors
  );

  const userEmail =
    report?.user?.email ||
    report?.user_email ||
    report?.email ||
    'Usuario no disponible';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={typeof onPress !== 'function'}
      activeOpacity={0.78}
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
              status.color,
              '16'
            ),
          },
        ]}
      >
        <Ionicons
          name={status.icon}
          size={20}
          color={status.color}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.top}>
          <Text
            style={[
              styles.subject,
              { color: colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {report?.subject ||
              'Reporte sin asunto'}
          </Text>

          <Text
            style={[
              styles.id,
              { color: colors.textMuted },
            ]}
          >
            #{report?.id ?? '-'}
          </Text>
        </View>

        <Text
          style={[
            styles.meta,
            { color: colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {userEmail}
        </Text>

        <View style={styles.bottom}>
          <Text
            style={[
              styles.badge,
              {
                color: status.color,
                backgroundColor: withAlpha(
                  status.color,
                  '14'
                ),
              },
            ]}
          >
            {status.label}
          </Text>

          <Text
            style={[
              styles.date,
              { color: colors.textMuted },
            ]}
          >
            {formatAdminDate(
              report?.created_at
            )}
          </Text>
        </View>
      </View>

      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textMuted}
        />
      )}
    </TouchableOpacity>
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
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subject: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  id: {
    marginLeft: 8,
    fontSize: 10,
  },
  meta: {
    marginTop: 4,
    fontSize: 11,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    fontSize: 10,
    fontWeight: '800',
  },
  date: {
    marginLeft: 8,
    fontSize: 10,
  },
});
