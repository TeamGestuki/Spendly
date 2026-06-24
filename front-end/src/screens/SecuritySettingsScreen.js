import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Modal,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

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
  orange: '#FB923C',
  purple: '#C084FC',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
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
 const [biometricEnabled, setBiometricEnabled] = useState(false);
const [pinEnabled, setPinEnabled] = useState(false);
const [biometricAvailable, setBiometricAvailable] = useState(false);
const [biometricEnrolled, setBiometricEnrolled] = useState(false);
const [securityAlertsEnabled, setSecurityAlertsEnabled] = useState(true);
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
      alert('Este dispositivo no soporta Face ID o huella.');
      return;
    }

    const enrolled =
      await LocalAuthentication.isEnrolledAsync();

    if (!enrolled) {
      alert('No tenés Face ID o huella configurados.');
      return;
    }

    const result =
      await LocalAuthentication.authenticateAsync({
        promptMessage: value
          ? 'Activar Face ID para Spendly'
          : 'Desactivar Face ID para Spendly',
        cancelLabel: 'Cancelar',
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
        setPinError('Los PIN no coinciden.');
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
      setPinError('PIN incorrecto.');
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>Seguridad y acceso</Text>

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

          <Text style={styles.heroTitle}>Protegé tu cuenta</Text>
          <Text style={styles.heroText}>
            Administrá tu contraseña, métodos de acceso y seguridad local del dispositivo.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Acceso</Text>
        <View style={styles.card}>
          <SecurityItem
            icon="lock-closed-outline"
            iconColor={COLORS.blue}
            label="Cambiar contraseña"
            value="Actualizá tu clave de acceso"
            onPress={() => navigation.navigate('ChangePassword')}
          />

          <SecurityItem
            icon="finger-print-outline"
            iconColor={COLORS.accent}
            label="Face ID / huella"
            value={biometricEnabled ? 'Activado' : 'Desactivado'}
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
            icon="keypad-outline"
            iconColor={COLORS.purple}
            label="PIN de acceso"
            value={pinEnabled ? 'Activado' : 'Próximamente funcional'}
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

        <Text style={styles.sectionTitle}>Sesión</Text>
        <View style={styles.card}>

          <SecurityItem
            icon="desktop-outline"
            iconColor={COLORS.orange}
            label="Dispositivos conectados"
            value="Ver sesiones activas"
            onPress={() => navigation.navigate('Sessions')}
          />

          <SecurityItem
            icon="log-out-outline"
            iconColor={COLORS.red}
            label="Cerrar sesión en este dispositivo"
            value="Salir de Spendly en este celular"
            onPress={handleLogoutDevice}
          />

          <SecurityItem
            icon="exit-outline"
            iconColor={COLORS.red}
            label="Cerrar sesión en todos los dispositivos"
            value="Requiere backend de sesiones"
            disabled
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>Alertas</Text>
        <View style={styles.card}>
          <SecurityItem
            icon="notifications-outline"
            iconColor={COLORS.orange}
            label="Alertas de seguridad"
            value={securityAlertsEnabled ? 'Activadas' : 'Desactivadas'}
            rightElement={
              <Switch
                value={securityAlertsEnabled}
                onValueChange={setSecurityAlertsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.accentDim }}
                thumbColor={securityAlertsEnabled ? COLORS.accent : COLORS.textMuted}
              />
            }
          />

          <SecurityItem
            icon="mail-outline"
            iconColor={COLORS.blue}
            label="Avisos por email"
            value="Próximamente"
            disabled
            isLast
          />
        </View>

        <Text style={styles.infoText}>
          Algunas opciones están preparadas visualmente y se conectarán cuando el backend de sesiones y seguridad esté disponible.
        </Text>

        <View style={{ height: 40 }} />
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
                  ? 'Crear PIN'
                  : 'Confirmar PIN'
                : 'Desactivar PIN'}
            </Text>

            <Text style={styles.modalText}>
              {pinMode === 'create'
                ? pinStep === 'enter'
                  ? 'Ingresá un PIN de 4 dígitos para proteger Spendly.'
                  : 'Volvé a ingresar el PIN para confirmarlo.'
                : 'Ingresá tu PIN actual para desactivarlo.'}
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
              <Text style={styles.cancelText}>Cancelar</Text>
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

            <Text style={styles.modalTitle}>Cerrar sesión</Text>

            <Text style={styles.modalText}>
              ¿Querés cerrar sesión en este dispositivo?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.16)',
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
    backgroundColor: 'rgba(248,113,113,0.12)',
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
    backgroundColor: 'rgba(248,113,113,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.35)',
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
});