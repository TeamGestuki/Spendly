/**
 * RegisterScreen.js
 * Pantalla de registro para Spendly
 */

import React, { useState, useRef, useCallback } from 'react';
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
import { registerUser } from '../services/authService';

const COLORS = {
  bg:            '#0D0F14',
  surface:       '#161A23',
  surfaceHigh:   '#1E2330',
  border:        '#272D3D',
  borderFocus:   '#4ADE80',
  accent:        '#4ADE80',
  accentDim:     '#1A3D28',
  textPrimary:   '#F0F2F7',
  textSecondary: '#6B748A',
  textMuted:     '#3E4557',
  error:         '#F87171',
};

export default function RegisterScreen({ navigation }) {
  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [acceptedTerms, setAcceptedTerms]     = useState(false);
  const [loading, setLoading]                 = useState(false);

  const [emailError, setEmailError]       = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError]   = useState('');
  const [registerError, setRegisterError] = useState('');

  const buttonScale = useRef(new Animated.Value(1)).current;

  // Referencias para cambiar borde sin re-render
  const nameWrapperRef    = useRef(null);
  const emailWrapperRef   = useRef(null);
  const passWrapperRef    = useRef(null);
  const confirmWrapperRef = useRef(null);

  const validateEmail = useCallback((text) => {
    setEmail(text);
    if (text.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('Ingresá un correo válido');
    } else {
      setEmailError('');
    }
  }, []);

  const validatePassword = useCallback((text) => {
    setPassword(text);
    if (text.length > 0 && text.length < 8) {
      setPasswordError('Mínimo 8 caracteres');
    } else {
      setPasswordError('');
    }
    if (confirmPassword.length > 0) {
      setConfirmError(text !== confirmPassword ? 'Las contraseñas no coinciden' : '');
    }
  }, [confirmPassword]);

  const validateConfirm = useCallback((text) => {
    setConfirmPassword(text);
    if (text.length > 0 && text !== password) {
      setConfirmError('Las contraseñas no coinciden');
    } else {
      setConfirmError('');
    }
  }, [password]);

  const isFormValid =
    name.trim().length > 0 &&
    email.length > 0 && !emailError &&
    password.length >= 8 && !passwordError &&
    confirmPassword === password && !confirmError &&
    acceptedTerms;

  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  }, [buttonScale]);

const handleRegister = useCallback(async () => {
  if (!isFormValid) return;

  try {
    setLoading(true);
    setRegisterError('');

    await registerUser(
      name.trim(),
      email,
      password
    );

    navigation.replace('Login');
  } catch (error) {
    if (
      error.message?.includes('registrado')
    ) {
      setRegisterError(
        'El email ya se encuentra registrado. Probá con otro o inicia sesión.'
      );
    } else {
      setRegisterError(
        'Tuvimos un problema, intentalo más tarde.'
      );
    }
  } finally {
    setLoading(false);
  }
}, [isFormValid, name, email, password, navigation]);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Branding ── */}
        <View style={styles.header}>
          <View style={styles.logoOuter}>
            <Text style={styles.logoIcon}>$</Text>
          </View>
          <Text style={styles.appName}>Spendly</Text>
          <Text style={styles.tagline}>Gestión inteligente de gastos</Text>
        </View>

        {/* ── Tarjeta ── */}
        <View style={styles.card}>
          <Text style={styles.formTitle}>Crear cuenta</Text>
          <Text style={styles.formSubtitle}>Empezá a gestionar tus gastos</Text>

          {/* Nombre */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View ref={nameWrapperRef} style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  placeholderTextColor={COLORS.textSecondary}
                  value={name}
                  onChangeText={setName}
                  onFocus={() =>
                    nameWrapperRef.current?.setNativeProps({
                      style: styles.inputWrapper,
                    })
                  }
                  onBlur={() =>
                    nameWrapperRef.current?.setNativeProps({
                      style: styles.inputWrapper,
                    })
                  }
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
            </View>

          {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View
                ref={emailWrapperRef}
                style={[
                  styles.inputWrapper,
                  !!emailError && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="tu@correo.com"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={validateEmail}
                  onFocus={() =>
                    emailWrapperRef.current?.setNativeProps({
                      style: [
                        styles.inputWrapper,
                        !!emailError && styles.inputWrapperError,
                      ],
                    })
                  }
                  onBlur={() =>
                    emailWrapperRef.current?.setNativeProps({
                      style: [
                        styles.inputWrapper,
                        !!emailError && styles.inputWrapperError,
                      ],
                    })
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

         {/* Contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View
                ref={passWrapperRef}
                style={[
                  styles.inputWrapper,
                  !!passwordError && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={validatePassword}
                  onFocus={() =>
                    passWrapperRef.current?.setNativeProps({
                      style: [
                        styles.inputWrapper,
                        !!passwordError && styles.inputWrapperError,
                      ],
                    })
                  }
                  onBlur={() =>
                    passWrapperRef.current?.setNativeProps({
                      style: [
                        styles.inputWrapper,
                        !!passwordError && styles.inputWrapperError,
                      ],
                    })
                  }
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            </View>

          {/* Confirmar contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View
                ref={confirmWrapperRef}
                style={[
                  styles.inputWrapper,
                  !!confirmError && styles.inputWrapperError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor={COLORS.textSecondary}
                  value={confirmPassword}
                  onChangeText={validateConfirm}
                  onFocus={() =>
                    confirmWrapperRef.current?.setNativeProps({
                      style: [
                        styles.inputWrapper,
                        !!confirmError && styles.inputWrapperError,
                      ],
                    })
                  }
                  onBlur={() =>
                    confirmWrapperRef.current?.setNativeProps({
                      style: [
                        styles.inputWrapper,
                        !!confirmError && styles.inputWrapperError,
                      ],
                    })
                  }
                  secureTextEntry={!showConfirm}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeButton}>
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
              {!!confirmError && <Text style={styles.errorText}>{confirmError}</Text>}
            </View>
          {/* Términos */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                onPress={() => setAcceptedTerms(v => !v)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && (
                    <Ionicons name="checkmark" size={13} color="#0D1A12" />
                  )}
                </View>
              </TouchableOpacity>

              <Text style={styles.checkboxLabel}>
                Acepto los{' '}
                <Text
                  style={styles.checkboxLink}
                  onPress={() => navigation.navigate('Terms')}
                >
                  Términos y condiciones
                </Text>
                {' '}y la{' '}
                <Text
                  style={styles.checkboxLink}
                  onPress={() => navigation.navigate('Privacy')}
                >
                  Política de privacidad
                </Text>
              </Text>
            </View>

          {/* ERROR REGISTER */}
            {!!registerError && (
              <Text style={styles.errorText}>
                {registerError}
              </Text>
            )}

          {/* Botón */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.primaryButton, !isFormValid && styles.primaryButtonDisabled]}
              onPress={handleRegister}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={!isFormValid || loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Separador */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Volver al login */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿Ya tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerLink}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
  },

  // Branding
  header: { alignItems: 'center', marginBottom: 36 },
  logoOuter: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1, borderColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 12,
  },
  logoIcon:  { fontSize: 30, color: COLORS.accent },
  appName:   { fontSize: 34, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.5, marginBottom: 6 },
  tagline:   { fontSize: 14, color: COLORS.textSecondary, letterSpacing: 0.3 },

  // Tarjeta
  card: {
    width: '100%', backgroundColor: COLORS.surface,
    borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  formTitle:    { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  formSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 28 },

  // Campos
  fieldGroup: { marginBottom: 20 },
  label: {
    fontSize: 13, fontWeight: '600', color: COLORS.textSecondary,
    marginBottom: 8, letterSpacing: 0.4, textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, height: 52,
  },

  inputWrapperError: {
  borderColor: COLORS.error,
  shadowColor: COLORS.error,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 0 },
  eyeButton: { padding: 4 },

  errorText: {
  fontSize: 13,
  fontWeight: '600',
  color: COLORS.error,
  marginTop: 2,
  marginBottom: 14,
  marginLeft: 2,
  letterSpacing: 0.2,
},

  // Checkbox términos
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18, gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1, flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  checkboxLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  checkboxLink: { color: COLORS.accent, fontWeight: '500' },

  // Botón
  primaryButton: {
    backgroundColor: COLORS.accent, borderRadius: 14,
    height: 54, alignItems: 'center', justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  primaryButtonDisabled: { backgroundColor: COLORS.accentDim, shadowOpacity: 0, elevation: 0 },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#0D1A12', letterSpacing: 0.3 },

  // Separador
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 12, color: COLORS.textMuted, marginHorizontal: 12, fontWeight: '500' },

  // Navegación
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: COLORS.textSecondary },
  registerLink: { fontSize: 14, color: COLORS.accent, fontWeight: '700' },
});