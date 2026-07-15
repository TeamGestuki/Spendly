import React, { useMemo, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';


function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function ChangePasswordScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
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
      return t('changePassword.validation.required');
    }

    if (newPassword.length < 8) {
      return t('changePassword.validation.minLength');
    }

    if (currentPassword === newPassword) {
      return t('changePassword.validation.samePassword');
    }

    if (newPassword !== repeatPassword) {
      return t('changePassword.validation.noMatch');
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
      setError(e.message || t('changePassword.saveError'));
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
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>{t('changePassword.title')}</Text>

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

          <Text style={styles.heroTitle}>{t('changePassword.heroTitle')}</Text>

          <Text style={styles.heroText}>
            {t('changePassword.heroText')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t('changePassword.currentPassword')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={(value) => {
                setCurrentPassword(value);
                setError('');
              }}
              placeholder={t('changePassword.currentPlaceholder')}
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

          <Text style={styles.label}>{t('changePassword.newPassword')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={(value) => {
                setNewPassword(value);
                setError('');
              }}
              placeholder={t('changePassword.newPlaceholder')}
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

          <Text style={styles.label}>{t('changePassword.repeatPassword')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={repeatPassword}
              onChangeText={(value) => {
                setRepeatPassword(value);
                setError('');
              }}
              placeholder={t('changePassword.repeatPlaceholder')}
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
          {loading && (
            <ActivityIndicator
              size="small"
              color={COLORS.buttonText || COLORS.bg}
            />
          )}

          <Text style={styles.saveBtnText}>
            {loading ? t('changePassword.saving') : t('changePassword.save')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Spendly © 2026</Text>
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

            <Text style={styles.modalTitle}>{t('changePassword.successTitle')}</Text>

            <Text style={styles.modalText}>
              {t('changePassword.successText')}
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={closeSuccessModal}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>{t('common.accept')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
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
    borderColor: `${COLORS.accent}29`,
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
    backgroundColor: `${COLORS.red}1A`,
    borderWidth: 1,
    borderColor: `${COLORS.red}40`,
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
    flexDirection: 'row',
    gap: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtnDisabled: {
    backgroundColor: COLORS.accentDim,
  },

  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.buttonText || COLORS.bg,
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
    color: COLORS.buttonText || COLORS.bg,
  },

  footerText: {
    marginTop: 28,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  });
}
