import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  ScrollView, Animated, KeyboardAvoidingView, Platform,
  ActivityIndicator, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { registerUser } from '../services/authService';

const normalizeEmail = (value = '') => value.trim().toLowerCase();
const validEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function RegisterScreen({ navigation }) {
  const { colors: C, isDark } = useTheme();
  const { t } = useLanguage();
  const s = useMemo(() => styles(C), [C]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const cleanEmail = normalizeEmail(email);
  const nameError = submitted && name.trim().length < 2 ? t('register.validation.name') : '';
  const emailError = email.length > 0 && !validEmail(cleanEmail) ? t('register.validation.email') : '';
  const passwordError = password.length > 0 && password.length < 8 ? t('register.validation.password') : '';
  const confirmError = confirmPassword.length > 0 && confirmPassword !== password ? t('register.validation.confirm') : '';
  const termsError = submitted && !acceptedTerms ? t('register.validation.terms') : '';

  const isValid =
    name.trim().length >= 2 &&
    validEmail(cleanEmail) &&
    password.length >= 8 &&
    confirmPassword === password &&
    acceptedTerms;

   /* const wrapper = (field, error) => [
    s.inputWrapper,
    focused === field && s.inputWrapperFocused,
    !!error && s.inputWrapperError,
  ]; */

  const wrapper = (error) => [
  s.inputWrapper,
  !!error && s.inputWrapperError,
  ];

  const submit = useCallback(async () => {
    setSubmitted(true);
    setRegisterError('');
    if (!isValid || loading) return;

    try {
      setLoading(true);
      Keyboard.dismiss();
      await registerUser(name.trim(), cleanEmail, password);
      navigation.replace('Login', { registeredEmail: cleanEmail });
    } catch (error) {
      const message = String(error?.message || '').toLowerCase();
      if (message.includes('registrado') || message.includes('already') || message.includes('exist')) {
        setRegisterError(t('register.errors.emailExists'));
        emailRef.current?.focus();
      } else {
        setRegisterError(error?.message || t('register.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  }, [isValid, loading, name, cleanEmail, password, navigation, t]);

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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.logoOuter}><Text style={s.logoIcon}>$</Text></View>
          <Text style={s.appName}>Spendly</Text>
          <Text style={s.tagline}>{t('register.tagline')}</Text>
        </View>

        <View style={s.card}>
          <Text style={s.formTitle}>{t('register.title')}</Text>
          <Text style={s.formSubtitle}>{t('register.subtitle')}</Text>

          <View style={s.fieldGroup}>
            <Text style={s.label}>{t('register.fullName')}</Text>
            <View style={wrapper(nameError)}>
              <TextInput
                style={s.input}
                value={name}
                onChangeText={(v) => { setName(v); setRegisterError(''); }}
                placeholder={t('register.fullNamePlaceholder')}
                placeholderTextColor={C.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
            {!!nameError && <Text style={s.errorText}>{nameError}</Text>}
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>{t('register.email')}</Text>
            <View style={wrapper(emailError || registerError)}>
              <TextInput
                ref={emailRef}
                style={s.input}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setRegisterError('');
                }}
                placeholder={t('register.emailPlaceholder')}
                placeholderTextColor={C.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
            {!!emailError && <Text style={s.errorText}>{emailError}</Text>}
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>{t('register.password')}</Text>
            <View style={wrapper(passwordError)}>
              <TextInput
                ref={passwordRef}
                style={s.input}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setRegisterError('');
                }}
                placeholder={t('register.passwordPlaceholder')}
                placeholderTextColor={C.textSecondary}
                secureTextEntry={!showPassword}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => confirmRef.current?.focus()}
              />
              <TouchableOpacity style={s.eyeButton} onPress={() => setShowPassword(v => !v)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={19} color={C.textSecondary} />
              </TouchableOpacity>
            </View>
            {!!passwordError && <Text style={s.errorText}>{passwordError}</Text>}
            <View style={s.hintRow}>
              <Ionicons
                name={password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                size={15}
                color={password.length >= 8 ? C.accent : C.textMuted}
              />
              <Text style={[s.hintText, password.length >= 8 && { color: C.accent }]}>
                {t('register.passwordRequirement')}
              </Text>
            </View>
          </View>

          <View style={s.fieldGroup}>
            <Text style={s.label}>{t('register.confirmPassword')}</Text>
            <View style={wrapper(confirmError)}>
              <TextInput
                ref={confirmRef}
                style={s.input}
                value={confirmPassword}
                onChangeText={(v) => {
                  setConfirmPassword(v);
                  setRegisterError('');
                }}
                placeholder={t('register.passwordPlaceholder')}
                placeholderTextColor={C.textSecondary}
                secureTextEntry={!showConfirm}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
              <TouchableOpacity style={s.eyeButton} onPress={() => setShowConfirm(v => !v)}>
                <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={19} color={C.textSecondary} />
              </TouchableOpacity>
            </View>
            {!!confirmError && <Text style={s.errorText}>{confirmError}</Text>}
          </View>

          <View style={s.checkboxRow}>
            <TouchableOpacity onPress={() => setAcceptedTerms(v => !v)} activeOpacity={0.8}>
              <View style={[s.checkbox, acceptedTerms && s.checkboxChecked, !!termsError && s.checkboxError]}>
                {acceptedTerms && <Ionicons name="checkmark" size={14} color={C.buttonText || C.bg} />}
              </View>
            </TouchableOpacity>
            <Text style={s.checkboxLabel}>
              {t('register.termsPrefix')}{' '}
              <Text style={s.checkboxLink} onPress={() => navigation.navigate('Terms')}>{t('register.terms')}</Text>{' '}
              {t('register.and')}{' '}
              <Text style={s.checkboxLink} onPress={() => navigation.navigate('Privacy')}>{t('register.privacy')}</Text>
            </Text>
          </View>
          {!!termsError && <Text style={s.errorText}>{termsError}</Text>}

          {!!registerError && (
            <View style={s.errorBox}>
              <Ionicons name="alert-circle-outline" size={19} color={C.error || C.red} />
              <Text style={s.errorBoxText}>{registerError}</Text>
            </View>
          )}

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[s.primaryButton, (!isValid || loading) && s.primaryButtonDisabled]}
              onPress={submit}
              onPressIn={() => Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start()}
              onPressOut={() => Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start()}
              activeOpacity={0.9}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={C.buttonText || C.bg} />
                  <Text style={s.primaryButtonText}>{t('register.creating')}</Text>
                </>
              ) : (
                <Text style={s.primaryButtonText}>{t('register.create')}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>{t('register.or')}</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.registerRow}>
            <Text style={s.registerText}>{t('register.haveAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={s.registerLink}>{t('register.login')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={s.footer}>Spendly © 2026</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function styles(C) {
  const error = C.error || C.red || '#F87171';
  return StyleSheet.create({
    flex:{flex:1,backgroundColor:C.bg},
    scroll:{flexGrow:1,paddingHorizontal:24,paddingTop:60,paddingBottom:32,alignItems:'center'},
    header:{alignItems:'center',marginBottom:36},
    logoOuter:{width:72,height:72,borderRadius:20,backgroundColor:C.accentDim,borderWidth:1,borderColor:C.accent,alignItems:'center',justifyContent:'center',marginBottom:16,shadowColor:C.accent,shadowOffset:{width:0,height:0},shadowOpacity:.4,shadowRadius:16,elevation:12},
    logoIcon:{fontSize:30,color:C.accent},
    appName:{fontSize:34,fontWeight:'800',color:C.textPrimary,letterSpacing:-.5,marginBottom:6},
    tagline:{fontSize:14,color:C.textSecondary,textAlign:'center'},
    card:{width:'100%',backgroundColor:C.surface,borderRadius:24,padding:24,borderWidth:1,borderColor:C.border,shadowColor:'#000',shadowOffset:{width:0,height:8},shadowOpacity:.3,shadowRadius:20,elevation:8},
    formTitle:{fontSize:22,fontWeight:'700',color:C.textPrimary,marginBottom:4},
    formSubtitle:{fontSize:13,color:C.textSecondary,marginBottom:28},
    fieldGroup:{marginBottom:18},
    label:{fontSize:13,fontWeight:'600',color:C.textSecondary,marginBottom:8,letterSpacing:.4,textTransform:'uppercase'},
    inputWrapper:{flexDirection:'row',alignItems:'center',backgroundColor:C.surfaceHigh,borderRadius:12,borderWidth:1,borderColor:C.border,paddingHorizontal:14,minHeight:52},
    // inputWrapperFocused:{borderColor:C.accent,shadowColor:C.accent,shadowOpacity:.18,shadowRadius:8,elevation:3},
    inputWrapperError:{borderColor:error},
    input:{flex:1,minHeight:50,fontSize:15,color:C.textPrimary,paddingVertical:0},
    eyeButton:{padding:6,marginLeft:6},
    errorText:{fontSize:12,fontWeight:'600',color:error,marginTop:7,marginLeft:2,lineHeight:17},
    hintRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:8,marginLeft:2},
    hintText:{fontSize:11,color:C.textMuted},
    checkboxRow:{flexDirection:'row',alignItems:'flex-start',marginBottom:10,gap:10},
    checkbox:{width:21,height:21,borderRadius:6,borderWidth:1.5,borderColor:C.border,backgroundColor:C.surfaceHigh,alignItems:'center',justifyContent:'center',marginTop:1},
    checkboxChecked:{backgroundColor:C.accent,borderColor:C.accent},
    checkboxError:{borderColor:error},
    checkboxLabel:{flex:1,fontSize:13,color:C.textSecondary,lineHeight:20},
    checkboxLink:{color:C.accent,fontWeight:'600'},
    errorBox:{flexDirection:'row',alignItems:'flex-start',gap:9,backgroundColor:`${error}12`,borderWidth:1,borderColor:`${error}45`,borderRadius:14,padding:12,marginTop:6,marginBottom:10},
    errorBoxText:{flex:1,fontSize:12,fontWeight:'600',color:error,lineHeight:18},
    primaryButton:{backgroundColor:C.accent,borderRadius:14,minHeight:54,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8,marginTop:8,shadowColor:C.accent,shadowOffset:{width:0,height:4},shadowOpacity:.4,shadowRadius:12,elevation:6},
    primaryButtonDisabled:{backgroundColor:C.accentDim,shadowOpacity:0,elevation:0},
    primaryButtonText:{fontSize:16,fontWeight:'700',color:C.buttonText || C.bg},
    divider:{flexDirection:'row',alignItems:'center',marginVertical:24},
    dividerLine:{flex:1,height:1,backgroundColor:C.border},
    dividerText:{fontSize:12,color:C.textMuted,marginHorizontal:12},
    registerRow:{flexDirection:'row',justifyContent:'center',alignItems:'center',flexWrap:'wrap'},
    registerText:{fontSize:14,color:C.textSecondary},
    registerLink:{fontSize:14,color:C.accent,fontWeight:'700'},
    footer:{marginTop:24,textAlign:'center',fontSize:12,color:C.textMuted,fontWeight:'600'},
  });
}
