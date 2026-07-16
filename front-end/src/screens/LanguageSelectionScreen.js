/**
 * LanguageSelectionScreen.js
 * Primera pantalla de Spendly.
 */
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '../context/LanguageContext';

export const LANGUAGE_STORAGE_KEY = 'preferred_language';

const COLORS = {
  bg: '#0D0F14',
  surface: '#161A23',
  surfaceHigh: '#1E2330',
  border: '#272D3D',
  accent: '#4ADE80',
  accentDim: '#1A3D28',
  textPrimary: '#F0F2F7',
  textSecondary: '#8A94A8',
  textMuted: '#50596D',
  buttonText: '#0D1A12',
};

const LANGUAGES = [
  { code: 'es', flag: '🇪🇸', nativeName: 'Español', region: 'Español' },
  { code: 'en', flag: '🇺🇸', nativeName: 'English', region: 'English' },
  { code: 'pt', flag: '🇧🇷', nativeName: 'Português', region: 'Português' },
  { code: 'fr', flag: '🇫🇷', nativeName: 'Français', region: 'Français' },
  { code: 'de', flag: '🇩🇪', nativeName: 'Deutsch', region: 'Deutsch' },
  { code: 'ru', flag: '🇷🇺', nativeName: 'Русский', region: 'Русский' },
  { code: 'zh', flag: '🇨🇳', nativeName: '中文', region: '简体中文' },
];

const COPY = {
  es: {
    title: 'Elegí tu idioma',
    subtitle: 'Seleccioná el idioma que querés usar en Spendly.',
    note: 'Podrás cambiarlo más adelante desde Configuración.',
    continue: 'Continuar',
    saving: 'Guardando...',
  },
  en: {
    title: 'Choose your language',
    subtitle: 'Select the language you want to use in Spendly.',
    note: 'You can change it later from Settings.',
    continue: 'Continue',
    saving: 'Saving...',
  },
  pt: {
    title: 'Escolha seu idioma',
    subtitle: 'Selecione o idioma que deseja usar no Spendly.',
    note: 'Você poderá alterá-lo depois nas Configurações.',
    continue: 'Continuar',
    saving: 'Salvando...',
  },
  fr: {
    title: 'Choisissez votre langue',
    subtitle: 'Sélectionnez la langue que vous souhaitez utiliser dans Spendly.',
    note: 'Vous pourrez la modifier plus tard dans les réglages.',
    continue: 'Continuer',
    saving: 'Enregistrement...',
  },
  de: {
    title: 'Wähle deine Sprache',
    subtitle: 'Wähle die Sprache, die du in Spendly verwenden möchtest.',
    note: 'Du kannst sie später in den Einstellungen ändern.',
    continue: 'Weiter',
    saving: 'Speichern...',
  },
  ru: {
    title: 'Выберите язык',
    subtitle: 'Выберите язык, который хотите использовать в Spendly.',
    note: 'Позже его можно изменить в настройках.',
    continue: 'Продолжить',
    saving: 'Сохранение...',
  },
  zh: {
    title: '选择语言',
    subtitle: '选择您希望在 Spendly 中使用的语言。',
    note: '之后可在设置中更改。',
    continue: '继续',
    saving: '正在保存...',
  },
};

function LanguageOption({ item, selected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.985,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.languageCard,
          selected && styles.languageCardSelected,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.92}
      >
        <View style={styles.flagBox}>
          <Text style={styles.flag}>{item.flag}</Text>
        </View>

        <View style={styles.languageBody}>
          <Text
            style={[
              styles.languageName,
              selected && styles.languageNameSelected,
            ]}
          >
            {item.nativeName}
          </Text>
          <Text style={styles.languageRegion}>{item.region}</Text>
        </View>

        <View
          style={[
            styles.selectionCircle,
            selected && styles.selectionCircleActive,
          ]}
        >
          {selected && (
            <Ionicons
              name="checkmark"
              size={16}
              color={COLORS.buttonText}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LanguageSelectionScreen({ navigation }) {
  const { setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [saving, setSaving] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const copy = useMemo(
    () => COPY[selectedLanguage || 'en'],
    [selectedLanguage]
  );

  const handleContinue = async () => {
    if (!selectedLanguage || saving) return;

    try {
      setSaving(true);
      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        selectedLanguage
      );
      await setLanguage(selectedLanguage);
      navigation.replace('Login');
    } finally {
      setSaving(false);
    }
  };

  const buttonDisabled = !selectedLanguage || saving;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.branding}>
          <View style={styles.logoOuter}>
            <Text style={styles.logoIcon}>$</Text>
          </View>
          <Text style={styles.appName}>Spendly</Text>
          <Text style={styles.appTagline}>Smart money management</Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <View style={styles.noteRow}>
            <Ionicons
              name="settings-outline"
              size={16}
              color={COLORS.textMuted}
            />
            <Text style={styles.note}>{copy.note}</Text>
          </View>
        </View>

        <View style={styles.languageList}>
          {LANGUAGES.map((language) => (
            <LanguageOption
              key={language.code}
              item={language}
              selected={selectedLanguage === language.code}
              onPress={() => setSelectedLanguage(language.code)}
            />
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              buttonDisabled && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            onPressIn={() =>
              Animated.spring(buttonScale, {
                toValue: 0.975,
                useNativeDriver: true,
              }).start()
            }
            onPressOut={() =>
              Animated.spring(buttonScale, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
              }).start()
            }
            disabled={buttonDisabled}
            activeOpacity={0.9}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color={COLORS.buttonText} />
                <Text style={styles.continueText}>{copy.saving}</Text>
              </>
            ) : (
              <>
                <Text style={styles.continueText}>{copy.continue}</Text>
                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={COLORS.buttonText}
                />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footer}>Spendly © 2026</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 56,
    paddingBottom: 30,
  },
  branding: {
    alignItems: 'center',
    marginBottom: 34,
  },
  logoOuter: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLORS.accentDim,
    borderWidth: 1,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  logoIcon: {
    fontSize: 31,
    fontWeight: '500',
    color: COLORS.accent,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  appTagline: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  intro: {
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 9,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 13,
  },
  note: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  languageList: {
    gap: 10,
    marginBottom: 24,
  },
  languageCard: {
    minHeight: 72,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  languageCardSelected: {
    backgroundColor: COLORS.accentDim,
    borderColor: COLORS.accent,
  },
  flagBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  flag: {
    fontSize: 25,
  },
  languageBody: {
    flex: 1,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  languageNameSelected: {
    color: COLORS.accent,
  },
  languageRegion: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  selectionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionCircleActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  continueButton: {
    height: 56,
    borderRadius: 17,
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 7,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.accentDim,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.buttonText,
  },
  footer: {
    marginTop: 26,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});