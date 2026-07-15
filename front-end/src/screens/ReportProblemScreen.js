import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Switch, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { createSupportReport } from '../services/supportService';

const CATEGORIES = ['transactions','profile','authentication','scan','statistics','goals','notifications','appearance','language','currency','performance','other'];
const Icon = ({ name, size=20, color }) => <Ionicons name={name} size={size} color={color}/>;

export default function ReportProblemScreen({ navigation }) {
  const { colors: C, isDark } = useTheme();
  const { t } = useLanguage();
  const s = useMemo(() => styles(C), [C]);
  const [category,setCategory]=useState('transactions');
  const [subject,setSubject]=useState('');
  const [description,setDescription]=useState('');
  const [steps,setSteps]=useState('');
  const [includeTechnicalInfo,setIncludeTechnicalInfo]=useState(true);
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    if (subject.trim().length < 5) return Alert.alert(t('common.error'),t('support.validation.subject'));
    if (description.trim().length < 10) return Alert.alert(t('common.error'),t('support.validation.description'));
    try {
      setLoading(true);
      await createSupportReport({
        category, subject: subject.trim(), description: description.trim(),
        steps_to_reproduce: steps.trim() || null,
        include_technical_info: includeTechnicalInfo,
        app_version: includeTechnicalInfo ? (Constants.expoConfig?.version || '1.1.0') : null,
        platform: includeTechnicalInfo ? Platform.OS : null,
        os_version: includeTechnicalInfo ? String(Platform.Version) : null,
        device_model: includeTechnicalInfo ? (Device.modelName || Device.deviceName || 'Unknown') : null,
      });
      Alert.alert(t('support.success.title'),t('support.success.text'),[{text:t('common.accept'),onPress:()=>navigation.replace('MyReports')}]);
    } catch(e) { Alert.alert(t('common.error'),e.message || t('support.errors.submit')); }
    finally { setLoading(false); }
  };

  return <View style={s.flex}>
    <StatusBar barStyle={isDark?'light-content':'dark-content'} backgroundColor={C.bg}/>
    <View style={s.top}><TouchableOpacity style={s.round} onPress={()=>navigation.goBack()}><Icon name="chevron-back" size={22} color={C.textPrimary}/></TouchableOpacity><Text style={s.topTitle}>{t('support.report.title')}</Text><TouchableOpacity style={s.round} onPress={()=>navigation.navigate('MyReports')}><Icon name="time-outline" color={C.accent}/></TouchableOpacity></View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <View style={s.hero}><View style={s.heroIcon}><Icon name="bug-outline" size={28} color={C.orange}/></View><Text style={s.heroTitle}>{t('support.report.heroTitle')}</Text><Text style={s.heroText}>{t('support.report.heroText')}</Text></View>
      <Text style={s.label}>{t('support.report.category')}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row}>{CATEGORIES.map(x=><TouchableOpacity key={x} style={[s.chip,category===x&&s.chipOn]} onPress={()=>setCategory(x)}><Text style={[s.chipText,category===x&&s.chipTextOn]}>{t(`support.category.${x}`)}</Text></TouchableOpacity>)}</ScrollView>
      <Text style={s.label}>{t('support.report.subject')}</Text><TextInput style={s.input} value={subject} onChangeText={setSubject} maxLength={150} placeholder={t('support.report.subjectPlaceholder')} placeholderTextColor={C.textMuted}/><Text style={s.counter}>{subject.length}/150</Text>
      <Text style={s.label}>{t('support.report.description')}</Text><TextInput style={[s.input,s.area]} value={description} onChangeText={setDescription} multiline textAlignVertical="top" placeholder={t('support.report.descriptionPlaceholder')} placeholderTextColor={C.textMuted}/>
      <Text style={s.label}>{t('support.report.steps')}</Text><TextInput style={[s.input,s.area]} value={steps} onChangeText={setSteps} multiline textAlignVertical="top" maxLength={255} placeholder={t('support.report.stepsPlaceholder')} placeholderTextColor={C.textMuted}/>
      <View style={s.switchCard}><View style={{flex:1}}><Text style={s.switchTitle}>{t('support.report.technicalTitle')}</Text><Text style={s.switchText}>{t('support.report.technicalText')}</Text></View><Switch value={includeTechnicalInfo} onValueChange={setIncludeTechnicalInfo} trackColor={{false:C.surfaceHigh,true:C.accentDim}} thumbColor={includeTechnicalInfo?C.accent:C.textMuted}/></View>
      <View style={s.info}><Icon name="shield-checkmark-outline" size={18} color={C.blue}/><Text style={s.infoText}>{t('support.report.privacy')}</Text></View>
      <TouchableOpacity style={[s.primary,loading&&{opacity:.6}]} onPress={submit} disabled={loading}>{loading?<ActivityIndicator color={C.buttonText||C.bg}/>:<><Icon name="paper-plane-outline" color={C.buttonText||C.bg}/><Text style={s.primaryText}>{t('support.report.submit')}</Text></>}</TouchableOpacity>
      <Text style={s.footer}>Spendly © 2026</Text>
    </ScrollView>
  </View>;
}
function styles(C){return StyleSheet.create({flex:{flex:1,backgroundColor:C.bg},top:{paddingTop:56,paddingHorizontal:20,paddingBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},round:{width:40,height:40,borderRadius:20,backgroundColor:C.surface,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'},topTitle:{fontSize:17,fontWeight:'700',color:C.textPrimary},content:{paddingHorizontal:20,paddingBottom:40},hero:{backgroundColor:C.surface,borderRadius:24,borderWidth:1,borderColor:`${C.orange}30`,padding:22,alignItems:'center',marginBottom:24},heroIcon:{width:58,height:58,borderRadius:29,backgroundColor:`${C.orange}18`,alignItems:'center',justifyContent:'center',marginBottom:14},heroTitle:{fontSize:20,fontWeight:'800',color:C.textPrimary},heroText:{fontSize:13,color:C.textSecondary,textAlign:'center',lineHeight:20,marginTop:6},label:{fontSize:12,fontWeight:'700',color:C.textSecondary,textTransform:'uppercase',marginBottom:8},row:{gap:8,paddingBottom:18},chip:{paddingHorizontal:14,minHeight:38,borderRadius:999,borderWidth:1,borderColor:C.border,backgroundColor:C.surface,justifyContent:'center'},chipOn:{backgroundColor:C.accentDim,borderColor:`${C.accent}55`},chipText:{fontSize:11,fontWeight:'700',color:C.textSecondary},chipTextOn:{color:C.accent},input:{minHeight:50,borderRadius:14,backgroundColor:C.surface,borderWidth:1,borderColor:C.border,padding:14,color:C.textPrimary,fontSize:14,marginBottom:7},area:{minHeight:110,marginBottom:18},counter:{fontSize:10,color:C.textMuted,textAlign:'right',marginBottom:16},switchCard:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.border,padding:15,marginBottom:14},switchTitle:{fontSize:14,fontWeight:'700',color:C.textPrimary},switchText:{fontSize:11,color:C.textSecondary,lineHeight:17,marginTop:4},info:{flexDirection:'row',gap:9,backgroundColor:C.surface,borderRadius:15,borderWidth:1,borderColor:C.border,padding:13,marginBottom:20},infoText:{flex:1,fontSize:11,color:C.textSecondary,lineHeight:17},primary:{height:54,borderRadius:16,backgroundColor:C.accent,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9},primaryText:{fontSize:15,fontWeight:'800',color:C.buttonText||C.bg},footer:{marginTop:28,textAlign:'center',fontSize:12,color:C.textMuted,fontWeight:'600'}})}
