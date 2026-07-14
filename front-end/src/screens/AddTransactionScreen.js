/**
 * AddTransactionScreen.js
 * Pantalla reutilizable para registrar gastos o ingresos.
 *
 * Soporta:
 * - type="expense"
 * - type="income"
 */

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  Modal,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import DateTimePicker from '@react-native-community/datetimepicker';

import { createTransaction } from '../services/transactionService';
import { getCurrentUser } from '../services/authService';
import { getCurrencyByCode } from '../utils/currency';

function getExpenseCategories(COLORS) {
  return [
    {
      value: 'Comida',
      translationKey: 'food',
      icon: 'bag-handle-outline',
      color: COLORS.accent,
    },
    {
      value: 'Transporte',
      translationKey: 'transport',
      icon: 'car-outline',
      color: COLORS.blue,
    },
    {
      value: 'Supermercado',
      translationKey: 'supermarket',
      icon: 'cart-outline',
      color: COLORS.orange,
    },
    {
      value: 'Servicios',
      translationKey: 'services',
      icon: 'flash-outline',
      color: COLORS.purple,
    },
    {
      value: 'Salud',
      translationKey: 'health',
      icon: 'heart-outline',
      color: COLORS.pink,
    },
    {
      value: 'Educación',
      translationKey: 'education',
      icon: 'book-outline',
      color: COLORS.blue,
    },
    {
      value: 'Entretenimiento',
      translationKey: 'entertainment',
      icon: 'play-circle-outline',
      color: COLORS.orange,
    },
    {
      value: 'Ropa',
      translationKey: 'clothing',
      icon: 'shirt-outline',
      color: COLORS.pink,
    },
    {
      value: 'Tecnología',
      translationKey: 'technology',
      icon: 'hardware-chip-outline',
      color: COLORS.blue,
    },
    {
      value: 'Otros',
      translationKey: 'other',
      icon: 'grid-outline',
      color: COLORS.textMuted,
    },
  ];
}

function getIncomeCategories(COLORS) {
  return [
    {
      value: 'Salario',
      translationKey: 'salary',
      icon: 'briefcase-outline',
      color: COLORS.accent,
    },
    {
      value: 'Freelance',
      translationKey: 'freelance',
      icon: 'laptop-outline',
      color: COLORS.blue,
    },
    {
      value: 'Inversiones',
      translationKey: 'investments',
      icon: 'trending-up-outline',
      color: COLORS.purple,
    },
    {
      value: 'Ventas',
      translationKey: 'sales',
      icon: 'storefront-outline',
      color: COLORS.orange,
    },
    {
      value: 'Regalos',
      translationKey: 'gifts',
      icon: 'gift-outline',
      color: COLORS.pink,
    },
    {
      value: 'Reembolsos',
      translationKey: 'refunds',
      icon: 'return-down-back-outline',
      color: COLORS.yellow,
    },
    {
      value: 'Otros',
      translationKey: 'other',
      icon: 'grid-outline',
      color: COLORS.textMuted,
    },
  ];
}

const EXPENSE_METHODS = [
  {
    value: 'Efectivo',
    translationKey: 'cash',
    icon: 'cash-outline',
  },
  {
    value: 'Tarjeta de débito',
    translationKey: 'debitCard',
    icon: 'card-outline',
  },
  {
    value: 'Tarjeta de crédito',
    translationKey: 'creditCard',
    icon: 'card-outline',
  },
  {
    value: 'Transferencia bancaria',
    translationKey: 'bankTransfer',
    icon: 'swap-horizontal-outline',
  },
  {
    value: 'Billetera digital',
    translationKey: 'digitalWallet',
    icon: 'phone-portrait-outline',
  },
  {
    value: 'Pago sin contacto',
    translationKey: 'contactlessPayment',
    icon: 'wifi-outline',
  },
  {
    value: 'Otro',
    translationKey: 'other',
    icon: 'ellipsis-horizontal-outline',
  },
];

const INCOME_METHODS = [
  {
    value: 'Cuenta bancaria',
    translationKey: 'bankAccount',
    icon: 'business-outline',
  },
  {
    value: 'Transferencia',
    translationKey: 'transfer',
    icon: 'swap-horizontal-outline',
  },
  {
    value: 'Efectivo',
    translationKey: 'cash',
    icon: 'cash-outline',
  },
  {
    value: 'Billetera digital',
    translationKey: 'digitalWallet',
    icon: 'phone-portrait-outline',
  },
  {
    value: 'Depósito',
    translationKey: 'deposit',
    icon: 'download-outline',
  },
  {
    value: 'Otro',
    translationKey: 'other',
    icon: 'ellipsis-horizontal-outline',
  },
];

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

function FormField({
  label,
  error,
  children,
  styles,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label}
      </Text>

      {children}

      {!!error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
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

function getScreenConfig(
  type,
  COLORS,
  t
) {
  if (type === 'income') {
    return {
      title: t('addTransaction.income.title'),
      amountQuestion: t('addTransaction.income.amountQuestion'),
      descriptionPlaceholder: t('addTransaction.income.descriptionPlaceholder'),
      descriptionFallback: t('addTransaction.income.descriptionFallback'),
      categoryLabel: t('addTransaction.income.categoryLabel'),
      categoryPlaceholder: t('addTransaction.categoryPlaceholder'),
      methodLabel: t('addTransaction.income.methodLabel'),
      methodPlaceholder: t('methods.bankAccount'),
      notePlaceholder: t('addTransaction.income.notePlaceholder'),
      saveButton: t('addTransaction.income.saveButton'),
      savingText: t('addTransaction.income.savingText'),
      successTitle: t('addTransaction.income.successTitle'),
      successMessage: t('addTransaction.income.successMessage'),
      accentColor: COLORS.accent,
      amountBorder: `${COLORS.accent}38`,
      categories: getIncomeCategories(COLORS),
      methods: INCOME_METHODS,
    };
  }

  return {
    title: t('addTransaction.expense.title'),
    amountQuestion: t('addTransaction.expense.amountQuestion'),
    descriptionPlaceholder: t('addTransaction.expense.descriptionPlaceholder'),
    descriptionFallback: t('addTransaction.expense.descriptionFallback'),
    categoryLabel: t('addTransaction.expense.categoryLabel'),
    categoryPlaceholder: t('addTransaction.categoryPlaceholder'),
    methodLabel: t('addTransaction.expense.methodLabel'),
    methodPlaceholder: t('methods.cash'),
    notePlaceholder: t('addTransaction.expense.notePlaceholder'),
    saveButton: t('addTransaction.expense.saveButton'),
    savingText: t('addTransaction.expense.savingText'),
    successTitle: t('addTransaction.expense.successTitle'),
    successMessage: t('addTransaction.expense.successMessage'),
    accentColor: COLORS.accent,
    amountBorder: `${COLORS.red}33`,
    categories: getExpenseCategories(COLORS),
    methods: EXPENSE_METHODS,
  };
}

export default function AddTransactionScreen({
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

  const now = new Date();

  const [amount, setAmount] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [method, setMethod] =
    useState('');

  const [date, setDate] =
    useState(now);

  const [note, setNote] =
    useState('');

  const [currency, setCurrency] =
    useState(
      getCurrencyByCode('ARS')
    );

  const [amountError, setAmountError] =
    useState('');

  const [
    categoryError,
    setCategoryError,
  ] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  const [
    showTimePicker,
    setShowTimePicker,
  ] = useState(false);

  const [
    datePickerMode,
    setDatePickerMode,
  ] = useState('date');

  const [
    showCategoryModal,
    setShowCategoryModal,
  ] = useState(false);

  const [
    showMethodModal,
    setShowMethodModal,
  ] = useState(false);

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  const amountRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const loadCurrency = async () => {
        try {
          const userData =
            await getCurrentUser();

          const userCurrency =
            getCurrencyByCode(
              userData.preferred_currency ||
                'ARS'
            );

          setCurrency(userCurrency);
        } catch (error) {
          console.log(
            'Error cargando moneda:',
            error.message
          );
        }
      };

      loadCurrency();
    }, [])
  );

  const handlePressIn =
    useCallback(() => {
      Animated.spring(
        buttonScale,
        {
          toValue: 0.97,
          useNativeDriver: true,
        }
      ).start();
    }, [buttonScale]);

  const handlePressOut =
    useCallback(() => {
      Animated.spring(
        buttonScale,
        {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }
      ).start();
    }, [buttonScale]);

  const validateAmount = (value) => {
    setAmount(value);

    const numericValue = parseFloat(
      value.replace(',', '.')
    );

    if (!value.trim()) {
      setAmountError(
        t('addTransaction.errors.amountRequired')
      );
      return;
    }

    if (
      Number.isNaN(numericValue) ||
      numericValue <= 0
    ) {
      setAmountError(
        t('addTransaction.errors.amountPositive')
      );
      return;
    }

    setAmountError('');
  };

  const formattedDate =
    date.toLocaleDateString(
      getDateLocale(language),
      {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

  const formattedTime =
    date.toLocaleTimeString(
      getDateLocale(language),
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  const onDateChange = (
    event,
    selectedDate
  ) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const selectedCategory =
    config.categories.find(
      (item) =>
        item.value === category
    );

  const selectedMethod =
    config.methods.find(
      (item) =>
        item.value === method
    );

  const handleSave = async () => {
    if (loading) return;

    const numericAmount = parseFloat(
      amount.replace(',', '.')
    );

    let hasError = false;

    if (
      !amount.trim() ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setAmountError(
        !amount.trim()
          ? t('addTransaction.errors.amountRequired')
          : t('addTransaction.errors.amountPositive')
      );

      hasError = true;
    }

    if (!category) {
      setCategoryError(
        t('addTransaction.errors.categoryRequired')
      );

      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);

      const formattedTransactionDate =
        date
          .toISOString()
          .split('T')[0];

      /*
       * El backend actual solo guarda:
       * type, amount, category,
       * description, date y currency.
       *
       * method y note quedan preparados
       * visualmente para agregarlos más
       * adelante al modelo si lo desean.
       */
      const transactionData = {
        type: transactionType,
        amount: numericAmount,
        category,
        description:
          description.trim() ||
          config.descriptionFallback,
        date: formattedTransactionDate,
        currency: currency.code,
      };

      await createTransaction(
        transactionData
      );

      Alert.alert(
        config.successTitle,
        config.successMessage,
        [
          {
            text: t('common.accept'),
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'Error guardando transacción:',
        error.message
      );

      Alert.alert(
        t('addTransaction.saveErrorTitle'),
        error.message ||
          t('addTransaction.saveErrorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    !!amount &&
    !amountError &&
    !!category;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      keyboardVerticalOffset={0}
    >
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
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
          disabled={loading}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={
              loading
                ? COLORS.textMuted
                : COLORS.textPrimary
            }
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          {config.title}
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={
          styles.scrollContent
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.amountCard,
            {
              borderColor:
                config.amountBorder,
            },
          ]}
        >
          <Text style={styles.amountLabel}>
            {config.amountQuestion}
          </Text>

          <View style={styles.amountRow}>
            <Text
              style={styles.currencySymbol}
            >
              {currency.symbol}
            </Text>

            <TextInput
              ref={amountRef}
              style={[
                styles.amountInput,
                !!amountError &&
                  styles.amountInputError,
              ]}
              placeholder="0"
              placeholderTextColor={
                COLORS.textMuted
              }
              value={amount}
              onChangeText={
                validateAmount
              }
              keyboardType="decimal-pad"
              autoFocus
              editable={!loading}
            />
          </View>

          <Text style={styles.currencyCode}>
            {currency.code}
          </Text>

          {!!amountError && (
            <Text
              style={styles.amountError}
            >
              {amountError}
            </Text>
          )}
        </View>

        <FormField
          styles={styles}
          label={t('addTransaction.description')}
          error=""
        >
          <View
            style={styles.inputWrapper}
          >
            <TextInput
              style={styles.input}
              placeholder={
                config.descriptionPlaceholder
              }
              placeholderTextColor={
                COLORS.textMuted
              }
              value={description}
              onChangeText={
                setDescription
              }
              returnKeyType="next"
              editable={!loading}
              maxLength={255}
            />
          </View>
        </FormField>

        <FormField
          styles={styles}
          label={config.categoryLabel}
          error={categoryError}
        >
          <TouchableOpacity
            style={[
              styles.selectorButton,
              !!categoryError &&
                styles.selectorButtonError,
            ]}
            onPress={() => {
              setCategoryError('');
              setShowCategoryModal(true);
            }}
            activeOpacity={0.8}
            disabled={loading}
          >
            {category ? (
              <>
                <AppIcon
                  name={
                    selectedCategory?.icon ||
                    'grid-outline'
                  }
                  size={18}
                  color={
                    selectedCategory?.color ||
                    COLORS.accent
                  }
                />

                <Text
                  style={
                    styles.selectorValue
                  }
                >
                  {t(`categories.${selectedCategory?.translationKey || 'other'}`)}
                </Text>
              </>
            ) : (
              <Text
                style={
                  styles.selectorPlaceholder
                }
              >
                {
                  config.categoryPlaceholder
                }
              </Text>
            )}

            <AppIcon
              name="chevron-down"
              size={16}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </FormField>

        <FormField
          styles={styles}
          label={config.methodLabel}
          error=""
        >
          <TouchableOpacity
            style={styles.selectorButton}
            onPress={() =>
              setShowMethodModal(true)
            }
            activeOpacity={0.8}
            disabled={loading}
          >
            {method ? (
              <>
                <AppIcon
                  name={
                    selectedMethod?.icon ||
                    'cash-outline'
                  }
                  size={18}
                  color={COLORS.blue}
                />

                <Text
                  style={
                    styles.selectorValue
                  }
                >
                  {t(`methods.${selectedMethod?.translationKey || 'other'}`)}
                </Text>
              </>
            ) : (
              <Text
                style={
                  styles.selectorPlaceholder
                }
              >
                {
                  config.methodPlaceholder
                }
              </Text>
            )}

            <AppIcon
              name="chevron-down"
              size={16}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </FormField>

        <Text style={styles.label}>
          {t('addTransaction.dateTime')}
        </Text>

        <View style={styles.dateRow}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              { flex: 1.5 },
            ]}
            onPress={() => {
              if (
                Platform.OS ===
                'android'
              ) {
                setShowTimePicker(
                  false
                );

                setShowDatePicker(
                  true
                );
              } else {
                setDatePickerMode(
                  'date'
                );

                setShowDatePicker(
                  true
                );
              }
            }}
            activeOpacity={0.8}
            disabled={loading}
          >
            <AppIcon
              name="calendar-outline"
              size={16}
              color={COLORS.accent}
            />

            <Text
              style={styles.dateButtonText}
              numberOfLines={1}
            >
              {formattedDate}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => {
              if (
                Platform.OS ===
                'android'
              ) {
                setShowDatePicker(
                  false
                );

                setShowTimePicker(
                  true
                );
              } else {
                setDatePickerMode(
                  'time'
                );

                setShowDatePicker(
                  true
                );
              }
            }}
            activeOpacity={0.8}
            disabled={loading}
          >
            <AppIcon
              name="time-outline"
              size={16}
              color={COLORS.blue}
            />

            <Text
              style={styles.dateButtonText}
            >
              {formattedTime}
            </Text>
          </TouchableOpacity>
        </View>

        {Platform.OS === 'android' &&
          showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

        {Platform.OS === 'android' &&
          showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={onDateChange}
            />
          )}

        {Platform.OS === 'ios' &&
          showDatePicker && (
            <View
              style={
                styles.iosPickerWrapper
              }
            >
              <DateTimePicker
                value={date}
                mode={datePickerMode}
                display="spinner"
                onChange={onDateChange}
                textColor={
                  COLORS.textPrimary
                }
                locale={getDateLocale(language)}
                maximumDate={
                  datePickerMode ===
                  'date'
                    ? new Date()
                    : undefined
                }
              />

              <TouchableOpacity
                style={
                  styles.iosPickerClose
                }
                onPress={() =>
                  setShowDatePicker(
                    false
                  )
                }
              >
                <Text
                  style={
                    styles
                      .iosPickerCloseText
                  }
                >
                  {t('common.done')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        <FormField
          styles={styles}
          label={t('addTransaction.noteOptional')}
          error=""
        >
          <View
            style={[
              styles.inputWrapper,
              styles.noteInputWrapper,
            ]}
          >
            <TextInput
              style={[
                styles.input,
                styles.noteInput,
              ]}
              placeholder={
                config.notePlaceholder
              }
              placeholderTextColor={
                COLORS.textMuted
              }
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              editable={!loading}
              maxLength={500}
            />
          </View>
        </FormField>

        <Animated.View
          style={[
            styles.saveButtonWrapper,
            {
              transform: [
                {
                  scale:
                    buttonScale,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isValid ||
                loading) &&
                styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={
              !isValid ||
              loading
            }
            activeOpacity={0.9}
          >
            {loading ? (
              <>
                <ActivityIndicator
                  size="small"
                  color={COLORS.textPrimary}
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {
                    config.savingText
                  }
                </Text>
              </>
            ) : (
              <>
                <AppIcon
                  name="checkmark-circle-outline"
                  size={20}
                  color={COLORS.textPrimary}
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {
                    config.saveButton
                  }
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setShowCategoryModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View
              style={styles.modalHandle}
            />

            <Text style={styles.modalTitle}>
              {t('addTransaction.category')}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
            >
              {config.categories.map(
                (item) => {
                  const isSelected =
                    category ===
                    item.value;

                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.modalItem,
                        isSelected &&
                          styles.modalItemActive,
                      ]}
                      onPress={() => {
                        setCategory(
                          item.value
                        );

                        setCategoryError(
                          ''
                        );

                        setShowCategoryModal(
                          false
                        );
                      }}
                      activeOpacity={0.75}
                    >
                      <View
                        style={[
                          styles.modalItemIcon,
                          {
                            backgroundColor: `${item.color}18`,
                          },
                        ]}
                      >
                        <AppIcon
                          name={item.icon}
                          size={20}
                          color={item.color}
                        />
                      </View>

                      <Text
                        style={[
                          styles.modalItemText,
                          isSelected && {
                            color:
                              COLORS.accent,
                          },
                        ]}
                      >
                        {t(`categories.${item.translationKey}`)}
                      </Text>

                      {isSelected && (
                        <AppIcon
                          name="checkmark-circle"
                          size={18}
                          color={
                            COLORS.accent
                          }
                        />
                      )}
                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() =>
                setShowCategoryModal(
                  false
                )
              }
            >
              <Text
                style={
                  styles.modalCancelText
                }
              >
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMethodModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setShowMethodModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View
              style={styles.modalHandle}
            />

            <Text style={styles.modalTitle}>
              {config.methodLabel}
            </Text>

            {config.methods.map(
              (item) => {
                const isSelected =
                  method === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.modalItem,
                      isSelected &&
                        styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setMethod(item.value);

                      setShowMethodModal(
                        false
                      );
                    }}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.modalItemIcon,
                        {
                          backgroundColor:
                            `${COLORS.blue}1F`,
                        },
                      ]}
                    >
                      <AppIcon
                        name={item.icon}
                        size={20}
                        color={COLORS.blue}
                      />
                    </View>

                    <Text
                      style={[
                        styles.modalItemText,
                        isSelected && {
                          color:
                            COLORS.accent,
                        },
                      ]}
                    >
                      {t(`methods.${item.translationKey}`)}
                    </Text>

                    {isSelected && (
                      <AppIcon
                        name="checkmark-circle"
                        size={18}
                        color={
                          COLORS.accent
                        }
                      />
                    )}
                  </TouchableOpacity>
                );
              }
            )}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() =>
                setShowMethodModal(false)
              }
            >
              <Text
                style={
                  styles.modalCancelText
                }
              >
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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

  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  amountCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },

  amountLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },

  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  currencyCode: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.textMuted,
  },

  amountInput: {
    fontSize: 46,
    fontWeight: '800',
    color: COLORS.textPrimary,
    minWidth: 100,
    maxWidth: '80%',
    textAlign: 'center',
    letterSpacing: -1,
  },

  amountInputError: {
    color: COLORS.error,
  },

  amountError: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 8,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      COLORS.surfaceHigh,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 52,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  noteInputWrapper: {
    height: 'auto',
    minHeight: 76,
    alignItems: 'flex-start',
  },

  noteInput: {
    paddingVertical: 14,
    minHeight: 74,
  },

  errorText: {
    fontSize: 11,
    color: COLORS.error,
    marginTop: 5,
  },

  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor:
      COLORS.surfaceHigh,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 52,
  },

  selectorButtonError: {
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  selectorValue: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },

  selectorPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textMuted,
  },

  dateRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor:
      COLORS.surfaceHigh,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 52,
  },

  dateButtonText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  iosPickerWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
    overflow: 'hidden',
  },

  iosPickerClose: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  iosPickerCloseText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.accent,
  },

  saveButtonWrapper: {
    marginTop: 8,
  },

  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,

    shadowColor: COLORS.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  saveButtonDisabled: {
    backgroundColor:
      COLORS.accentDim,
    shadowOpacity: 0,
    elevation: 0,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0,0,0,0.6)',
  },

  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '75%',
  },

  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  modalItemActive: {
    backgroundColor:
      `${COLORS.accent}05`,
  },

  modalItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  modalCancel: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor:
      COLORS.surfaceHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  });
}