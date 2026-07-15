/**
 * PinUnlockScreen.js
 * Pantalla de desbloqueo mediante PIN para accesos sensibles.
 */

import React, {
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

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useLanguage,
} from '../context/LanguageContext';

const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCK_TIME_MS =
  60 * 60 * 1000;

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

function formatTimeLeft(
  milliseconds,
  t
) {
  const totalSeconds =
    Math.max(
      0,
      Math.ceil(
        milliseconds / 1000
      )
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
    );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    return t(
      'pinUnlock.time.hoursMinutes'
    )
      .replace(
        '{hours}',
        String(hours)
      )
      .replace(
        '{minutes}',
        String(minutes)
      );
  }

  return `${minutes}:${String(
    seconds
  ).padStart(2, '0')}`;
}

export default function PinUnlockScreen({
  navigation,
  route,
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
    pinValue,
    setPinValue,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    lockedUntil,
    setLockedUntil,
  ] = useState(null);

  const [
    failedAttempts,
    setFailedAttempts,
  ] = useState(0);

  const [
    timeLeft,
    setTimeLeft,
  ] = useState('');

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    validating,
    setValidating,
  ] = useState(false);

  const isLocked =
    !!lockedUntil &&
    Date.now() < lockedUntil;

  useEffect(() => {
    const loadLockState =
      async () => {
        try {
          const [
            savedAttempts,
            savedLockedUntil,
          ] = await Promise.all([
            AsyncStorage.getItem(
              'pin_failed_attempts'
            ),
            AsyncStorage.getItem(
              'pin_locked_until'
            ),
          ]);

          setFailedAttempts(
            savedAttempts
              ? Number(savedAttempts)
              : 0
          );

          if (!savedLockedUntil) {
            return;
          }

          const lockTime =
            Number(
              savedLockedUntil
            );

          if (
            Date.now() <
            lockTime
          ) {
            setLockedUntil(
              lockTime
            );

            setError(
              t(
                'pinUnlock.tooManyAttempts'
              )
            );
          } else {
            await AsyncStorage.multiRemove([
              'pin_locked_until',
              'pin_failed_attempts',
            ]);
          }
        } catch (loadError) {
          console.log(
            'Error cargando bloqueo PIN:',
            loadError
          );

          setError(
            t('pinUnlock.loadError')
          );
        } finally {
          setLoading(false);
        }
      };

    loadLockState();
  }, [t]);

  useEffect(() => {
    if (!lockedUntil) {
      setTimeLeft('');
      return undefined;
    }

    const updateCountdown =
      async () => {
        const remaining =
          lockedUntil -
          Date.now();

        if (remaining <= 0) {
          await AsyncStorage.multiRemove([
            'pin_locked_until',
            'pin_failed_attempts',
          ]);

          setLockedUntil(null);
          setFailedAttempts(0);
          setTimeLeft('');
          setError('');
          return;
        }

        setTimeLeft(
          formatTimeLeft(
            remaining,
            t
          )
        );
      };

    updateCountdown();

    const interval =
      setInterval(
        updateCountdown,
        1000
      );

    return () =>
      clearInterval(interval);
  }, [
    lockedUntil,
    t,
  ]);

  const handleWrongPin =
    async () => {
      const storedAttempts =
        await AsyncStorage.getItem(
          'pin_failed_attempts'
        );

      const currentAttempts =
        storedAttempts
          ? Number(
              storedAttempts
            )
          : 0;

      const nextAttempts =
        currentAttempts + 1;

      setFailedAttempts(
        nextAttempts
      );

      if (
        nextAttempts >=
        MAX_PIN_ATTEMPTS
      ) {
        const lockUntil =
          Date.now() +
          PIN_LOCK_TIME_MS;

        await AsyncStorage.multiSet([
          [
            'pin_locked_until',
            String(lockUntil),
          ],
          [
            'pin_failed_attempts',
            String(nextAttempts),
          ],
        ]);

        setLockedUntil(
          lockUntil
        );

        setError(
          t(
            'pinUnlock.tooManyAttempts'
          )
        );

        setPinValue('');
        return;
      }

      await AsyncStorage.setItem(
        'pin_failed_attempts',
        String(nextAttempts)
      );

      const attemptsLeft =
        MAX_PIN_ATTEMPTS -
        nextAttempts;

      setError(
        t(
          'pinUnlock.incorrectWithAttempts'
        ).replace(
          '{attempts}',
          String(attemptsLeft)
        )
      );

      setTimeout(() => {
        setPinValue('');
      }, 220);
    };

  const unlock = async () => {
    const redirectTo =
      route?.params?.redirectTo ||
      'Home';

    const redirectParams =
      route?.params?.redirectParams;

    await AsyncStorage.multiRemove([
      'pin_failed_attempts',
      'pin_locked_until',
    ]);

    navigation.replace(
      redirectTo,
      redirectParams
    );
  };

  const handlePinPress =
    async (digit) => {
      if (
        isLocked ||
        validating
      ) {
        if (isLocked) {
          setError(
            t(
              'pinUnlock.tooManyAttempts'
            )
          );
        }

        return;
      }

      setError('');

      if (
        pinValue.length >= 4
      ) {
        return;
      }

      const nextValue =
        pinValue + digit;

      setPinValue(nextValue);

      if (
        nextValue.length !== 4
      ) {
        return;
      }

      try {
        setValidating(true);

        const savedPin =
          await AsyncStorage.getItem(
            'spendly_pin'
          );

        if (!savedPin) {
          setError(
            t(
              'pinUnlock.pinNotConfigured'
            )
          );

          setTimeout(() => {
            navigation.goBack();
          }, 900);

          return;
        }

        if (
          nextValue === savedPin
        ) {
          await unlock();
          return;
        }

        await handleWrongPin();
      } catch (validationError) {
        console.log(
          'Error validando PIN:',
          validationError
        );

        setError(
          t(
            'pinUnlock.validationError'
          )
        );

        setPinValue('');
      } finally {
        setValidating(false);
      }
    };

  const handleDelete = () => {
    if (
      isLocked ||
      validating
    ) {
      return;
    }

    setError('');

    setPinValue(
      (previous) =>
        previous.slice(0, -1)
    );
  };

  const handleBack = () => {
    if (validating) {
      return;
    }

    navigation.goBack();
  };

  if (loading) {
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

        <View
          style={
            styles.loadingWrapper
          }
        >
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />

          <Text
            style={
              styles.loadingText
            }
          >
            {t(
              'pinUnlock.loading'
            )}
          </Text>
        </View>
      </View>
    );
  }

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

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.8}
        disabled={validating}
      >
        <AppIcon
          name="chevron-back"
          size={22}
          color={
            COLORS.textPrimary
          }
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View
          style={[
            styles.lockIcon,
            isLocked &&
              styles.lockIconBlocked,
          ]}
        >
          <AppIcon
            name={
              isLocked
                ? 'time-outline'
                : 'lock-closed-outline'
            }
            size={34}
            color={
              isLocked
                ? COLORS.orange
                : COLORS.accent
            }
          />
        </View>

        <Text style={styles.title}>
          {isLocked
            ? t(
                'pinUnlock.lockedTitle'
              )
            : t(
                'pinUnlock.title'
              )}
        </Text>

        <Text style={styles.subtitle}>
          {isLocked
            ? t(
                'pinUnlock.lockedSubtitle'
              ).replace(
                '{time}',
                timeLeft
              )
            : t(
                'pinUnlock.subtitle'
              )}
        </Text>

        <Text
          style={[
            styles.pinDots,
            isLocked &&
              styles.pinDotsDisabled,
          ]}
        >
          {'●'.repeat(
            pinValue.length
          )}
          {'○'.repeat(
            4 -
              pinValue.length
          )}
        </Text>

        {!!error && (
          <View style={styles.errorBox}>
            <AppIcon
              name="alert-circle-outline"
              size={17}
              color={COLORS.red}
            />

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        <View style={styles.pinGrid}>
          {[
            1, 2, 3,
            4, 5, 6,
            7, 8, 9,
          ].map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.pinKey,
                (isLocked ||
                  validating) &&
                  styles.pinKeyDisabled,
              ]}
              onPress={() =>
                handlePinPress(
                  String(number)
                )
              }
              disabled={
                isLocked ||
                validating
              }
              activeOpacity={0.75}
            >
              <Text
                style={
                  styles.pinKeyText
                }
              >
                {number}
              </Text>
            </TouchableOpacity>
          ))}

          <View
            style={
              styles.pinKeyPlaceholder
            }
          />

          <TouchableOpacity
            style={[
              styles.pinKey,
              (isLocked ||
                validating) &&
                styles.pinKeyDisabled,
            ]}
            onPress={() =>
              handlePinPress('0')
            }
            disabled={
              isLocked ||
              validating
            }
            activeOpacity={0.75}
          >
            <Text
              style={
                styles.pinKeyText
              }
            >
              0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pinKey,
              (isLocked ||
                validating) &&
                styles.pinKeyDisabled,
            ]}
            onPress={handleDelete}
            disabled={
              isLocked ||
              validating
            }
            activeOpacity={0.75}
          >
            {validating ? (
              <ActivityIndicator
                size="small"
                color={
                  COLORS.accent
                }
              />
            ) : (
              <AppIcon
                name="backspace-outline"
                size={22}
                color={
                  COLORS.textPrimary
                }
              />
            )}
          </TouchableOpacity>
        </View>

        {!isLocked &&
          failedAttempts > 0 && (
          <Text
            style={
              styles.attemptsInfo
            }
          >
            {t(
              'pinUnlock.attemptsUsed'
            )
              .replace(
                '{used}',
                String(
                  failedAttempts
                )
              )
              .replace(
                '{max}',
                String(
                  MAX_PIN_ATTEMPTS
                )
              )}
          </Text>
        )}

        <Text style={styles.footerText}>
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
      backgroundColor: COLORS.bg,
    },

    backButton: {
      position: 'absolute',
      top: 56,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
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
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 80,
      paddingBottom: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },

    lockIcon: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor:
        COLORS.accentDim,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}35`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
    },

    lockIconBlocked: {
      backgroundColor:
        `${COLORS.orange}16`,
      borderColor:
        `${COLORS.orange}40`,
    },

    title: {
      fontSize: 24,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },

    subtitle: {
      maxWidth: 330,
      fontSize: 14,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: 28,
    },

    pinDots: {
      fontSize: 30,
      color: COLORS.accent,
      letterSpacing: 9,
      marginBottom: 16,
    },

    pinDotsDisabled: {
      color: COLORS.textMuted,
    },

    errorBox: {
      maxWidth: 330,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        `${COLORS.red}16`,
      borderWidth: 1,
      borderColor:
        `${COLORS.red}40`,
      borderRadius: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 16,
    },

    errorText: {
      flex: 1,
      fontSize: 12,
      color: COLORS.red,
      lineHeight: 17,
      textAlign: 'center',
    },

    pinGrid: {
      width: '100%',
      maxWidth: 260,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      marginTop: 4,
    },

    pinKey: {
      width: 70,
      height: 60,
      borderRadius: 18,
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    pinKeyDisabled: {
      opacity: 0.35,
    },

    pinKeyPlaceholder: {
      width: 70,
      height: 60,
    },

    pinKeyText: {
      fontSize: 23,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },

    attemptsInfo: {
      marginTop: 18,
      fontSize: 11,
      color: COLORS.textMuted,
      textAlign: 'center',
    },

    footerText: {
      marginTop: 30,
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.textMuted,
      textAlign: 'center',
    },
  });
}
