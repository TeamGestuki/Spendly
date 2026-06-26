import React, { useEffect, useState } from 'react';
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

import {
  CURRENCIES,
  getPreferredCurrency,
  setPreferredCurrency,
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
  blue: '#60A5FA',
};

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function CurrencyItem({
  currency,
  selected,
  onPress,
  isLast,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.currencyItem,
        selected && styles.currencyItemSelected,
        isLast && styles.currencyItemLast,
      ]}
      onPress={onPress}
      activeOpacity={0.78}
    >
      <View
        style={[
          styles.currencyIcon,
          selected && styles.currencyIconSelected,
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
                Actual
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.currencyName}>
          {currency.name}
        </Text>
      </View>

      <View style={styles.previewBox}>
        <Text style={styles.previewText}>
          {formatMoney(1250, currency)}
        </Text>
      </View>

      {selected ? (
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

export default function CurrencySettingsScreen({ navigation }) {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCode, setSavingCode] = useState(null);

  useEffect(() => {
    loadCurrency();
  }, []);

  const loadCurrency = async () => {
    try {
      setLoading(true);

      const currency = await getPreferredCurrency();

      setSelectedCurrency(currency);
    } catch (error) {
      console.log('Error cargando moneda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCurrency = async (currency) => {
    if (savingCode) return;

    try {
      setSavingCode(currency.code);

      const savedCurrency =
        await setPreferredCurrency(currency.code);

      setSelectedCurrency(savedCurrency);
    } catch (error) {
      console.log('Error guardando moneda:', error);
    } finally {
      setSavingCode(null);
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          Moneda principal
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color={COLORS.accent}
          />
          <Text style={styles.loadingText}>
            Cargando monedas...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
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
              Elegí tu moneda
            </Text>

            <Text style={styles.heroText}>
              Esta moneda se usará como referencia para mostrar gastos,
              reportes, presupuestos y estadísticas dentro de Spendly.
            </Text>

            {selectedCurrency && (
              <View style={styles.currentCurrencyBox}>
                <Text style={styles.currentCurrencyLabel}>
                  Moneda actual
                </Text>

                <Text style={styles.currentCurrencyValue}>
                  {selectedCurrency.code} — {selectedCurrency.name}
                </Text>

                <Text style={styles.currentCurrencyPreview}>
                  Ejemplo: {formatMoney(1250, selectedCurrency)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            Monedas disponibles
          </Text>

          <View style={styles.card}>
            {CURRENCIES.map((currency, index) => {
              const selected =
                selectedCurrency?.code === currency.code;

              return (
                <CurrencyItem
                  key={currency.code}
                  currency={currency}
                  selected={selected}
                  isLast={index === CURRENCIES.length - 1}
                  onPress={() => handleSelectCurrency(currency)}
                />
              );
            })}
          </View>

          <Text style={styles.infoText}>
            Por ahora esta preferencia se guarda en este dispositivo.
            Más adelante se podrá sincronizar con tu cuenta para mantenerla
            en todos tus dispositivos.
          </Text>

          {!!savingCode && (
            <Text style={styles.savingText}>
              Guardando {savingCode}...
            </Text>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.bg,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
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
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.16)',
    padding: 22,
    marginBottom: 24,
    alignItems: 'center',
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.accentDim,
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
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.20)',
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
    backgroundColor: COLORS.surface,
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
    borderBottomColor: COLORS.border,
    gap: 12,
  },

  currencyItemSelected: {
    backgroundColor: 'rgba(74,222,128,0.06)',
  },

  currencyItemLast: {
    borderBottomWidth: 0,
  },

  currencyIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  currencyIconSelected: {
    backgroundColor: COLORS.accentDim,
    borderColor: 'rgba(74,222,128,0.25)',
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
    backgroundColor: COLORS.accentDim,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.25)',
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

  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  savingText: {
    marginTop: 14,
    fontSize: 12,
    color: COLORS.accent,
    textAlign: 'center',
    fontWeight: '700',
  },
});