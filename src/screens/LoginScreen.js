/**
 * LoginScreen.js
 * Pantalla de inicio de sesión para Spendly
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [emailError, setEmailError]           = useState('');
  const [loading, setLoading]                 = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;

  // Referencias a los wrappers para cambiar el borde sin re-render
  const emailWrapperRef = useRef(null);
  const passWrapperRef  = useRef(null);

  const validateEmail = useCallback((text) => {
    setEmail(text);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError('Ingresá un correo válido');
    } else {
      setEmailError('');
    }
  }, []);

  const handlePressIn = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
  }, [buttonScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  }, [buttonScale]);

  const handleLogin = useCallback(() => {
    if (!email || !password || emailError) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }, [email, password, emailError]);

  const isDisabled = !email || !password || !!emailError || loading;

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
          <Text style={styles.formTitle}>Iniciar sesión</Text>
          <Text style={styles.formSubtitle}>Bienvenido de vuelta</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View
              ref={emailWrapperRef}
              style={[styles.inputWrapper, !!emailError && styles.inputWrapperError]}
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
                        emailError ? styles.inputWrapperError : styles.inputWrapperFocused,
                    ],
                })
              }
                onBlur={() => emailWrapperRef.current?.setNativeProps({ style: [styles.inputWrapper, !!emailError && styles.inputWrapperError] })}
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
            <View style={styles.labelRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <View ref={passWrapperRef} style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => passWrapperRef.current?.setNativeProps({ style: [styles.inputWrapper, styles.inputWrapperFocused] })}
                onBlur={() => passWrapperRef.current?.setNativeProps({ style: styles.inputWrapper })}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recordar sesión */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberSession(v => !v)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, rememberSession && styles.checkboxActive]}>
              {rememberSession && <Ionicons name="checkmark" size={14} color="#0D1A12" />}
            </View>
            <Text style={styles.rememberText}>Mantener sesión iniciada</Text>
          </TouchableOpacity>

          {/* Botón */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={isDisabled}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Verificando...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Separador */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Registro */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Registrate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Al continuar aceptás los{' '}
          <Text style={styles.footerLink}>Términos y condiciones</Text>
          {' '}y la{' '}
          <Text style={styles.footerLink}>Política de privacidad</Text>
        </Text>
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
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  forgotLink: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, height: 52,
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
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
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5, marginLeft: 2 },

  // Recordar sesión
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginTop: -2, marginBottom: 15 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  checkboxActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  rememberText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

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

  // Registro
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14, color: COLORS.textSecondary },
  registerLink: { fontSize: 14, color: COLORS.accent, fontWeight: '700' },

  // Footer
  footer: { marginTop: 28, fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: 12 },
  footerLink: { color: COLORS.textSecondary, textDecorationLine: 'underline' },
});