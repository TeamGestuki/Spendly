import React, {
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
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useLanguage,
} from '../context/LanguageContext';

import {
  useTheme,
} from '../context/ThemeContext';

const LANGUAGES = [
  {
    code: 'es',
    translationKey: 'spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'en',
    translationKey: 'english',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'pt',
    translationKey: 'portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
  {
    code: 'ru',
    translationKey: 'russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
  },
  {
    code: 'zh',
    translationKey: 'chinese',
    nativeName: '中文',
    flag: '🇨🇳',
  },
  {
    code: 'fr',
    translationKey: 'french',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
  {
    code: 'de',
    translationKey: 'german',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
  },
];

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

function LanguageItem({
  item,
  translatedName,
  selected,
  saving,
  onPress,
  isLast,
  styles,
  COLORS,
  currentText,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selected &&
          styles.languageItemSelected,
        isLast &&
          styles.languageItemLast,
      ]}
      onPress={onPress}
      activeOpacity={0.78}
      disabled={saving}
    >
      <View
        style={[
          styles.languageIcon,
          selected &&
            styles.languageIconSelected,
        ]}
      >
        <Text style={styles.languageFlag}>
          {item.flag}
        </Text>
      </View>

      <View style={styles.languageBody}>
        <View style={styles.languageTitleRow}>
          <Text style={styles.languageName}>
            {translatedName}
          </Text>

          {selected && (
            <View style={styles.selectedBadge}>
              <Text
                style={
                  styles.selectedBadgeText
                }
              >
                {currentText}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={
            styles.languageNativeName
          }
        >
          {item.nativeName}
        </Text>
      </View>

      {saving ? (
        <ActivityIndicator
          size="small"
          color={COLORS.accent}
        />
      ) : selected ? (
        <AppIcon
          name="checkmark-circle"
          size={22}
          color={COLORS.accent}
        />
      ) : (
        <AppIcon
          name="chevron-forward"
          size={16}
          color={COLORS.textMuted}
        />
      )}
    </TouchableOpacity>
  );
}

export default function LanguageSettingsScreen({
  navigation,
}) {
  const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const {
    language,
    setLanguage,
    languageLoaded,
    t,
  } = useLanguage();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );

  const [
    savingCode,
    setSavingCode,
  ] = useState(null);

  const selectedLanguage =
    LANGUAGES.find(
      (item) =>
        item.code === language
    ) || LANGUAGES[0];

  const handleSelectLanguage = async (
    item
  ) => {
    if (
      savingCode ||
      item.code === language
    ) {
      return;
    }

    try {
      setSavingCode(item.code);

      await setLanguage(item.code);
    } catch (error) {
      console.log(
        'Error guardando idioma:',
        error.message
      );
    } finally {
      setSavingCode(null);
    }
  };

  if (!languageLoaded) {
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

        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />

          <Text style={styles.loadingText}>
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

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

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          {t('language.title')}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="language-outline"
              size={28}
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.heroTitle}>
            {t('language.title')}
          </Text>

          <Text style={styles.heroText}>
            {t('language.subtitle')}
          </Text>

          <View
            style={
              styles.currentLanguageBox
            }
          >
            <Text
              style={
                styles.currentLanguageLabel
              }
            >
              {t('language.currentLanguage')}
            </Text>

            <Text
              style={
                styles.currentLanguageValue
              }
            >
              {selectedLanguage.flag}{' '}
              {t(
                `language.${selectedLanguage.translationKey}`
              )}
            </Text>

            <Text
              style={
                styles.currentLanguagePreview
              }
            >
              {selectedLanguage.nativeName}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('language.availableLanguages')}
        </Text>

        <View style={styles.card}>
          {LANGUAGES.map(
            (item, index) => {
              const selected =
                language === item.code;

              const saving =
                savingCode === item.code;

              return (
                <LanguageItem
                  key={item.code}
                  item={item}
                  translatedName={t(
                    `language.${item.translationKey}`
                  )}
                  selected={selected}
                  saving={saving}
                  isLast={
                    index ===
                    LANGUAGES.length - 1
                  }
                  currentText={t(
                    'language.current'
                  )}
                  onPress={() =>
                    handleSelectLanguage(
                      item
                    )
                  }
                  styles={styles}
                  COLORS={COLORS}
                />
              );
            }
          )}
        </View>

        <Text style={styles.footerText}>
          Spendly © 2026
        </Text>

        {!!savingCode && (
          <View style={styles.savingBox}>
            <ActivityIndicator
              size="small"
              color={COLORS.accent}
            />

            <Text style={styles.savingText}>
              {t('language.saving')}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: COLORS.bg,
    },

    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    topBarTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },

    topBarSpacer: {
      width: 40,
    },

    loadingBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginTop: 12,
      fontSize: 13,
      color: COLORS.textSecondary,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 30,
    },

    heroCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: `${COLORS.accent}29`,
      padding: 22,
      marginBottom: 24,
      alignItems: 'center',
    },

    heroIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor:
        COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    heroTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 6,
    },

    heroText: {
      fontSize: 13,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },

    currentLanguageBox: {
      width: '100%',
      marginTop: 18,
      backgroundColor:
        COLORS.surfaceHigh,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: `${COLORS.accent}33`,
      padding: 16,
      alignItems: 'center',
    },

    currentLanguageLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },

    currentLanguageValue: {
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 4,
    },

    currentLanguagePreview: {
      fontSize: 12,
      color: COLORS.accent,
      fontWeight: '700',
    },

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

    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor:
        COLORS.border,
      gap: 12,
    },

    languageItemSelected: {
      backgroundColor:
        COLORS.accentDim,
    },

    languageItemLast: {
      borderBottomWidth: 0,
    },

    languageIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    languageIconSelected: {
      backgroundColor:
        COLORS.surface,
      borderColor: `${COLORS.accent}40`,
    },

    languageFlag: {
      fontSize: 22,
    },

    languageBody: {
      flex: 1,
    },

    languageTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
      flexWrap: 'wrap',
    },

    languageName: {
      fontSize: 14,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },

    languageNativeName: {
      fontSize: 11,
      color: COLORS.textSecondary,
    },

    selectedBadge: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 999,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: `${COLORS.accent}40`,
    },

    selectedBadgeText: {
      fontSize: 9,
      fontWeight: '800',
      color: COLORS.accent,
      textTransform: 'uppercase',
    },

    infoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
    },

    infoText: {
      flex: 1,
      fontSize: 12,
      color: COLORS.textSecondary,
      lineHeight: 18,
    },

    savingBox: {
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },

    savingText: {
      fontSize: 12,
      color: COLORS.accent,
      textAlign: 'center',
      fontWeight: '700',
    },
    
    footerText: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: 12,
      color: COLORS.textMuted,
      fontWeight: '600',
    },
  });
}