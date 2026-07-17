import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { updateTransaction } from '../services/transactionService';

const EXPENSE_CATEGORIES = [
  { key: 'food', storage: 'Comida', icon: 'bag-handle-outline' },
  { key: 'transport', storage: 'Transporte', icon: 'car-outline' },
  { key: 'supermarket', storage: 'Supermercado', icon: 'cart-outline' },
  { key: 'services', storage: 'Servicios', icon: 'flash-outline' },
  { key: 'health', storage: 'Salud', icon: 'heart-outline' },
  { key: 'education', storage: 'Educación', icon: 'book-outline' },
  { key: 'entertainment', storage: 'Entretenimiento', icon: 'play-circle-outline' },
  { key: 'clothing', storage: 'Ropa', icon: 'shirt-outline' },
  { key: 'technology', storage: 'Tecnología', icon: 'hardware-chip-outline' },
  { key: 'other', storage: 'Otros', icon: 'grid-outline' },
];

const INCOME_CATEGORIES = [
  { key: 'salary', storage: 'Salario', icon: 'briefcase-outline' },
  { key: 'freelance', storage: 'Freelance', icon: 'laptop-outline' },
  { key: 'investments', storage: 'Inversiones', icon: 'trending-up-outline' },
  { key: 'sales', storage: 'Ventas', icon: 'storefront-outline' },
  { key: 'gifts', storage: 'Regalos', icon: 'gift-outline' },
  { key: 'refunds', storage: 'Reembolsos', icon: 'return-down-back-outline' },
  { key: 'other', storage: 'Otros', icon: 'grid-outline' },
];

const PAYMENT_METHODS = [
  { value: 'cash', translationKey: 'cash', icon: 'cash-outline' },
  { value: 'debit_card', translationKey: 'debitCard', icon: 'card-outline' },
  { value: 'credit_card', translationKey: 'creditCard', icon: 'card-outline' },
  { value: 'transfer', translationKey: 'transfer', icon: 'swap-horizontal-outline' },
  { value: 'bank_account', translationKey: 'bankAccount', icon: 'business-outline' },
  { value: 'digital_wallet', translationKey: 'digitalWallet', icon: 'phone-portrait-outline' },
  { value: 'contactless_payment', translationKey: 'contactlessPayment', icon: 'wifi-outline' },
  { value: 'deposit', translationKey: 'deposit', icon: 'download-outline' },
  { value: 'other', translationKey: 'other', icon: 'ellipsis-horizontal-outline' },
];

function parseLocalDate(value) {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}

function formatLocalDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeCategoryKey(category, categories) {
  return (
    categories.find((item) => item.storage === category)?.key ||
    categories.find((item) => item.key === category)?.key ||
    'other'
  );
}

export default function EditTransactionScreen({ navigation, route }) {
  const transaction = route?.params?.transaction;
  const { colors: COLORS, isDark } = useTheme();
  const { language, t } = useLanguage();
  const styles = useMemo(() => createStyles(COLORS), [COLORS]);

  const type = transaction?.type || 'expense';
  const categories =
    type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const [amount, setAmount] = useState(String(transaction?.amount ?? ''));
  const [description, setDescription] =
    useState(transaction?.description || '');
  const [categoryKey, setCategoryKey] = useState(
    normalizeCategoryKey(transaction?.category, categories)
  );
  const [paymentMethod, setPaymentMethod] =
    useState(transaction?.payment_method || 'other');
  const [currency, setCurrency] =
    useState(transaction?.currency || 'ARS');
  const [date, setDate] =
    useState(parseLocalDate(transaction?.date));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!transaction?.id) {
    return (
      <View style={styles.flex}>
        <View style={styles.center}>
          <Text style={styles.helperText}>
            {t('editTransaction.missing')}
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const selectedCategory =
    categories.find((item) => item.key === categoryKey) ||
    categories[categories.length - 1];

  const saveChanges = async () => {
    if (loading) return;

    const numericAmount = Number(amount.replace(',', '.'));

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert(t('common.error'), t('editTransaction.errors.amount'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(t('common.error'), t('editTransaction.errors.description'));
      return;
    }

    try {
      setLoading(true);

      await updateTransaction(transaction.id, {
        amount: numericAmount,
        category: selectedCategory.storage,
        description: description.trim(),
        date: formatLocalDate(date),
        currency: currency.trim().toUpperCase() || 'ARS',
        payment_method: paymentMethod || 'other',
      });

      Alert.alert(
        t('editTransaction.successTitle'),
        t('editTransaction.successText'),
        [{ text: t('common.accept'), onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error.message || t('editTransaction.errors.save')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.topTitle}>
          {type === 'income'
            ? t('editTransaction.incomeTitle')
            : t('editTransaction.expenseTitle')}
        </Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="create-outline" size={27} color={COLORS.accent} />
          </View>
          <Text style={styles.heroTitle}>{t('editTransaction.heroTitle')}</Text>
          <Text style={styles.heroText}>{t('editTransaction.heroText')}</Text>
        </View>

        <Text style={styles.label}>{t('editTransaction.amount')}</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={styles.label}>{t('addTransaction.description')}</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          maxLength={255}
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={styles.label}>{t('addTransaction.category')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {categories.map((item) => {
            const selected = item.key === categoryKey;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => setCategoryKey(item.key)}
              >
                <Ionicons
                  name={item.icon}
                  size={15}
                  color={selected ? COLORS.accent : COLORS.textSecondary}
                />
                <Text
                  style={[styles.chipText, selected && styles.chipTextActive]}
                >
                  {t(`categories.${item.key}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>
          {t('editTransaction.paymentMethod')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {PAYMENT_METHODS.map((item) => {
            const selected = item.value === paymentMethod;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.chip, selected && styles.chipActive]}
                onPress={() => setPaymentMethod(item.value)}
              >
                <Ionicons
                  name={item.icon}
                  size={15}
                  color={selected ? COLORS.accent : COLORS.textSecondary}
                />
                <Text
                  style={[styles.chipText, selected && styles.chipTextActive]}
                >
                  {t(`methods.${item.translationKey}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>{t('editTransaction.date')}</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={18} color={COLORS.accent} />
          <Text style={styles.selectorText}>
            {date.toLocaleDateString(language === 'es' ? 'es-AR' : undefined)}
          </Text>
          <Ionicons name="chevron-down" size={17} color={COLORS.textMuted} />
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerCard}>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
              textColor={COLORS.textPrimary}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.doneButtonText}>{t('common.done')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>{t('editTransaction.currency')}</Text>
        <TextInput
          style={styles.input}
          value={currency}
          onChangeText={(value) =>
            setCurrency(value.toUpperCase().slice(0, 3))
          }
          autoCapitalize="characters"
          maxLength={3}
          placeholder="ARS"
          placeholderTextColor={COLORS.textMuted}
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={saveChanges}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.buttonText || COLORS.bg}
            />
          ) : (
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color={COLORS.buttonText || COLORS.bg}
            />
          )}
          <Text style={styles.primaryButtonText}>
            {loading
              ? t('editTransaction.saving')
              : t('editTransaction.save')}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Spendly © 2026</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: COLORS.bg },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: COLORS.bg,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    topTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    heroCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 20,
      alignItems: 'center',
      marginBottom: 22,
    },
    heroIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    heroTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: COLORS.textPrimary,
      textAlign: 'center',
    },
    heroText: {
      marginTop: 5,
      fontSize: 12,
      lineHeight: 18,
      color: COLORS.textSecondary,
      textAlign: 'center',
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
      marginTop: 2,
    },
    input: {
      minHeight: 52,
      borderRadius: 14,
      backgroundColor: COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      fontSize: 15,
      color: COLORS.textPrimary,
      marginBottom: 18,
    },
    chipRow: { gap: 8, paddingBottom: 18 },
    chip: {
      minHeight: 40,
      borderRadius: 999,
      paddingHorizontal: 14,
      backgroundColor: COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },
    chipActive: {
      backgroundColor: COLORS.accentDim,
      borderColor: COLORS.accent,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.textSecondary,
    },
    chipTextActive: { color: COLORS.accent },
    selector: {
      minHeight: 52,
      borderRadius: 14,
      backgroundColor: COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      marginBottom: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    selectorText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
    datePickerCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: 'hidden',
      marginTop: -8,
      marginBottom: 18,
    },
    doneButton: {
      alignSelf: 'flex-end',
      paddingHorizontal: 18,
      paddingBottom: 14,
      paddingTop: 4,
    },
    doneButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: COLORS.accent,
    },
    primaryButton: {
      minHeight: 56,
      borderRadius: 16,
      backgroundColor: COLORS.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      marginTop: 8,
    },
    buttonDisabled: { opacity: 0.65 },
    primaryButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.buttonText || COLORS.bg,
    },
    footer: {
      marginTop: 28,
      textAlign: 'center',
      color: COLORS.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    helperText: {
      fontSize: 14,
      lineHeight: 21,
      color: COLORS.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
  });
}
