/**
 * RegisterScreen.js
 * Pantalla de registro para Spendly
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Paleta de colores ───────────────────────────────
const COLORS = {
  bg:           '#0D0F14',
  surface:      '#161A23',
  surfaceHigh:  '#1E2330',
  border:       '#272D3D',
  borderFocus:  '#4ADE80',
  accent:       '#4ADE80',
  accentDim:    '#1A3D28',
  textPrimary:  '#F0F2F7',
  textSecondary:'#6B748A',
  textMuted:    '#3E4557',
  error:        '#F87171',
  white:        '#FFFFFF',
};

export default function RegisterScreen({ navigation }) {
  // ─── Estado del formulario ─────────────────────────────────────────────────
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [acceptedTerms, setAcceptedTerms]       = useState(false);
  const [loading, setLoading]                   = useState(false);

  // Focus states
  const [nameFocused, setNameFocused]           = useState(false);
  const [emailFocused, setEmailFocused]         = useState(false);
  const [passFocused, setPassFocused]           = useState(false);
  const [confirmFocused, setConfirmFocused]     = useState(false);

  // Error states
  const [emailError, setEmailError]             = useState('');
  const [passwordError, setPasswordError]       = useState('');
  const [confirmError, setConfirmError]         = useState('');

  // Animación del botón
  const buttonScale = useRef(new Animated.Value(1)).current;

  // ─── Validaciones ──────────────────────────────────────────────────────────

  const validateEmail = (text) => {
    setEmail(text);
    if (text.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Ingresá un correo válido');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text.length > 0 && text.length < 8) {
      setPasswordError('Mínimo 8 caracteres');
    } else {
      setPasswordError('');
    }
    // Re-validar confirmación si ya tiene texto
    if (confirmPassword.length > 0 && text !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden');
    } else if (confirmPassword.length > 0) {
      setConfirmError('');
    }
  };

  const validateConfirm = (text) => {
    setConfirmPassword(text);
    if (text.length > 0 && text !== password) {
      setConfirmError('Las contraseñas no coinciden');
    } else {
      setConfirmError('');
    }
  };

  // ─── Formulario válido para habilitar el botón ─────────────────────────────
  const isFormValid =
    name.trim().length > 0 &&
    email.length > 0 &&
    !emailError &&
    password.length >= 8 &&
    !passwordError &&
    confirmPassword === password &&
    !confirmError &&
    acceptedTerms;

  // ─── Animación del botón ───────────────────────────────────────────────────
  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  // ─── Acción de registro (simulada) ────────────────────────────────────────
  const handleRegister = () => {
    if (!isFormValid) return;
    setLoading(true);
    // Aquí va la llamada al backend cuando esté listo
    setTimeout(() => setLoading(false), 1500);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cabecera / Branding ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Text style={styles.logoIcon}>$</Text>
              </View>
            </View>
          </View>
          <Text style={styles.appName}>Spendly</Text>
          <Text style={styles.tagline}>Gestión inteligente de gastos</Text>
        </View>

        {/* ── Tarjeta del formulario ──────────────────────────────────────── */}
        <View style={styles.card}>

          <Text style={styles.formTitle}>Crear cuenta</Text>
          <Text style={styles.formSubtitle}>Empezá a gestionar tus gastos</Text>

          {/* ── Input: Nombre ─────────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={[
              styles.inputWrapper,
              nameFocused && styles.inputWrapperFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* ── Input: Correo electrónico ──────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused,
              emailError   && styles.inputWrapperError,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="tu@correo.com"
                placeholderTextColor={COLORS.textSecondary}
                value={email}
                onChangeText={validateEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            {!!emailError && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
          </View>

          {/* ── Input: Contraseña ─────────────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={[
              styles.inputWrapper,
              passFocused && styles.inputWrapperFocused,
              passwordError && styles.inputWrapperError,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={validatePassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                secureTextEntry={!showPassword}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
            {!!passwordError && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
          </View>

          {/* ── Input: Confirmar contraseña ───────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={[
              styles.inputWrapper,
              confirmFocused && styles.inputWrapperFocused,
              confirmError   && styles.inputWrapperError,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor={COLORS.textSecondary}
                value={confirmPassword}
                onChangeText={validateConfirm}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
            {!!confirmError && (
              <Text style={styles.errorText}>{confirmError}</Text>
            )}
          </View>

          {/* ── Checkbox: Términos y condiciones ─────────────────────── */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.checkbox,
              acceptedTerms && styles.checkboxChecked,
            ]}>
              {acceptedTerms && (
                <Ionicons name="checkmark" size={13} color="#0D1A12" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              Acepto los{' '}
              <Text style={styles.checkboxLink}>Términos y condiciones</Text>
              {' '}y la{' '}
              <Text style={styles.checkboxLink}>Política de privacidad</Text>
            </Text>
          </TouchableOpacity>

          {/* ── Botón principal ───────────────────────────────────────── */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !isFormValid && styles.primaryButtonDisabled,
              ]}
              onPress={handleRegister}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <Text style={styles.primaryButtonText}>Creando cuenta...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Crear cuenta</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* ── Separador ─────────────────────────────────────────────── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Volver al login ───────────────────────────────────────── */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* ── Espaciado inferior ─────────────────────────────────────────── */}
        <View style={{ height: 20 }} />

      </ScrollView>
    </View>
  );
}

// ─── Estilos ───────────────────────────────────────
const styles = StyleSheet.create({

  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },

  // ── Cabecera / Branding ─────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoOuter: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 30,
    color: COLORS.accent,
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },

  // ── Tarjeta ─────────────────────────────────────────────────────────────
  card: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 28,
  },

  // ── Campos ──────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,

  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: 5,
    marginLeft: 2,
  },

  // ── Checkbox ─────────────────────────────────────────────────────────────
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  checkboxLink: {
    color: COLORS.accent,
    fontWeight: '500',
  },

  // ── Botón principal ──────────────────────────────────────────────────────
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.accentDim,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D1A12',
    letterSpacing: 0.3,
  },

  // ── Separador ────────────────────────────────────────────────────────────
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 12,
    fontWeight: '500',
  },

  // ── Fila de navegación ────────────────────────────────────────────────────
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '700',
  },
});