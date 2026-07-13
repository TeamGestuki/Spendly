import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getTransactions } from '../services/transactionService';
import { getCurrentUser } from '../services/authService';
import {
  getCurrencyByCode,
  formatMoney,
} from '../utils/currency';

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
  red: '#F87171',
  blue: '#60A5FA',
  orange: '#FB923C',
  purple: '#C084FC',
};

const CATEGORY_ICONS = {
  Comida: { icon: 'bag-handle-outline', color: COLORS.accent },
  Transporte: { icon: 'car-outline', color: COLORS.blue },
  Supermercado: { icon: 'cart-outline', color: COLORS.orange },
  Servicios: { icon: 'flash-outline', color: COLORS.purple },
  Salud: { icon: 'heart-outline', color: '#F472B4' },
  Educación: { icon: 'book-outline', color: COLORS.blue },
  Entretenimiento: { icon: 'play-circle-outline', color: COLORS.orange },
  Ropa: { icon: 'shirt-outline', color: '#F472B4' },
  Tecnología: { icon: 'hardware-chip-outline', color: COLORS.blue },
  Otros: { icon: 'grid-outline', color: COLORS.textMuted },
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function isSameMonth(dateString, targetDate) {
  const date = new Date(dateString);

  return (
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  );
}

function getPreviousMonth(date) {
  const previous = new Date(date);
  previous.setMonth(previous.getMonth() - 1);
  return previous;
}

function getMonthName(date) {
  return date.toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });
}

function getCategoryMeta(category) {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.Otros;
}

function StatCard({ icon, iconColor, label, value, sub }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${iconColor}18` }]}>
        <AppIcon name={icon} size={20} color={iconColor} />
      </View>

      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>

      {!!sub && <Text style={styles.statSub}>{sub}</Text>}
    </View>
  );
}

export default function StatsScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState(getCurrencyByCode('ARS'));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const loadStats = async () => {
    try {
      setLoading(true);

      const userData = await getCurrentUser();

      const userCurrency = getCurrencyByCode(
        userData.preferred_currency || 'ARS'
      );

      setCurrency(userCurrency);

      const data = await getTransactions();

      const onlyExpenses = Array.isArray(data)
        ? data.filter((transaction) => transaction.type === 'expense')
        : [];

      setExpenses(onlyExpenses);
    } catch (error) {
      console.log('Error cargando estadísticas:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const onRefresh = async () => {
  try {
    setRefreshing(true);
    await loadStats();
  } finally {
    setRefreshing(false);
  }
};  
  const now = new Date();
  const previousMonth = getPreviousMonth(now);

  const currentMonthExpenses = expenses.filter((expense) =>
    isSameMonth(expense.date, now)
  );

  const previousMonthExpenses = expenses.filter((expense) =>
    isSameMonth(expense.date, previousMonth)
  );

  const totalMonth = currentMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const previousTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const expenseCount = currentMonthExpenses.length;

  const averageExpense =
    expenseCount > 0 ? totalMonth / expenseCount : 0;

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    const category = expense.category || 'Otros';
    acc[category] = (acc[category] || 0) + Number(expense.amount || 0);
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: totalMonth > 0 ? (total / totalMonth) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const topCategory = topCategories[0];

  const monthlyDifference = totalMonth - previousTotal;
  const monthlyPercentage =
    previousTotal > 0 ? (monthlyDifference / previousTotal) * 100 : 0;

  const recentExpenses = [...currentMonthExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

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
            <Text style={styles.headerTitle}>Estadísticas</Text>
            <Text style={styles.headerSub}>
              Resumen de {getMonthName(now)}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.loadingText}>Cargando estadísticas...</Text>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>Total gastado este mes</Text>

              <Text style={styles.heroAmount}>
                {formatMoney(totalMonth, currency)}
              </Text>

              <View
                style={[
                  styles.trendBadge,
                  monthlyDifference > 0
                    ? styles.trendBadgeNegative
                    : styles.trendBadgePositive,
                ]}
              >
                <AppIcon
                  name={
                    monthlyDifference > 0
                      ? 'trending-up-outline'
                      : 'trending-down-outline'
                  }
                  size={16}
                  color={monthlyDifference > 0 ? COLORS.red : COLORS.accent}
                />

                <Text
                  style={[
                    styles.trendText,
                    {
                      color:
                        monthlyDifference > 0
                          ? COLORS.red
                          : COLORS.accent,
                    },
                  ]}
                >
                  {previousTotal > 0
                    ? `${monthlyDifference > 0 ? '+' : ''}${monthlyPercentage.toFixed(1)}% vs mes anterior`
                    : 'Sin comparación previa'}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <StatCard
                icon="receipt-outline"
                iconColor={COLORS.accent}
                label="Gastos"
                value={expenseCount}
                sub="registros"
              />

              <StatCard
                icon="calculator-outline"
                iconColor={COLORS.blue}
                label="Promedio"
                value={formatMoney(averageExpense, currency)}
                sub="por gasto"
              />

              <StatCard
                icon={
                  topCategory
                    ? getCategoryMeta(topCategory.category).icon
                    : 'grid-outline'
                }
                iconColor={
                  topCategory
                    ? getCategoryMeta(topCategory.category).color
                    : COLORS.textMuted
                }
                label="Categoría top"
                value={topCategory?.category || '—'}
                sub={
                  topCategory
                    ? formatMoney(topCategory.total, currency)
                    : 'sin datos'
                }
              />

              <StatCard
                icon="calendar-outline"
                iconColor={COLORS.orange}
                label="Mes anterior"
                value={formatMoney(previousTotal, currency)}
                sub={getMonthName(previousMonth)}
              />
            </View>

            <Text style={styles.sectionTitle}>Gasto por categoría</Text>

            {topCategories.length === 0 ? (
              <View style={styles.emptyCard}>
                <AppIcon
                  name="pie-chart-outline"
                  size={34}
                  color={COLORS.textMuted}
                />
                <Text style={styles.emptyTitle}>Sin datos todavía</Text>
                <Text style={styles.emptyText}>
                  Cuando registres gastos, vas a ver acá el desglose por categoría.
                </Text>
              </View>
            ) : (
              <View style={styles.card}>
                {topCategories.map((item, index) => {
                  const meta = getCategoryMeta(item.category);

                  return (
                    <View
                      key={item.category}
                      style={[
                        styles.categoryRow,
                        index === topCategories.length - 1 &&
                          styles.categoryRowLast,
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryIcon,
                          { backgroundColor: `${meta.color}18` },
                        ]}
                      >
                        <AppIcon
                          name={meta.icon}
                          size={18}
                          color={meta.color}
                        />
                      </View>

                      <View style={styles.categoryBody}>
                        <View style={styles.categoryTop}>
                          <Text style={styles.categoryName}>{item.category}</Text>
                          <Text style={styles.categoryAmount}>
                            {formatMoney(item.total, currency)}
                          </Text>
                        </View>

                        <View style={styles.progressTrack}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${Math.min(item.percentage, 100)}%`,
                              },
                            ]}
                          />
                        </View>

                        <Text style={styles.categoryPercent}>
                          {item.percentage.toFixed(1)}% del total
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            <Text style={styles.sectionTitle}>Últimos gastos</Text>

            {recentExpenses.length === 0 ? (
              <View style={styles.emptySmallCard}>
                <Text style={styles.emptyText}>
                  No hay gastos recientes este mes.
                </Text>
              </View>
            ) : (
              <View style={styles.card}>
                {recentExpenses.map((expense, index) => {
                  const meta = getCategoryMeta(expense.category);

                  return (
                    <View
                      key={expense.id}
                      style={[
                        styles.recentRow,
                        index === recentExpenses.length - 1 &&
                          styles.recentRowLast,
                      ]}
                    >
                      <View
                        style={[
                          styles.recentIcon,
                          { backgroundColor: `${meta.color}18` },
                        ]}
                      >
                        <AppIcon
                          name={meta.icon}
                          size={18}
                          color={meta.color}
                        />
                      </View>

                      <View style={styles.recentBody}>
                        <Text style={styles.recentTitle}>
                          {expense.description || 'Gasto sin descripción'}
                        </Text>
                        <Text style={styles.recentSub}>
                          {expense.category || 'Otros'}
                        </Text>
                      </View>

                      <Text style={styles.recentAmount}>
                        -{formatMoney(expense.amount, currency)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={{ height: 100 }} />
          </>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <AppIcon name="home-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
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
          <Text style={styles.navLabel}>Movimientos</Text>
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

        <TouchableOpacity style={styles.navItem}>
          <AppIcon name="bar-chart" size={24} color={COLORS.accent} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>
            Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('Goals')}
        >
          <AppIcon name="flag-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Metas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

  headerSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },

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

  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
    padding: 24,
    marginBottom: 18,
  },

  heroLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: 16,
  },

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

  trendBadgeNegative: {
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.25)',
  },

  trendBadgePositive: {
    backgroundColor: 'rgba(74,222,128,0.10)',
    borderColor: 'rgba(74,222,128,0.25)',
  },

  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },

  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },

  statSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    overflow: 'hidden',
  },

  categoryRow: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },

  categoryRowLast: {
    borderBottomWidth: 0,
  },

  categoryIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryBody: {
    flex: 1,
  },

  categoryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  categoryAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceHigh,
    overflow: 'hidden',
    marginBottom: 6,
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.accent,
  },

  categoryPercent: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  recentRowLast: {
    borderBottomWidth: 0,
  },

  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  recentBody: {
    flex: 1,
  },

  recentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },

  recentSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  recentAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.red,
  },

  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 26,
    alignItems: 'center',
    marginBottom: 24,
  },

  emptySmallCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(22,26,35,0.97)',
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

  navScanBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: -28,
  },
});