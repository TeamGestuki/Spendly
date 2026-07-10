import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  getCurrentUser,
  updateCurrentUser,
} from '../services/authService';

const COLORS = {
  bg: '#0D0F14',
  surface: '#161A23',
  surfaceHigh: '#1E2330',
  border: '#272D3D',
  accent: '#4ADE80',
  accentDim: '#1A3D28',
  textPrimary: '#F0F2F7',
  textSecondary: '#9CA3AF',
  textMuted: '#6B748A',
  red: '#F87171',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function EditProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        setFullName(data.full_name || '');
        setEmail(data.email || '');
      } catch (error) {
        console.log('Error cargando perfil:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) return;

    try {
      setSaving(true);

      await updateCurrentUser({
        full_name: fullName.trim(),
      });

      navigation.goBack();
    } catch (error) {
      console.log('Error actualizando perfil:', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Editar datos</Text>

        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Información personal</Text>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Tu nombre completo"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={email}
                editable={false}
                placeholderTextColor={COLORS.textMuted}
              />
              <Text style={styles.helperText}>
                El cambio de email se habilitará más adelante.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.saveBtn,
              (!fullName.trim() || saving) && styles.saveBtnDisabled,
            ]}
            onPress={handleSave}
            disabled={!fullName.trim() || saving}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 24,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 15,
  },

  inputDisabled: {
    color: COLORS.textMuted,
  },

  helperText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },

  saveBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtnDisabled: {
    backgroundColor: COLORS.accentDim,
  },

  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D1A12',
  },
});