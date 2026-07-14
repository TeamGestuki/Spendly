/**
 * CurrencySettingsScreen.js
 * Selección de la moneda principal de Spendly.
 */

import React, {
  useEffect,
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
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  CURRENCIES,
  getPreferredCurrency,
  setPreferredCurrency,
  formatMoney,
} from '../utils/currency';

import {
  updateCurrentUser,
} from '../services/authService';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useLanguage,
} from '../context/LanguageContext';

function AppIcon({
  name,
  size = 20,
  color,
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  );
}

function getCurrencyTranslationKey(code) {
  return `currency.currencies.${code.toLowerCase()}`;
}

function CurrencyItem({
  currency,
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
        styles.currencyItem,
        selected &&
          styles.currencyItemSelected,
        isLast &&
          styles.currencyItemLast,
      ]}
      onPress={onPress}
      activeOpacity={0.78}
      disabled={saving}
    >
      <View
        style={[
          styles.currencyIcon,
          selected &&
            styles.currencyIconSelected,
        ]}
      >
        <Text style={styles.currencySymbol}>
          {currency.symbol}
        </Text>
      </View>

      <View style={styles.currencyBody}>
        <View style={styles.currencyTitleRow}>
          <Text style={styles.currencyCode}>
            {currency.code}
          </Text>

          {selected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedBadgeText}>
                {currentText}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.currencyName}>
          {translatedName}
        </Text>
      </View>

      <View style={styles.previewBox}>
        <Text style={styles.previewText}>
          {formatMoney(1250, currency)}
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

export default function CurrencySettingsScreen({
  navigation,
}) {
  const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const {
    t,
  } = useLanguage();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );

  const [
    selectedCurrency,
    setSelectedCurrency,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingCode,
    setSavingCode,
  ] = useState(null);

  useEffect(() => {
    loadCurrency();
  }, []);

  const translateCurrencyName = (
    currency
  ) => {
    const key =
      getCurrencyTranslationKey(
        currency.code
      );

    const translated = t(key);

    return translated === key
      ? currency.name
      : translated;
  };

  const loadCurrency = async () => {
    try {
      setLoading(true);

      const currency =
        await getPreferredCurrency();

      setSelectedCurrency(currency);
    } catch (error) {
      console.log(
        'Error cargando moneda:',
        error.message
      );

      Alert.alert(
        t('common.error'),
        t('currency.loadError')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCurrency = async (
    currency
  ) => {
    if (
      savingCode ||
      selectedCurrency?.code ===
        currency.code
    ) {
      return;
    }

    try {
      setSavingCode(currency.code);

      const savedCurrency =
        await setPreferredCurrency(
          currency.code
        );

      await updateCurrentUser({
        preferred_currency:
          currency.code,
      });

      setSelectedCurrency(
        savedCurrency
      );
    } catch (error) {
      console.log(
        'Error guardando moneda:',
        error.message
      );

      Alert.alert(
        t('common.error'),
        t('currency.saveError')
      );
    } finally {
      setSavingCode(null);
    }
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

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
          disabled={!!savingCode}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={
              savingCode
                ? COLORS.textMuted
                : COLORS.textPrimary
            }
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          {t('currency.title')}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />

          <Text style={styles.loadingText}>
            {t('currency.loading')}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <AppIcon
                name="cash-outline"
                size={28}
                color={COLORS.accent}
              />
            </View>

            <Text style={styles.heroTitle}>
              {t('currency.chooseCurrency')}
            </Text>

            <Text style={styles.heroText}>
              {t('currency.description')}
            </Text>

            {selectedCurrency && (
              <View
                style={
                  styles.currentCurrencyBox
                }
              >
                <Text
                  style={
                    styles.currentCurrencyLabel
                  }
                >
                  {t(
                    'currency.currentCurrency'
                  )}
                </Text>

                <Text
                  style={
                    styles.currentCurrencyValue
                  }
                >
                  {selectedCurrency.code}
                  {' — '}
                  {translateCurrencyName(
                    selectedCurrency
                  )}
                </Text>

                <Text
                  style={
                    styles.currentCurrencyPreview
                  }
                >
                  {t('currency.example')}
                  {': '}
                  {formatMoney(
                    1250,
                    selectedCurrency
                  )}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            {t(
              'currency.availableCurrencies'
            )}
          </Text>

          <View style={styles.card}>
            {CURRENCIES.map(
              (currency, index) => {
                const selected =
                  selectedCurrency?.code ===
                  currency.code;

                const saving =
                  savingCode ===
                  currency.code;

                return (
                  <CurrencyItem
                    key={currency.code}
                    currency={currency}
                    translatedName={
                      translateCurrencyName(
                        currency
                      )
                    }
                    selected={selected}
                    saving={saving}
                    isLast={
                      index ===
                      CURRENCIES.length - 1
                    }
                    onPress={() =>
                      handleSelectCurrency(
                        currency
                      )
                    }
                    styles={styles}
                    COLORS={COLORS}
                    currentText={t(
                      'currency.current'
                    )}
                  />
                );
              }
            )}
          </View>

          {!!savingCode && (
            <View style={styles.savingBox}>
              <ActivityIndicator
                size="small"
                color={COLORS.accent}
              />

              <Text style={styles.savingText}>
                {t('currency.saving')}
                {' '}
                {savingCode}...
              </Text>
            </View>
          )}

          <Text style={styles.footerText}>
            Spendly © 2026
          </Text>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
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
      justifyContent:
        'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: COLORS.bg,
    },

    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        COLORS.surface,
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
      backgroundColor:
        COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}29`,
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

    currentCurrencyBox: {
      width: '100%',
      marginTop: 18,
      backgroundColor:
        COLORS.surfaceHigh,
      borderRadius: 18,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}33`,
      padding: 16,
      alignItems: 'center',
    },

    currentCurrencyLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },

    currentCurrencyValue: {
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 4,
      textAlign: 'center',
    },

    currentCurrencyPreview: {
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
      backgroundColor:
        COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 20,
      overflow: 'hidden',
    },

    currencyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor:
        COLORS.border,
      gap: 12,
    },

    currencyItemSelected: {
      backgroundColor:
        COLORS.accentDim,
    },

    currencyItemLast: {
      borderBottomWidth: 0,
    },

    currencyIcon: {
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

    currencyIconSelected: {
      backgroundColor:
        COLORS.surface,
      borderColor:
        `${COLORS.accent}40`,
    },

    currencySymbol: {
      fontSize: 15,
      fontWeight: '900',
      color: COLORS.accent,
    },

    currencyBody: {
      flex: 1,
    },

    currencyTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 2,
      flexWrap: 'wrap',
    },

    currencyCode: {
      fontSize: 14,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },

    currencyName: {
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
      borderColor:
        `${COLORS.accent}40`,
    },

    selectedBadgeText: {
      fontSize: 9,
      fontWeight: '800',
      color: COLORS.accent,
      textTransform: 'uppercase',
    },

    previewBox: {
      maxWidth: 105,
      alignItems: 'flex-end',
    },

    previewText: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.textSecondary,
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
      marginTop: 28,
      textAlign: 'center',
      fontSize: 12,
      color: COLORS.textMuted,
      fontWeight: '600',
    },

    bottomSpacer: {
      height: 40,
    },
  });
}
