/**
 * LoginScreen.js
 * Pantalla de inicio de sesión para Spendly
 * Estética fintech moderna: fondos oscuros, acentos dorados/verdes, tipografía clara
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Paleta de colores ───────────────────────────────────────────────────────
const COLORS = {
  bg:           '#0D0F14',   // Negro azulado (fondo principal)
  surface:      '#161A23',   // Superficie de tarjeta
  surfaceHigh:  '#1E2330',   // Input y elementos elevados
  border:       '#272D3D',   // Borde sutil
  borderFocus:  '#4ADE80',   // Verde neón suave al enfocar
  accent:       '#4ADE80',   // Verde acento (positivo/finanza)
  accentDim:    '#1A3D28',   // Verde oscuro para botón secundario
  textPrimary:  '#F0F2F7',   // Texto principal
  textSecondary:'#6B748A',   // Texto secundario / placeholder
  textMuted:    '#3E4557',   // Texto muy suave
  error:        '#F87171',   // Rojo error
  white:        '#FFFFFF',
};

export default function LoginScreen({ navigation }) {
  // ─── Estado del formulario ─────────────────────────────────────────────────
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused]   = useState(false);
  const [emailError, setEmailError]     = useState('');
  const [loading, setLoading]           = useState(false);

  // Animación del botón al presionar
  const buttonScale = useRef(new Animated.Value(1)).current;

  // ─── Validación básica del email ───────────────────────────────────────────
  const validateEmail = (text) => {

    setEmail(text);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError('Ingresá un correo válido');
  } else {
        setEmailError('');
    }
  };

  // ─── Animación del botón principal ────────────────────────────────────────
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // ─── Acción de login (simulada) ────────────────────────────────────────────
  const handleLogin = () => {
    if (!email || !password) return;
    setLoading(true);
    // Aquí va la llamada al backend cuando esté listo
    setTimeout(() => setLoading(false), 1500);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cabecera / Branding ─────────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Logo icono: símbolo "$" estilizado dentro de un hexágono */}
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

          {/* Título del formulario */}
          <Text style={styles.formTitle}>Iniciar sesión</Text>
          <Text style={styles.formSubtitle}>Bienvenido de vuelta</Text>

          {/* ── Input: Correo electrónico ──────────────────────────────── */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused,
              emailError   && styles.inputWrapperError,
            ]}>
              {/* Ícono de email (SVG-less: texto Unicode) */}
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
            <View style={styles.labelRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotLink}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
            <View style={[
              styles.inputWrapper,
              passFocused && styles.inputWrapperFocused,
            ]}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              {/* Mostrar / ocultar contraseña */}

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
          </View>       

        {/* ── Mantener sesión iniciada ─────────────────────────────── */}

        <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberSession(!rememberSession)}
            activeOpacity={0.8}
        >
            <View style={[
                styles.checkbox,
                rememberSession && styles.checkboxActive,
            ]}>
                {rememberSession && (
                  <Ionicons name="checkmark" size={14} color="#0D1A12" />
                    )}
            </View>
            <Text style={styles.rememberText}>Mantener sesión iniciada</Text>
        </TouchableOpacity>

          {/* ── Botón principal ───────────────────────────────────────── */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!email || !password || emailError) && styles.primaryButtonDisabled,
              ]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={!email || !password || emailError || loading}
            >
              {loading ? (
                <Text style={styles.primaryButtonText}>Verificando...</Text>
              ) : (
                <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* ── Separador ─────────────────────────────────────────────── */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* ── Registro ──────────────────────────────────────────────── */}

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>¿No tenés cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Registrate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <Text style={styles.footer}>
          Al continuar aceptás los{' '}
          <Text style={styles.footerLink}>Términos y condiciones</Text>
          {' '}y la{' '}
          <Text style={styles.footerLink}>Política de privacidad</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // Layout base
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotLink: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '500',
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
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.6,
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
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: 5,
    marginLeft: 2,
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

  // ── Registro ─────────────────────────────────────────────────────────────
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

  rememberRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -2,
  marginBottom: 15,
},

checkbox: {
  width: 20,
  height: 20,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: COLORS.border,
  backgroundColor: COLORS.surfaceHigh,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
},

checkboxActive: {
  backgroundColor: COLORS.accent,
  borderColor: COLORS.accent,
},

rememberText: {
  fontSize: 13,
  color: COLORS.textSecondary,
  fontWeight: '500',
},
  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    marginTop: 28,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  footerLink: {
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});