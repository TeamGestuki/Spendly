import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  getActiveSessions,
  revokeSession,
  revokeOtherSessions,
} from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const LOCALES = {
  es: 'es-AR', en: 'en-US', pt: 'pt-BR', ru: 'ru-RU',
  zh: 'zh-CN', fr: 'fr-FR', de: 'de-DE',
};

function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function getLocale(language) {
  return LOCALES[language] || LOCALES.es;
}

function formatDate(value, language, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString(getLocale(language), {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getDeviceLabel(session, t) {
  if (session.device_name) return session.device_name;
  const agent = session.user_agent || '';
  if (agent.includes('iPhone')) return 'iPhone';
  if (agent.includes('Android')) return 'Android';
  if (agent.includes('Windows')) return 'Windows';
  if (agent.includes('Mac')) return 'Mac';
  if (agent.includes('Linux')) return 'Linux';
  return t('sessions.unknownDevice');
}

function getDeviceIcon(session) {
  const text = `${session.device_name || ''} ${session.user_agent || ''}`;
  if (text.includes('iPhone') || text.includes('Android')) return 'phone-portrait-outline';
  if (text.includes('Windows') || text.includes('Mac') || text.includes('Linux')) return 'desktop-outline';
  return 'hardware-chip-outline';
}

export default function SessionsScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { language, t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [confirmAllVisible, setConfirmAllVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const clearModal = () => {
    setPassword('');
    setPasswordError('');
  };

  const closeSingleModal = () => {
    if (actionLoading) return;
    setSelectedSession(null);
    clearModal();
  };

  const closeAllModal = () => {
    if (actionLoading) return;
    setConfirmAllVisible(false);
    clearModal();
  };

  const loadSessions = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError('');
      const data = await getActiveSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message || t('sessions.loadError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useFocusEffect(useCallback(() => {
    loadSessions(false);
  }, [loadSessions]));

  const currentSession = sessions.find((session) => session.is_current);
  const otherSessions = sessions.filter((session) => !session.is_current);

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError(t('sessions.passwordRequired'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRevokeSession = async () => {
    if (!selectedSession || actionLoading || !validatePassword()) return;
    try {
      setActionLoading(true);
      await revokeSession(selectedSession.id, password);
      setSelectedSession(null);
      clearModal();
      await loadSessions(false);
      Alert.alert(t('sessions.successTitle'), t('sessions.singleSuccess'));
    } catch (requestError) {
      setPasswordError(requestError.message || t('sessions.singleError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevokeOthers = async () => {
    if (actionLoading || !validatePassword()) return;
    try {
      setActionLoading(true);
      await revokeOtherSessions(password);
      setConfirmAllVisible(false);
      clearModal();
      await loadSessions(false);
      Alert.alert(t('sessions.successTitle'), t('sessions.allSuccess'));
    } catch (requestError) {
      setPasswordError(requestError.message || t('sessions.allError'));
    } finally {
      setActionLoading(false);
    }
  };

  const renderSessionCard = (session) => {
    const isCurrent = !!session.is_current;
    return (
      <View key={session.id} style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <View style={[
            styles.deviceIcon,
            { backgroundColor: isCurrent ? COLORS.accentDim : `${COLORS.blue}1F` },
          ]}>
            <AppIcon
              name={getDeviceIcon(session)}
              size={22}
              color={isCurrent ? COLORS.accent : COLORS.blue}
            />
          </View>

          <View style={styles.sessionBody}>
            <View style={styles.sessionTitleRow}>
              <Text style={styles.deviceName} numberOfLines={1}>
                {getDeviceLabel(session, t)}
              </Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>{t('sessions.current')}</Text>
                </View>
              )}
            </View>

            <Text style={styles.sessionDetail}>
              {t('sessions.ip')}: {session.ip_address || t('sessions.noData')}
            </Text>
            <Text style={styles.sessionDetail}>
              {t('sessions.lastActivity')}: {formatDate(session.last_seen_at, language, t('sessions.noData'))}
            </Text>
            <Text style={styles.sessionDetail}>
              {t('sessions.created')}: {formatDate(session.created_at, language, t('sessions.noData'))}
            </Text>
          </View>
        </View>

        {!isCurrent && (
          <TouchableOpacity
            style={styles.closeSessionButton}
            onPress={() => {
              clearModal();
              setSelectedSession(session);
            }}
            activeOpacity={0.8}
          >
            <AppIcon name="log-out-outline" size={17} color={COLORS.red} />
            <Text style={styles.closeSessionText}>{t('sessions.closeSession')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{t('sessions.title')}</Text>
        <View style={styles.topBarSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>{t('sessions.loading')}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadSessions(true)}
              tintColor={COLORS.accent}
              colors={[COLORS.accent]}
            />
          }
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <AppIcon name="shield-checkmark-outline" size={28} color={COLORS.accent} />
            </View>
            <Text style={styles.heroTitle}>{t('sessions.heroTitle')}</Text>
            <Text style={styles.heroText}>{t('sessions.heroText')}</Text>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <AppIcon name="alert-circle-outline" size={18} color={COLORS.red} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => loadSessions(false)}>
                <AppIcon name="refresh-outline" size={19} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.sectionTitle}>{t('sessions.currentSession')}</Text>
          {currentSession ? renderSessionCard(currentSession) : (
            <View style={styles.emptyCard}>
              <AppIcon name="help-circle-outline" size={28} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>{t('sessions.currentNotDetectedTitle')}</Text>
              <Text style={styles.emptyText}>{t('sessions.currentNotDetectedText')}</Text>
            </View>
          )}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('sessions.otherDevices')}</Text>
            {otherSessions.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  clearModal();
                  setConfirmAllVisible(true);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.closeAllText}>{t('sessions.closeAll')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {otherSessions.length > 0 ? otherSessions.map(renderSessionCard) : (
            <View style={styles.emptyCard}>
              <AppIcon name="checkmark-circle-outline" size={30} color={COLORS.accent} />
              <Text style={styles.emptyTitle}>{t('sessions.allGoodTitle')}</Text>
              <Text style={styles.emptyText}>{t('sessions.allGoodText')}</Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <AppIcon name="information-circle-outline" size={19} color={COLORS.blue} />
            <Text style={styles.infoText}>{t('sessions.info')}</Text>
          </View>

          <Text style={styles.footerText}>Spendly © 2026</Text>
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      <ConfirmSessionModal
        visible={!!selectedSession}
        title={t('sessions.singleModalTitle')}
        text={t('sessions.singleModalText')}
        deviceName={selectedSession ? getDeviceLabel(selectedSession, t) : ''}
        password={password}
        setPassword={setPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        loading={actionLoading}
        onCancel={closeSingleModal}
        onConfirm={handleRevokeSession}
        confirmText={t('sessions.close')}
        t={t}
        styles={styles}
        COLORS={COLORS}
      />

      <ConfirmSessionModal
        visible={confirmAllVisible}
        title={t('sessions.allModalTitle')}
        text={t('sessions.allModalText')}
        password={password}
        setPassword={setPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        loading={actionLoading}
        onCancel={closeAllModal}
        onConfirm={handleRevokeOthers}
        confirmText={t('sessions.closeAll')}
        t={t}
        styles={styles}
        COLORS={COLORS}
      />
    </View>
  );
}

function ConfirmSessionModal({
  visible,
  title,
  text,
  deviceName,
  password,
  setPassword,
  passwordError,
  setPasswordError,
  loading,
  onCancel,
  onConfirm,
  confirmText,
  t,
  styles,
  COLORS,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={styles.confirmModal}>
          <View style={styles.modalIcon}>
            <AppIcon name="log-out-outline" size={26} color={COLORS.red} />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{text}</Text>
          {!!deviceName && <Text style={styles.modalDeviceName}>{deviceName}</Text>}

          <TextInput
            style={[styles.passwordInput, !!passwordError && styles.passwordInputError]}
            placeholder={t('sessions.passwordPlaceholder')}
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry
            value={password}
            editable={!loading}
            onChangeText={(value) => {
              setPassword(value);
              setPasswordError('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={onConfirm}
          />

          {!!passwordError && <Text style={styles.passwordError}>{passwordError}</Text>}

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={loading}>
              <Text style={styles.cancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.red} />
              ) : (
                <Text style={styles.confirmText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.bg },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: COLORS.bg },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    topBarTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
    topBarSpacer: { width: 40 },
    content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 30 },
    loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { fontSize: 13, color: COLORS.textSecondary },
    heroCard: { backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: `${COLORS.accent}29`, padding: 22, marginBottom: 24, alignItems: 'center' },
    heroIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.accentDim, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    heroTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6, textAlign: 'center' },
    heroText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
    errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${COLORS.red}1A`, borderWidth: 1, borderColor: `${COLORS.red}40`, borderRadius: 16, padding: 12, gap: 8, marginBottom: 18 },
    errorText: { flex: 1, fontSize: 12, color: COLORS.red, lineHeight: 17 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginLeft: 2 },
    closeAllText: { fontSize: 12, fontWeight: '700', color: COLORS.red, marginBottom: 10 },
    sessionCard: { backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 16, marginBottom: 14 },
    sessionHeader: { flexDirection: 'row', gap: 12 },
    deviceIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    sessionBody: { flex: 1 },
    sessionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
    deviceName: { flex: 1, fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
    currentBadge: { backgroundColor: COLORS.accentDim, borderWidth: 1, borderColor: `${COLORS.accent}40`, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
    currentBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.accent },
    sessionDetail: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 18 },
    closeSessionButton: { height: 42, borderRadius: 14, backgroundColor: `${COLORS.red}1A`, borderWidth: 1, borderColor: `${COLORS.red}40`, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 14 },
    closeSessionText: { fontSize: 13, fontWeight: '800', color: COLORS.red },
    emptyCard: { backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, padding: 22, marginBottom: 18, alignItems: 'center' },
    emptyTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginTop: 8, marginBottom: 4, textAlign: 'center' },
    emptyText: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 18 },
    infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginTop: 4 },
    infoText: { flex: 1, fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
    footerText: { marginTop: 26, fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },
    bottomSpacer: { height: 30 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    confirmModal: { width: '100%', maxWidth: 390, backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border, padding: 24, alignItems: 'center' },
    modalIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: `${COLORS.red}1F`, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8, textAlign: 'center' },
    modalText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
    modalDeviceName: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 22, textAlign: 'center' },
    passwordInput: { width: '100%', height: 48, borderRadius: 14, backgroundColor: COLORS.surfaceHigh, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, color: COLORS.textPrimary, fontSize: 14, marginTop: 8 },
    passwordInputError: { borderColor: COLORS.red },
    passwordError: { width: '100%', fontSize: 12, color: COLORS.red, marginTop: 8, textAlign: 'left' },
    modalActions: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 16 },
    cancelButton: { flex: 1, height: 48, borderRadius: 14, backgroundColor: COLORS.surfaceHigh, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    cancelText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
    confirmButton: { flex: 1, height: 48, borderRadius: 14, backgroundColor: `${COLORS.red}24`, borderWidth: 1, borderColor: `${COLORS.red}59`, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { opacity: 0.65 },
    confirmText: { fontSize: 14, fontWeight: '800', color: COLORS.red },
  });
}
