/**
 * HomeScreen.js
 * Pantalla principal de Spendly con datos reales.
 */

import React, {useState, useCallback, useMemo,} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import { getCurrentUser } from '../services/authService';
import { getTransactions } from '../services/transactionService';
import { getGoals } from '../services/goalService';
import {
  getCurrencyByCode,
  setPreferredCurrency as savePreferredCurrency,
  formatMoney,
} from '../utils/currency';

const API_BASE_URL =
  'https://spendly-production-1793.up.railway.app';

function getCategoryIcons(COLORS) {
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
      color: COLORS.slate,
    },
  };
}

function AppIcon({
  name,
  size = 20,
  color = '#9CA3AF',
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

function getInitials(fullName = '') {
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return 'U';
}

function getAvatarUrl(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

function getCategoryMeta(
  category,
  COLORS
) {
  const CATEGORY_ICONS =
    getCategoryIcons(COLORS);

  return (
    CATEGORY_ICONS[category] ||
    CATEGORY_ICONS.Otros
  );
}

function isSameMonth(dateString, targetDate) {
  const date = new Date(dateString);

  return (
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  );
}

function getMonthName(date, language) {
  return date.toLocaleDateString(language, {
    month: 'long',
    year: 'numeric',
  });
}

function formatDate(isoString, language, t) {
  const date = new Date(isoString);
  const avatarUrl = getAvatarUrl(user.profile_image_url);

const now = new Date();

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

  if (isToday) return t('home.date.today');
  if (isYesterday) return t('home.date.yesterday');

  return date.toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
  });
}

function ProgressBar({percent, color, styles, }) {
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

function EmptyBlock({icon, title, text, actionText, onPress, styles, COLORS, }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <AppIcon name={icon} size={28} color={COLORS.textMuted} />
      </View>

      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>

      {!!actionText && (
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={onPress}
          activeOpacity={0.85}
        >
          <Text style={styles.emptyBtnText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const {
  colors: COLORS,
  isDark,
} = useTheme();

const { language, t } = useLanguage();

const styles = useMemo(
  () => createStyles(COLORS),
  [COLORS]
);
  const [user, setUser] = useState({
    full_name: 'Usuario',
    email: '',
    profile_image_url: null,
    preferred_currency: 'ARS',
  });

  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [currency, setCurrency] = useState(getCurrencyByCode('ARS'));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [])
  );


const loadHomeData = async () => {
  try {
    setLoading(true);
    setError('');

    const [
      userData,
      transactionData,
      goalsData,
    ] = await Promise.all([
      getCurrentUser(),
      getTransactions(),
      getGoals(),
    ]);

    const userCurrency = getCurrencyByCode(
      userData.preferred_currency || 'ARS'
    );

    setAvatarError(false);
    setUser(userData);
    setCurrency(userCurrency);
    setTransactions(
      Array.isArray(transactionData)
        ? transactionData
        : []
    );
    setGoals(
      Array.isArray(goalsData)
        ? goalsData
        : []
    );

    await savePreferredCurrency(userCurrency.code);
  } catch (loadError) {
    console.log(
      'Error cargando Home:',
      loadError.message
    );
    setError(
      loadError.message ||
      t('home.errors.load')
    );
  } finally {
    setLoading(false);
  }
};


const onRefresh = async () => {
  try {
    setRefreshing(true);
    await loadHomeData();
  } finally {
    setRefreshing(false);
  }
};

const now = new Date();

  const monthlyTransactions = transactions.filter((t) =>
    isSameMonth(t.date, now)
  );

  const monthlyExpenses = monthlyTransactions.filter(
    (t) => t.type === 'expense'
  );

  const monthlyIncome = monthlyTransactions.filter(
    (t) => t.type === 'income'
  );

  const totalExpenses = monthlyExpenses.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  const totalIncome = monthlyIncome.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );

  const balance = totalIncome - totalExpenses;
  const savings = Math.max(balance, 0);

  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    const category = expense.category || t('home.otherCategory');
    acc[category] =
      (acc[category] || 0) + Number(expense.amount || 0);
    return acc;
  }, {});

  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percent: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      ...getCategoryMeta(name, COLORS),
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categories[0];

  const recentExpenses = [...monthlyExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

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
            <Text style={styles.greeting}>
              {t('home.greeting').replace('{name}', user.full_name?.split(' ')[0] || t('home.defaultUser'))}
            </Text>
            <Text style={styles.greetingSub}>
              {t('home.welcomeBack')}
            </Text>
          </View>

            <TouchableOpacity
              style={styles.avatarRing}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              {avatarUrl && !avatarError ? (
                <Image
                  source={{ uri: avatarUrl }}
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

{!!error && (
  <View style={styles.errorCard}>
    <AppIcon
      name="cloud-offline-outline"
      size={22}
      color={COLORS.orange}
    />

    <View style={{ flex: 1 }}>
      <Text style={styles.errorTitle}>
        {t('home.errors.title')}
      </Text>
      <Text style={styles.errorText}>
        {error}
      </Text>
    </View>

    <TouchableOpacity
      style={styles.retryButton}
      onPress={loadHomeData}
    >
      <Text style={styles.retryButtonText}>
        {t('home.errors.retry')}
      </Text>
    </TouchableOpacity>
  </View>
)}

{loading ? (

          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>{t('home.loading')}</Text>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>
                {t('home.balanceMonth')}
              </Text>

              <Text style={styles.heroAmount}>
                {formatMoney(balance, currency)}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <AppIcon
                      name="trending-up"
                      size={14}
                      color={COLORS.accent}
                    />
                    <Text style={styles.statLabel}>{t('home.income')}</Text>
                  </View>
                  <Text style={[styles.statValue, { color: COLORS.accent }]}>
                    {formatMoney(totalIncome, currency)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <AppIcon
                      name="trending-down"
                      size={14}
                      color={COLORS.red}
                    />
                    <Text style={styles.statLabel}>{t('home.expenses')}</Text>
                  </View>
                  <Text style={[styles.statValue, { color: COLORS.red }]}>
                    {formatMoney(totalExpenses, currency)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <AppIcon
                      name="wallet-outline"
                      size={14}
                      color={COLORS.blue}
                    />
                    <Text style={styles.statLabel}>{t('home.available')}</Text>
                  </View>
                  <Text style={[styles.statValue, { color: COLORS.blue }]}>
                    {formatMoney(savings, currency)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('AddExpense')}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: 'rgba(74,222,128,0.1)' },
                  ]}
                >
                  <AppIcon name="add" size={24} color={COLORS.accent} />
                </View>
                <Text style={styles.actionLabel}>{t('home.quick.expense')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('AddIncome')}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: 'rgba(96,165,250,0.1)' },
                  ]}
                >
                  <AppIcon
                    name="cash-outline"
                    size={24}
                    color={COLORS.blue}
                  />
                </View>
                <Text style={styles.actionLabel}>{t('home.quick.income')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('Scan')}
                  activeOpacity={0.85}
              >

                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: 'rgba(74,222,128,0.2)' },
                  ]}
                >
                  <AppIcon
                    name="camera-outline"
                    size={24}
                    color={COLORS.accent}
                  />
                </View>
                <Text style={[styles.actionLabel, { color: COLORS.accent }]}>
                  Escanear
                </Text>
                <View style={styles.actionDot} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Stats')}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: 'rgba(192,132,252,0.1)' },
                  ]}
                >
                  <AppIcon
                    name="bar-chart-outline"
                    size={24}
                    color={COLORS.purple}
                  />
                </View>
                <Text style={styles.actionLabel}>{t('home.quick.stats')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t('home.monthSummary')}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getMonthName(now, language)}</Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('home.totalSpent')}</Text>
                <Text style={[styles.summaryValue, { color: COLORS.red }]}>
                  {formatMoney(totalExpenses, currency)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('home.totalIncome')}</Text>
                <Text style={[styles.summaryValue, { color: COLORS.accent }]}>
                  {formatMoney(totalIncome, currency)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('home.topCategory')}</Text>
                <View style={styles.summaryValueRow}>
                  <AppIcon
                    name={topCategory?.icon || 'grid-outline'}
                    size={14}
                    color={COLORS.textPrimary}
                  />
                  <Text style={[styles.summaryValue, { marginLeft: 4 }]}>
                    {topCategory?.name || t('home.noData')}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.trendRow}>
                <AppIcon
                  name="information-circle-outline"
                  size={14}
                  color={COLORS.orange}
                />
                <Text style={[styles.trendText, { color: COLORS.orange }]}>
                  {' '}
                  {monthlyExpenses.length > 0
                    ? 'Tu resumen ya está basado en gastos reales.'
                    : 'Todavía no registraste gastos este mes.'}
                </Text>
              </View>
            </View>


<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>
    {t('home.featuredGoal')}
  </Text>

  <TouchableOpacity
    onPress={() => navigation.navigate('Goals')}
  >
    <Text style={styles.sectionLink}>
      {t('home.viewAll')}
    </Text>
  </TouchableOpacity>
</View>

{goals.filter((goal) => goal.status === 'active').length > 0 ? (() => {
  const featuredGoal = [...goals]
    .filter((goal) => goal.status === 'active')
    .sort(
      (a, b) =>
        Number(b.porcentaje_progreso || 0) -
        Number(a.porcentaje_progreso || 0)
    )[0];

  return (
    <TouchableOpacity
      style={styles.goalCard}
      onPress={() =>
        navigation.navigate('Goals', {
          goalId: featuredGoal.id,
        })
      }
      activeOpacity={0.82}
    >
      <View style={styles.goalHeader}>
        <View
          style={[
            styles.goalIcon,
            {
              backgroundColor:
                `${featuredGoal.color || COLORS.accent}18`,
            },
          ]}
        >
          <Text style={styles.goalEmoji}>
            {featuredGoal.icon || '🎯'}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.goalTitle}>
            {featuredGoal.name}
          </Text>
          <Text style={styles.goalSubtitle}>
            {t('home.goalProgress').replace(
              '{percent}',
              String(
                Math.round(
                  Number(
                    featuredGoal.porcentaje_progreso || 0
                  )
                )
              )
            )}
          </Text>
        </View>

        <AppIcon
          name="chevron-forward"
          size={18}
          color={COLORS.textMuted}
        />
      </View>

      <ProgressBar
        percent={featuredGoal.porcentaje_progreso}
        color={featuredGoal.color || COLORS.accent}
        styles={styles}
      />

      <View style={styles.goalFooter}>
        <Text style={styles.goalAmount}>
          {formatMoney(
            featuredGoal.current_amount,
            getCurrencyByCode(featuredGoal.currency)
          )}
        </Text>

        <Text style={styles.goalTarget}>
          {formatMoney(
            featuredGoal.target_amount,
            getCurrencyByCode(featuredGoal.currency)
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
})() : (
  <EmptyBlock
    styles={styles}
    COLORS={COLORS}
    icon="flag-outline"
    title={t('home.emptyGoal.title')}
    text={t('home.emptyGoal.text')}
    actionText={t('home.emptyGoal.action')}
    onPress={() => navigation.navigate('Goals')}
  />
)}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.recentExpenses')}</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Expenses')}
              >
                <Text style={styles.sectionLink}>{t('home.viewAll')}</Text>
              </TouchableOpacity>
            </View>

            {recentExpenses.length === 0 ? (
              <EmptyBlock
                styles={styles}
                COLORS={COLORS}
                icon="receipt-outline"
                title={t('home.emptyExpenses.title')}
                text={t('home.emptyExpenses.text')}
                actionText={t('home.emptyExpenses.action')}
                onPress={() => navigation.navigate('AddExpense')}
              />
            ) : (
              recentExpenses.map((expense) => {
                const meta =
                  getCategoryMeta(
                    expense.category,
                    COLORS
                  );

                return (
                  <TouchableOpacity
                    key={expense.id}
                    style={styles.expenseCard}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.expenseIconWrapper,
                        { backgroundColor: `${meta.color}18` },
                      ]}
                    >
                      <AppIcon
                        name={meta.icon}
                        size={22}
                        color={meta.color}
                      />
                    </View>

                    <View style={styles.expenseInfo}>
                      <Text style={styles.expenseName}>
                        {expense.description || t('home.expenseNoDescription')}
                      </Text>
                      <Text style={styles.expenseDate}>
                        {formatDate(expense.date, language, t)}
                      </Text>
                    </View>

                    <View style={styles.expenseRight}>
                      <Text
                        style={[
                          styles.expenseAmount,
                          { color: COLORS.red },
                        ]}
                      >
                        -{formatMoney(expense.amount, currency)}
                      </Text>
                      <Text style={styles.expenseCategory}>
                        {expense.category || t('home.otherCategory')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}

            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
                <Text style={styles.sectionLink}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {categories.length === 0 ? (
              <EmptyBlock
                styles={styles}
                COLORS={COLORS}
                icon="receipt-outline"
                title={t('home.emptyCategories.title')}
                text={t('home.emptyCategories.text')}
              />
            ) : (
              categories.map((cat) => (
                <View key={cat.name} style={styles.categoryCard}>
                  <View style={styles.categoryTop}>
                    <View
                      style={[
                        styles.categoryIcon,
                        { backgroundColor: `${cat.color}20` },
                      ]}
                    >
                      <AppIcon
                        name={cat.icon}
                        size={18}
                        color={cat.color}
                      />
                    </View>

                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryName}>{cat.name}</Text>
                      <Text style={styles.categoryAmount}>
                        {formatMoney(cat.amount, currency)}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.categoryPercent,
                        { color: cat.color },
                      ]}
                    >
                      {cat.percent.toFixed(0)}%
                    </Text>
                  </View>

                  <ProgressBar
                    percent={cat.percent}
                    color={cat.color}
                    styles={styles}
                  />
                </View>
              ))
            )}

            <Text style={styles.footerText}>
              Spendly © 2026
            </Text>

            <View style={{ height: 90 }} />
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <AppIcon name="home" size={24} color={COLORS.accent} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Expenses')}
        >
          <AppIcon
          name="swap-horizontal-outline"
          size={24}
          color={COLORS.textMuted}
        />
          <Text style={styles.navLabel}>{t('navigation.transactions')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navScanWrapper}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Scan')}
        >
          <View style={styles.navScanBtn}>
            <AppIcon
              name="scan-outline"
              size={26}
              color="#0D1A12"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Stats')}
        >
          <AppIcon
            name="bar-chart-outline"
            size={24}
            color={COLORS.textMuted}
          />
          <Text style={styles.navLabel}>{t('home.quick.stats')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Goals')}
        >
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 56 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  greetingSub: { fontSize: 13, color: COLORS.textSecondary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
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
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: COLORS.accent },
  avatarImage: { width: 38, height: 38, borderRadius: 19 },

  loadingBox: {
    marginTop: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  heroAmount: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 24,
    letterSpacing: -1,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  statValue: { fontSize: 15, fontWeight: '600' },

  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
  },
  actionBtnHighlight: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderColor: 'rgba(74,222,128,0.3)',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actionDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  iaBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.3)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iaLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iaIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74,222,128,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iaTextBlock: { flex: 1 },
  iaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  iaDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  badge: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 13, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  trendText: { fontSize: 13 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  sectionLink: { fontSize: 13, color: COLORS.accent },

  expenseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  expenseInfo: { flex: 1 },
  expenseName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  expenseDate: { fontSize: 11, color: COLORS.textSecondary },
  expenseRight: { alignItems: 'flex-end' },
  expenseAmount: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  expenseCategory: { fontSize: 11, color: COLORS.textSecondary },

  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 10,
  },
  categoryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: { flex: 1 },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  categoryAmount: { fontSize: 12, color: COLORS.textSecondary },
  categoryPercent: { fontSize: 13, fontWeight: '600' },

  progressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3 },

  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyBtn: {
    marginTop: 14,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D1A12',
  },


errorCard: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  backgroundColor: `${COLORS.orange}12`,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: `${COLORS.orange}35`,
  padding: 14,
  marginBottom: 16,
},
errorTitle: {
  fontSize: 13,
  fontWeight: '800',
  color: COLORS.textPrimary,
},
errorText: {
  marginTop: 2,
  fontSize: 11,
  color: COLORS.textSecondary,
},
retryButton: {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  backgroundColor: COLORS.surfaceHigh,
},
retryButtonText: {
  fontSize: 11,
  fontWeight: '800',
  color: COLORS.accent,
},

goalCard: {
  backgroundColor: COLORS.surface,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: COLORS.border,
  padding: 16,
  marginBottom: 18,
},
goalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 11,
  marginBottom: 14,
},
goalIcon: {
  width: 44,
  height: 44,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
},
goalEmoji: {
  fontSize: 22,
},
goalTitle: {
  fontSize: 15,
  fontWeight: '800',
  color: COLORS.textPrimary,
},
goalSubtitle: {
  marginTop: 3,
  fontSize: 11,
  color: COLORS.textSecondary,
},
goalFooter: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},
goalAmount: {
  fontSize: 12,
  fontWeight: '800',
  color: COLORS.accent,
},
goalTarget: {
  fontSize: 12,
  color: COLORS.textSecondary,
},
footerText: {
  marginTop: 28,
  textAlign: 'center',
  fontSize: 12,
  color: COLORS.textMuted,
  fontWeight: '600',
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
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: COLORS.textMuted },
  navLabelActive: { color: COLORS.accent },
  navScanWrapper: { flex: 1, alignItems: 'center', marginBottom: 8 },
  navScanBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
  },
  });
}