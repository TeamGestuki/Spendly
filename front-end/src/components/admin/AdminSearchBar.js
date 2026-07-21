import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../context/ThemeContext';

export default function AdminSearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = 'Buscar',
  autoCapitalize = 'none',
  returnKeyType = 'search',
  showClearButton = true,
  style,
  inputStyle,
}) {
  const { colors } = useTheme();

  const clearSearch = () => {
    if (typeof onChangeText === 'function') {
      onChangeText('');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={colors.textSecondary}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        style={[
          styles.input,
          { color: colors.textPrimary },
          inputStyle,
        ]}
      />

      {showClearButton && !!value && (
        <TouchableOpacity
          onPress={clearSearch}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Limpiar búsqueda"
          style={styles.clearButton}
        >
          <Ionicons
            name="close-circle"
            size={19}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 9,
    fontSize: 14,
  },
  clearButton: {
    padding: 5,
    marginRight: -5,
  },
});
