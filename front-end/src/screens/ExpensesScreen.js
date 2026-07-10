/**
 * ExpensesScreen.js
 * Pantalla de gastos de Spendly.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions, deleteTransaction } from '../services/transactionService';

// ─── Paleta idéntica al resto de la app ───────────────────────────────────────
const COLORS = {
  bg:            '#0D0F14',
  surface:       '#161A23',
  surfaceHigh:   '#1E2330',
  border:        '#272D3D',
  accent:        '#4ADE80',
  accentDim:     '#1A3D28',
  textPrimary:   '#F0F2F7',
  textSecondary: '#9CA3AF',
  textMuted:     '#6B748A',
  red:           '#F87171',
  blue:          '#60A5FA',
  orange:        '#FB923C',
  purple:        '#C084FC',
};

// ─── Íconos por categoría ─────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  'Comida':          { icon: 'bag-handle-outline', color: COLORS.accent  },
  'Transporte':      { icon: 'car-outline',         color: COLORS.blue    },
  'Supermercado':    { icon: 'cart-outline',         color: COLORS.orange  },
  'Servicios':       { icon: 'flash-outline',        color: COLORS.purple  },
  'Salud':           { icon: 'heart-outline',        color: '#F472B4'      },
  'Educación':       { icon: 'book-outline',         color: COLORS.blue    },
  'Entretenimiento': { icon: 'play-circle-outline',  color: COLORS.orange  },
  'Ropa':            { icon: 'shirt-outline',        color: '#F472B4'      },
  'Tecnología':      { icon: 'hardware-chip-outline',color: COLORS.blue    },
  'Otros':           { icon: 'grid-outline',         color: COLORS.textMuted },
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── Formatea fecha de ISO a texto legible ────────────────────────────────────
function formatDate(isoString) {
  const date = new Date(isoString);
  const now  = new Date();

  const isToday =
    date.getDate()     === now.getDate() &&
    date.getMonth()    === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate()     === yesterday.getDate() &&
    date.getMonth()    === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const hh = date.getHours().toString().padStart(2, '0');
  const mm  = date.getMinutes().toString().padStart(2, '0');
  const time = `${hh}:${mm}`;

  if (isToday)     return `Hoy, ${time}`;
  if (isYesterday) return `Ayer, ${time}`;

  return date.toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short',
  }) + `, ${time}`;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <View style={styles.emptyWrapper}>
      <View style={styles.emptyIconWrapper}>
        <AppIcon name="receipt-outline" size={40} color={COLORS.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>Sin gastos registrados</Text>
      <Text style={styles.emptyDesc}>
        Todavía no cargaste ningún gasto este mes.{'\n'}
        Empezá agregando uno ahora.
      </Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onAdd} activeOpacity={0.85}>
        <AppIcon name="add" size={18} color="#0D1A12" />
        <Text style={styles.emptyBtnText}>Agregar primer gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function ExpensesScreen({ navigation, route }) {
  const [expenses, setExpenses]   = useState([]);
  const [loading, setLoading]     = useState(true);

  // Recarga la lista cada vez que la pantalla toma el foco
  // (sirve para reflejar gastos nuevos creados en AddExpense)
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      // Solo mostramos gastos (type === 'expense')
      setExpenses(data.filter((t) => t.type === 'expense'));
    } catch (e) {
      console.log('Error cargando gastos:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.log('Error eliminando:', e.message);
    }
  };

  // ── Cálculos de resumen ──────────────────────────────────────────────────
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count       = expenses.length;

  // Categoría con más gasto
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Gastos</Text>
            <Text style={styles.headerSub}>Controlá tus movimientos recientes</Text>
          </View>
          {/* Filtro futuro */}
          <TouchableOpacity style={styles.iconBtn}>
            <AppIcon name="options-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* ── Card resumen ─────────────────────────────────────────────── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total gastado este mes</Text>
          <Text style={styles.summaryAmount}>
            ${totalAmount.toLocaleString('es-AR')}
          </Text>

          <View style={styles.summaryRow}>
            {/* Cantidad */}
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconWrapper, { backgroundColor: 'rgba(74,222,128,0.12)' }]}>
                <AppIcon name="receipt-outline" size={16} color={COLORS.accent} />
              </View>
              <View>
                <Text style={styles.summaryItemValue}>{count}</Text>
                <Text style={styles.summaryItemLabel}>Registros</Text>
              </View>
            </View>

            {/* Divisor */}
            <View style={styles.summaryDivider} />

            {/* Categoría principal */}
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconWrapper, { backgroundColor: 'rgba(96,165,250,0.12)' }]}>
                <AppIcon
                  name={CATEGORY_ICONS[topCategory]?.icon ?? 'grid-outline'}
                  size={16}
                  color={COLORS.blue}
                />
              </View>
              <View>
                <Text style={styles.summaryItemValue}>{topCategory}</Text>
                <Text style={styles.summaryItemLabel}>Cat. principal</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Lista de gastos ──────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Movimientos</Text>
          <Text style={styles.sectionCount}>{count} gastos</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
            style={{ marginTop: 40 }}
          />
        ) : expenses.length === 0 ? (
          <EmptyState onAdd={() => navigation.navigate('AddExpense')} />
        ) : (
          expenses.map((expense) => {
            const cat = CATEGORY_ICONS[expense.category] ?? CATEGORY_ICONS['Otros'];
            return (
              <TouchableOpacity
                key={expense.id}
                style={styles.expenseCard}
                activeOpacity={0.75}
                onLongPress={() => handleDelete(expense.id)}
              >
                {/* Ícono de categoría */}
                <View style={[styles.expenseIconWrapper, { backgroundColor: `${cat.color}18` }]}>
                  <AppIcon name={cat.icon} size={22} color={cat.color} />
                </View>

                {/* Info */}
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseName}>{expense.description}</Text>
                  <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
                </View>

                {/* Monto + categoría */}
                <View style={styles.expenseRight}>
                  <Text style={[styles.expenseAmount, { color: COLORS.red }]}>
                    -${expense.amount.toLocaleString('es-AR')}
                  </Text>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Hint para delete */}
        {expenses.length > 0 && (
          <Text style={styles.hintText}>
            Mantené presionado un gasto para eliminarlo
          </Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FAB: Agregar gasto ───────────────────────────────────────────── */}
      {!loading && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddExpense')}
          activeOpacity={0.85}
        >
          <AppIcon name="add" size={28} color="#0D1A12" />
        </TouchableOpacity>
      )}

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="home-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        {/* Gastos — activo */}
        <TouchableOpacity style={styles.navItem}>
          <AppIcon name="card" size={24} color={COLORS.accent} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Gastos</Text>
        </TouchableOpacity>

        {/* Scan central */}
        <TouchableOpacity style={styles.navScanWrapper} activeOpacity={0.85}>
          <View style={styles.navScanBtn}>
            <AppIcon name="scan-outline" size={26} color="#0D1A12" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <AppIcon name="bar-chart-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <AppIcon name="flag-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Metas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 56 },

  // ── Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 3 },
  headerSub:   { fontSize: 13, color: COLORS.textSecondary },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Summary card
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24, borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
    padding: 24, marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  summaryLabel:  { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  summaryAmount: {
    fontSize: 34, fontWeight: '800', color: COLORS.textPrimary,
    letterSpacing: -1, marginBottom: 20,
  },
  summaryRow:    { flexDirection: 'row', alignItems: 'center' },
  summaryItem:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  summaryIconWrapper: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryItemValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  summaryItemLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  summaryDivider: {
    width: 1, height: 32, backgroundColor: COLORS.border, marginHorizontal: 16,
  },

  // ── Sección
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  sectionCount: { fontSize: 12, color: COLORS.textMuted },

  // ── Expense card (igual a HomeScreen)
  expenseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    padding: 16, flexDirection: 'row', alignItems: 'center',
    marginBottom: 10,
  },
  expenseIconWrapper: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  expenseInfo:     { flex: 1 },
  expenseName:     { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 3 },
  expenseDate:     { fontSize: 11, color: COLORS.textSecondary },
  expenseRight:    { alignItems: 'flex-end' },
  expenseAmount:   { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  expenseCategory: { fontSize: 11, color: COLORS.textSecondary },

  hintText: {
    textAlign: 'center', fontSize: 11,
    color: COLORS.textMuted, marginTop: 4, marginBottom: 8,
  },

  // ── Empty state
  emptyWrapper: { alignItems: 'center', paddingVertical: 48 },
  emptyIconWrapper: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 17, fontWeight: '700',
    color: COLORS.textPrimary, marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13, color: COLORS.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: 24,
  },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 14, paddingHorizontal: 20, paddingVertical: 13,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#0D1A12' },

  // ── FAB
  fab: {
    position: 'absolute', right: 20, bottom: 100,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
  },

  // ── Bottom Nav (idéntica al resto)
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(22,26,35,0.97)',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    flexDirection: 'row', alignItems: 'flex-end',
    paddingBottom: 24, paddingTop: 12, paddingHorizontal: 20,
  },
  navItem:        { flex: 1, alignItems: 'center', gap: 4 },
  navLabel:       { fontSize: 10, color: COLORS.textMuted },
  navLabelActive: { color: COLORS.accent },
  navScanWrapper: { flex: 1, alignItems: 'center', marginBottom: 8 },
  navScanBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    marginTop: -28,
  },
});