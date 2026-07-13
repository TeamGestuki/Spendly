import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import es from '../i18n/es';
import en from '../i18n/en';
import pt from '../i18n/pt';
import ru from '../i18n/ru';
import zh from '../i18n/zh';
import fr from '../i18n/fr';
import de from '../i18n/de';

const LANGUAGE_STORAGE_KEY =
  'preferred_language';

const translations = {
  es,
  en,
  pt,
  ru,
  zh,
  fr,
  de,
};

const SUPPORTED_LANGUAGES = [
  'es',
  'en',
  'pt',
  'ru',
  'zh',
  'fr',
  'de',
];

const LanguageContext =
  createContext(null);

function getNestedValue(
  object,
  path
) {
  return path
    .split('.')
    .reduce(
      (current, key) =>
        current?.[key],
      object
    );
}

export function LanguageProvider({
  children,
}) {
  const [
    language,
    setLanguageState,
  ] = useState('es');

  const [
    languageLoaded,
    setLanguageLoaded,
  ] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage =
          await AsyncStorage.getItem(
            LANGUAGE_STORAGE_KEY
          );

        if (
          savedLanguage &&
          translations[savedLanguage]
        ) {
          setLanguageState(
            savedLanguage
          );
        }
      } catch (error) {
        console.log(
          'Error cargando idioma:',
          error.message
        );
      } finally {
        setLanguageLoaded(true);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (
    code
  ) => {
    if (
      !SUPPORTED_LANGUAGES.includes(
        code
      )
    ) {
      console.log(
        `Idioma no soportado: ${code}`
      );

      return;
    }

    try {
      setLanguageState(code);

      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        code
      );
    } catch (error) {
      console.log(
        'Error guardando idioma:',
        error.message
      );
    }
  };

  const t = (key) => {
    const selectedTranslation =
      getNestedValue(
        translations[language],
        key
      );

    if (
      selectedTranslation !==
      undefined
    ) {
      return selectedTranslation;
    }

    const fallbackTranslation =
      getNestedValue(es, key);

    return (
      fallbackTranslation ??
      key
    );
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languageLoaded,
      supportedLanguages:
        SUPPORTED_LANGUAGES,
    }),
    [
      language,
      languageLoaded,
    ]
  );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage debe utilizarse dentro de LanguageProvider'
    );
  }

  return context;
}