/**
 * ProfileScreen.js
 * Perfil y configuración de Spendly.
 */
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrencyByCode, setPreferredCurrency as savePreferredCurrency, } from '../utils/currency';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Constants from 'expo-constants';

import {
  getCurrentUser,
  uploadProfileAvatar,
  deleteProfileAvatar,
} from '../services/authService';
import { API_BASE_URL } from '../config';

const LANGUAGE_TRANSLATION_KEYS = {
  es: 'spanish',
  en: 'english',
  pt: 'portuguese',
  ru: 'russian',
  zh: 'chinese',
  fr: 'french',
  de: 'german',
};

const LANGUAGE_FLAGS = {
  es: '🇪🇸',
  en: '🇺🇸',
  pt: '🇧🇷',
  ru: '🇷🇺',
  zh: '🇨🇳',
  fr: '🇫🇷',
  de: '🇩🇪',
};

function AppIcon({
  name,
  size = 20,
  color = '#9CA3AF',
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  );
}

function getInitials(fullName = '') {
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return 'U';
}

function getAvatarUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function ProfileScreen({ navigation }) {
  const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const {
    language,
    t,
  } = useLanguage();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );

  const appVersion =
    Constants.expoConfig?.version || '1.1.0';

  function SettingItem({
    icon,
    iconColor = COLORS.accent,
    label,
    value,
    onPress,
    isLast,
    rightElement,
  }) {
    return (
      <TouchableOpacity
        style={[
          styles.settingItem,
          isLast && styles.settingItemLast,
        ]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.settingIconWrapper,
            {
              backgroundColor: `${iconColor}18`,
            },
          ]}
        >
          <AppIcon
            name={icon}
            size={18}
            color={iconColor}
          />
        </View>

        <View style={styles.settingBody}>
          <Text style={styles.settingLabel}>
            {label}
          </Text>

          {!!value && (
            <Text style={styles.settingValue}>
              {value}
            </Text>
          )}
        </View>

        {rightElement || (
          <AppIcon
            name="chevron-forward"
            size={16}
            color={COLORS.textMuted}
          />
        )}
      </TouchableOpacity>
    );
  }

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [avatarPreviewVisible, setAvatarPreviewVisible] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [preferredCurrency, setPreferredCurrency] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const [user, setUser] = useState({
    id: null,
    full_name: '',
    email: '',
    profile_image_url: null,
    is_active: true,
  });

  const avatarUrl = getAvatarUrl(user.profile_image_url);
  const initials = getInitials(user.full_name);

 useFocusEffect(
  useCallback(() => {
    loadUserData();
  }, [])
);

  const loadUserData = async () => {
  try {
    setLoadingUser(true);

    const data = await getCurrentUser();

    const currency = getCurrencyByCode(data.preferred_currency);

    setPreferredCurrency(currency);

    await savePreferredCurrency(currency.code);

    setAvatarError(false);

    setUser({
      id: data.id,
      full_name: data.full_name || t('profile.defaultUser'),
      email: data.email || '',
      profile_image_url: data.profile_image_url || null,
      is_active: data.is_active,
    });
  } catch (error) {
    console.log('Error cargando usuario:', error.message);
  } finally {
    setLoadingUser(false);
  }
};

  const handleOpenSecurity = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
    const pinEnabled = await AsyncStorage.getItem('pin_enabled');

    if (biometricEnabled === 'true') {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t('profile.verifyIdentity'),
        cancelLabel: t('common.cancel'),
        disableDeviceFallback: false,
      });

      if (result.success) {
        navigation.navigate('SecuritySettings');
      }

      return;
    }

    if (pinEnabled === 'true') {
      navigation.navigate('PinUnlock', {
        redirectTo: 'SecuritySettings',
      });
      return;
    }

    navigation.navigate('SecuritySettings');
  };

  const openAvatarMenu = () => setAvatarMenuVisible(true);
  const closeAvatarMenu = () => setAvatarMenuVisible(false);

  const handlePickAvatar = async () => {
    setTimeout(async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        console.log('Permiso de galería denegado');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      closeAvatarMenu();

      if (result.canceled) return;

      try {
        setUploadingAvatar(true);
        const imageUri = result.assets[0].uri;
        const updatedUser = await uploadProfileAvatar(imageUri);

        setAvatarError(false);

        setUser({
          id: updatedUser.id,
          full_name: updatedUser.full_name || t('profile.defaultUser'),
          email: updatedUser.email || '',
          profile_image_url: updatedUser.profile_image_url || null,
          is_active: updatedUser.is_active,
        });
      } catch (error) {
        console.log('Error subiendo avatar:', error.message);
      } finally {
        setUploadingAvatar(false);
      }
    }, 350);
  };

  const handleViewAvatar = () => {
    closeAvatarMenu();
    if (avatarUrl) setAvatarPreviewVisible(true);
  };

  const handleDeleteAvatar = async () => {
    closeAvatarMenu();

    try {
      const updatedUser = await deleteProfileAvatar();

      setAvatarError(false);

      setUser({
        id: updatedUser.id,
        full_name: updatedUser.full_name || t('profile.defaultUser'),
        email: updatedUser.email || '',
        profile_image_url: updatedUser.profile_image_url || null,
        is_active: updatedUser.is_active,
      });
    } catch (error) {
      console.log('Error eliminando avatar:', error.message);
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    setLogoutModalVisible(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={COLORS.bg}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <AppIcon name="create-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <TouchableOpacity
            style={styles.avatarRing}
            activeOpacity={0.8}
            onPress={openAvatarMenu}
          >
            {avatarUrl && !avatarError ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}

            <View style={styles.avatarEditBadge}>
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color={COLORS.onAccent || COLORS.bg} />
              ) : (
                <AppIcon name="camera-outline" size={13} color={COLORS.onAccent || COLORS.bg} />
              )}
            </View>
          </TouchableOpacity>

          {loadingUser ? (
            <ActivityIndicator size="small" color={COLORS.accent} />
          ) : (
            <>
              <Text style={styles.heroName}>{user.full_name}</Text>
              <Text style={styles.heroEmail}>{user.email}</Text>

              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  {user.is_active
                    ? t('profile.activeAccount')
                    : t('profile.inactiveAccount')}
                </Text>
              </View>
            </>
          )}
        </View>

        <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
        <View style={styles.card}>
          <SettingItem
            icon="person-outline"
            iconColor={COLORS.accent}
            label={t('profile.editPersonalData')}
            value={t('profile.editPersonalDataSubtitle')}
            onPress={() => navigation.navigate('EditProfile')}
          />

          <SettingItem
            icon="shield-checkmark-outline"
            iconColor={COLORS.purple}
            label={t('profile.security')}
            value={t('profile.securitySubtitle')}
            onPress={handleOpenSecurity}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>{t('profile.preferences')}</Text>
        <View style={styles.card}>
          <SettingItem
            icon="moon-outline"
            iconColor={COLORS.purple}
            label={t('profile.appearance')}
            value={t('profile.appearanceSubtitle')}
            onPress={() => navigation.navigate('ThemeSettings')}
          />

          <SettingItem
            icon="cash-outline"
            iconColor={COLORS.orange}
            label={t('profile.currency')}
            value={
              preferredCurrency
                ? `${preferredCurrency.code} · ${preferredCurrency.name}`
                : t('common.loading')
            }
            onPress={() => navigation.navigate('CurrencySettings')}
          />

          <SettingItem
            icon="language-outline"
            iconColor={COLORS.blue}
            label={t('profile.language')}
            value={`${LANGUAGE_FLAGS[language] || ''} ${t(
              `language.${LANGUAGE_TRANSLATION_KEYS[language] || 'spanish'}`
            )}`.trim()}
            onPress={() => navigation.navigate('LanguageSettings')}
          />

          <SettingItem
            icon="notifications-outline"
            iconColor={COLORS.orange}
            label={t('profile.notifications')}
            value={t('profile.notificationsSubtitle')}
            onPress={() => navigation.navigate('Notifications')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>{t('profile.support')}</Text>
        <View style={styles.card}>
          <SettingItem
            icon="help-circle-outline"
            iconColor={COLORS.blue}
            label={t('profile.helpCenter')}
            value={t('profile.helpCenterSubtitle')}
            onPress={() => navigation.navigate('HelpCenter')}
          />

          <SettingItem
            icon="bug-outline"
            iconColor={COLORS.orange}
            label={t('profile.reportProblem')}
            value={t('profile.reportProblemSubtitle')}
            onPress={() => navigation.navigate('ReportProblem')}
          />

          <SettingItem
            icon="information-circle-outline"
            iconColor={COLORS.purple}
            label={t('profile.about')}
            value={`${t('profile.version')} ${appVersion}`}
            onPress={() => navigation.navigate('AboutSpendly')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>{t('profile.session')}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <AppIcon name="log-out-outline" size={20} color={COLORS.red} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Spendly © 2026
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Modal
        visible={avatarMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAvatarMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeAvatarMenu}
        >
          <View style={styles.actionSheet}>
            <Text style={styles.actionSheetTitle}>{t('profile.profilePhoto')}</Text>

            {avatarUrl && (
              <TouchableOpacity style={styles.actionSheetItem} onPress={handleViewAvatar}>
                <AppIcon name="eye-outline" size={20} color={COLORS.blue} />
                <Text style={styles.actionSheetText}>{t('profile.viewProfilePhoto')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionSheetItem} onPress={handlePickAvatar}>
              <AppIcon
                name={avatarUrl ? 'image-outline' : 'add-circle-outline'}
                size={20}
                color={COLORS.accent}
              />
              <Text style={styles.actionSheetText}>
                {avatarUrl
                  ? t('profile.updatePhoto')
                  : t('profile.addPhoto')}
              </Text>
            </TouchableOpacity>

            {avatarUrl && (
              <TouchableOpacity style={styles.actionSheetItem} onPress={handleDeleteAvatar}>
                <AppIcon name="trash-outline" size={20} color={COLORS.red} />
                <Text style={[styles.actionSheetText, { color: COLORS.red }]}>
                  {t('profile.deletePhoto')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionSheetCancel} onPress={closeAvatarMenu}>
              <Text style={styles.actionSheetCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={avatarPreviewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarPreviewVisible(false)}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewCloseBtn}
            onPress={() => setAvatarPreviewVisible(false)}
          >
            <AppIcon name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {avatarUrl && !avatarError && (
            <Image
              source={{ uri: avatarUrl }}
              style={styles.previewImage}
              onError={() => {
                setAvatarError(true);
                setAvatarPreviewVisible(false);
              }}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModal}>
            <View style={styles.modalIconWrapper}>
              <AppIcon name="log-out-outline" size={26} color={COLORS.red} />
            </View>

            <Text style={styles.modalTitle}>{t('profile.logoutConfirmTitle')}</Text>

            <Text style={styles.modalText}>
              {t('profile.logoutConfirmText')}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmLogoutText}>{t('profile.logout')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="home-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>{t('navigation.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Expenses')}>
          <AppIcon name="swap-horizontal" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>{t('navigation.transactions')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navScanWrapper}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Scan')}
        >
          <View style={styles.navScanBtn}>
            <AppIcon
              name="scan-outline"
              size={26}
              color={COLORS.onAccent || COLORS.bg}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Stats')}
        >
          <AppIcon
            name="bar-chart-outline"
            size={24}
            color={COLORS.textMuted}
          />
          <Text style={styles.navLabel}>{t('navigation.stats')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Goals')}>
          <AppIcon name="flag-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>{t('navigation.goals')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 56 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: `${COLORS.accent}26`,
    marginBottom: 24,
    alignItems: 'center',
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: `${COLORS.accent}59`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  avatarImage: { width: 74, height: 74, borderRadius: 37 },
  avatarFallback: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: COLORS.accent },
  avatarEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  heroName: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  heroEmail: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentDim,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
    marginRight: 6,
  },
  statusText: { fontSize: 12, color: COLORS.accent, fontWeight: '600' },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  settingItemLast: { borderBottomWidth: 0 },
  settingIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingBody: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  settingValue: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  logoutBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${COLORS.red}40`,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: COLORS.red },
  footerText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 90,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: COLORS.textMuted },
  navScanWrapper: { flex: 1, alignItems: 'center', marginBottom: 8 },
  navScanBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  actionSheet: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  actionSheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  actionSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionSheetText: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  actionSheetCancel: {
    marginTop: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheetCancelText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCloseBtn: {
    position: 'absolute',
    top: 54,
    right: 24,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: { width: 280, height: 280, borderRadius: 140 },
  logoutModal: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${COLORS.red}1F`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  modalText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  confirmLogoutButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${COLORS.red}24`,
    borderWidth: 1,
    borderColor: `${COLORS.red}59`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLogoutText: { fontSize: 14, fontWeight: '800', color: COLORS.red },
  });
}