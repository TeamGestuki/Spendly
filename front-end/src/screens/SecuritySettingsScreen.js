import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Modal,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';


function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function SecurityItem({
  icon,
  iconColor = COLORS.accent,
  label,
  value,
  onPress,
  rightElement,
  disabled = false,
  isLast = false,
  styles,
  COLORS,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        isLast && styles.itemLast,
        disabled && styles.itemDisabled,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.itemIcon,
          { backgroundColor: `${iconColor}18` },
        ]}
      >
        <AppIcon name={icon} size={18} color={iconColor} />
      </View>

      <View style={styles.itemBody}>
        <Text style={styles.itemLabel}>{label}</Text>
        {!!value && <Text style={styles.itemValue}>{value}</Text>}
      </View>

      {rightElement || (
        <AppIcon
          name="chevron-forward"
          size={16}
          color={disabled ? COLORS.textMuted : COLORS.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
}

export default function SecuritySettingsScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
 const [biometricEnabled, setBiometricEnabled] = useState(false);
const [pinEnabled, setPinEnabled] = useState(false);
const [biometricAvailable, setBiometricAvailable] = useState(false);
const [biometricEnrolled, setBiometricEnrolled] = useState(false);
const [logoutModalVisible, setLogoutModalVisible] = useState(false);

const [pinModalVisible, setPinModalVisible] = useState(false);
const [pinMode, setPinMode] = useState('create');
const [pinStep, setPinStep] = useState('enter');
const [pinValue, setPinValue] = useState('');
const [pinConfirmValue, setPinConfirmValue] = useState('');
const [pinError, setPinError] = useState('');

  const biometricBlocked =
  pinEnabled || !biometricAvailable || !biometricEnrolled;

  const pinBlocked = biometricEnabled;

  useEffect(() => {
  const loadSecuritySettings = async () => {
    const savedBiometric =
      await AsyncStorage.getItem('biometric_enabled');

    const savedPin =
      await AsyncStorage.getItem('pin_enabled');

    const compatible =
      await LocalAuthentication.hasHardwareAsync();

    const enrolled =
      await LocalAuthentication.isEnrolledAsync();

    setBiometricAvailable(compatible);
    setBiometricEnrolled(enrolled);

    setBiometricEnabled(
      savedBiometric === 'true' && compatible && enrolled
    );

    setPinEnabled(savedPin === 'true');
  };

  loadSecuritySettings();
}, []);

  const handleToggleBiometric = async (value) => {
  try {
    const compatible =
      await LocalAuthentication.hasHardwareAsync();

    if (!compatible) {
      Alert.alert(t('common.error'), t('security.biometricUnavailable'));
      return;
    }

    const enrolled =
      await LocalAuthentication.isEnrolledAsync();

    if (!enrolled) {
      Alert.alert(t('common.error'), t('security.biometricNotConfigured'));
      return;
    }

    const result =
      await LocalAuthentication.authenticateAsync({
        promptMessage: value
          ? t('security.enableBiometricPrompt')
          : t('security.disableBiometricPrompt'),
        cancelLabel: t('common.cancel'),
        disableDeviceFallback: false,
      });

    if (!result.success) {
      return;
    }

    await AsyncStorage.setItem(
      'biometric_enabled',
      value ? 'true' : 'false'
    );

    setBiometricEnabled(value);
  } catch (error) {
    console.log('Biometric error:', error);
  }
};

const handleTogglePin = async (value) => {
  if (biometricEnabled) return;

  setPinError('');
  setPinValue('');
  setPinConfirmValue('');

  if (value) {
    setPinMode('create');
    setPinStep('enter');
    setPinModalVisible(true);
  } else {
    setPinMode('disable');
    setPinStep('enter');
    setPinModalVisible(true);
  }
};

const handlePinPress = async (digit) => {
  setPinError('');

  const currentValue =
    pinStep === 'confirm'
      ? pinConfirmValue
      : pinValue;

  if (currentValue.length >= 4) return;

  const nextValue = currentValue + digit;

  // ─── Confirmación PIN ─────────────────────
  if (pinStep === 'confirm') {
    setPinConfirmValue(nextValue);

    if (nextValue.length === 4) {
      if (nextValue !== pinValue) {
        setPinError(t('security.pinMismatch'));
        setPinConfirmValue('');
        return;
      }

      await AsyncStorage.setItem(
        'spendly_pin',
        pinValue
      );

      await AsyncStorage.setItem(
        'pin_enabled',
        'true'
      );

      setPinEnabled(true);
      setPinModalVisible(false);

      setPinValue('');
      setPinConfirmValue('');
      setPinStep('enter');
    }

    return;
  }

  // ─── Primer ingreso ─────────────────────
  setPinValue(nextValue);

  if (nextValue.length === 4) {

    // Crear PIN
    if (pinMode === 'create') {
      setTimeout(() => {
        setPinStep('confirm');
        setPinConfirmValue('');
      }, 200);

      return;
    }

    // Desactivar PIN
    const savedPin =
      await AsyncStorage.getItem('spendly_pin');

    if (nextValue !== savedPin) {
      setPinError(t('security.incorrectPin'));
      setPinValue('');
      return;
    }

    await AsyncStorage.removeItem(
      'spendly_pin'
    );

    await AsyncStorage.setItem(
      'pin_enabled',
      'false'
    );

    setPinEnabled(false);
    setPinModalVisible(false);

    setPinValue('');
    setPinConfirmValue('');
    setPinStep('enter');
  }
};

const handlePinDelete = () => {
  setPinError('');

  if (pinStep === 'confirm') {
    setPinConfirmValue((prev) =>
      prev.slice(0, -1)
    );
  } else {
    setPinValue((prev) =>
      prev.slice(0, -1)
    );
  }
};

const closePinModal = () => {
  setPinModalVisible(false);
  setPinError('');
  setPinValue('');
  setPinConfirmValue('');
  setPinStep('enter');
};

  const handleLogoutDevice = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    setLogoutModalVisible(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>{t('security.title')}</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon name="shield-checkmark-outline" size={28} color={COLORS.accent} />
          </View>

          <Text style={styles.heroTitle}>{t('security.heroTitle')}</Text>
          <Text style={styles.heroText}>
            {t('security.heroText')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>{t('security.access')}</Text>
        <View style={styles.card}>
          <SecurityItem
            styles={styles}
            COLORS={COLORS}
            icon="lock-closed-outline"
            iconColor={COLORS.blue}
            label={t('security.changePassword')}
            value={t('security.changePasswordSubtitle')}
            onPress={() => {
              if (pinEnabled) {
                navigation.navigate(
                  'PinUnlock',
                  {
                    redirectTo:
                      'ChangePassword',
                  }
                );
              } else {
                navigation.navigate(
                  'ChangePassword'
                );
              }
            }}
          />

          <SecurityItem
            styles={styles}
            COLORS={COLORS}
            icon="finger-print-outline"
            iconColor={COLORS.accent}
            label={t('security.biometric')}
            value={biometricEnabled ? t('security.enabled') : t('security.disabled')}
            disabled={biometricBlocked}
            rightElement={
              <Switch
                value={biometricEnabled}
                onValueChange={handleToggleBiometric}
                disabled={biometricBlocked}
                trackColor={{
                  false: COLORS.surfaceHigh,
                  true: COLORS.accentDim,
                }}
                thumbColor={
                  biometricEnabled
                    ? COLORS.accent
                    : COLORS.textSecondary
                }
              />
            }
          />

          <SecurityItem
            styles={styles}
            COLORS={COLORS}
            icon="keypad-outline"
            iconColor={COLORS.purple}
            label={t('security.accessPin')}
            value={pinEnabled ? t('security.enabled') : t('security.disabled')}
            disabled={pinBlocked}
            rightElement={
              <Switch
                value={pinEnabled}
                onValueChange={handleTogglePin}
                trackColor={{
                  false: COLORS.surfaceHigh,
                  true: COLORS.accentDim,
                }}
                thumbColor={
                  pinEnabled
                    ? COLORS.accent
                    : COLORS.textSecondary
                }
              />
            }
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>{t('security.sessions')}</Text>
        <View style={styles.card}>

          <SecurityItem
            styles={styles}
            COLORS={COLORS}
            icon="desktop-outline"
            iconColor={COLORS.orange}
            label={t('security.connectedDevices')}
            value={t('security.connectedDevicesSubtitle')}
            onPress={() => navigation.navigate('Sessions')}
          />

          <SecurityItem
            styles={styles}
            COLORS={COLORS}
            icon="log-out-outline"
            iconColor={COLORS.red}
            label={t('security.logoutDevice')}
            value={t('security.logoutDeviceSubtitle')}
            onPress={handleLogoutDevice}
            isLast
          />
        </View>

        <Text style={styles.footerText}>Spendly © 2026</Text>
      </ScrollView>
      
      <Modal
        visible={pinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closePinModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={closePinModal}
              >
                <AppIcon
                  name="arrow-back"
                  size={22}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            <View style={styles.modalIcon}>
              <AppIcon name="keypad-outline" size={26} color={COLORS.accent} />
            </View>

            <Text style={styles.modalTitle}>
              {pinMode === 'create'
                ? pinStep === 'enter'
                  ? t('security.createPin')
                  : t('security.confirmPin')
                : t('security.disablePin')}
            </Text>

            <Text style={styles.modalText}>
              {pinMode === 'create'
                ? pinStep === 'enter'
                  ? t('security.createPinText')
                  : t('security.confirmPinText')
                : t('security.disablePinText')}
            </Text>

            <Text style={styles.pinDots}>
              {'●'.repeat(
                pinStep === 'confirm'
                  ? pinConfirmValue.length
                  : pinValue.length
              )}
              {'○'.repeat(
                4 -
                  (pinStep === 'confirm'
                    ? pinConfirmValue.length
                    : pinValue.length)
              )}
            </Text>

            {!!pinError && (
              <Text style={styles.pinError}>{pinError}</Text>
            )}

            <View style={styles.pinGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.pinKey}
                  onPress={() => handlePinPress(String(num))}
                >
                  <Text style={styles.pinKeyText}>{num}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.pinKeyPlaceholder} />

              <TouchableOpacity
                style={styles.pinKey}
                onPress={() => handlePinPress('0')}
              >
                <Text style={styles.pinKeyText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pinKey}
                onPress={handlePinDelete}
              >
                <AppIcon name="backspace-outline" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={closePinModal}
            >
              <Text style={styles.cancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.modalIcon}>
              <AppIcon name="log-out-outline" size={26} color={COLORS.red} />
            </View>

            <Text style={styles.modalTitle}>{t('security.logoutTitle')}</Text>

            <Text style={styles.modalText}>
              {t('security.logoutConfirm')}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>{t('security.logoutTitle')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 30,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: `${COLORS.accent}29`,
    padding: 22,
    marginBottom: 24,
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
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemDisabled: {
    opacity: 0.55,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemValue: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoutModal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${COLORS.red}1F`,
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
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${COLORS.red}24`,
    borderWidth: 1,
    borderColor: `${COLORS.red}59`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.red,
  },

  pinDots: {
  fontSize: 28,
  color: COLORS.accent,
  letterSpacing: 8,
  marginBottom: 16,
},

pinError: {
  fontSize: 12,
  color: COLORS.red,
  marginBottom: 12,
  textAlign: 'center',
},

pinGrid: {
  width: '100%',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 12,
  marginBottom: 18,
},

pinKey: {
  width: 68,
  height: 58,
  borderRadius: 18,
  backgroundColor: COLORS.surfaceHigh,
  borderWidth: 1,
  borderColor: COLORS.border,
  alignItems: 'center',
  justifyContent: 'center',
},

pinKeyPlaceholder: {
  width: 68,
  height: 58,
},

pinKeyText: {
  fontSize: 22,
  fontWeight: '800',
  color: COLORS.textPrimary,
},
  footerText: { marginTop: 8, textAlign: 'center', fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  });
}
