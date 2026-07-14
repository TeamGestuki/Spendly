/**
 * EditProfileScreen.js
 * Edición definitiva del perfil de Spendly.
 *
 * Compatible con el backend actual:
 * - full_name: editable
 * - email: solo lectura
 */

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  getCurrentUser,
  updateCurrentUser,
} from '../services/authService';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useLanguage,
} from '../context/LanguageContext';

function AppIcon({
  name,
  size = 20,
  color,
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  );
}

export default function EditProfileScreen({
  navigation,
}) {
  const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const {
    t,
  } = useLanguage();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );

  const [
    fullName,
    setFullName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    fullNameError,
    setFullNameError,
  ] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const data =
          await getCurrentUser();

        setFullName(
          data.full_name || ''
        );

        setEmail(
          data.email || ''
        );
      } catch (error) {
        console.log(
          'Error cargando perfil:',
          error.message
        );

        Alert.alert(
          t('common.error'),
          t('editProfile.loadError')
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [t]);

  const validateFullName = () => {
    const trimmedName =
      fullName.trim();

    if (!trimmedName) {
      setFullNameError(
        t(
          'editProfile.validation.fullNameRequired'
        )
      );

      return false;
    }

    if (trimmedName.length < 3) {
      setFullNameError(
        t(
          'editProfile.validation.fullNameTooShort'
        )
      );

      return false;
    }

    setFullNameError('');
    return true;
  };

  const handleSave = async () => {
    if (
      saving ||
      !validateFullName()
    ) {
      return;
    }

    try {
      setSaving(true);

      await updateCurrentUser({
        full_name:
          fullName.trim(),
      });

      Alert.alert(
        t('editProfile.successTitle'),
        t('editProfile.successMessage'),
        [
          {
            text: t('common.accept'),
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'Error actualizando perfil:',
        error.message
      );

      Alert.alert(
        t('common.error'),
        error.message ||
          t('editProfile.saveError')
      );
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    fullName.trim().length >= 3 &&
    !saving;

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
          disabled={saving}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={
              saving
                ? COLORS.textMuted
                : COLORS.textPrimary
            }
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          {t('editProfile.title')}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />

          <Text style={styles.loadingText}>
            {t('editProfile.loading')}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="person-outline"
                size={28}
                color={COLORS.accent}
              />
            </View>

            <Text style={styles.heroTitle}>
              {t('editProfile.heroTitle')}
            </Text>

            <Text style={styles.heroText}>
              {t('editProfile.heroText')}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {t(
              'editProfile.personalInformation'
            )}
          </Text>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                {t(
                  'editProfile.fullName'
                )}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  !!fullNameError &&
                    styles.inputError,
                ]}
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);

                  if (
                    fullNameError
                  ) {
                    setFullNameError(
                      ''
                    );
                  }
                }}
                placeholder={t(
                  'editProfile.fullNamePlaceholder'
                )}
                placeholderTextColor={
                  COLORS.textMuted
                }
                maxLength={120}
                editable={!saving}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />

              {!!fullNameError && (
                <Text style={styles.errorText}>
                  {fullNameError}
                </Text>
              )}
            </View>

            <View
              style={[
                styles.fieldGroup,
                styles.fieldGroupLast,
              ]}
            >
              <Text style={styles.label}>
                {t('editProfile.email')}
              </Text>

              <View style={styles.readOnlyBox}>
                <AppIcon
                  name="mail-outline"
                  size={18}
                  color={COLORS.textMuted}
                />

                <Text
                  style={styles.readOnlyValue}
                  numberOfLines={1}
                >
                  {email}
                </Text>

                <AppIcon
                  name="lock-closed-outline"
                  size={16}
                  color={COLORS.textMuted}
                />
              </View>

              <Text style={styles.helperText}>
                {t(
                  'editProfile.emailHelper'
                )}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              !canSave &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!canSave}
            activeOpacity={0.85}
          >
            {saving ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={
                    COLORS.buttonText ||
                    COLORS.bg
                  }
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {t(
                    'editProfile.saving'
                  )}
                </Text>
              </>
            ) : (
              <>
                <AppIcon
                  name="checkmark-circle-outline"
                  size={20}
                  color={
                    COLORS.buttonText ||
                    COLORS.bg
                  }
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {t(
                    'editProfile.saveChanges'
                  )}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Spendly © 2026
          </Text>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </View>
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
      justifyContent:
        'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: COLORS.bg,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        COLORS.surface,
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

    topBarSpacer: {
      width: 40,
    },

    loadingWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      fontSize: 13,
      color: COLORS.textSecondary,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 30,
    },

    heroCard: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}29`,
      padding: 22,
      alignItems: 'center',
      marginBottom: 24,
    },

    heroIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor:
        COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    heroTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 6,
      textAlign: 'center',
    },

    heroText: {
      fontSize: 13,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },

    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
      marginLeft: 2,
    },

    card: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginBottom: 16,
    },

    fieldGroup: {
      marginBottom: 20,
    },

    fieldGroupLast: {
      marginBottom: 0,
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
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      color: COLORS.textPrimary,
      fontSize: 15,
    },

    inputError: {
      borderColor:
        COLORS.error ||
        COLORS.red,
    },

    readOnlyBox: {
      height: 52,
      borderRadius: 14,
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    readOnlyValue: {
      flex: 1,
      color: COLORS.textMuted,
      fontSize: 14,
    },

    helperText: {
      fontSize: 11,
      color: COLORS.textMuted,
      marginTop: 6,
      lineHeight: 16,
    },

    errorText: {
      fontSize: 11,
      color:
        COLORS.error ||
        COLORS.red,
      marginTop: 6,
    },

    homeNameInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor:
        COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 15,
      marginBottom: 22,
    },

    homeNameInfoText: {
      flex: 1,
      fontSize: 12,
      color: COLORS.textSecondary,
      lineHeight: 18,
    },

    saveButton: {
      height: 54,
      borderRadius: 16,
      backgroundColor:
        COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 9,
    },

    saveButtonDisabled: {
      backgroundColor:
        COLORS.accentDim,
    },

    saveButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color:
        COLORS.buttonText ||
        COLORS.bg,
    },

    footerText: {
      marginTop: 28,
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.textMuted,
      textAlign: 'center',
    },

    bottomSpacer: {
      height: 30,
    },
  });
}
