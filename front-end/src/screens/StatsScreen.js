/**
 * StatsScreen.js
 * Estadísticas profesionales de Spendly.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getTransactions } from '../services/transactionService';
import { getCurrentUser } from '../services/authService';
import { getCurrencyByCode, formatMoney } from '../utils/currency';

const PERIODS = [
  'currentMonth',
  'previousMonth',
  'threeMonths',
  'sixMonths',
  'currentYear',
  'all',
];

const VIEWS = ['overview', 'expense', 'income'];

const LOCALES = {
  es: 'es-AR',
  en: 'en-US',
  pt: 'pt-BR',
  ru: 'ru-RU',
  zh: 'zh-CN',
  fr: 'fr-FR',
  de: 'de-DE',
};

const API_BASE_URL =
  'https://spendly-production-1793.up.railway.app';

function getInitials(fullName = '') {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return 'U';
}

function getAvatarUrl(url) {
  if (!url) {
    return null;
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `${API_BASE_URL}${
    url.startsWith('/')
      ? url
      : `/${url}`
  }`;
}

function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function getLocale(language) {
  return LOCALES[language] || LOCALES.es;
}

function getCategoryTranslationKey(category) {
  const keys = {
    Comida: 'food',
    Transporte: 'transport',
    Supermercado: 'supermarket',
    Servicios: 'services',
    Salud: 'health',
    Educación: 'education',
    Entretenimiento: 'entertainment',
    Ropa: 'clothing',
    Tecnología: 'technology',
    Salario: 'salary',
    Freelance: 'freelance',
    Inversiones: 'investments',
    Ventas: 'sales',
    Regalos: 'gifts',
    Reembolsos: 'refunds',
    Otros: 'other',
  };

  return keys[category] || 'other';
}

function getCategoryIcons(COLORS) {
  return {
    Comida: { icon: 'bag-handle-outline', color: COLORS.accent },
    Transporte: { icon: 'car-outline', color: COLORS.blue },
    Supermercado: { icon: 'cart-outline', color: COLORS.orange },
    Servicios: { icon: 'flash-outline', color: COLORS.purple },
    Salud: { icon: 'heart-outline', color: COLORS.pink },
    Educación: { icon: 'book-outline', color: COLORS.blue },
    Entretenimiento: { icon: 'play-circle-outline', color: COLORS.orange },
    Ropa: { icon: 'shirt-outline', color: COLORS.pink },
    Tecnología: { icon: 'hardware-chip-outline', color: COLORS.blue },
    Salario: { icon: 'briefcase-outline', color: COLORS.accent },
    Freelance: { icon: 'laptop-outline', color: COLORS.blue },
    Inversiones: { icon: 'trending-up-outline', color: COLORS.purple },
    Ventas: { icon: 'storefront-outline', color: COLORS.orange },
    Regalos: { icon: 'gift-outline', color: COLORS.pink },
    Reembolsos: { icon: 'return-down-back-outline', color: COLORS.yellow },
    Otros: { icon: 'grid-outline', color: COLORS.textMuted },
  };
}

function getCategoryMeta(category, COLORS) {
  const icons = getCategoryIcons(COLORS);
  return icons[category] || icons.Otros;
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function shiftMonths(date, amount) {
  const value = new Date(date);
  value.setMonth(value.getMonth() + amount);
  return value;
}

function getPeriodRange(period, now = new Date()) {
  if (period === 'previousMonth') {
    const previous = shiftMonths(now, -1);
    return { start: startOfMonth(previous), end: endOfMonth(previous) };
  }

  if (period === 'threeMonths') {
    return { start: startOfMonth(shiftMonths(now, -2)), end: endOfDay(now) };
  }

  if (period === 'sixMonths') {
    return { start: startOfMonth(shiftMonths(now, -5)), end: endOfDay(now) };
  }

  if (period === 'currentYear') {
    return { start: new Date(now.getFullYear(), 0, 1), end: endOfDay(now) };
  }

  if (period === 'all') {
    return { start: null, end: null };
  }

  return { start: startOfMonth(now), end: endOfDay(now) };
}

function getPreviousRange(period) {
  const current = getPeriodRange(period);
  if (!current.start || !current.end) return { start: null, end: null };

  const duration = current.end.getTime() - current.start.getTime();
  const end = endOfDay(new Date(current.start.getTime() - 1));
  const start = startOfDay(new Date(end.getTime() - duration));
  return { start, end };
}

function inRange(value, range) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  if (!range.start || !range.end) return true;
  return date >= range.start && date <= range.end;
}

function sum(items) {
  return items.reduce((total, item) => total + Number(item.amount || 0), 0);
}

function variation(current, previous) {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function periodLabel(period, language, t) {
  const now = new Date();
  const locale = getLocale(language);

  if (period === 'currentMonth') {
    return now.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }

  if (period === 'previousMonth') {
    return shiftMonths(now, -1).toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    });
  }

  return t(`stats.periods.${period}`);
}

function shortDate(value, language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(getLocale(language), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function MetricCard({ icon, color, label, value, sub, styles }) {
  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}18` }]}>
        <AppIcon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {!!sub && <Text style={styles.metricSub}>{sub}</Text>}
    </View>
  );
}

function EmptyState({ icon, title, text, action, onPress, styles, COLORS }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <AppIcon name={icon} size={32} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
      {!!action && (
        <TouchableOpacity style={styles.emptyButton} onPress={onPress}>
          <Text style={styles.emptyButtonText}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function StatsScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { language, t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const [user, setUser] = useState({
  full_name: 'Usuario',
  email: '',
  profile_image_url: null,
  preferred_currency: 'ARS',
  });

  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState(getCurrencyByCode('ARS'));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('currentMonth');
  const [selectedView, setSelectedView] = useState('overview');
  const [searchText, setSearchText] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();

      setAvatarError(false);
      setUser(userData);

      setCurrency(
        getCurrencyByCode(
          userData.preferred_currency ||
            'ARS'
        )
      );

      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log('Error cargando estadísticas:', error.message);
      Alert.alert(t('common.error'), t('stats.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadStats();
    } finally {
      setRefreshing(false);
    }
  };

  const currentRange = useMemo(
    () => getPeriodRange(selectedPeriod),
    [selectedPeriod]
  );

  const previousRange = useMemo(
    () => getPreviousRange(selectedPeriod),
    [selectedPeriod]
  );

  const current = transactions.filter((item) => inRange(item.date, currentRange));
  const previous = previousRange.start
    ? transactions.filter((item) => inRange(item.date, previousRange))
    : [];

  const expenses = current.filter((item) => item.type === 'expense');
  const incomes = current.filter((item) => item.type === 'income');
  const previousExpenses = previous.filter((item) => item.type === 'expense');
  const previousIncomes = previous.filter((item) => item.type === 'income');

  const totalExpenses = sum(expenses);
  const totalIncome = sum(incomes);
  const balance = totalIncome - totalExpenses;
  const previousExpenseTotal = sum(previousExpenses);
  const previousIncomeTotal = sum(previousIncomes);
  const previousBalance = previousIncomeTotal - previousExpenseTotal;

  const expenseChange = variation(totalExpenses, previousExpenseTotal);
  const incomeChange = variation(totalIncome, previousIncomeTotal);
  const balanceChange = variation(balance, previousBalance);
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  const averageExpense = expenses.length ? totalExpenses / expenses.length : 0;
  const averageIncome = incomes.length ? totalIncome / incomes.length : 0;
  const highestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
  const highestIncome = [...incomes].sort((a, b) => b.amount - a.amount)[0];

  const selectedTransactions =
    selectedView === 'expense'
      ? expenses
      : selectedView === 'income'
        ? incomes
        : current;

  const categorySource = selectedView === 'income' ? incomes : expenses;
  const categoryTotal = sum(categorySource);
  const categoryMap = categorySource.reduce((acc, item) => {
    const category = item.category || 'Otros';
    acc[category] = (acc[category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const categories = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: categoryTotal > 0 ? (amount / categoryTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categories[0];

  const evolution = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const month = shiftMonths(now, index - 5);
      const items = transactions.filter((item) => {
        const date = new Date(item.date);
        return (
          date.getMonth() === month.getMonth() &&
          date.getFullYear() === month.getFullYear()
        );
      });

      return {
        key: `${month.getFullYear()}-${month.getMonth()}`,
        label: month.toLocaleDateString(getLocale(language), { month: 'short' }),
        income: sum(items.filter((item) => item.type === 'income')),
        expenses: sum(items.filter((item) => item.type === 'expense')),
      };
    });
  }, [transactions, language]);

  const maxEvolution = Math.max(
    ...evolution.flatMap((item) => [item.income, item.expenses]),
    1
  );

  const normalizedSearch = searchText.trim().toLowerCase();
  const recent = [...selectedTransactions]
    .filter((item) => {
      if (!normalizedSearch) return true;
      const rawCategory = item.category || 'Otros';
      const translated = t(
        `categories.${getCategoryTranslationKey(rawCategory)}`
      ).toLowerCase();

      return (
        (item.description || '').toLowerCase().includes(normalizedSearch) ||
        rawCategory.toLowerCase().includes(normalizedSearch) ||
        translated.includes(normalizedSearch) ||
        String(item.amount || '').includes(normalizedSearch)
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const heroValue =
    selectedView === 'expense'
      ? totalExpenses
      : selectedView === 'income'
        ? totalIncome
        : balance;

  const heroLabel =
    selectedView === 'expense'
      ? t('stats.hero.totalExpenses')
      : selectedView === 'income'
        ? t('stats.hero.totalIncome')
        : t('stats.hero.balance');

  const comparison =
    selectedView === 'expense'
      ? expenseChange
      : selectedView === 'income'
        ? incomeChange
        : balanceChange;

  const positiveComparison =
    selectedView === 'expense' ? (comparison ?? 0) <= 0 : (comparison ?? 0) >= 0;

  const metrics = [
    {
      icon: 'trending-up-outline',
      color: COLORS.accent,
      label: t('stats.metrics.income'),
      value: formatMoney(totalIncome, currency),
      sub:
        incomeChange === null
          ? t('stats.noPreviousComparison')
          : t('stats.comparisonValue').replace(
              '{value}',
              `${incomeChange >= 0 ? '+' : ''}${incomeChange.toFixed(1)}%`
            ),
    },
    {
      icon: 'trending-down-outline',
      color: COLORS.red,
      label: t('stats.metrics.expenses'),
      value: formatMoney(totalExpenses, currency),
      sub:
        expenseChange === null
          ? t('stats.noPreviousComparison')
          : t('stats.comparisonValue').replace(
              '{value}',
              `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}%`
            ),
    },
    {
      icon: 'wallet-outline',
      color: balance >= 0 ? COLORS.blue : COLORS.red,
      label: t('stats.metrics.balance'),
      value: formatMoney(balance, currency),
      sub: t('stats.metrics.savingsRate').replace(
        '{value}',
        `${savingsRate.toFixed(1)}%`
      ),
    },
    {
      icon: 'receipt-outline',
      color: COLORS.orange,
      label: t('stats.metrics.records'),
      value: String(current.length),
      sub: t('stats.metrics.recordsBreakdown')
        .replace('{expenses}', expenses.length)
        .replace('{income}', incomes.length),
    },
  ];

  const avatarUrl = getAvatarUrl(user.profile_image_url);

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{t('stats.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {periodLabel(selectedPeriod, language, t)}
            </Text>
          </View>

          <TouchableOpacity
              style={styles.avatarRing}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
          >
              {avatarUrl && !avatarError ? (
                  <Image
                      source={{
                          uri: avatarUrl,
                      }}
                      style={styles.avatarImage}
                      onError={() => setAvatarError(true)}
                  />
              ) : (
                  <View style={styles.avatarFallback}>
                      <Text style={styles.avatarText}>
                          {getInitials(user.full_name)}
                      </Text>
                  </View>
              )}
          </TouchableOpacity>
        </View>

        <Text style={styles.filterLabel}>{t('stats.periodLabel')}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {PERIODS.map((period) => {
            const active = period === selectedPeriod;
            return (
              <TouchableOpacity
                key={period}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {t(`stats.periods.${period}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.viewSelector}>
          {VIEWS.map((view) => {
            const active = selectedView === view;
            return (
              <TouchableOpacity
                key={view}
                style={[styles.viewButton, active && styles.viewButtonActive]}
                onPress={() => setSelectedView(view)}
              >
                <Text
                  style={[styles.viewButtonText, active && styles.viewButtonTextActive]}
                >
                  {t(`stats.views.${view}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>{t('stats.loading')}</Text>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>{heroLabel}</Text>
              <Text style={styles.heroAmount}>{formatMoney(heroValue, currency)}</Text>

              <View
                style={[
                  styles.trendBadge,
                  {
                    backgroundColor: positiveComparison
                      ? `${COLORS.accent}14`
                      : `${COLORS.red}14`,
                    borderColor: positiveComparison
                      ? `${COLORS.accent}40`
                      : `${COLORS.red}40`,
                  },
                ]}
              >
                <AppIcon
                  name={positiveComparison ? 'trending-up-outline' : 'trending-down-outline'}
                  size={16}
                  color={positiveComparison ? COLORS.accent : COLORS.red}
                />
                <Text
                  style={[
                    styles.trendText,
                    { color: positiveComparison ? COLORS.accent : COLORS.red },
                  ]}
                >
                  {comparison === null
                    ? t('stats.noPreviousComparison')
                    : t('stats.comparisonValue').replace(
                        '{value}',
                        `${comparison >= 0 ? '+' : ''}${comparison.toFixed(1)}%`
                      )}
                </Text>
              </View>
            </View>

            <View style={styles.grid}>
              {metrics.map((item) => (
                <MetricCard key={item.label} {...item} styles={styles} />
              ))}
            </View>

            <Text style={styles.sectionTitle}>{t('stats.monthlyEvolution')}</Text>

            <View style={styles.chartCard}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
                  <Text style={styles.legendText}>{t('stats.metrics.income')}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.red }]} />
                  <Text style={styles.legendText}>{t('stats.metrics.expenses')}</Text>
                </View>
              </View>

              <View style={styles.chartRow}>
                {evolution.map((item) => (
                  <View key={item.key} style={styles.chartColumn}>
                    <View style={styles.barsArea}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${Math.max(
                              (item.income / maxEvolution) * 100,
                              item.income > 0 ? 5 : 0
                            )}%`,
                            backgroundColor: COLORS.accent,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${Math.max(
                              (item.expenses / maxEvolution) * 100,
                              item.expenses > 0 ? 5 : 0
                            )}%`,
                            backgroundColor: COLORS.red,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.grid}>
              <MetricCard
                styles={styles}
                icon="calculator-outline"
                color={COLORS.blue}
                label={t('stats.insights.averageExpense')}
                value={formatMoney(averageExpense, currency)}
                sub={t('stats.insights.perExpense')}
              />
              <MetricCard
                styles={styles}
                icon="cash-outline"
                color={COLORS.accent}
                label={t('stats.insights.averageIncome')}
                value={formatMoney(averageIncome, currency)}
                sub={t('stats.insights.perIncome')}
              />
              <MetricCard
                styles={styles}
                icon="arrow-up-circle-outline"
                color={COLORS.red}
                label={t('stats.insights.highestExpense')}
                value={highestExpense ? formatMoney(highestExpense.amount, currency) : '—'}
                sub={
                  highestExpense
                    ? highestExpense.description || t('stats.noDescription')
                    : t('stats.noData')
                }
              />
              <MetricCard
                styles={styles}
                icon="arrow-down-circle-outline"
                color={COLORS.accent}
                label={t('stats.insights.highestIncome')}
                value={highestIncome ? formatMoney(highestIncome.amount, currency) : '—'}
                sub={
                  highestIncome
                    ? highestIncome.description || t('stats.noDescription')
                    : t('stats.noData')
                }
              />
            </View>

            <Text style={styles.sectionTitle}>
              {selectedView === 'income'
                ? t('stats.incomeByCategory')
                : t('stats.expenseByCategory')}
            </Text>

            {categories.length === 0 ? (
              <EmptyState
                styles={styles}
                COLORS={COLORS}
                icon="pie-chart-outline"
                title={t('stats.emptyCategoriesTitle')}
                text={t('stats.emptyCategoriesText')}
                action={
                  selectedView === 'income'
                    ? t('stats.addIncome')
                    : t('stats.addExpense')
                }
                onPress={() =>
                  navigation.navigate(selectedView === 'income' ? 'AddIncome' : 'AddExpense')
                }
              />
            ) : (
              <View style={styles.card}>
                {categories.map((item, index) => {
                  const meta = getCategoryMeta(item.category, COLORS);
                  return (
                    <View
                      key={item.category}
                      style={[
                        styles.categoryRow,
                        index === categories.length - 1 && styles.lastRow,
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: `${meta.color}18` },
                        ]}
                      >
                        <AppIcon name={meta.icon} size={18} color={meta.color} />
                      </View>

                      <View style={styles.categoryBody}>
                        <View style={styles.categoryTop}>
                          <Text style={styles.categoryName}>
                            {t(
                              `categories.${getCategoryTranslationKey(item.category)}`
                            )}
                          </Text>
                          <Text style={styles.categoryAmount}>
                            {formatMoney(item.amount, currency)}
                          </Text>
                        </View>

                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(item.percentage, 100)}%`,
                                backgroundColor: meta.color,
                              },
                            ]}
                          />
                        </View>

                        <Text style={styles.categoryPercent}>
                          {t('stats.percentageOfTotal').replace(
                            '{value}',
                            item.percentage.toFixed(1)
                          )}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {!!topCategory && (
              <View style={styles.topCategoryCard}>
                <View
                  style={[
                    styles.topCategoryIcon,
                    {
                      backgroundColor: `${getCategoryMeta(
                        topCategory.category,
                        COLORS
                      ).color}18`,
                    },
                  ]}
                >
                  <AppIcon
                    name={getCategoryMeta(topCategory.category, COLORS).icon}
                    size={22}
                    color={getCategoryMeta(topCategory.category, COLORS).color}
                  />
                </View>
                <View style={styles.topCategoryBody}>
                  <Text style={styles.topCategoryLabel}>{t('stats.topCategory')}</Text>
                  <Text style={styles.topCategoryValue}>
                    {t(
                      `categories.${getCategoryTranslationKey(topCategory.category)}`
                    )}
                  </Text>
                </View>
                <Text style={styles.topCategoryAmount}>
                  {formatMoney(topCategory.amount, currency)}
                </Text>
              </View>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitleNoMargin}>
                {t('stats.recentTransactions')}
              </Text>
              <Text style={styles.sectionCount}>{recent.length}</Text>
            </View>

            <View style={styles.searchBox}>
              <AppIcon name="search-outline" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                placeholder={t('stats.searchPlaceholder')}
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
              />
              {!!searchText && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <AppIcon name="close-circle" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {recent.length === 0 ? (
              <EmptyState
                styles={styles}
                COLORS={COLORS}
                icon="search-outline"
                title={t('stats.emptyTransactionsTitle')}
                text={
                  searchText
                    ? t('stats.noSearchResults')
                    : t('stats.emptyTransactionsText')
                }
                action={searchText ? t('stats.clearSearch') : undefined}
                onPress={() => setSearchText('')}
              />
            ) : (
              <View style={styles.card}>
                {recent.map((item, index) => {
                  const meta = getCategoryMeta(item.category || 'Otros', COLORS);
                  const income = item.type === 'income';

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.transactionRow,
                        index === recent.length - 1 && styles.lastRow,
                      ]}
                    >
                      <View
                        style={[
                          styles.transactionIcon,
                          { backgroundColor: `${meta.color}18` },
                        ]}
                      >
                        <AppIcon name={meta.icon} size={18} color={meta.color} />
                      </View>

                      <View style={styles.transactionBody}>
                        <Text style={styles.transactionTitle} numberOfLines={1}>
                          {item.description || t('stats.noDescription')}
                        </Text>
                        <Text style={styles.transactionSubtitle}>
                          {t(
                            `categories.${getCategoryTranslationKey(
                              item.category || 'Otros'
                            )}`
                          )}
                          {' · '}
                          {shortDate(item.date, language)}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.transactionAmount,
                          { color: income ? COLORS.accent : COLORS.red },
                        ]}
                      >
                        {income ? '+' : '-'}
                        {formatMoney(item.amount, currency)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <Text style={styles.footerText}>Spendly © 2026</Text>
            <View style={styles.bottomSpacer} />
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="home-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>{t('navigation.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Expenses')}
        >
          <AppIcon name="swap-horizontal-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>{t('navigation.transactions')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navScanWrapper}
          onPress={() => navigation.navigate('Scan')}
        >
          <View style={styles.navScanButton}>
            <AppIcon
              name="scan-outline"
              size={26}
              color={COLORS.buttonText || COLORS.bg}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <AppIcon name="bar-chart" size={24} color={COLORS.accent} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>
            {t('navigation.stats')}
          </Text>
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
    scrollContent: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 30 },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
    headerSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: COLORS.textSecondary,
      textTransform: 'capitalize',
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginBottom: 9,
    },
    chipsRow: { gap: 8, paddingRight: 10, marginBottom: 16 },
    chip: {
      height: 38,
      borderRadius: 999,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipActive: { backgroundColor: COLORS.accentDim, borderColor: `${COLORS.accent}55` },
    chipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
    chipTextActive: { color: COLORS.accent },
    viewSelector: {
      flexDirection: 'row',
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 4,
      marginBottom: 18,
    },
    viewButton: { flex: 1, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    viewButtonActive: { backgroundColor: COLORS.surfaceHigh, borderWidth: 1, borderColor: `${COLORS.accent}45` },
    viewButtonText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
    viewButtonTextActive: { color: COLORS.accent },
    loadingBox: { alignItems: 'center', paddingVertical: 90 },
    loadingText: { marginTop: 12, color: COLORS.textSecondary },
    heroCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: `${COLORS.accent}35`,
      padding: 24,
      marginBottom: 16,
    },
    heroLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 7 },
    heroAmount: { fontSize: 36, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 16 },
    trendBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderWidth: 1,
    },
    trendText: { fontSize: 12, fontWeight: '700' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    metricCard: {
      width: '48%',
      minHeight: 145,
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
    },
    metricIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    metricLabel: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 5 },
    metricValue: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary },
    metricSub: { marginTop: 4, fontSize: 11, lineHeight: 16, color: COLORS.textMuted },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
    sectionTitleNoMargin: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
    chartCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginBottom: 24,
    },
    legendRow: { flexDirection: 'row', gap: 18, marginBottom: 18 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 11, color: COLORS.textSecondary },
    chartRow: { height: 150, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
    chartColumn: { flex: 1, height: '100%', alignItems: 'center' },
    barsArea: { flex: 1, width: '100%', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 3 },
    chartBar: { width: '34%', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
    chartLabel: { marginTop: 8, fontSize: 10, color: COLORS.textMuted, textTransform: 'capitalize' },
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 18,
      overflow: 'hidden',
    },
    categoryRow: { flexDirection: 'row', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    lastRow: { borderBottomWidth: 0 },
    categoryIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    categoryBody: { flex: 1 },
    categoryTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 8 },
    categoryName: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
    categoryAmount: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
    progressTrack: { height: 7, borderRadius: 999, backgroundColor: COLORS.surfaceHigh, overflow: 'hidden', marginBottom: 6 },
    progressFill: { height: '100%', borderRadius: 999 },
    categoryPercent: { fontSize: 11, color: COLORS.textMuted },
    topCategoryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: `${COLORS.accent}35`,
      padding: 15,
      marginBottom: 24,
    },
    topCategoryIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    topCategoryBody: { flex: 1 },
    topCategoryLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 3 },
    topCategoryValue: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
    topCategoryAmount: { fontSize: 13, fontWeight: '800', color: COLORS.accent },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionCount: { fontSize: 12, color: COLORS.textMuted },
    searchBox: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: COLORS.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      marginBottom: 14,
    },
    searchInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
    transactionRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    transactionIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    transactionBody: { flex: 1, paddingRight: 10 },
    transactionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
    transactionSubtitle: { fontSize: 11, color: COLORS.textSecondary },
    transactionAmount: { fontSize: 13, fontWeight: '800' },
    emptyCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 26,
      alignItems: 'center',
      marginBottom: 20,
    },
    emptyIcon: { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.surfaceHigh, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    emptyTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6, textAlign: 'center' },
    emptyText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, textAlign: 'center' },
    emptyButton: { marginTop: 16, backgroundColor: COLORS.accent, borderRadius: 14, paddingHorizontal: 17, paddingVertical: 11 },
    emptyButtonText: { fontSize: 13, fontWeight: '800', color: COLORS.buttonText || COLORS.bg },
    footerText: { marginTop: 26, fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },
    bottomSpacer: { height: 90 },
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
    navLabelActive: { color: COLORS.accent },
    navScanWrapper: { flex: 1, alignItems: 'center', marginBottom: 8 },
    navScanButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -28,
      shadowColor: COLORS.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },

    avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(74,222,128,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImage: { width: 38, height: 38, borderRadius: 19 },
  avatarText: { fontSize: 13, fontWeight: '700', color: COLORS.accent },

  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },


  });
}
