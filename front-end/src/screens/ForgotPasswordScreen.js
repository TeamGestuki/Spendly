import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import { forgotPassword } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return Alert.alert(t('passwordRecovery.common.errorTitle'), t('passwordRecovery.errors.emailRequired'));
    if (!EMAIL_REGEX.test(normalized)) return Alert.alert(t('passwordRecovery.common.errorTitle'), t('passwordRecovery.errors.emailInvalid'));
    try {
      setLoading(true);
      await forgotPassword(normalized);
      navigation.navigate('VerifyResetCode', { email: normalized });
    } catch (error) {
      Alert.alert(t('passwordRecovery.common.errorTitle'), error.message || t('passwordRecovery.errors.sendCode'));
    } finally { setLoading(false); }
  };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg}/>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="always" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'} removeClippedSubviews={false}>
      <View style={styles.topBar}><TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={22} color={COLORS.textPrimary}/></TouchableOpacity><Text style={styles.topTitle}>{t('passwordRecovery.forgot.title')}</Text><View style={{width:42}}/></View>
      <View style={styles.card}>
        <View style={styles.icon}><Ionicons name="mail-outline" size={32} color={COLORS.accent}/></View>
        <Text style={styles.title}>{t('passwordRecovery.forgot.heading')}</Text>
        <Text style={styles.subtitle}>{t('passwordRecovery.forgot.subtitle')}</Text>
        <Text style={styles.label}>{t('passwordRecovery.forgot.emailLabel')}</Text>
        <View style={styles.inputWrap}><Ionicons name="mail-outline" size={18} color={COLORS.textMuted}/><TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholder={t('passwordRecovery.forgot.emailPlaceholder')} placeholderTextColor={COLORS.textMuted} returnKeyType="send" onSubmitEditing={submit}/></View>
        <TouchableOpacity style={[styles.primary,loading&&styles.disabled]} onPress={submit} disabled={loading}>{loading?<ActivityIndicator color={COLORS.buttonText||COLORS.bg}/>:<Ionicons name="send-outline" size={20} color={COLORS.buttonText||COLORS.bg}/>}<Text style={styles.primaryText}>{loading?t('passwordRecovery.forgot.sending'):t('passwordRecovery.forgot.send')}</Text></TouchableOpacity>
        <View style={styles.info}><Ionicons name="shield-checkmark-outline" size={18} color={COLORS.accent}/><Text style={styles.infoText}>{t('passwordRecovery.forgot.securityNote')}</Text></View>
      </View>
      <Text style={styles.footer}>Spendly © 2026</Text>
    </ScrollView>
  </KeyboardAvoidingView>;
}

function createStyles(C){return StyleSheet.create({flex:{flex:1,backgroundColor:C.bg},content:{flexGrow:1,paddingTop:56,paddingHorizontal:20,paddingBottom:40},topBar:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:30},back:{width:42,height:42,borderRadius:21,backgroundColor:C.surface,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'},topTitle:{fontSize:17,fontWeight:'800',color:C.textPrimary},card:{backgroundColor:C.surface,borderRadius:24,borderWidth:1,borderColor:C.border,padding:22},icon:{width:64,height:64,borderRadius:32,backgroundColor:C.accentDim,alignItems:'center',justifyContent:'center',marginBottom:18},title:{fontSize:24,fontWeight:'800',color:C.textPrimary},subtitle:{marginTop:8,fontSize:14,lineHeight:21,color:C.textSecondary,marginBottom:26},label:{fontSize:12,fontWeight:'700',color:C.textSecondary,textTransform:'uppercase',marginBottom:8},inputWrap:{minHeight:54,borderRadius:15,backgroundColor:C.surfaceHigh,borderWidth:1,borderColor:C.border,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10},input:{flex:1,fontSize:15,color:C.textPrimary,paddingVertical:0},primary:{minHeight:56,borderRadius:16,backgroundColor:C.accent,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,marginTop:20},disabled:{opacity:.65},primaryText:{fontSize:15,fontWeight:'800',color:C.buttonText||C.bg},info:{marginTop:18,borderRadius:14,backgroundColor:C.surfaceHigh,padding:14,flexDirection:'row',alignItems:'flex-start',gap:10},infoText:{flex:1,fontSize:12,lineHeight:18,color:C.textSecondary},footer:{marginTop:28,fontSize:12,fontWeight:'600',color:C.textMuted,textAlign:'center'}})}
