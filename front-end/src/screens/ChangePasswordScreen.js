import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../services/authService';

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
  blue: '#60A5FA',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const [error, setError] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!currentPassword || !newPassword || !repeatPassword) {
      return 'Completá todos los campos.';
    }

    if (newPassword.length < 8) {
      return 'La nueva contraseña debe tener al menos 8 caracteres.';
    }

    if (currentPassword === newPassword) {
      return 'La nueva contraseña debe ser diferente a la actual.';
    }

    if (newPassword !== repeatPassword) {
      return 'Las contraseñas nuevas no coinciden.';
    }

    return '';
  };

  const handleSave = async () => {
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await changePassword(currentPassword, newPassword);

      setSuccessModalVisible(true);
    } catch (e) {
      setError(e.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
    navigation.goBack();
  };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Cambiar contraseña</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon name="lock-closed-outline" size={28} color={COLORS.accent} />
          </View>

          <Text style={styles.heroTitle}>Actualizá tu clave</Text>

          <Text style={styles.heroText}>
            Usá una contraseña segura y diferente a la anterior para proteger tu cuenta.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Contraseña actual</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={(value) => {
                setCurrentPassword(value);
                setError('');
              }}
              placeholder="Ingresá tu contraseña actual"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showCurrent}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowCurrent(v => !v)}>
              <AppIcon
                name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                setError('');
              }}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showNew}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowNew(v => !v)}>
              <AppIcon
                name={showNew ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Repetir nueva contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={repeatPassword}
              onChangeText={(value) => {
                setRepeatPassword(value);
                setError('');
              }}
              placeholder="Repetí la nueva contraseña"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showRepeat}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowRepeat(v => !v)}>
              <AppIcon
                name={showRepeat ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <AppIcon name="alert-circle-outline" size={18} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.saveBtn,
            loading && styles.saveBtnDisabled,
          ]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <AppIcon name="checkmark-circle-outline" size={34} color={COLORS.accent} />
            </View>

            <Text style={styles.modalTitle}>Contraseña actualizada</Text>

            <Text style={styles.modalText}>
              Tu contraseña se cambió correctamente.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={closeSuccessModal}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.16)',
    padding: 22,
    marginBottom: 22,
    alignItems: 'center',
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  heroText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginBottom: 20,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  inputWrapper: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingRight: 10,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.25)',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginTop: 2,
  },

  errorText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.red,
    lineHeight: 17,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  successModal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 22,
  },

  modalBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D1A12',
  },
});