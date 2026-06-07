/**
 * HomeScreen.js
    * Pantalla principal de Spendly, muestra un resumen financiero con diseño moderno y visualmente atractivo.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Paleta (idéntica al resto de la app) ────────────────────────────────────
const COLORS = {
  bg:            '#0D0F14',
  surface:       '#161A23',
  surfaceHigh:   '#1E2330',
  border:        '#272D3D',
  accent:        '#4ADE80',
  accentDim:     '#1A3D28',
  accentGlow:    'rgba(74,222,128,0.12)',
  textPrimary:   '#F0F2F7',
  textSecondary: '#9CA3AF',
  textMuted:     '#6B748A',
  red:           '#F87171',
  blue:          '#60A5FA',
  orange:        '#FB923C',
  pink:          '#F472B4',
  purple:        '#C084FC',
  slate:         '#94A3B8',
  cardBorder:    'rgba(255,255,255,0.06)',
};

// ─── Datos de ejemplo ─────────────────────────────────────────────────────────
const EXPENSES = [
  { id: 1, icon: 'bag-handle-outline',     iconLib: 'ion', name: "McDonald's",  date: 'Hoy, 14:30',      amount: -12500, category: 'Comida'          },
  { id: 2, icon: 'cart-outline',           iconLib: 'ion', name: 'Carrefour',   date: 'Ayer, 18:45',     amount: -45000, category: 'Compras'         },
  { id: 3, icon: 'car-outline',            iconLib: 'ion', name: 'Uber',        date: 'Ayer, 09:20',     amount: -6200,  category: 'Transporte'      },
  { id: 4, icon: 'play-circle-outline',    iconLib: 'ion', name: 'Netflix',     date: '3 jun, 10:00',    amount: -8900,  category: 'Entretenimiento' },
];

const CATEGORIES = [
  { name: 'Comida',           amount: 45200, percent: 35, icon: 'bag-handle-outline',  iconLib: 'ion', color: COLORS.accent  },
  { name: 'Transporte',       amount: 28400, percent: 22, icon: 'car-outline',          iconLib: 'ion', color: COLORS.blue    },
  { name: 'Entretenimiento',  amount: 18900, percent: 15, icon: 'play-circle-outline',  iconLib: 'ion', color: COLORS.orange  },
  { name: 'Salud',            amount: 15200, percent: 12, icon: 'heart-outline',         iconLib: 'ion', color: COLORS.pink    },
  { name: 'Servicios',        amount: 12000, percent: 9,  icon: 'flash-outline',         iconLib: 'ion', color: COLORS.purple  },
  { name: 'Otros',            amount: 8000,  percent: 7,  icon: 'grid-outline',          iconLib: 'ion', color: COLORS.slate   },
];

// ─── Componente de ícono unificado ────────────────────────────────────────────
function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── Progress Bar custom ──────────────────────────────────────────────────────
function ProgressBar({ percent, color }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  const formatAmount = (n) =>
    Math.abs(n).toLocaleString('es-AR');

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, Pedro</Text>
            <Text style={styles.greetingSub}>Bienvenido de nuevo</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <AppIcon name="notifications-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <View style={styles.avatarRing}>
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarText}>PD</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Hero Card: Balance ────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Glow de fondo */}
          <Text style={styles.heroLabel}>Balance Total del Mes</Text>
          <Text style={styles.heroAmount}>$452.300</Text>

          <View style={styles.statsRow}>
            {/* Ingresos */}
            <View style={styles.statItem}>
              <View style={styles.statLabelRow}>
                <AppIcon name="trending-up" size={14} color={COLORS.accent} />
                <Text style={styles.statLabel}>  Ingresos</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.accent }]}>$580.000</Text>
            </View>
            {/* Gastos */}
            <View style={styles.statItem}>
              <View style={styles.statLabelRow}>
                <AppIcon name="trending-down" size={14} color={COLORS.red} />
                <Text style={styles.statLabel}>  Gastos</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.red }]}>$127.700</Text>
            </View>
            {/* Ahorro */}
            <View style={styles.statItem}>
              <View style={styles.statLabelRow}>
                <AppIcon name="wallet-outline" size={14} color={COLORS.blue} />
                <Text style={styles.statLabel}>  Ahorro</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.blue }]}>$324.600</Text>
            </View>
          </View>
        </View>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <View style={styles.quickActions}>
          {/* Gasto */}
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(74,222,128,0.1)' }]}>
              <AppIcon name="add" size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.actionLabel}>Gasto</Text>
          </TouchableOpacity>

          {/* Ingreso */}
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(96,165,250,0.1)' }]}>
              <AppIcon name="cash-outline" size={24} color={COLORS.blue} />
            </View>
            <Text style={styles.actionLabel}>Ingreso</Text>
          </TouchableOpacity>

          {/* Escanear — destacado */}
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnHighlight]}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(74,222,128,0.2)' }]}>
              <AppIcon name="camera-outline" size={24} color={COLORS.accent} />
            </View>
            <Text style={[styles.actionLabel, { color: COLORS.accent }]}>Escanear</Text>
            {/* Dot animado */}
            <View style={styles.actionDot} />
          </TouchableOpacity>

          {/* Stats */}
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIcon, { backgroundColor: 'rgba(192,132,252,0.1)' }]}>
              <AppIcon name="bar-chart-outline" size={24} color={COLORS.purple} />
            </View>
            <Text style={styles.actionLabel}>Stats</Text>
          </TouchableOpacity>
        </View>

        {/* ── IA/OCR Banner ─────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.iaBanner} activeOpacity={0.85}>
            <View style={styles.iaLeft}>
                <View style={styles.iaIconWrapper}>
                <AppIcon name="sparkles" size={20} color={COLORS.accent} />
                </View>

                <View style={styles.iaTextBlock}>
                <Text style={styles.iaTitle}>Escaneá un ticket</Text>
                <Text style={styles.iaDesc}>
                    Sacá una foto y obtenemos automáticamente monto, categoría y descripción.
                </Text>
                </View>
            </View>

            <AppIcon name="chevron-forward" size={22} color={COLORS.accent} />
            </TouchableOpacity>
        {/* ── Resumen del Mes ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Resumen del Mes</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Junio 2026</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total gastado</Text>
            <Text style={[styles.summaryValue, { color: COLORS.red }]}>$127.700</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total ingresado</Text>
            <Text style={[styles.summaryValue, { color: COLORS.accent }]}>$580.000</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Categoría principal</Text>
            <View style={styles.summaryValueRow}>
              <AppIcon name="bag-handle-outline" size={14} color={COLORS.textPrimary} />
              <Text style={[styles.summaryValue, { marginLeft: 4 }]}>Comida</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.trendRow}>
            <AppIcon name="trending-up" size={14} color={COLORS.orange} />
            <Text style={[styles.trendText, { color: COLORS.orange }]}>
              {' '}Gastaste 12% más que el mes pasado
            </Text>
          </View>
        </View>

        {/* ── Gastos Recientes ──────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gastos Recientes</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todos</Text></TouchableOpacity>
        </View>

        {EXPENSES.map((expense) => (
          <TouchableOpacity key={expense.id} style={styles.expenseCard} activeOpacity={0.75}>
            <View style={styles.expenseIconWrapper}>
              <AppIcon name={expense.icon} size={22} color={COLORS.textSecondary} />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseName}>{expense.name}</Text>
              <Text style={styles.expenseDate}>{expense.date}</Text>
            </View>
            <View style={styles.expenseRight}>
              <Text style={[styles.expenseAmount, { color: COLORS.red }]}>
                -${formatAmount(expense.amount)}
              </Text>
              <Text style={styles.expenseCategory}>{expense.category}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* ── Categorías ────────────────────────────────────────────────── */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todas</Text></TouchableOpacity>
        </View>

        {CATEGORIES.map((cat) => (
          <View key={cat.name} style={styles.categoryCard}>
            <View style={styles.categoryTop}>
              <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
                <AppIcon name={cat.icon} size={18} color={cat.color} />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryAmount}>${cat.amount.toLocaleString('es-AR')}</Text>
              </View>
              <Text style={[styles.categoryPercent, { color: cat.color }]}>{cat.percent}%</Text>
            </View>
            <ProgressBar percent={cat.percent} color={cat.color} />
          </View>
        ))}

        {/* Espacio para la nav bar */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <AppIcon name={activeTab === 'home' ? 'home' : 'home-outline'} size={24} color={activeTab === 'home' ? COLORS.accent : COLORS.textMuted} />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        {/* Gastos */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('gastos')}
        >
          <AppIcon name={activeTab === 'gastos' ? 'card' : 'card-outline'} size={24} color={activeTab === 'gastos' ? COLORS.accent : COLORS.textMuted} />
          <Text style={[styles.navLabel, activeTab === 'gastos' && styles.navLabelActive]}>Gastos</Text>
        </TouchableOpacity>

        {/* Scan — botón central elevado */}
        <TouchableOpacity style={styles.navScanWrapper} activeOpacity={0.85}>
          <View style={styles.navScanBtn}>
            <AppIcon name="scan-outline" size={26} color="#0D1A12" />
          </View>
        </TouchableOpacity>

        {/* Stats */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('stats')}
        >
          <AppIcon name={activeTab === 'stats' ? 'bar-chart' : 'bar-chart-outline'} size={24} color={activeTab === 'stats' ? COLORS.accent : COLORS.textMuted} />
          <Text style={[styles.navLabel, activeTab === 'stats' && styles.navLabelActive]}>Stats</Text>
        </TouchableOpacity>

        {/* Perfil */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('perfil')}
        >
          <AppIcon name={activeTab === 'perfil' ? 'person' : 'person-outline'} size={24} color={activeTab === 'perfil' ? COLORS.accent : COLORS.textMuted} />
          <Text style={[styles.navLabel, activeTab === 'perfil' && styles.navLabelActive]}>Perfil</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:    { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  greetingSub: { fontSize: 13, color: COLORS.textSecondary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarRing: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: 'rgba(74,222,128,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarFallback: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.accentDim,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: COLORS.accent },

  // ── Hero Card
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },

  heroLabel:  { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  heroAmount: { fontSize: 38, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 24, letterSpacing: -1 },
  statsRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  statItem:   { flex: 1 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statLabel:  { fontSize: 11, color: COLORS.textSecondary },
  statValue:  { fontSize: 15, fontWeight: '600' },

  // ── Quick Actions
  quickActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    position: 'relative',
  },
  actionBtnHighlight: {
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderColor: 'rgba(74,222,128,0.3)',
  },
  actionIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  actionLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  actionDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  // ── IA Banner
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

iaLeft: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
},

iaIconWrapper: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: 'rgba(74,222,128,0.15)',
  alignItems: 'center',
  justifyContent: 'center',
},

iaTextBlock: {
  flex: 1,
},

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

  // ── Cards genéricas
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24, borderWidth: 1, borderColor: COLORS.border,
    padding: 20, marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle:  { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  badge: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },

  // ── Summary
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  trendText: { fontSize: 13 },

  // ── Secciones
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  sectionLink:  { fontSize: 13, color: COLORS.accent },

  // ── Expense Cards
  expenseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    padding: 16, flexDirection: 'row', alignItems: 'center',
    marginBottom: 10,
  },
  expenseIconWrapper: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  expenseInfo:    { flex: 1 },
  expenseName:    { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 3 },
  expenseDate:    { fontSize: 11, color: COLORS.textSecondary },
  expenseRight:   { alignItems: 'flex-end' },
  expenseAmount:  { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  expenseCategory:{ fontSize: 11, color: COLORS.textSecondary },

  // ── Category Cards
  categoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    padding: 16, marginBottom: 10,
  },
  categoryTop:    { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryIcon:   { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  categoryInfo:   { flex: 1 },
  categoryName:   { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  categoryAmount: { fontSize: 12, color: COLORS.textSecondary },
  categoryPercent:{ fontSize: 13, fontWeight: '600' },

  // ── Progress Bar
  progressTrack: { height: 6, backgroundColor: COLORS.surfaceHigh, borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: 6, borderRadius: 3 },

  // ── Bottom Nav
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(22,26,35,0.97)',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    flexDirection: 'row', alignItems: 'flex-end',
    paddingBottom: 24, paddingTop: 12, paddingHorizontal: 20,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, color: COLORS.textMuted },
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