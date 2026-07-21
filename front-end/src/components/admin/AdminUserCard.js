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
  getInitials,
  withAlpha,
} from './adminTheme';

export default function AdminUserCard({
  user,
  onPress,
  showChevron = true,
  style,
}) {
  const { colors } = useTheme();

  const isAdmin = user?.role === 'admin';
  const isActive = user?.is_active !== false;
  const isOnline = Boolean(
    user?.is_online ?? user?.online
  );

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
          styles.avatar,
          {
            backgroundColor: withAlpha(
              colors.accent,
              '16'
            ),
          },
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            { color: colors.accent },
          ]}
        >
          {getInitials(user?.full_name)}
        </Text>

        {isOnline && (
          <View
            style={[
              styles.online,
              {
                backgroundColor: colors.accent,
                borderColor: colors.surface,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.name,
              { color: colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {user?.full_name ||
              'Usuario sin nombre'}
          </Text>

          {isAdmin && (
            <View
              style={[
                styles.adminBadge,
                {
                  backgroundColor: withAlpha(
                    colors.purple,
                    '16'
                  ),
                },
              ]}
            >
              <Text
                style={[
                  styles.adminText,
                  { color: colors.purple },
                ]}
              >
                Admin
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.email,
            { color: colors.textSecondary },
          ]}
          numberOfLines={1}
        >
          {user?.email || 'Sin correo'}
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isActive
                ? withAlpha(colors.accent, '16')
                : withAlpha(colors.red, '14'),
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: isActive
                  ? colors.accent
                  : colors.red,
              },
            ]}
          >
            {isActive ? 'Activo' : 'Inactivo'}
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
  avatar: {
    width: 49,
    height: 49,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
  },
  online: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
  },
  body: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  email: {
    marginTop: 3,
    fontSize: 12,
  },
  adminBadge: {
    marginLeft: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 99,
  },
  adminText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
});
