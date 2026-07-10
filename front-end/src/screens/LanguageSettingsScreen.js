import React, { useEffect, useState } from 'react';
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
  LANGUAGES,
  getPreferredLanguage,
  setPreferredLanguage,
} from '../utils/language';

const COLORS = {
  bg: '#0D0F14',
  surface: '#161A23',
  surfaceHigh: '#1E2330',
  border: '#272D3D',
  accent: '#4ADE80',
  accentDim: '#1A3D28',
  textPrimary: '#F0F2F7',
  textSecondary: '#9CA3AF',
  textMuted: '#6B748A',
  blue: '#60A5FA',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function LanguageItem({
  language,
  selected,
  onPress,
  isLast,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selected && styles.languageItemSelected,
        isLast && styles.languageItemLast,
      ]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      <View
        style={[
          styles.languageIcon,
          selected && styles.languageIconSelected,
        ]}
      >
        <Text style={styles.languageFlag}>
          {language.flag}
        </Text>
      </View>

      <View style={styles.languageBody}>
        <View style={styles.languageTitleRow}>
          <Text style={styles.languageName}>
            {language.name}
          </Text>

          {selected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>
                Actual
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.languageNativeName}>
          {language.nativeName}
        </Text>
      </View>

      {selected ? (
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

export default function LanguageSettingsScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCode, setSavingCode] = useState(null);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      setLoading(true);

      const language = await getPreferredLanguage();

      setSelectedLanguage(language);
    } catch (error) {
      console.log('Error cargando idioma:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLanguage = async (language) => {
    if (savingCode) return;

    try {
      setSavingCode(language.code);

      const savedLanguage =
        await setPreferredLanguage(language.code);

      setSelectedLanguage(savedLanguage);
    } catch (error) {
      console.log('Error guardando idioma:', error);
    } finally {
      setSavingCode(null);
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          Idioma
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />
          <Text style={styles.loadingText}>
            Cargando idiomas...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
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
              Elegí el idioma
            </Text>

            <Text style={styles.heroText}>
              Esta preferencia quedará guardada para cuando Spendly
              tenga traducción completa mediante i18n.
            </Text>

            {selectedLanguage && (
              <View style={styles.currentLanguageBox}>
                <Text style={styles.currentLanguageLabel}>
                  Idioma actual
                </Text>

                <Text style={styles.currentLanguageValue}>
                  {selectedLanguage.flag} {selectedLanguage.name}
                </Text>

                <Text style={styles.currentLanguagePreview}>
                  {selectedLanguage.nativeName}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            Idiomas disponibles
          </Text>

          <View style={styles.card}>
            {LANGUAGES.map((language, index) => {
              const selected =
                selectedLanguage?.code === language.code;

              return (
                <LanguageItem
                  key={language.code}
                  language={language}
                  selected={selected}
                  isLast={index === LANGUAGES.length - 1}
                  onPress={() => handleSelectLanguage(language)}
                />
              );
            })}
          </View>

          <Text style={styles.infoText}>
            Por ahora esta opción guarda la preferencia de idioma.
            Más adelante, al implementar i18n, los textos de la app
            se adaptarán automáticamente a la selección.
          </Text>

          {!!savingCode && (
            <Text style={styles.savingText}>
              Guardando idioma...
            </Text>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    borderColor: 'rgba(74,222,128,0.16)',
    padding: 22,
    marginBottom: 24,
    alignItems: 'center',
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accentDim,
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
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.20)',
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
    borderBottomColor: COLORS.border,
    gap: 12,
  },

  languageItemSelected: {
    backgroundColor: 'rgba(74,222,128,0.06)',
  },

  languageItemLast: {
    borderBottomWidth: 0,
  },

  languageIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  languageIconSelected: {
    backgroundColor: COLORS.accentDim,
    borderColor: 'rgba(74,222,128,0.25)',
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
    backgroundColor: COLORS.accentDim,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
  },

  selectedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.accent,
    textTransform: 'uppercase',
  },

  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  savingText: {
    marginTop: 14,
    fontSize: 12,
    color: COLORS.accent,
    textAlign: 'center',
    fontWeight: '700',
  },
});