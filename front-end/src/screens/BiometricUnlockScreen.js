import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import * as LocalAuthentication from
  'expo-local-authentication';

import AsyncStorage from
  '@react-native-async-storage/async-storage';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useLanguage,
} from '../context/LanguageContext';

export default function BiometricUnlockScreen({
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
    authenticating,
    setAuthenticating,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const authenticate =
    useCallback(async () => {
      if (authenticating) {
        return;
      }

      try {
        setAuthenticating(true);
        setError('');

        const token =
          await AsyncStorage.getItem(
            'access_token'
          );

        if (!token) {
          navigation.replace(
            'Login'
          );
          return;
        }

        const compatible =
          await LocalAuthentication
            .hasHardwareAsync();

        const enrolled =
          await LocalAuthentication
            .isEnrolledAsync();

        if (
          !compatible ||
          !enrolled
        ) {
          setError(
            t(
              'biometricUnlock.unavailable'
            )
          );
          return;
        }

        const result =
          await LocalAuthentication
            .authenticateAsync({
              promptMessage:
                t(
                  'biometricUnlock.prompt'
                ),
              cancelLabel:
                t(
                  'common.cancel'
                ),
              disableDeviceFallback:
                false,
            });

        if (result.success) {
          navigation.replace(
            'Home'
          );
          return;
        }

        setError(
          t(
            'biometricUnlock.failed'
          )
        );
      } catch (authenticationError) {
        console.log(
          'Biometric unlock error:',
          authenticationError
        );

        setError(
          t(
            'biometricUnlock.failed'
          )
        );
      } finally {
        setAuthenticating(false);
      }
    }, [
      authenticating,
      navigation,
      t,
    ]);

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={
          COLORS.bg
        }
      />

      <View style={styles.content}>
        <View style={styles.icon}>
          <Ionicons
            name="finger-print-outline"
            size={46}
            color={
              COLORS.accent
            }
          />
        </View>

        <Text style={styles.title}>
          {t(
            'biometricUnlock.title'
          )}
        </Text>

        <Text style={styles.subtitle}>
          {t(
            'biometricUnlock.subtitle'
          )}
        </Text>

        {!!error && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={
                COLORS.red
              }
            />

            <Text
              style={
                styles.errorText
              }
            >
              {error}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={authenticate}
          disabled={
            authenticating
          }
          activeOpacity={0.85}
        >
          {authenticating ? (
            <ActivityIndicator
              size="small"
              color={
                COLORS.buttonText ||
                COLORS.bg
              }
            />
          ) : (
            <Ionicons
              name="finger-print-outline"
              size={22}
              color={
                COLORS.buttonText ||
                COLORS.bg
              }
            />
          )}

          <Text
            style={
              styles.buttonText
            }
          >
            {authenticating
              ? t(
                  'biometricUnlock.verifying'
                )
              : t(
                  'biometricUnlock.retry'
                )}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Spendly © 2026
        </Text>
      </View>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor:
        COLORS.bg,
    },

    content: {
      flex: 1,
      paddingHorizontal: 28,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    icon: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor:
        COLORS.accentDim,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}40`,
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 24,
    },

    title: {
      fontSize: 25,
      fontWeight: '800',
      color:
        COLORS.textPrimary,
      textAlign: 'center',
    },

    subtitle: {
      marginTop: 9,
      maxWidth: 330,
      fontSize: 14,
      lineHeight: 21,
      color:
        COLORS.textSecondary,
      textAlign: 'center',
    },

    errorBox: {
      marginTop: 22,
      maxWidth: 340,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        `${COLORS.red}16`,
      borderWidth: 1,
      borderColor:
        `${COLORS.red}40`,
      borderRadius: 14,
      padding: 12,
    },

    errorText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      color:
        COLORS.red,
    },

    button: {
      width: '100%',
      maxWidth: 340,
      minHeight: 54,
      marginTop: 26,
      borderRadius: 16,
      backgroundColor:
        COLORS.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 9,
    },

    buttonText: {
      fontSize: 15,
      fontWeight: '800',
      color:
        COLORS.buttonText ||
        COLORS.bg,
    },

    footer: {
      marginTop: 30,
      fontSize: 12,
      fontWeight: '600',
      color:
        COLORS.textMuted,
    },
  });
}