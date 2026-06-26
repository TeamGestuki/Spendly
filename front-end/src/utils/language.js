import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = 'preferred_language';

export const LANGUAGES = [
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'en',
    name: 'Inglés',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'pt',
    name: 'Portugués',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

export const getLanguageByCode = (code) => {
  return (
    LANGUAGES.find((language) => language.code === code) ||
    DEFAULT_LANGUAGE
  );
};

export const getPreferredLanguage = async () => {
  const savedCode = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return getLanguageByCode(savedCode);
};

export const setPreferredLanguage = async (code) => {
  const language = getLanguageByCode(code);

  await AsyncStorage.setItem(
    LANGUAGE_STORAGE_KEY,
    language.code
  );

  return language;
};