/**
 * TransactionListScreen.js
 * Pantalla reutilizable para listar gastos o ingresos.
 *
 * Soporta:
 * - type="expense"
 * - type="income"
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
  Alert,
  RefreshControl,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import {
  getTransactions,
  deleteTransaction,
} from '../services/transactionService';

import { getCurrentUser } from '../services/authService';

import {
  getCurrencyByCode,
  formatMoney,
} from '../utils/currency';

function getExpenseCategoryIcons(COLORS) {
  return {
    Comida: {
      icon: 'bag-handle-outline',
      color: COLORS.accent,
    },
    Transporte: {
      icon: 'car-outline',
      color: COLORS.blue,
    },
    Supermercado: {
      icon: 'cart-outline',
      color: COLORS.orange,
    },
    Servicios: {
      icon: 'flash-outline',
      color: COLORS.purple,
    },
    Salud: {
      icon: 'heart-outline',
      color: COLORS.pink,
    },
    Educación: {
      icon: 'book-outline',
      color: COLORS.blue,
    },
    Entretenimiento: {
      icon: 'play-circle-outline',
      color: COLORS.orange,
    },
    Ropa: {
      icon: 'shirt-outline',
      color: COLORS.pink,
    },
    Tecnología: {
      icon: 'hardware-chip-outline',
      color: COLORS.blue,
    },
    Otros: {
      icon: 'grid-outline',
      color: COLORS.textMuted,
    },
  };
}

function getIncomeCategoryIcons(COLORS) {
  return {
    Salario: {
      icon: 'briefcase-outline',
      color: COLORS.accent,
    },
    Freelance: {
      icon: 'laptop-outline',
      color: COLORS.blue,
    },
    Inversiones: {
      icon: 'trending-up-outline',
      color: COLORS.purple,
    },
    Ventas: {
      icon: 'storefront-outline',
      color: COLORS.orange,
    },
    Regalos: {
      icon: 'gift-outline',
      color: COLORS.pink,
    },
    Reembolsos: {
      icon: 'return-down-back-outline',
      color: COLORS.yellow,
    },
    Otros: {
      icon: 'grid-outline',
      color: COLORS.textMuted,
    },
  };
}

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

function getDateLocale(language) {
  const locales = {
    es: 'es-AR',
    en: 'en-US',
    pt: 'pt-BR',
    ru: 'ru-RU',
    zh: 'zh-CN',
    fr: 'fr-FR',
    de: 'de-DE',
  };

  return locales[language] || locales.es;
}

function formatDate(
  dateString,
  language,
  t
) {
  const date = new Date(dateString);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return t('transactionList.unknownDate');
  }

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const time = date.toLocaleTimeString(
    getDateLocale(language),
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  if (isToday) {
    return `${t('transactionList.today')}, ${time}`;
  }

  if (isYesterday) {
    return `${t('transactionList.yesterday')}, ${time}`;
  }

  return `${date.toLocaleDateString(
    getDateLocale(language),
    {
      day: '2-digit',
      month: 'short',
    }
  )}, ${time}`;
}

function getScreenConfig(
  type,
  COLORS,
  t
) {
  if (type === 'income') {
    return {
      title: t('transactionList.income.title'),
      subtitle: t('transactionList.income.subtitle'),
      summaryLabel: t('transactionList.income.summaryLabel'),
      singular: t('transactionList.income.singular'),
      plural: t('transactionList.income.plural'),
      emptyTitle: t('transactionList.income.emptyTitle'),
      emptyDescription: t('transactionList.income.emptyDescription'),
      emptyButton: t('transactionList.income.emptyButton'),
      defaultDescription: t('transactionList.income.defaultDescription'),
      amountColor: COLORS.accent,
      amountPrefix: '+',
      mainIcon: 'cash-outline',
      categories: getIncomeCategoryIcons(COLORS),
    };
  }

  return {
    title: t('transactionList.expense.title'),
    subtitle: t('transactionList.expense.subtitle'),
    summaryLabel: t('transactionList.expense.summaryLabel'),
    singular: t('transactionList.expense.singular'),
    plural: t('transactionList.expense.plural'),
    emptyTitle: t('transactionList.expense.emptyTitle'),
    emptyDescription: t('transactionList.expense.emptyDescription'),
    emptyButton: t('transactionList.expense.emptyButton'),
    defaultDescription: t('transactionList.expense.defaultDescription'),
    amountColor: COLORS.red,
    amountPrefix: '-',
    mainIcon: 'receipt-outline',
    categories: getExpenseCategoryIcons(COLORS),
  };
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

function EmptyState({
  config,
  onAdd,
  styles,
  COLORS,
  t,
}) {
  return (
    <View style={styles.emptyWrapper}>
      <View style={styles.emptyIconWrapper}>
        <AppIcon
          name={config.mainIcon}
          size={40}
          color={COLORS.textMuted}
        />
      </View>

      <Text style={styles.emptyTitle}>
        {config.emptyTitle}
      </Text>

      <Text style={styles.emptyDescription}>
        {config.emptyDescription}
        {'\n'}
        {t('transactionList.startAdding')}
      </Text>

      <TouchableOpacity
        style={styles.emptyButton}
        onPress={onAdd}
        activeOpacity={0.85}
      >
        <AppIcon
          name="add"
          size={18}
          color={COLORS.textPrimary}
        />

        <Text style={styles.emptyButtonText}>
          {config.emptyButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TransactionListScreen({
  navigation,
  route,
  type: typeProp,
}) {

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

  const transactionType =
    route?.params?.type ||
    typeProp ||
    'expense';

 const config = useMemo(
  () =>
    getScreenConfig(
      transactionType,
      COLORS,
      t
    ),
  [transactionType, COLORS, t]
);

  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState(
    getCurrencyByCode('ARS')
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const userData = await getCurrentUser();

      const userCurrency = getCurrencyByCode(
        userData.preferred_currency || 'ARS'
      );

      setCurrency(userCurrency);

      const data = await getTransactions(
        transactionType
      );

      setTransactions(
        Array.isArray(data)
          ? data.filter(
              (transaction) =>
                transaction.type === transactionType
            )
          : []
      );
    } catch (error) {
      console.log(
        'Error cargando transacciones:',
        error.message
      );

      Alert.alert(
        t('common.error'),
        t('transactionList.loadError').replace('{items}', config.plural)
      );
    } finally {
      setLoading(false);
    }
  }, [
    transactionType,
    config.plural,
  ]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadTransactions();
      }finally {
      setRefreshing(false);
    }
  };

 const goToAddTransaction = () => {
  navigation.navigate(
    transactionType === 'income'
      ? 'AddIncome'
      : 'AddExpense'
  );
};

  const confirmDelete = (transaction) => {
    Alert.alert(
      t('transactionList.deleteTitle').replace('{item}', config.singular),
      t('transactionList.deleteConfirm').replace(
        '{description}',
        transaction.description ||
          config.defaultDescription
      ),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () =>
            handleDelete(transaction.id),
        },
      ]
    );
  };

  const handleDelete = async (id) => {
    if (deletingId) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteTransaction(id);

      setTransactions((current) =>
        current.filter(
          (transaction) =>
            transaction.id !== id
        )
      );
    } catch (error) {
      console.log(
        'Error eliminando transacción:',
        error.message
      );

      Alert.alert(
        t('common.error'),
        t('transactionList.deleteError').replace('{item}', config.singular)
      );
    } finally {
      setDeletingId(null);
    }
  };

const filteredTransactions = transactions.filter(
  (transaction) => {
    const search =
      searchText.toLowerCase().trim();

    if (!search) {
      return true;
    }

    const description = (
      transaction.description || ''
    ).toLowerCase();

    const rawCategory =
      transaction.category || 'Otros';

    const category =
      rawCategory.toLowerCase();

    const translatedCategory = t(
      `categories.${getCategoryTranslationKey(
        rawCategory
      )}`
    ).toLowerCase();

    const amount = String(
      transaction.amount || ''
    );

    return (
      description.includes(search) ||
      category.includes(search) ||
      translatedCategory.includes(search) ||
      amount.includes(search)
    );
  }
);

const sortedTransactions = [...filteredTransactions].sort(
  (first, second) => {
    switch (sortBy) {
      case 'oldest':
        return (
          new Date(first.date) -
          new Date(second.date)
        );

      case 'highest':
        return second.amount - first.amount;

      case 'lowest':
        return first.amount - second.amount;

      default:
        return (
          new Date(second.date) -
          new Date(first.date)
        );
    }
  }
);

const totalAmount = filteredTransactions.reduce(
  (sum, transaction) =>
    sum + Number(transaction.amount || 0),
  0
);

const transactionCount =
  filteredTransactions.length;

const categoryTotals =
  filteredTransactions.reduce(
      (accumulator, transaction) => {
        const category =
          transaction.category || 'Otros';

        accumulator[category] =
          (accumulator[category] || 0) +
          Number(transaction.amount || 0);

        return accumulator;
      },
      {}
    );

  const topCategory =
    Object.entries(categoryTotals)
      .sort(
        (first, second) =>
          second[1] - first[1]
      )[0]?.[0] || '—';

  const getCategoryMeta = (
    category
  ) => {
    return (
      config.categories[category] ||
      config.categories.Otros
    );
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
        contentContainerStyle={
          styles.scrollContent
        }
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
            <Text style={styles.headerTitle}>
              {config.title}
            </Text>

            <Text style={styles.headerSubtitle}>
              {config.subtitle}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              navigation.replace(
                transactionType === 'expense'
                  ? 'Income'
                  : 'Expenses'
              )
            }
            activeOpacity={0.8}
          >
            <AppIcon
              name="swap-horizontal-outline"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <AppIcon
            name="search-outline"
            size={18}
            color={COLORS.textMuted}
          />

          <TextInput
            style={styles.searchInput}
            placeholder={t('transactionList.searchPlaceholder').replace('{items}', config.plural)}
            placeholderTextColor={COLORS.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            returnKeyType="search"
          />

          {!!searchText && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              activeOpacity={0.8}
            >
              <AppIcon
                name="close-circle"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            Alert.alert(
              t('transactionList.sortTitle'),
              '',
              [
                {
                  text: t('transactionList.sort.recent'),
                  onPress: () => setSortBy('recent'),
                },
                {
                  text: t('transactionList.sort.oldest'),
                  onPress: () => setSortBy('oldest'),
                },
                {
                  text: t('transactionList.sort.highest'),
                  onPress: () => setSortBy('highest'),
                },
                {
                  text: t('transactionList.sort.lowest'),
                  onPress: () => setSortBy('lowest'),
                },
                {
                  text: t('common.cancel'),
                  style: 'cancel',
                },
              ]
            );
          }}
        >
          <Text style={styles.sortButtonText}>
            {t(`transactionList.sort.${sortBy}`)}
          </Text>

          <AppIcon
            name="chevron-down"
            size={16}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {!!searchText && (
          <TouchableOpacity
            style={styles.clearFiltersRow}
            onPress={() => setSearchText('')}
            activeOpacity={0.8}
          >
            <AppIcon
              name="close-circle-outline"
              size={16}
              color={COLORS.accent}
            />

            <Text style={styles.clearFiltersRowText}>
              {t('transactionList.clearSearch')}
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.summaryCard,
            {
              borderColor:
                transactionType === 'income'
                  ? `${COLORS.accent}40`
                  : `${COLORS.red}38`,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>
            {config.summaryLabel}
          </Text>

          <Text
            style={[
              styles.summaryAmount,
              {
                color: COLORS.textPrimary,
              },
            ]}
          >
            {formatMoney(
              totalAmount,
              currency
            )}
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIconWrapper,
                  {
                    backgroundColor:
                      transactionType ===
                      'income'
                        ? `${COLORS.accent}1F`
                        : `${COLORS.red}1F`,
                  },
                ]}
              >
                <AppIcon
                  name={config.mainIcon}
                  size={16}
                  color={
                    transactionType ===
                    'income'
                      ? COLORS.accent
                      : COLORS.red
                  }
                />
              </View>

              <View>
                <Text
                  style={
                    styles.summaryItemValue
                  }
                >
                  {transactionCount}
                </Text>

                <Text
                  style={
                    styles.summaryItemLabel
                  }
                >
                  {t('transactionList.records')}
                </Text>
              </View>
            </View>

            <View
              style={styles.summaryDivider}
            />

            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIconWrapper,
                  {
                    backgroundColor:
                      `${COLORS.blue}1F`,
                  },
                ]}
              >
                <AppIcon
                  name={
                    getCategoryMeta(
                      topCategory
                    ).icon
                  }
                  size={16}
                  color={
                    getCategoryMeta(
                      topCategory
                    ).color
                  }
                />
              </View>

              <View style={styles.summaryCategoryBody}>
                <Text
                  style={styles.summaryItemValue}
                  numberOfLines={1}
                >
                  {topCategory === '—'
                    ? topCategory
                    : t(
                        `categories.${getCategoryTranslationKey(
                          topCategory
                        )}`
                      )}
                </Text>

                <Text
                  style={styles.summaryItemLabel}
                >
                  {t('transactionList.mainCategory')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t('navigation.transactions')}
          </Text>

          <Text style={styles.sectionCount}>
            {transactionCount}{' '}
            {transactionCount === 1
              ? config.singular
              : config.plural}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.accent}
            />

            <Text style={styles.loadingText}>
              {t('transactionList.loading').replace('{items}', config.plural)}
            </Text>
          </View>
        ) : transactions.length === 0 ? (
          <EmptyState
            config={config}
            onAdd={goToAddTransaction}
            styles={styles}
            COLORS={COLORS}
            t={t}
          />
        ) : sortedTransactions.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <View style={styles.noResultsIcon}>
              <AppIcon
                name="search-outline"
                size={34}
                color={COLORS.textMuted}
              />
            </View>

            <Text style={styles.noResultsTitle}>
              {t('transactionList.noResultsTitle')}
            </Text>

            <Text style={styles.noResultsText}>
              {t('transactionList.noResultsText')}
            </Text>

            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSearchText('');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.clearFiltersButtonText}>
                {t('transactionList.clearFilters')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          sortedTransactions.map(
            (transaction) => {
              const categoryMeta =
                getCategoryMeta(
                  transaction.category ||
                    'Otros'
                );

              const isDeleting =
                deletingId === transaction.id;

              return (
                <TouchableOpacity
                  key={transaction.id}
                  style={[
                    styles.transactionCard,
                    isDeleting &&
                      styles.transactionCardDisabled,
                  ]}
                  activeOpacity={0.75}
                  disabled={isDeleting}
                  onLongPress={() =>
                    confirmDelete(transaction)
                  }
                >
                  <View
                    style={[
                      styles.transactionIconWrapper,
                      {
                        backgroundColor: `${categoryMeta.color}18`,
                      },
                    ]}
                  >
                    {isDeleting ? (
                      <ActivityIndicator
                        size="small"
                        color={
                          categoryMeta.color
                        }
                      />
                    ) : (
                      <AppIcon
                        name={
                          categoryMeta.icon
                        }
                        size={22}
                        color={
                          categoryMeta.color
                        }
                      />
                    )}
                  </View>

                  <View
                    style={
                      styles.transactionInfo
                    }
                  >
                    <Text
                      style={
                        styles.transactionName
                      }
                      numberOfLines={1}
                    >
                      {transaction.description ||
                        config.defaultDescription}
                    </Text>

                    <Text
                      style={
                        styles.transactionDate
                      }
                    >
                      {formatDate(
                        transaction.date,
                        language,
                        t
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.transactionRight
                    }
                  >
                    <Text
                      style={styles.transactionAmount}
                    >
                      {config.amountPrefix}
                      {formatMoney(
                        transaction.amount,
                        currency
                      )}
                    </Text>

                    <Text
                      style={
                        styles.transactionCategory
                      }
                      numberOfLines={1}
                    >
                      {t(
                        `categories.${getCategoryTranslationKey(
                          transaction.category ||
                            'Otros'
                        )}`
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          )
        )}

        {transactions.length > 0 && (
          <Text style={styles.deleteHint}>
            {t('transactionList.deleteHint')}
          </Text>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {!loading && (
        <TouchableOpacity
          style={[
            styles.fab,
            transactionType === 'expense' &&
              styles.expenseFab,
          ]}
          onPress={goToAddTransaction}
          activeOpacity={0.85}
        >
          <AppIcon
            name="add"
            size={28}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('Home')
          }
        >
          <AppIcon
            name="home-outline"
            size={24}
            color={COLORS.textMuted}
          />

          <Text style={styles.navLabel}>
            {t('navigation.home')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('Expenses')
          }
        >
          <AppIcon
            name="swap-horizontal"
            size={24}
            color={COLORS.accent}
          />

          <Text
            style={[
              styles.navLabel,
              styles.navLabelActive,
            ]}
          >
            {t('navigation.transactions')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navScanWrapper}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('Scan')
          }
        >
          <View style={styles.navScanButton}>
            <AppIcon
              name="scan-outline"
              size={26}
              color={COLORS.textPrimary}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('Stats')
          }
        >
          <AppIcon
            name="bar-chart-outline"
            size={24}
            color={COLORS.textMuted}
          />

          <Text style={styles.navLabel}>
            {t('navigation.stats')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('Goals')
          }
        >
          <AppIcon
            name="flag-outline"
            size={24}
            color={COLORS.textMuted}
          />

          <Text style={styles.navLabel}>
            {t('navigation.goals')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 56,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },

  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
    shadowColor: COLORS.textPrimary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },

  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  summaryAmount: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  summaryCategoryBody: {
    flex: 1,
  },

  summaryIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryItemValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  summaryItemLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  sectionCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  transactionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  transactionCardDisabled: {
    opacity: 0.55,
  },

  transactionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },

  transactionDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  transactionRight: {
    maxWidth: '42%',
    alignItems: 'flex-end',
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
    color: COLORS.textPrimary,
  },

  transactionCategory: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  deleteHint: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 8,
  },

  emptyWrapper: {
    alignItems: 'center',
    paddingVertical: 48,
  },

  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  expenseFab: {
    backgroundColor: COLORS.accent,
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

  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },

  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },

  navLabelActive: {
    color: COLORS.accent,
  },

  navScanWrapper: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
  },

  navScanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  height: 50,
  backgroundColor: COLORS.surface,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: COLORS.border,
  paddingHorizontal: 14,
  marginBottom: 18,
},

searchInput: {
  flex: 1,
  fontSize: 14,
  color: COLORS.textPrimary,
},

noResultsContainer: {
  alignItems: 'center',
  paddingVertical: 46,
  paddingHorizontal: 20,
},

noResultsIcon: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: COLORS.surface,
  borderWidth: 1,
  borderColor: COLORS.border,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
},

noResultsTitle: {
  fontSize: 17,
  fontWeight: '800',
  color: COLORS.textPrimary,
  marginBottom: 7,
},

noResultsText: {
  fontSize: 13,
  color: COLORS.textSecondary,
  textAlign: 'center',
  lineHeight: 20,
  marginBottom: 20,
},

clearFiltersButton: {
  backgroundColor: COLORS.accent,
  borderRadius: 14,
  paddingHorizontal: 18,
  paddingVertical: 11,
},

clearFiltersButtonText: {
  fontSize: 13,
  fontWeight: '800',
  color: COLORS.textPrimary,
},

clearFiltersRow: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-end',
  gap: 6,
  marginTop: -8,
  marginBottom: 16,
},

clearFiltersRowText: {
  fontSize: 12,
  fontWeight: '700',
  color: COLORS.accent,
},

sortButton: {
  height: 46,
  borderRadius: 14,
  backgroundColor: COLORS.surface,
  borderWidth: 1,
  borderColor: COLORS.border,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 14,
  marginBottom: 18,
},

sortButtonText: {
  color: COLORS.textPrimary,
  fontSize: 13,
  fontWeight: '600',
},
  });
}