import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useColorScheme,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  darkTheme,
  lightTheme,
} from '../theme/themes';

const THEME_STORAGE_KEY = 'theme_mode';

const VALID_THEME_MODES = [
  'light',
  'dark',
  'system',
];

const ThemeContext = createContext(null);

export function ThemeProvider({
  children,
}) {
  const systemColorScheme =
    useColorScheme();

  const [
    themeMode,
    setThemeMode,
  ] = useState('system');

  const [
    themeLoaded,
    setThemeLoaded,
  ] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme =
          await AsyncStorage.getItem(
            THEME_STORAGE_KEY
          );

        if (
          savedTheme &&
          VALID_THEME_MODES.includes(
            savedTheme
          )
        ) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.log(
          'Error cargando tema:',
          error.message
        );
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (mode) => {
    if (
      !VALID_THEME_MODES.includes(mode)
    ) {
      console.log(
        `Tema inválido: ${mode}`
      );

      return;
    }

    try {
      setThemeMode(mode);

      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        mode
      );
    } catch (error) {
      console.log(
        'Error guardando tema:',
        error.message
      );
    }
  };

  const isDark =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
      : themeMode === 'dark';

  const colors = isDark
    ? darkTheme
    : lightTheme;

  const contextValue = useMemo(
    () => ({
      themeMode,
      setTheme,
      colors,
      isDark,
      themeLoaded,
    }),
    [
      themeMode,
      colors,
      isDark,
      themeLoaded,
    ]
  );

  return (
    <ThemeContext.Provider
      value={contextValue}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme debe utilizarse dentro de ThemeProvider'
    );
  }

  return context;
}