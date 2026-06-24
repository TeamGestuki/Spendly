import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#0D0F14',
  surfaceHigh: '#1E2330',
  border: '#272D3D',
  accent: '#4ADE80',
  accentDim: '#1A3D28',
  textPrimary: '#F0F2F7',
  textSecondary: '#9CA3AF',
  red: '#F87171',
};

const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCK_TIME_MS = 60 * 60 * 1000;

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function formatTimeLeft(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function PinUnlockScreen({ navigation, route }) {
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState('');
  const [lockedUntil, setLockedUntil] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  useEffect(() => {
    const loadLockState = async () => {
        const savedAttempts =
            await AsyncStorage.getItem('pin_failed_attempts');
                setFailedAttempts(savedAttempts ? Number(savedAttempts) : 0);

      const savedLockedUntil =
        await AsyncStorage.getItem('pin_locked_until');

      if (!savedLockedUntil) return;

      const lockTime = Number(savedLockedUntil);

      if (Date.now() < lockTime) {
        setLockedUntil(lockTime);
        setError('Demasiados intentos fallidos.');
      } else {
        await AsyncStorage.removeItem('pin_locked_until');
        await AsyncStorage.removeItem('pin_failed_attempts');
      }
    };

    loadLockState();
  }, []);

  useEffect(() => {
    if (!lockedUntil) {
      setTimeLeft('');
      return;
    }

    const updateCountdown = async () => {
      const remaining = lockedUntil - Date.now();

      if (remaining <= 0) {
        await AsyncStorage.removeItem('pin_locked_until');
        await AsyncStorage.removeItem('pin_failed_attempts');

        setLockedUntil(null);
        setTimeLeft('');
        setError('');
        return;
      }

      setTimeLeft(formatTimeLeft(remaining));
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleWrongPin = async () => {
    const currentAttemptsRaw =
      await AsyncStorage.getItem('pin_failed_attempts');

    const currentAttempts = currentAttemptsRaw
      ? Number(currentAttemptsRaw)
      : 0;

    const nextAttempts = currentAttempts + 1;

    setFailedAttempts(nextAttempts);

    if (nextAttempts >= MAX_PIN_ATTEMPTS) {
      const lockUntil = Date.now() + PIN_LOCK_TIME_MS;

      await AsyncStorage.setItem(
        'pin_locked_until',
        String(lockUntil)
      );

      await AsyncStorage.setItem(
        'pin_failed_attempts',
        String(nextAttempts)
      );

      setLockedUntil(lockUntil);
      setError('Demasiados intentos fallidos.');
      setPinValue('');
      return;
    }

    await AsyncStorage.setItem(
      'pin_failed_attempts',
      String(nextAttempts)
    );

    setError(
      `PIN incorrecto. Intentos restantes: ${
        MAX_PIN_ATTEMPTS - nextAttempts
      }`
    );

    setTimeout(() => {
      setPinValue('');
    }, 250);
  };

  const handlePinPress = async (digit) => {
    if (isLocked) {
      setError('Demasiados intentos fallidos.');
      return;
    }

    setError('');

    if (pinValue.length >= 4) return;

    const nextValue = pinValue + digit;
    setPinValue(nextValue);

    if (nextValue.length !== 4) return;

    const savedPin = await AsyncStorage.getItem('spendly_pin');

    if (nextValue === savedPin) {
      await AsyncStorage.removeItem('pin_failed_attempts');
      await AsyncStorage.removeItem('pin_locked_until');

      const redirectTo = route?.params?.redirectTo || 'Home';

      navigation.replace(redirectTo);
      
      return;
    }

    await handleWrongPin();
  };

  const handleDelete = () => {
    if (isLocked) return;

    setError('');
    setPinValue((prev) => prev.slice(0, -1));
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.content}>
        <View style={styles.lockIcon}>
          <AppIcon
            name={isLocked ? 'time-outline' : 'lock-closed-outline'}
            size={34}
            color={COLORS.accent}
          />
        </View>

        <Text style={styles.title}>
          {isLocked ? 'PIN bloqueado' : 'Desbloquear Spendly'}
        </Text>

        <Text style={styles.subtitle}>
          {isLocked
            ? `Probá nuevamente en ${timeLeft}.`
            : 'Ingresá tu PIN de acceso para continuar.'}
        </Text>

        <Text style={[styles.pinDots, isLocked && styles.pinDotsDisabled]}>
          {'●'.repeat(pinValue.length)}
          {'○'.repeat(4 - pinValue.length)}
        </Text>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.pinGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.pinKey,
                isLocked && styles.pinKeyDisabled,
              ]}
              onPress={() => handlePinPress(String(num))}
              disabled={isLocked}
              activeOpacity={0.75}
            >
              <Text style={styles.pinKeyText}>{num}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.pinKeyPlaceholder} />

          <TouchableOpacity
            style={[
              styles.pinKey,
              isLocked && styles.pinKeyDisabled,
            ]}
            onPress={() => handlePinPress('0')}
            disabled={isLocked}
            activeOpacity={0.75}
          >
            <Text style={styles.pinKeyText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pinKey,
              isLocked && styles.pinKeyDisabled,
            ]}
            onPress={handleDelete}
            disabled={isLocked}
            activeOpacity={0.75}
          >
            <AppIcon
              name="backspace-outline"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lockIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 30,
  },

  pinDots: {
    fontSize: 30,
    color: COLORS.accent,
    letterSpacing: 9,
    marginBottom: 14,
  },

  pinDotsDisabled: {
    color: COLORS.textSecondary,
  },

  errorText: {
    fontSize: 13,
    color: COLORS.red,
    marginBottom: 14,
    textAlign: 'center',
  },

  pinGrid: {
    width: '100%',
    maxWidth: 260,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },

  pinKey: {
    width: 70,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceHigh,
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
});