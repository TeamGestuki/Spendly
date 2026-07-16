import AsyncStorage from '@react-native-async-storage/async-storage';

export const LANGUAGE_STORAGE_KEY = 'preferred_language';

export async function getInitialAppRoute() {
  const [language, token] = await Promise.all([
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
    AsyncStorage.getItem('access_token'),
  ]);

  if (!language) return 'LanguageSelection';
  if (token) return 'Home';
  return 'Login';
}

export async function hasSelectedLanguage() {
  const language = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return Boolean(language);
}

export async function getStoredLanguage() {
  return AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
}
