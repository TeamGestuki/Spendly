import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { getAdminDashboard } from '../../services/adminService';

const EMPTY = { users: {}, reports: {}, system: {} };
const Icon = ({ name, size = 20, color }) => <Ionicons name={name} size={size} color={color} />;

function Stat({ label, value, icon, color, styles }) {
  return <View style={styles.stat}><View style={[styles.statIcon,{backgroundColor:`${color}18`}]}><Icon name={icon} color={color}/></View><Text style={styles.statValue}>{value ?? 0}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function LinkRow({ title, subtitle, icon, color, onPress, styles, COLORS }) {
  return <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.78}><View style={[styles.rowIcon,{backgroundColor:`${color}18`}]}><Icon name={icon} color={color}/></View><View style={styles.rowBody}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowSubtitle}>{subtitle}</Text></View><Icon name="chevron-forward" color={COLORS.textMuted}/></TouchableOpacity>;
}

export default function AdminDashboardScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (silent=false) => {
    try { if(!silent) setLoading(true); setError(''); const r = await getAdminDashboard(); setData({users:r?.users||{},reports:r?.reports||{},system:r?.system||{}}); }
    catch(e){ setError(e?.message || 'No se pudo cargar el panel.'); }
    finally { setLoading(false); setRefreshing(false); }
  },[]);

  useFocusEffect(useCallback(()=>{ load(); },[load]));

  if(loading) return <View style={styles.center}><StatusBar barStyle={isDark?'light-content':'dark-content'} backgroundColor={COLORS.bg}/><ActivityIndicator size="large" color={COLORS.accent}/><Text style={styles.loading}>Cargando administración...</Text></View>;

  return <SafeAreaView edges={['top']} style={styles.flex}>
    <StatusBar barStyle={isDark?'light-content':'dark-content'} backgroundColor={COLORS.bg}/>
    <View style={styles.header}><TouchableOpacity style={styles.back} onPress={()=>navigation.goBack()}><Icon name="arrow-back" color={COLORS.textPrimary}/></TouchableOpacity><View style={styles.headerBody}><Text style={styles.title}>Administración</Text><Text style={styles.subtitle}>Resumen general de Spendly</Text></View><TouchableOpacity style={styles.action} onPress={()=>navigation.navigate('AdminActivity')}><Icon name="time-outline" color={COLORS.accent}/></TouchableOpacity></View>
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load(true);}} tintColor={COLORS.accent} colors={[COLORS.accent]}/>}>
      {!!error && <View style={styles.error}><Icon name="alert-circle-outline" color={COLORS.red}/><Text style={styles.errorText}>{error}</Text></View>}
      <Text style={styles.section}>Usuarios</Text><View style={styles.grid}><Stat label="Registrados" value={data.users.total} icon="people-outline" color={COLORS.blue} styles={styles}/><Stat label="En línea" value={data.users.online} icon="radio-outline" color={COLORS.accent} styles={styles}/><Stat label="Administradores" value={data.users.admins} icon="shield-checkmark-outline" color={COLORS.purple} styles={styles}/><Stat label="Inactivos" value={data.users.inactive} icon="person-remove-outline" color={COLORS.orange} styles={styles}/></View>
      <Text style={styles.section}>Reportes</Text><View style={styles.grid}><Stat label="Abiertos" value={data.reports.open} icon="mail-unread-outline" color={COLORS.red} styles={styles}/><Stat label="En revisión" value={data.reports.in_review} icon="eye-outline" color={COLORS.orange} styles={styles}/><Stat label="Resueltos" value={data.reports.resolved} icon="checkmark-circle-outline" color={COLORS.accent} styles={styles}/><Stat label="Cerrados" value={data.reports.closed} icon="archive-outline" color={COLORS.textSecondary} styles={styles}/></View>
      <Text style={styles.section}>Gestión</Text><View style={styles.card}><LinkRow title="Usuarios" subtitle="Cuentas, estados y roles" icon="people-outline" color={COLORS.blue} onPress={()=>navigation.navigate('AdminUsers')} styles={styles} COLORS={COLORS}/><LinkRow title="Reportes" subtitle="Seguimiento y respuestas" icon="document-text-outline" color={COLORS.orange} onPress={()=>navigation.navigate('AdminReports')} styles={styles} COLORS={COLORS}/><LinkRow title="Herramientas" subtitle="Diagnóstico y pruebas" icon="build-outline" color={COLORS.purple} onPress={()=>navigation.navigate('AdminTools')} styles={styles} COLORS={COLORS}/><LinkRow title="Actividad" subtitle="Historial administrativo" icon="time-outline" color={COLORS.accent} onPress={()=>navigation.navigate('AdminActivity')} styles={styles} COLORS={COLORS}/></View>
      <Text style={styles.section}>Sistema</Text><View style={styles.system}><Text style={styles.systemText}>Correo: {data.system.email_configured?'Configurado':'Sin configurar'}</Text><Text style={styles.systemText}>Entorno: {data.system.environment || '-'}</Text><Text style={styles.systemText}>Versión API: {data.system.app_version || '-'}</Text></View>
      <Text style={styles.footer}>Spendly © 2026</Text>
    </ScrollView>
  </SafeAreaView>;
}

function createStyles(C){return StyleSheet.create({flex:{flex:1,backgroundColor:C.bg},center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:C.bg},loading:{color:C.textSecondary,marginTop:12},header:{flexDirection:'row',alignItems:'center',padding:18,borderBottomWidth:1,borderBottomColor:C.border},back:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:C.surface,borderWidth:1,borderColor:C.border},headerBody:{flex:1,marginHorizontal:13},title:{color:C.textPrimary,fontSize:20,fontWeight:'800'},subtitle:{color:C.textSecondary,fontSize:12,marginTop:2},action:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:`${C.accent}14`},content:{padding:18,paddingBottom:36},section:{color:C.textSecondary,fontSize:12,fontWeight:'800',letterSpacing:.8,textTransform:'uppercase',marginTop:20,marginBottom:10},grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'},stat:{width:'48.5%',backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.border,padding:15,marginBottom:10},statIcon:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',marginBottom:10},statValue:{color:C.textPrimary,fontSize:24,fontWeight:'900'},statLabel:{color:C.textSecondary,fontSize:12,marginTop:3},card:{backgroundColor:C.surface,borderRadius:19,borderWidth:1,borderColor:C.border,overflow:'hidden'},row:{flexDirection:'row',alignItems:'center',padding:14,borderBottomWidth:1,borderBottomColor:C.border},rowIcon:{width:42,height:42,borderRadius:13,alignItems:'center',justifyContent:'center',marginRight:12},rowBody:{flex:1},rowTitle:{color:C.textPrimary,fontSize:14,fontWeight:'800'},rowSubtitle:{color:C.textSecondary,fontSize:12,marginTop:3},system:{backgroundColor:C.surface,borderRadius:18,borderWidth:1,borderColor:C.border,padding:15},systemText:{color:C.textPrimary,fontSize:13,paddingVertical:7},error:{flexDirection:'row',alignItems:'center',backgroundColor:`${C.red}10`,borderWidth:1,borderColor:`${C.red}35`,borderRadius:14,padding:12},errorText:{flex:1,color:C.textSecondary,fontSize:12,marginLeft:9},footer:{color:C.textMuted,fontSize:12,textAlign:'center',marginTop:30}})}
