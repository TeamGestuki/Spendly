import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';

export default function AdminLoading({
  message = 'Cargando...',
  size = 'large',
  fullScreen = true,
  style,
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor: fullScreen ? colors.bg : 'transparent' },
        style,
      ]}
    >
      <ActivityIndicator
        size={size}
        color={colors.accent}
      />

      {!!message && (
        <Text
          style={[
            styles.message,
            { color: colors.textSecondary },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },
});
