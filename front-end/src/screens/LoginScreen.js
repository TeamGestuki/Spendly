import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  ScrollView, Animated, KeyboardAvoidingView, Platform,
  ActivityIndicator, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { loginUser } from '../services/authService';

const normalizeEmail = (value = '') => value.trim().toLowerCase();
const validEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function LoginScreen({ navigation, route }) {
  const { colors: C, isDark } = useTheme();
  const { t } = useLanguage();
  const s = useMemo(() => styles(C), [C]);

  const [email, setEmail] = useState(route?.params?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');

  const passwordRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const cleanEmail = normalizeEmail(email);
  const emailError =
    (submitted || email.length > 0) && !validEmail(cleanEmail)
      ? t('login.validation.email')
      : '';
  const passwordError =
    submitted && !password
      ? t('login.validation.password')
      : '';
  const isValid = validEmail(cleanEmail) && password.length > 0;

  const submit = useCallback(async () => {
    setSubmitted(true);
    setLoginError('');
    if (!isValid || loading) return;

    try {
      setLoading(true);
      Keyboard.dismiss();

      const deviceName =
        Platform.OS === 'ios'
          ? 'iPhone'
          : Platform.OS === 'android'
            ? 'Android'
            : 'Dispositivo móvil';

      const data = await loginUser(
        cleanEmail,
        password,
        rememberSession,
        deviceName
      );

      await Promise.all([
        AsyncStorage.setItem('access_token', data.access_token),
        AsyncStorage.setItem(
          'remember_session',
          rememberSession ? 'true' : 'false'
        ),
      ]);

      navigation.replace('Home');
    } catch (error) {
      const message = String(error?.message || '').toLowerCase();

      if (
        message.includes('incorrect') ||
        message.includes('incorrecto') ||
        message.includes('credential') ||
        message.includes('401')
      ) {
        setLoginError(t('login.errors.invalidCredentials'));
      } else if (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('connection')
      ) {
        setLoginError(t('login.errors.connection'));
      } else {
        setLoginError(t('login.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  }, [
    isValid, loading, cleanEmail, password,
    rememberSession, navigation, t,
  ]);

  const pressIn = () =>
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={C.bg}
      />

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.logoOuter}>
            <Text style={s.logoIcon}>$</Text>
          </View>
          <Text style={s.appName}>Spendly</Text>
          <Text style={s.tagline}>{t('login.tagline')}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.formTitle}>{t('login.title')}</Text>
          <Text style={s.formSubtitle}>{t('login.subtitle')}</Text>

          <View style={s.fieldGroup}>
            <Text style={s.label}>{t('login.email')}</Text>
            <View style={[s.inputWrapper, !!(emailError || loginError) && s.inputWrapperError]}>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setLoginError('');
                }}
                placeholder={t('login.emailPlaceholder')}
                placeholderTextColor={C.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
            {!!emailError && <Text style={s.errorText}>{emailError}</Text>}
          </View>

          <View style={s.fieldGroup}>
            <View style={s.labelRow}>
              <Text style={s.label}>{t('login.password')}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={s.forgotLink}>{t('login.forgotPassword')}</Text>
              </TouchableOpacity>
            </View>

            <View style={[s.inputWrapper, !!(passwordError || loginError) && s.inputWrapperError]}>
              <TextInput
                ref={passwordRef}
                style={s.input}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setLoginError('');
                }}
                placeholder={t('login.passwordPlaceholder')}
                placeholderTextColor={C.textSecondary}
                secureTextEntry={!showPassword}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={submit}
              />
              <TouchableOpacity
                style={s.eyeButton}
                onPress={() => setShowPassword((value) => !value)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={19}
                  color={C.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {!!passwordError && <Text style={s.errorText}>{passwordError}</Text>}

            {!!loginError && (
              <View style={s.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color={C.error || C.red}
                />
                <Text style={s.errorBoxText}>{loginError}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={s.rememberRow}
            onPress={() => setRememberSession((value) => !value)}
            activeOpacity={0.8}
          >
            <View style={[s.checkbox, rememberSession && s.checkboxActive]}>
              {rememberSession && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={C.buttonText || C.bg}
                />
              )}
            </View>
            <Text style={s.rememberText}>{t('login.rememberSession')}</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[s.primaryButton, (!isValid || loading) && s.primaryButtonDisabled]}
              onPress={submit}
              onPressIn={pressIn}
              onPressOut={pressOut}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={C.buttonText || C.bg} />
                  <Text style={s.primaryButtonText}>{t('login.verifying')}</Text>
                </>
              ) : (
                <Text style={s.primaryButtonText}>{t('login.submit')}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>{t('login.or')}</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.registerRow}>
            <Text style={s.registerText}>{t('login.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={s.registerLink}>{t('login.register')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.footer}>
          {t('login.footerPrefix')}{' '}
          <Text style={s.footerLink} onPress={() => navigation.navigate('Terms')}>
            {t('login.terms')}
          </Text>{' '}
          {t('login.and')}{' '}
          <Text style={s.footerLink} onPress={() => navigation.navigate('Privacy')}>
            {t('login.privacy')}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function styles(C) {
  const error = C.error || C.red || '#F87171';

  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: C.bg },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 32 },
    header: { alignItems: 'center', marginBottom: 36 },
    logoOuter: {
      width: 72, height: 72, borderRadius: 20,
      backgroundColor: C.accentDim, borderWidth: 1, borderColor: C.accent,
      alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      shadowColor: C.accent, shadowOffset: { width: 0, height: 0 },
      shadowOpacity: .4, shadowRadius: 16, elevation: 12,
    },
    logoIcon: { fontSize: 30, color: C.accent },
    appName: {
      fontSize: 34, fontWeight: '800', color: C.textPrimary,
      letterSpacing: -.5, marginBottom: 6, textAlign: 'center',
    },
    tagline: { fontSize: 14, color: C.textSecondary, textAlign: 'center' },
    card: {
      width: '100%', backgroundColor: C.surface, borderRadius: 24, padding: 24,
      borderWidth: 1, borderColor: C.border, shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 }, shadowOpacity: .3,
      shadowRadius: 20, elevation: 8,
    },
    formTitle: { fontSize: 22, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
    formSubtitle: { fontSize: 13, color: C.textSecondary, marginBottom: 28 },
    fieldGroup: { marginBottom: 20 },
    label: {
      fontSize: 13, fontWeight: '600', color: C.textSecondary,
      letterSpacing: .4, textTransform: 'uppercase',  marginBottom: 10,
    },
    labelRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 8, gap: 10,
    },
    forgotLink: { fontSize: 12, color: C.accent, fontWeight: '600' },
    inputWrapper: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: C.surfaceHigh,
      borderRadius: 12, borderWidth: 1, borderColor: C.border,
      paddingHorizontal: 14, minHeight: 52,
    },
    inputWrapperError: { borderColor: error },
    input: {
      flex: 1, minHeight: 50, fontSize: 15,
      color: C.textPrimary, paddingVertical: 0,
    },
    eyeButton: { padding: 6, marginLeft: 6 },
    errorText: {
      fontSize: 12, color: error, marginTop: 7,
      marginLeft: 2, fontWeight: '600',
    },
    errorBox: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 9,
      backgroundColor: `${error}12`, borderWidth: 1,
      borderColor: `${error}45`, borderRadius: 14,
      padding: 12, marginTop: 10,
    },
    errorBoxText: {
      flex: 1, fontSize: 12, fontWeight: '600',
      color: error, lineHeight: 18,
    },
    rememberRow: {
      flexDirection: 'row', alignItems: 'center',
      marginTop: -2, marginBottom: 15, alignSelf: 'flex-start',
    },
    checkbox: {
      width: 20, height: 20, borderRadius: 6, borderWidth: 1,
      borderColor: C.border, backgroundColor: C.surfaceHigh,
      alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    checkboxActive: { backgroundColor: C.accent, borderColor: C.accent },
    rememberText: { fontSize: 13, color: C.textSecondary, fontWeight: '500' },
    primaryButton: {
      backgroundColor: C.accent, borderRadius: 14, minHeight: 54,
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'row', gap: 8, marginTop: 8,
      shadowColor: C.accent, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: .4, shadowRadius: 12, elevation: 6,
    },
    primaryButtonDisabled: {
      backgroundColor: C.accentDim, shadowOpacity: 0, elevation: 0,
    },
    primaryButtonText: {
      fontSize: 16, fontWeight: '700', color: C.buttonText || C.bg,
    },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
    dividerText: { fontSize: 12, color: C.textMuted, marginHorizontal: 12 },
    registerRow: {
      flexDirection: 'row', justifyContent: 'center',
      alignItems: 'center', flexWrap: 'wrap',
    },
    registerText: { fontSize: 14, color: C.textSecondary },
    registerLink: { fontSize: 14, color: C.accent, fontWeight: '700' },
    footer: {
      marginTop: 28, fontSize: 11, color: C.textMuted,
      textAlign: 'center', lineHeight: 18, paddingHorizontal: 12,
    },
    footerLink: { color: C.textSecondary, textDecorationLine: 'underline' },
  });
}
