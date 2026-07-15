import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
  configureNotifications,
  DEFAULT_NOTIFICATION_SETTINGS,
  getNotificationPermissionStatus,
  getNotificationSettings,
  requestNotificationPermissions,
  saveNotificationSettings,
  syncBaseNotifications,
  sendTestNotification,
  cancelAllSpendlyNotifications,
} from '../services/notificationService';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function SettingItem({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  onValueChange,
  disabled,
  isLast,
  styles,
  COLORS,
}) {
  return (
    <View style={[
      styles.settingItem,
      isLast && styles.settingItemLast,
      disabled && styles.settingItemDisabled,
    ]}>
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}18` }]}>
        <AppIcon name={icon} size={19} color={iconColor} />
      </View>

      <View style={styles.settingBody}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: COLORS.surfaceHigh, true: COLORS.accentDim }}
        thumbColor={value ? COLORS.accent : COLORS.textSecondary}
      />
    </View>
  );
}

export default function NotificationsScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const copy = useMemo(() => ({
    dailyTitle: t('notifications.copy.dailyTitle'),
    dailyBody: t('notifications.copy.dailyBody'),
    weeklyTitle: t('notifications.copy.weeklyTitle'),
    weeklyBody: t('notifications.copy.weeklyBody'),
    monthlyTitle: t('notifications.copy.monthlyTitle'),
    monthlyBody: t('notifications.copy.monthlyBody'),
  }), [t]);

  const loadSettings = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      await configureNotifications();
      const [saved, status] = await Promise.all([
        getNotificationSettings(),
        getNotificationPermissionStatus(),
      ]);
      setSettings(saved);
      setPermissionStatus(status);
    } catch {
      Alert.alert(t('common.error'), t('notifications.loadError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useFocusEffect(useCallback(() => {
    loadSettings(false);
  }, [loadSettings]));

  const persist = async (next) => {
    try {
      setSaving(true);
      await saveNotificationSettings(next);
      await syncBaseNotifications({ settings: next, copy });
      setSettings(next);
    } catch {
      Alert.alert(t('common.error'), t('notifications.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => persist({ ...settings, [key]: value });

  const handleMaster = async (value) => {
    if (value) {
      const status = await requestNotificationPermissions();
      setPermissionStatus(status);
      if (status !== 'granted') {
        Alert.alert(
          t('notifications.permissionDeniedTitle'),
          t('notifications.permissionDeniedText')
        );
        return;
      }
    } else {
      await cancelAllSpendlyNotifications();
    }

    await persist({ ...settings, enabled: value });
  };

  const handleTest = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        t('notifications.permissionRequiredTitle'),
        t('notifications.permissionRequiredText')
      );
      return;
    }

    await sendTestNotification({
      title: t('notifications.copy.testTitle'),
      body: t('notifications.copy.testBody'),
    });

    Alert.alert(
      t('notifications.testScheduledTitle'),
      t('notifications.testScheduledText')
    );
  };

  const disabled = !settings.enabled || saving;
  const permissionLabel = permissionStatus === 'granted'
    ? t('notifications.permission.granted')
    : permissionStatus === 'denied'
      ? t('notifications.permission.denied')
      : t('notifications.permission.undetermined');

  if (loading) {
    return (
      <View style={styles.flex}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={COLORS.bg}
        />
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>{t('notifications.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{t('notifications.title')}</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSettings(true)}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon name="notifications-outline" size={28} color={COLORS.accent} />
          </View>
          <Text style={styles.heroTitle}>{t('notifications.heroTitle')}</Text>
          <Text style={styles.heroText}>{t('notifications.heroText')}</Text>
        </View>

        <Text style={styles.sectionTitle}>{t('notifications.generalSection')}</Text>
        <View style={styles.card}>
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="notifications-outline"
            iconColor={COLORS.accent}
            title={t('notifications.master.title')}
            subtitle={t('notifications.master.subtitle')}
            value={settings.enabled}
            onValueChange={handleMaster}
            disabled={saving}
            isLast
          />
        </View>

        <View style={styles.permissionCard}>
          <View style={[styles.permissionIcon, {
            backgroundColor: permissionStatus === 'granted'
              ? `${COLORS.accent}18`
              : `${COLORS.orange}18`,
          }]}>
            <AppIcon
              name={permissionStatus === 'granted' ? 'checkmark-circle-outline' : 'settings-outline'}
              size={20}
              color={permissionStatus === 'granted' ? COLORS.accent : COLORS.orange}
            />
          </View>
          <View style={styles.permissionBody}>
            <Text style={styles.permissionTitle}>{t('notifications.permissionTitle')}</Text>
            <Text style={styles.permissionValue}>{permissionLabel}</Text>
          </View>
          {permissionStatus === 'denied' && (
            <TouchableOpacity onPress={() => Linking.openSettings()}>
              <Text style={styles.settingsLink}>{t('notifications.openSettings')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>{t('notifications.activitySection')}</Text>
        <View style={styles.card}>
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="create-outline"
            iconColor={COLORS.blue}
            title={t('notifications.daily.title')}
            subtitle={t('notifications.daily.subtitle')}
            value={settings.dailyReminder}
            onValueChange={(value) => update('dailyReminder', value)}
            disabled={disabled}
            isLast
          />
        </View>

        {settings.enabled && settings.dailyReminder && (
          <View style={styles.timeCard}>
            <Text style={styles.timeTitle}>{t('notifications.daily.timeTitle')}</Text>
            <View style={styles.timeRow}>
              {[18, 20, 21].map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[styles.timeChip, settings.dailyHour === hour && styles.timeChipActive]}
                  onPress={() => persist({ ...settings, dailyHour: hour, dailyMinute: 0 })}
                >
                  <Text style={[
                    styles.timeChipText,
                    settings.dailyHour === hour && styles.timeChipTextActive,
                  ]}>
                    {`${hour}:00`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.timeHint}>{t('notifications.daily.timeHint')}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>{t('notifications.summarySection')}</Text>
        <View style={styles.card}>
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="calendar-outline"
            iconColor={COLORS.purple}
            title={t('notifications.weekly.title')}
            subtitle={t('notifications.weekly.subtitle')}
            value={settings.weeklySummary}
            onValueChange={(value) => update('weeklySummary', value)}
            disabled={disabled}
          />
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="bar-chart-outline"
            iconColor={COLORS.orange}
            title={t('notifications.monthly.title')}
            subtitle={t('notifications.monthly.subtitle')}
            value={settings.monthlySummary}
            onValueChange={(value) => update('monthlySummary', value)}
            disabled={disabled}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>{t('notifications.goalsSection')}</Text>
        <View style={styles.card}>
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="time-outline"
            iconColor={COLORS.orange}
            title={t('notifications.goalDeadline.title')}
            subtitle={t('notifications.goalDeadline.subtitle')}
            value={settings.goalDeadline}
            onValueChange={(value) => update('goalDeadline', value)}
            disabled={disabled}
          />
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="trending-up-outline"
            iconColor={COLORS.blue}
            title={t('notifications.goalProgress.title')}
            subtitle={t('notifications.goalProgress.subtitle')}
            value={settings.goalProgress}
            onValueChange={(value) => update('goalProgress', value)}
            disabled={disabled}
          />
          <SettingItem
            styles={styles}
            COLORS={COLORS}
            icon="trophy-outline"
            iconColor={COLORS.accent}
            title={t('notifications.goalCompleted.title')}
            subtitle={t('notifications.goalCompleted.subtitle')}
            value={settings.goalCompleted}
            onValueChange={(value) => update('goalCompleted', value)}
            disabled={disabled}
            isLast
          />
        </View>

        <View style={styles.infoCard}>
          <AppIcon name="information-circle-outline" size={19} color={COLORS.blue} />
          <Text style={styles.infoText}>{t('notifications.goalsInfo')}</Text>
        </View>

        <Text style={styles.footerText}>Spendly © 2026</Text>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.bg },
    topBar: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: COLORS.bg,
    },
    backButton: {
      width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface,
      borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
    },
    topBarTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
    topBarSpacer: { width: 40 },
    content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 36 },
    loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 12, fontSize: 13, color: COLORS.textSecondary },
    heroCard: {
      backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1,
      borderColor: `${COLORS.accent}29`, padding: 22, marginBottom: 24, alignItems: 'center',
    },
    heroIcon: {
      width: 58, height: 58, borderRadius: 29, backgroundColor: COLORS.accentDim,
      alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    heroTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
    heroText: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },
    sectionTitle: {
      fontSize: 13, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase',
      letterSpacing: 0.8, marginBottom: 10, marginLeft: 2,
    },
    card: {
      backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1,
      borderColor: COLORS.border, marginBottom: 16, overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16,
      paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    settingItemLast: { borderBottomWidth: 0 },
    settingItemDisabled: { opacity: 0.5 },
    settingIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    settingBody: { flex: 1 },
    settingTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
    settingSubtitle: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },
    permissionCard: {
      flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface,
      borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 22,
    },
    permissionIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
    permissionBody: { flex: 1 },
    permissionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
    permissionValue: { marginTop: 2, fontSize: 11, color: COLORS.textSecondary },
    settingsLink: { fontSize: 12, fontWeight: '700', color: COLORS.accent },
    timeCard: {
      backgroundColor: COLORS.surface, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border,
      padding: 15, marginTop: -6, marginBottom: 22,
    },
    timeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 },
    timeRow: { flexDirection: 'row', gap: 8 },
    timeChip: {
      flex: 1, height: 40, borderRadius: 12, backgroundColor: COLORS.surfaceHigh,
      borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
    },
    timeChipActive: { backgroundColor: COLORS.accentDim, borderColor: `${COLORS.accent}55` },
    timeChipText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
    timeChipTextActive: { color: COLORS.accent },
    timeHint: { marginTop: 10, fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },
    infoCard: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: COLORS.surface,
      borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 20,
    },
    infoText: { flex: 1, fontSize: 11, color: COLORS.textSecondary, lineHeight: 17 },
    testButton: {
      height: 52, borderRadius: 16, backgroundColor: COLORS.accent, flexDirection: 'row',
      gap: 9, alignItems: 'center', justifyContent: 'center',
    },
    testButtonDisabled: { backgroundColor: COLORS.accentDim },
    testButtonText: { fontSize: 14, fontWeight: '800', color: COLORS.buttonText || COLORS.bg },
    footerText: { marginTop: 28, fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },
    bottomSpacer: { height: 20 },
  });
}
