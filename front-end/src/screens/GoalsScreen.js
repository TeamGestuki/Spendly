import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, ActivityIndicator, RefreshControl, Modal, Alert, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { formatMoney, getCurrencyByCode } from '../utils/currency';
import { getCurrentUser } from '../services/authService';
import {
  getGoals, getGoal, createGoal, updateGoal, deleteGoal,
  addGoalMovement, deleteGoalMovement, pauseGoal, resumeGoal, cancelGoal,
} from '../services/goalService';
import {
  cancelGoalNotifications, scheduleGoalDeadlineNotification,
  sendGoalCompletedNotification, sendGoalProgressNotification,
} from '../services/notificationService';

const API_BASE_URL = 'https://spendly-production-1793.up.railway.app';
const STATUSES = ['all', 'active', 'paused', 'completed', 'cancelled'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['emergency', 'travel', 'home', 'education', 'vehicle', 'technology', 'health', 'other'];
const ICONS = ['🎯', '🏠', '✈️', '🚗', '💻', '📚', '🏥', '💰'];
const GOAL_COLORS = ['#4ADE80', '#60A5FA', '#A78BFA', '#F59E0B', '#F87171', '#22D3EE'];

function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function getAvatarUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function progress(goal) {
  return Math.min(100, Math.max(0, Number(goal?.porcentaje_progreso) || 0));
}

function money(goal, value) {
  return formatMoney(value, getCurrencyByCode(goal?.currency || 'ARS'));
}

export default function GoalsScreen({ navigation, route }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t, language } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const [user, setUser] = useState({ full_name: '', profile_image_url: null, preferred_currency: 'ARS' });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [movementVisible, setMovementVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', target_amount: '', category: 'other', priority: 'medium', icon: '🎯', color: '#4ADE80' });
  const [movement, setMovement] = useState({ type: 'aporte', amount: '', note: '' });

  const avatarUrl = getAvatarUrl(user.profile_image_url);
  const preferredCurrency = getCurrencyByCode(user.preferred_currency || 'ARS');

  const load = useCallback(async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const [userData, goalData] = await Promise.all([getCurrentUser(), getGoals()]);
      setUser(userData);
      setGoals(Array.isArray(goalData) ? goalData : []);
    } catch (error) {
      Alert.alert(t('common.error'), error.message || t('goals.errors.load'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useFocusEffect(useCallback(() => { load(false); }, [load]));

  useEffect(() => {
    const goalId = route?.params?.goalId;
    if (!goalId || loading) return;
    (async () => {
      try {
        const goal = goals.find((item) => Number(item.id) === Number(goalId)) || await getGoal(goalId);
        setSelected(goal);
      } finally {
        navigation.setParams({ goalId: undefined });
      }
    })();
  }, [goals, loading, navigation, route?.params?.goalId]);

  const visibleGoals = useMemo(() => {
    const term = search.trim().toLowerCase();
    return goals.filter((goal) => {
      const statusOk = status === 'all' || goal.status === status;
      const searchOk = !term || [goal.name, goal.description, goal.category].some((value) => String(value || '').toLowerCase().includes(term));
      return statusOk && searchOk;
    });
  }, [goals, search, status]);

  const summary = useMemo(() => ({
    active: goals.filter((goal) => goal.status === 'active').length,
    completed: goals.filter((goal) => goal.status === 'completed').length,
    saved: goals.reduce((sum, goal) => sum + (Number(goal.current_amount) || 0), 0),
  }), [goals]);

  function resetForm() {
    setEditing(null);
    setForm({ name: '', description: '', target_amount: '', category: 'other', priority: 'medium', icon: '🎯', color: '#4ADE80' });
  }

  function openCreate() {
    resetForm();
    setFormVisible(true);
  }

  function openEdit(goal) {
    setEditing(goal);
    setForm({
      name: goal.name || '', description: goal.description || '', target_amount: String(goal.target_amount || ''),
      category: goal.category || 'other', priority: goal.priority || 'medium', icon: goal.icon || '🎯', color: goal.color || '#4ADE80',
    });
    setSelected(null);
    setFormVisible(true);
  }

  async function saveGoal() {
    const amount = Number(String(form.target_amount).replace(',', '.'));
    if (!form.name.trim()) return Alert.alert(t('common.error'), t('goals.validation.name'));
    if (!Number.isFinite(amount) || amount <= 0) return Alert.alert(t('common.error'), t('goals.validation.amount'));

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(), description: form.description.trim() || null,
        target_amount: amount, currency: editing?.currency || preferredCurrency.code,
        target_date: editing?.target_date || null, category: form.category,
        priority: form.priority, color: form.color, icon: form.icon,
      };
      const saved = editing
        ? await updateGoal(editing.id, payload)
        : await createGoal({ ...payload, status: 'active', automatic_contribution_config: null });

      if (editing) await cancelGoalNotifications(editing.id);
      if (saved.target_date && saved.status === 'active') {
        await scheduleGoalDeadlineNotification({
          goalId: saved.id, goalName: saved.name, targetDate: saved.target_date,
          title: t('goals.notifications.deadlineTitle'), body: t('goals.notifications.deadlineBody'),
        });
      }
      setFormVisible(false);
      resetForm();
      await load(false);
    } catch (error) {
      Alert.alert(t('common.error'), error.message || t('goals.errors.save'));
    } finally { setSaving(false); }
  }

  function openMovement(goal, type = 'aporte') {
    setSelected(goal);
    setMovement({ type, amount: '', note: '' });
    setMovementVisible(true);
  }

  async function saveMovement() {
    const amount = Number(String(movement.amount).replace(',', '.'));
    if (!Number.isFinite(amount) || amount === 0) return Alert.alert(t('common.error'), t('goals.validation.movementAmount'));
    try {
      setSaving(true);
      const previousProgress = progress(selected);
      const previousStatus = selected.status;
      const updated = await addGoalMovement(selected.id, { type: movement.type, amount, note: movement.note.trim() || null });
      const nextProgress = progress(updated);
      if (previousProgress < 80 && nextProgress >= 80 && nextProgress < 100) {
        await sendGoalProgressNotification({ goalId: updated.id, goalName: updated.name, percentage: nextProgress, title: t('goals.notifications.progressTitle'), body: t('goals.notifications.progressBody') });
      }
      if (previousStatus !== 'completed' && updated.status === 'completed') {
        await sendGoalCompletedNotification({ goalId: updated.id, goalName: updated.name, title: t('goals.notifications.completedTitle'), body: t('goals.notifications.completedBody') });
      }
      setMovementVisible(false);
      setSelected(updated);
      await load(false);
    } catch (error) {
      Alert.alert(t('common.error'), error.message || t('goals.errors.movement'));
    } finally { setSaving(false); }
  }

  async function changeStatus(action) {
    try {
      setSaving(true);
      const updated = action === 'pause' ? await pauseGoal(selected.id) : action === 'resume' ? await resumeGoal(selected.id) : await cancelGoal(selected.id);
      if (action !== 'resume') await cancelGoalNotifications(selected.id);
      setSelected(updated);
      await load(false);
    } catch (error) { Alert.alert(t('common.error'), error.message); }
    finally { setSaving(false); }
  }

  function confirmDelete() {
    Alert.alert(t('goals.confirm.deleteTitle'), t('goals.confirm.deleteText'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: async () => {
        await deleteGoal(selected.id); await cancelGoalNotifications(selected.id); setSelected(null); await load(false);
      } },
    ]);
  }

  function confirmDeleteMovement(item) {
    Alert.alert(t('goals.confirm.deleteMovementTitle'), t('goals.confirm.deleteMovementText'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: async () => {
        await deleteGoalMovement(selected.id, item.id); const updated = await getGoal(selected.id); setSelected(updated); await load(false);
      } },
    ]);
  }

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.accent} /><Text style={styles.loadingText}>{t('goals.loading')}</Text></View>;
  }

  return (
    <View style={styles.flex}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={COLORS.bg} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={COLORS.accent} />}>
        <View style={styles.header}>
          <View><Text style={styles.title}>{t('goals.title')}</Text><Text style={styles.subtitle}>{t('goals.subtitle')}</Text></View>
          <TouchableOpacity style={styles.avatarRing} onPress={() => navigation.navigate('Profile')}>
            {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatarImage} /> : <View style={styles.avatarFallback}><Text style={styles.avatarText}>{getInitials(user.full_name)}</Text></View>}
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryRow}>
          <View style={styles.summaryCard}><Text style={styles.summaryValue}>{summary.active}</Text><Text style={styles.summaryLabel}>{t('goals.summary.active')}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryValue}>{summary.completed}</Text><Text style={styles.summaryLabel}>{t('goals.summary.completed')}</Text></View>
          <View style={styles.summaryWide}><Text style={styles.summaryAmount}>{formatMoney(summary.saved, preferredCurrency)}</Text><Text style={styles.summaryLabel}>{t('goals.summary.saved')}</Text></View>
        </ScrollView>

        <View style={styles.searchBox}><AppIcon name="search-outline" color={COLORS.textMuted} /><TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder={t('goals.search')} placeholderTextColor={COLORS.textMuted} /></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {STATUSES.map((item) => <TouchableOpacity key={item} style={[styles.chip, status === item && styles.chipActive]} onPress={() => setStatus(item)}><Text style={[styles.chipText, status === item && styles.chipTextActive]}>{t(`goals.filters.${item}`)}</Text></TouchableOpacity>)}
        </ScrollView>

        {visibleGoals.length ? visibleGoals.map((goal) => (
          <TouchableOpacity key={goal.id} style={styles.goalCard} onPress={() => setSelected(goal)}>
            <View style={[styles.goalColor, { backgroundColor: goal.color || COLORS.accent }]} />
            <View style={styles.goalHeader}><View style={[styles.goalIcon, { backgroundColor: `${goal.color || COLORS.accent}18` }]}><Text style={styles.emoji}>{goal.icon || '🎯'}</Text></View><View style={{ flex: 1 }}><Text style={styles.goalName}>{goal.name}</Text><Text style={styles.goalMeta}>{t(`goals.status.${goal.status}`)} · {t(`goals.priority.${goal.priority}`)}</Text></View><AppIcon name="chevron-forward" color={COLORS.textMuted} /></View>
            <Text style={styles.amount}>{money(goal, goal.current_amount)} <Text style={styles.target}>/ {money(goal, goal.target_amount)}</Text></Text>
            <View style={styles.track}><View style={[styles.fill, { width: `${progress(goal)}%`, backgroundColor: goal.color || COLORS.accent }]} /></View>
            <View style={styles.cardBottom}><Text style={styles.percent}>{Math.round(progress(goal))}%</Text><Text style={styles.remaining}>{t('goals.card.remaining')}: {money(goal, goal.monto_restante)}</Text></View>
            {goal.status === 'active' && <TouchableOpacity style={styles.addButton} onPress={() => openMovement(goal)}><Text style={styles.addButtonText}>{t('goals.actions.contribute')}</Text></TouchableOpacity>}
          </TouchableOpacity>
        )) : <View style={styles.empty}><AppIcon name="flag-outline" size={38} color={COLORS.accent} /><Text style={styles.emptyTitle}>{t('goals.empty.title')}</Text><Text style={styles.emptyText}>{t('goals.empty.text')}</Text></View>}

        <Text style={styles.footer}>Spendly © 2026</Text>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openCreate}><AppIcon name="add" size={28} color={COLORS.buttonText || COLORS.bg} /></TouchableOpacity>

      <View style={styles.bottomNav}>
        {[['Home','home-outline','navigation.home'],['Expenses','swap-horizontal-outline','navigation.transactions'],['Scan','scan-outline',null],['Stats','bar-chart-outline','navigation.stats'],['Goals','flag','navigation.goals']].map(([screen, icon, key]) => screen === 'Scan' ? <TouchableOpacity key={screen} style={styles.scanWrap} onPress={() => navigation.navigate(screen)}><View style={styles.scanBtn}><AppIcon name={icon} size={26} color={COLORS.buttonText || COLORS.bg} /></View></TouchableOpacity> : <TouchableOpacity key={screen} style={styles.navItem} onPress={() => navigation.navigate(screen)}><AppIcon name={icon} size={24} color={screen === 'Goals' ? COLORS.accent : COLORS.textMuted} /><Text style={[styles.navLabel, screen === 'Goals' && { color: COLORS.accent }]}>{t(key)}</Text></TouchableOpacity>)}
      </View>

      <Modal visible={formVisible} transparent animationType="slide" onRequestClose={() => setFormVisible(false)}>
        <View style={styles.overlay}><View style={styles.sheet}><Text style={styles.sheetTitle}>{editing ? t('goals.form.editTitle') : t('goals.form.createTitle')}</Text>
          <ScrollView keyboardShouldPersistTaps="handled">
            <TextInput style={styles.input} value={form.name} onChangeText={(name) => setForm({ ...form, name })} placeholder={t('goals.form.namePlaceholder')} placeholderTextColor={COLORS.textMuted} />
            <TextInput style={[styles.input, styles.area]} value={form.description} onChangeText={(description) => setForm({ ...form, description })} placeholder={t('goals.form.descriptionPlaceholder')} placeholderTextColor={COLORS.textMuted} multiline />
            <TextInput style={styles.input} value={form.target_amount} onChangeText={(target_amount) => setForm({ ...form, target_amount })} placeholder={t('goals.form.targetAmount')} placeholderTextColor={COLORS.textMuted} keyboardType="decimal-pad" />
            <Text style={styles.sectionLabel}>{t('goals.form.category')}</Text><ScrollView horizontal>{CATEGORIES.map((category) => <TouchableOpacity key={category} style={[styles.chip, form.category === category && styles.chipActive]} onPress={() => setForm({ ...form, category })}><Text style={[styles.chipText, form.category === category && styles.chipTextActive]}>{t(`goals.category.${category}`)}</Text></TouchableOpacity>)}</ScrollView>
            <Text style={styles.sectionLabel}>{t('goals.form.priority')}</Text><View style={styles.row}>{PRIORITIES.map((priority) => <TouchableOpacity key={priority} style={[styles.chip, form.priority === priority && styles.chipActive]} onPress={() => setForm({ ...form, priority })}><Text style={[styles.chipText, form.priority === priority && styles.chipTextActive]}>{t(`goals.priority.${priority}`)}</Text></TouchableOpacity>)}</View>
            <View style={styles.rowWrap}>{ICONS.map((icon) => <TouchableOpacity key={icon} style={[styles.iconChoice, form.icon === icon && styles.choiceActive]} onPress={() => setForm({ ...form, icon })}><Text style={styles.emoji}>{icon}</Text></TouchableOpacity>)}</View>
            <View style={styles.row}>{GOAL_COLORS.map((color) => <TouchableOpacity key={color} style={[styles.colorChoice, { backgroundColor: color }, form.color === color && styles.colorSelected]} onPress={() => setForm({ ...form, color })} />)}</View>
            <TouchableOpacity style={styles.primary} onPress={saveGoal} disabled={saving}>{saving ? <ActivityIndicator color={COLORS.buttonText || COLORS.bg} /> : <Text style={styles.primaryText}>{editing ? t('goals.actions.saveChanges') : t('goals.actions.create')}</Text>}</TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={() => setFormVisible(false)}><Text style={styles.secondaryText}>{t('common.cancel')}</Text></TouchableOpacity>
          </ScrollView>
        </View></View>
      </Modal>

      <Modal visible={!!selected} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.overlay}><View style={styles.detailSheet}>{selected && <ScrollView>
          <View style={styles.detailHeader}><Text style={styles.detailTitle}>{selected.icon} {selected.name}</Text><TouchableOpacity onPress={() => setSelected(null)}><AppIcon name="close" size={24} color={COLORS.textSecondary} /></TouchableOpacity></View>
          <Text style={styles.detailAmount}>{money(selected, selected.current_amount)}</Text><Text style={styles.detailSub}>{t('goals.detail.of')} {money(selected, selected.target_amount)}</Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${progress(selected)}%`, backgroundColor: selected.color || COLORS.accent }]} /></View>
          <View style={styles.detailActions}><TouchableOpacity style={styles.primarySmall} onPress={() => openMovement(selected, 'aporte')}><Text style={styles.primaryText}>{t('goals.actions.contribute')}</Text></TouchableOpacity><TouchableOpacity style={styles.secondarySmall} onPress={() => openMovement(selected, 'retiro')}><Text style={styles.secondaryText}>{t('goals.actions.withdraw')}</Text></TouchableOpacity></View>
          <View style={styles.rowWrap}>
            <TouchableOpacity style={styles.action} onPress={() => openEdit(selected)}><Text style={styles.actionText}>{t('goals.actions.edit')}</Text></TouchableOpacity>
            {selected.status === 'active' && <TouchableOpacity style={styles.action} onPress={() => changeStatus('pause')}><Text style={styles.actionText}>{t('goals.actions.pause')}</Text></TouchableOpacity>}
            {selected.status === 'paused' && <TouchableOpacity style={styles.action} onPress={() => changeStatus('resume')}><Text style={styles.actionText}>{t('goals.actions.resume')}</Text></TouchableOpacity>}
            {!['completed','cancelled'].includes(selected.status) && <TouchableOpacity style={styles.action} onPress={() => changeStatus('cancel')}><Text style={styles.actionText}>{t('goals.actions.cancelGoal')}</Text></TouchableOpacity>}
            <TouchableOpacity style={styles.action} onPress={confirmDelete}><Text style={[styles.actionText, { color: COLORS.red }]}>{t('goals.actions.delete')}</Text></TouchableOpacity>
          </View>
          <Text style={styles.sectionLabel}>{t('goals.detail.history')}</Text>
          {(selected.movements || []).map((item) => <View key={item.id} style={styles.movementRow}><View style={{ flex: 1 }}><Text style={styles.goalName}>{t(`goals.movement.${item.type}`)}</Text><Text style={styles.goalMeta}>{new Date(item.date).toLocaleDateString(language)}{item.note ? ` · ${item.note}` : ''}</Text></View><Text style={styles.movementAmount}>{item.type === 'retiro' ? '-' : '+'}{money(selected, Math.abs(item.amount))}</Text><TouchableOpacity onPress={() => confirmDeleteMovement(item)}><AppIcon name="trash-outline" color={COLORS.red} /></TouchableOpacity></View>)}
        </ScrollView>}</View></View>
      </Modal>

      <Modal visible={movementVisible} transparent animationType="fade" onRequestClose={() => setMovementVisible(false)}>
        <View style={styles.overlay}><View style={styles.smallSheet}><Text style={styles.sheetTitle}>{t(`goals.movementForm.${movement.type}`)}</Text>
          <View style={styles.row}>{['aporte','retiro','ajuste'].map((type) => <TouchableOpacity key={type} style={[styles.chip, movement.type === type && styles.chipActive]} onPress={() => setMovement({ ...movement, type })}><Text style={[styles.chipText, movement.type === type && styles.chipTextActive]}>{t(`goals.movement.${type}`)}</Text></TouchableOpacity>)}</View>
          <TextInput style={styles.input} value={movement.amount} onChangeText={(amount) => setMovement({ ...movement, amount })} placeholder={t('goals.movementForm.amount')} placeholderTextColor={COLORS.textMuted} keyboardType="decimal-pad" />
          <TextInput style={[styles.input, styles.area]} value={movement.note} onChangeText={(note) => setMovement({ ...movement, note })} placeholder={t('goals.movementForm.note')} placeholderTextColor={COLORS.textMuted} multiline />
          <TouchableOpacity style={styles.primary} onPress={saveMovement} disabled={saving}>{saving ? <ActivityIndicator color={COLORS.buttonText || COLORS.bg} /> : <Text style={styles.primaryText}>{t('goals.actions.confirm')}</Text>}</TouchableOpacity>
          <TouchableOpacity style={styles.secondary} onPress={() => setMovementVisible(false)}><Text style={styles.secondaryText}>{t('common.cancel')}</Text></TouchableOpacity>
        </View></View>
      </Modal>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex:{flex:1,backgroundColor:COLORS.bg},loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.bg},loadingText:{marginTop:10,color:COLORS.textSecondary},content:{paddingHorizontal:20,paddingTop:56,paddingBottom:150},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20},title:{fontSize:25,fontWeight:'800',color:COLORS.textPrimary},subtitle:{marginTop:4,fontSize:13,color:COLORS.textSecondary},avatarRing:{width:44,height:44,borderRadius:22,borderWidth:2,borderColor:`${COLORS.accent}55`,alignItems:'center',justifyContent:'center'},avatarImage:{width:38,height:38,borderRadius:19},avatarFallback:{width:38,height:38,borderRadius:19,backgroundColor:COLORS.accentDim,alignItems:'center',justifyContent:'center'},avatarText:{fontWeight:'800',color:COLORS.accent},summaryRow:{gap:10,paddingBottom:18},summaryCard:{width:105,padding:14,borderRadius:18,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border},summaryWide:{width:165,padding:14,borderRadius:18,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border},summaryValue:{fontSize:24,fontWeight:'800',color:COLORS.textPrimary},summaryAmount:{fontSize:18,fontWeight:'800',color:COLORS.accent},summaryLabel:{marginTop:5,fontSize:11,color:COLORS.textSecondary},searchBox:{height:50,borderRadius:15,backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14},searchInput:{flex:1,color:COLORS.textPrimary},filters:{gap:8,paddingVertical:14},chip:{paddingHorizontal:13,height:38,borderRadius:12,backgroundColor:COLORS.surfaceHigh,borderWidth:1,borderColor:COLORS.border,alignItems:'center',justifyContent:'center',marginRight:8},chipActive:{backgroundColor:COLORS.accentDim,borderColor:`${COLORS.accent}55`},chipText:{fontSize:11,fontWeight:'700',color:COLORS.textSecondary},chipTextActive:{color:COLORS.accent},goalCard:{backgroundColor:COLORS.surface,borderRadius:22,borderWidth:1,borderColor:COLORS.border,padding:17,marginBottom:14,overflow:'hidden'},goalColor:{position:'absolute',top:0,bottom:0,left:0,width:4},goalHeader:{flexDirection:'row',alignItems:'center',gap:10},goalIcon:{width:44,height:44,borderRadius:14,alignItems:'center',justifyContent:'center'},emoji:{fontSize:22},goalName:{fontSize:15,fontWeight:'800',color:COLORS.textPrimary},goalMeta:{marginTop:3,fontSize:11,color:COLORS.textSecondary},amount:{fontSize:18,fontWeight:'800',color:COLORS.textPrimary,marginTop:16,marginBottom:10},target:{fontSize:12,fontWeight:'400',color:COLORS.textSecondary},track:{height:9,borderRadius:999,backgroundColor:COLORS.surfaceHigh,overflow:'hidden'},fill:{height:'100%',borderRadius:999},cardBottom:{flexDirection:'row',justifyContent:'space-between',marginTop:8},percent:{fontSize:12,fontWeight:'800',color:COLORS.textPrimary},remaining:{fontSize:11,color:COLORS.textSecondary},addButton:{alignSelf:'flex-end',marginTop:12,paddingHorizontal:13,height:36,borderRadius:12,backgroundColor:COLORS.accent,alignItems:'center',justifyContent:'center'},addButtonText:{fontSize:11,fontWeight:'800',color:COLORS.buttonText||COLORS.bg},empty:{padding:28,alignItems:'center',backgroundColor:COLORS.surface,borderRadius:22,borderWidth:1,borderColor:COLORS.border},emptyTitle:{fontSize:18,fontWeight:'800',color:COLORS.textPrimary,marginTop:12},emptyText:{fontSize:13,color:COLORS.textSecondary,textAlign:'center',marginTop:6},footer:{textAlign:'center',marginTop:28,color:COLORS.textMuted,fontSize:12,fontWeight:'600'},fab:{position:'absolute',right:22,bottom:105,width:58,height:58,borderRadius:29,backgroundColor:COLORS.accent,alignItems:'center',justifyContent:'center',elevation:8},bottomNav:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:COLORS.surface,borderTopWidth:1,borderTopColor:COLORS.border,flexDirection:'row',alignItems:'flex-end',paddingBottom:24,paddingTop:12,paddingHorizontal:20},navItem:{flex:1,alignItems:'center',gap:4},navLabel:{fontSize:10,color:COLORS.textMuted},scanWrap:{flex:1,alignItems:'center',marginBottom:8},scanBtn:{width:60,height:60,borderRadius:30,backgroundColor:COLORS.accent,alignItems:'center',justifyContent:'center',marginTop:-28},overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.68)',justifyContent:'flex-end'},sheet:{maxHeight:'92%',backgroundColor:COLORS.surface,borderTopLeftRadius:28,borderTopRightRadius:28,padding:20},detailSheet:{height:'88%',backgroundColor:COLORS.surface,borderTopLeftRadius:28,borderTopRightRadius:28,padding:20},smallSheet:{backgroundColor:COLORS.surface,borderTopLeftRadius:28,borderTopRightRadius:28,padding:20},sheetTitle:{fontSize:20,fontWeight:'800',color:COLORS.textPrimary,marginBottom:16},input:{minHeight:50,borderRadius:14,backgroundColor:COLORS.surfaceHigh,borderWidth:1,borderColor:COLORS.border,paddingHorizontal:14,paddingVertical:12,color:COLORS.textPrimary,marginBottom:14},area:{minHeight:85,textAlignVertical:'top'},sectionLabel:{fontSize:12,fontWeight:'700',color:COLORS.textSecondary,textTransform:'uppercase',marginTop:6,marginBottom:10},row:{flexDirection:'row',marginBottom:14},rowWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:14},iconChoice:{width:48,height:48,borderRadius:14,backgroundColor:COLORS.surfaceHigh,borderWidth:1,borderColor:COLORS.border,alignItems:'center',justifyContent:'center'},choiceActive:{borderColor:COLORS.accent,backgroundColor:COLORS.accentDim},colorChoice:{width:34,height:34,borderRadius:17,marginRight:10,borderWidth:3,borderColor:'transparent'},colorSelected:{borderColor:COLORS.textPrimary},primary:{height:52,borderRadius:16,backgroundColor:COLORS.accent,alignItems:'center',justifyContent:'center',marginTop:8},primaryText:{fontSize:14,fontWeight:'800',color:COLORS.buttonText||COLORS.bg},secondary:{height:48,borderRadius:14,backgroundColor:COLORS.surfaceHigh,alignItems:'center',justifyContent:'center',marginTop:10},secondaryText:{fontSize:13,fontWeight:'700',color:COLORS.textSecondary},detailHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16},detailTitle:{fontSize:20,fontWeight:'800',color:COLORS.textPrimary},detailAmount:{fontSize:26,fontWeight:'800',color:COLORS.textPrimary,textAlign:'center'},detailSub:{fontSize:12,color:COLORS.textSecondary,textAlign:'center',marginBottom:15},detailActions:{flexDirection:'row',gap:10,marginTop:18},primarySmall:{flex:1,height:46,borderRadius:14,backgroundColor:COLORS.accent,alignItems:'center',justifyContent:'center'},secondarySmall:{flex:1,height:46,borderRadius:14,backgroundColor:COLORS.surfaceHigh,alignItems:'center',justifyContent:'center'},action:{paddingHorizontal:12,height:40,borderRadius:12,backgroundColor:COLORS.surfaceHigh,alignItems:'center',justifyContent:'center'},actionText:{fontSize:11,fontWeight:'700',color:COLORS.textPrimary},movementRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:12,borderBottomWidth:1,borderBottomColor:COLORS.border},movementAmount:{fontSize:12,fontWeight:'800',color:COLORS.accent}
  });
}
