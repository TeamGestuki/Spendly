import React,{useCallback,useMemo,useState}from'react';
import{ActivityIndicator,Alert,Modal,RefreshControl,ScrollView,StatusBar,StyleSheet,Text,TextInput,TouchableOpacity,View,Keyboard,KeyboardAvoidingView,Platform,TouchableWithoutFeedback}from'react-native';
import {Ionicons} from'@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import{useFocusEffect}from'@react-navigation/native';
import{useTheme}from'../../context/ThemeContext';
import{getAdminReport,replyAdminReport,updateAdminReportStatus}from'../../services/adminService';

const Icon=({name,size=20,color})=><Ionicons name={name} size={size} color={color}/>;const OPTIONS=[['open','Abierto'],['in_review','En revisión'],['resolved','Resuelto'],['closed','Cerrado']];const date=v=>{if(!v)return'Sin información';const d=new Date(v);return isNaN(d)?String(v):d.toLocaleString('es-AR')};const color=(st,C)=>({open:C.red,in_review:C.orange,resolved:C.accent,closed:C.textSecondary}[st]||C.textSecondary);
function Block({label,value,s}){return <View style={s.block}><Text style={s.blockLabel}>{label}</Text><Text style={s.blockText}>{value||'Sin información'}</Text></View>}
export default function AdminReportDetailScreen({navigation,route}){const{colors:C,isDark}=useTheme(),s=useMemo(()=>styles(C),[C]),id=route?.params?.reportId??route?.params?.report?.id;const[report,setReport]=useState(route?.params?.report||null),[loading,setLoading]=useState(!report),[refreshing,setRefreshing]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[statusModal,setStatusModal]=useState(false),[replyModal,setReplyModal]=useState(false),[reply,setReply]=useState('');
const load=useCallback(async(silent=false)=>{try{if(!silent)setLoading(true);setError('');const r=await getAdminReport(id);setReport(r?.report||r)}catch(e){setError(e?.message||'No se pudo cargar el reporte.')}finally{setLoading(false);setRefreshing(false)}},[id]);useFocusEffect(useCallback(()=>{load(!!report)},[load]));
const setStatus=async st=>{try{setBusy(true);setStatusModal(false);const r=await updateAdminReportStatus(id,st);setReport(x=>({...x,...(r?.report||r),status:st}))}catch(e){Alert.alert('Error',e?.message||'No se pudo actualizar.')}finally{setBusy(false)}};
const send=async()=>{if(!reply.trim())return;try{setBusy(true);const r=await replyAdminReport(id,reply.trim());setReport(x=>({...x,...(r?.report||r),admin_response:reply.trim(),responded_at:new Date().toISOString()}));setReply('');setReplyModal(false);Alert.alert('Respuesta enviada','El usuario recibirá la respuesta por correo.')}catch(e){Alert.alert('Error',e?.message||'No se pudo responder.')}finally{setBusy(false)}};
if(loading)return <View style={s.center}><ActivityIndicator size="large" color={C.accent}/></View>;const cc=color(report?.status,C);
return <SafeAreaView edges={['top']} style={s.flex}><StatusBar barStyle={isDark?'light-content':'dark-content'} backgroundColor={C.bg}/><View style={s.header}><TouchableOpacity style={s.back} onPress={()=>navigation.goBack()}><Icon name="arrow-back" color={C.textPrimary}/></TouchableOpacity><View style={{marginLeft:13}}><Text style={s.title}>Reporte #{id??'-'}</Text><Text style={s.subtitle}>Detalle y seguimiento</Text></View></View><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load(true)}} tintColor={C.accent} colors={[C.accent]}/>}>
{!!error&&<View style={s.error}><Text style={s.errorText}>{error}</Text></View>}{report&&<><View style={s.hero}><View style={[s.heroIcon,{backgroundColor:`${cc}16`}]}><Icon name="document-text-outline" size={27} color={cc}/></View><Text style={s.subject}>{report.subject||'Reporte sin asunto'}</Text><Text style={s.category}>{report.category||'Sin categoría'}</Text><Text style={[s.status,{color:cc,backgroundColor:`${cc}16`}]}>{OPTIONS.find(x=>x[0]===report.status)?.[1]||report.status}</Text></View><Text style={s.section}>Usuario</Text><View style={s.card}><Block label="Nombre" value={report.user?.full_name||report.user_name} s={s}/><Block label="Correo" value={report.user?.email||report.user_email||report.email} s={s}/><Block label="Creado" value={date(report.created_at)} s={s}/></View><Text style={s.section}>Descripción</Text><View style={s.card}><Block label="Problema informado" value={report.description} s={s}/><Block label="Pasos para reproducir" value={report.steps_to_reproduce||'No fueron informados.'} s={s}/></View>{report.include_technical_info&&<><Text style={s.section}>Información técnica</Text><View style={s.card}><Block label="Versión" value={report.app_version} s={s}/><Block label="Plataforma" value={report.platform} s={s}/><Block label="Sistema operativo" value={report.os_version} s={s}/><Block label="Dispositivo" value={report.device_info||report.device_name} s={s}/></View></>}{report.admin_response&&<><Text style={s.section}>Respuesta administrativa</Text><View style={s.response}><Text style={s.responseText}>{report.admin_response}</Text><Text style={s.responseDate}>{date(report.responded_at)}</Text></View></>}<Text style={s.section}>Acciones</Text><TouchableOpacity style={s.primary} onPress={()=>setReplyModal(true)} disabled={busy}><Icon name="send-outline" color={C.bg}/><Text style={s.primaryText}>Responder al usuario</Text></TouchableOpacity><TouchableOpacity style={s.secondary} onPress={()=>setStatusModal(true)} disabled={busy}><Icon name="swap-horizontal-outline" color={C.accent}/><Text style={s.secondaryText}>Cambiar estado</Text></TouchableOpacity>{busy&&<ActivityIndicator style={{marginTop:15}} color={C.accent}/>}</>}<Text style={s.footer}>Spendly © 2026</Text></ScrollView>
<Modal visible={statusModal} transparent animationType="fade" onRequestClose={()=>setStatusModal(false)}><View style={s.overlay}><View style={s.modal}><Text style={s.modalTitle}>Cambiar estado</Text>{OPTIONS.map(x=><TouchableOpacity key={x[0]} style={s.option} onPress={()=>setStatus(x[0])}><Text style={s.optionText}>{x[1]}</Text>{report?.status===x[0]&&<Icon name="checkmark-circle" color={color(x[0],C)}/>}</TouchableOpacity>)}</View></View></Modal>
<Modal
      visible={replyModal}
      transparent
      animationType="slide"
      onRequestClose={() => {
        Keyboard.dismiss();
        setReplyModal(false);
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={s.overlay}>
            <TouchableWithoutFeedback>
              <View style={s.modal}>
                <View style={s.replyHeader}>
                  <Text style={s.modalTitle}>Responder reporte</Text>
                  <TouchableOpacity
                    style={s.closeButton}
                    onPress={() => {
                      Keyboard.dismiss();
                      setReplyModal(false);
                    }}
                  >
                    <Icon name="close" color={C.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={reply}
                  onChangeText={setReply}
                  multiline
                  autoFocus
                  placeholder="Escribí una respuesta clara..."
                  placeholderTextColor={C.textMuted}
                  style={s.reply}
                  textAlignVertical="top"
                  maxLength={2000}
                />

                <View style={s.replyActions}>
                  <TouchableOpacity
                    style={s.cancel}
                    onPress={() => {
                      Keyboard.dismiss();
                      setReplyModal(false);
                    }}
                    disabled={busy}
                  >
                    <Text style={s.cancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[s.primary, s.sendReply, !reply.trim() && { opacity: .5 }]}
                    onPress={send}
                    disabled={!reply.trim() || busy}
                  >
                    {busy
                      ? <ActivityIndicator color={C.bg} />
                      : <Icon name="send" color={C.bg} />}
                    <Text style={s.primaryText}>Enviar respuesta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal></SafeAreaView>}
function styles(C){return StyleSheet.create({flex:{flex:1,backgroundColor:C.bg},center:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:C.bg},header:{flexDirection:'row',alignItems:'center',padding:18,borderBottomWidth:1,borderBottomColor:C.border},back:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:C.surface,borderWidth:1,borderColor:C.border},title:{color:C.textPrimary,fontSize:20,fontWeight:'800'},subtitle:{color:C.textSecondary,fontSize:12,marginTop:2},content:{padding:18,paddingBottom:36},hero:{alignItems:'center',backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:22,padding:20},heroIcon:{width:58,height:58,borderRadius:19,alignItems:'center',justifyContent:'center'},subject:{color:C.textPrimary,fontSize:19,fontWeight:'900',textAlign:'center',marginTop:13},category:{color:C.textSecondary,fontSize:12,marginTop:4},status:{fontSize:10,fontWeight:'900',paddingHorizontal:11,paddingVertical:6,borderRadius:99,marginTop:12},section:{color:C.textSecondary,fontSize:12,fontWeight:'800',textTransform:'uppercase',letterSpacing:.8,marginTop:22,marginBottom:10},card:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:18,overflow:'hidden'},block:{padding:14,borderBottomWidth:1,borderBottomColor:C.border},blockLabel:{color:C.textMuted,fontSize:10,fontWeight:'800',textTransform:'uppercase'},blockText:{color:C.textPrimary,fontSize:13,lineHeight:20,marginTop:5},response:{backgroundColor:`${C.accent}0D`,borderWidth:1,borderColor:`${C.accent}35`,borderRadius:18,padding:15},responseText:{color:C.textPrimary,lineHeight:20},responseDate:{color:C.textMuted,fontSize:10,marginTop:12},primary:{minHeight:50,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:C.accent,borderRadius:16},primaryText:{color:C.bg,fontSize:14,fontWeight:'900',marginLeft:8},secondary:{minHeight:50,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:`${C.accent}12`,borderWidth:1,borderColor:`${C.accent}40`,borderRadius:16,marginTop:10},secondaryText:{color:C.accent,fontSize:14,fontWeight:'800',marginLeft:8},error:{backgroundColor:`${C.red}10`,borderWidth:1,borderColor:`${C.red}35`,borderRadius:14,padding:12,marginBottom:12},errorText:{color:C.textSecondary},footer:{color:C.textMuted,fontSize:12,textAlign:'center',marginTop:30},overlay:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(0,0,0,.58)'},modal:{backgroundColor:C.surface,borderTopLeftRadius:25,borderTopRightRadius:25,padding:18,paddingBottom:28},modalTitle:{color:C.textPrimary,fontSize:18,fontWeight:'900',marginBottom:14},option:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:C.bg,borderWidth:1,borderColor:C.border,borderRadius:15,padding:14,marginBottom:9},optionText:{color:C.textPrimary,fontWeight:'700'},replyHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},closeButton:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:C.bg},replyActions:{flexDirection:'row',alignItems:'center'},cancel:{flex:1,minHeight:50,alignItems:'center',justifyContent:'center',backgroundColor:C.bg,borderWidth:1,borderColor:C.border,borderRadius:16,marginRight:6},cancelText:{color:C.textSecondary,fontSize:14,fontWeight:'800'},sendReply:{flex:1,marginLeft:6},reply:{minHeight:150,maxHeight:260,color:C.textPrimary,backgroundColor:C.bg,borderWidth:1,borderColor:C.border,borderRadius:16,padding:14,textAlignVertical:'top',marginBottom:12}})}
