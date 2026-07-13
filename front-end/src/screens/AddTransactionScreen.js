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
import DateTimePicker from '@react-native-community/datetimepicker';

import { createTransaction } from '../services/transactionService';
import { getCurrentUser } from '../services/authService';
import { getCurrencyByCode } from '../utils/currency';

function getExpenseCategories(COLORS) {
  return [
    {
      label: 'Comida',
      icon: 'bag-handle-outline',
      color: COLORS.accent,
    },
    {
      label: 'Transporte',
      icon: 'car-outline',
      color: COLORS.blue,
    },
    {
      label: 'Supermercado',
      icon: 'cart-outline',
      color: COLORS.orange,
    },
    {
      label: 'Servicios',
      icon: 'flash-outline',
      color: COLORS.purple,
    },
    {
      label: 'Salud',
      icon: 'heart-outline',
      color: COLORS.pink,
    },
    {
      label: 'Educación',
      icon: 'book-outline',
      color: COLORS.blue,
    },
    {
      label: 'Entretenimiento',
      icon: 'play-circle-outline',
      color: COLORS.orange,
    },
    {
      label: 'Ropa',
      icon: 'shirt-outline',
      color: COLORS.pink,
    },
    {
      label: 'Tecnología',
      icon: 'hardware-chip-outline',
      color: COLORS.blue,
    },
    {
      label: 'Otros',
      icon: 'grid-outline',
      color: COLORS.textMuted,
    },
  ];
}

function getIncomeCategories(COLORS) {
  return [
    {
      label: 'Salario',
      icon: 'briefcase-outline',
      color: COLORS.accent,
    },
    {
      label: 'Freelance',
      icon: 'laptop-outline',
      color: COLORS.blue,
    },
    {
      label: 'Inversiones',
      icon: 'trending-up-outline',
      color: COLORS.purple,
    },
    {
      label: 'Ventas',
      icon: 'storefront-outline',
      color: COLORS.orange,
    },
    {
      label: 'Regalos',
      icon: 'gift-outline',
      color: COLORS.pink,
    },
    {
      label: 'Reembolsos',
      icon: 'return-down-back-outline',
      color: COLORS.yellow,
    },
    {
      label: 'Otros',
      icon: 'grid-outline',
      color: COLORS.textMuted,
    },
  ];
}

const EXPENSE_METHODS = [
  {
    label: 'Efectivo',
    icon: 'cash-outline',
  },
  {
    label: 'Tarjeta de débito',
    icon: 'card-outline',
  },
  {
    label: 'Tarjeta de crédito',
    icon: 'card-outline',
  },
  {
    label: 'Transferencia',
    icon: 'swap-horizontal-outline',
  },
  {
    label: 'Mercado Pago',
    icon: 'phone-portrait-outline',
  },
  {
    label: 'Otro',
    icon: 'ellipsis-horizontal-outline',
  },
];

const INCOME_METHODS = [
  {
    label: 'Transferencia bancaria',
    icon: 'swap-horizontal-outline',
  },
  {
    label: 'Efectivo',
    icon: 'cash-outline',
  },
  {
    label: 'Mercado Pago',
    icon: 'phone-portrait-outline',
  },
  {
    label: 'Depósito',
    icon: 'business-outline',
  },
  {
    label: 'Otro',
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

function getScreenConfig(
  type,
  COLORS
) {
  if (type === 'income') {
    return {
      title: 'Nuevo ingreso',
      amountQuestion: '¿Cuánto recibiste?',
      descriptionPlaceholder:
        'Ej: Sueldo, venta, trabajo freelance...',
      descriptionFallback:
        'Ingreso sin descripción',
      categoryLabel:
        'Categoría del ingreso *',
      categoryPlaceholder:
        'Seleccioná una categoría',
      methodLabel:
        'Medio de recepción',
      methodPlaceholder:
        'Transferencia bancaria',
      notePlaceholder:
        'Agregá una nota sobre el ingreso...',
      saveButton: 'Guardar ingreso',
      savingText:
        'Guardando ingreso...',
      successTitle:
        'Ingreso registrado',
      successMessage:
        'El ingreso se guardó correctamente.',
      accentColor: COLORS.accent,
      amountBorder:
        'rgba(74,222,128,0.22)',
      categories:
        getIncomeCategories(COLORS),
      methods: INCOME_METHODS,
    };
  }

  return {
    title: 'Nuevo gasto',
    amountQuestion:
      '¿Cuánto gastaste?',
    descriptionPlaceholder:
      "Ej: McDonald's, Uber, Netflix...",
    descriptionFallback:
      'Gasto sin descripción',
    categoryLabel:
      'Categoría del gasto *',
    categoryPlaceholder:
      'Seleccioná una categoría',
    methodLabel: 'Método de pago',
    methodPlaceholder: 'Efectivo',
    notePlaceholder:
      'Agregá una nota sobre el gasto...',
    saveButton: 'Guardar gasto',
    savingText:
      'Guardando gasto...',
    successTitle:
      'Gasto registrado',
    successMessage:
      'El gasto se guardó correctamente.',
    accentColor: COLORS.accent,
    amountBorder:
      'rgba(248,113,113,0.20)',
    categories:
      getExpenseCategories(COLORS),
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
      COLORS
    ),
  [transactionType, COLORS]
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
        'El monto es obligatorio'
      );
      return;
    }

    if (
      Number.isNaN(numericValue) ||
      numericValue <= 0
    ) {
      setAmountError(
        'El monto debe ser mayor a 0'
      );
      return;
    }

    setAmountError('');
  };

  const formattedDate =
    date.toLocaleDateString(
      'es-AR',
      {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );

  const formattedTime =
    date.toLocaleTimeString(
      'es-AR',
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
        item.label === category
    );

  const selectedMethod =
    config.methods.find(
      (item) =>
        item.label === method
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
          ? 'El monto es obligatorio'
          : 'El monto debe ser mayor a 0'
      );

      hasError = true;
    }

    if (!category) {
      setCategoryError(
        'Seleccioná una categoría'
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
            text: 'Aceptar',
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
        'No se pudo guardar',
        error.message ||
          'Ocurrió un error al registrar la transacción.'
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
          label="Descripción"
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
                  {category}
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
                  {method}
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
          Fecha y hora
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
                locale="es-AR"
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
                  Listo
                </Text>
              </TouchableOpacity>
            </View>
          )}

        <FormField
          styles={styles}
          label="Nota (opcional)"
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
                  color="#0D1A12"
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
                  color="#0D1A12"
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
              Categoría
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
                    item.label;

                  return (
                    <TouchableOpacity
                      key={item.label}
                      style={[
                        styles.modalItem,
                        isSelected &&
                          styles.modalItemActive,
                      ]}
                      onPress={() => {
                        setCategory(
                          item.label
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
                        {item.label}
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
                Cancelar
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
                  method === item.label;

                return (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.modalItem,
                      isSelected &&
                        styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setMethod(item.label);

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
                            'rgba(96,165,250,0.12)',
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
                      {item.label}
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
                Cancelar
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
    color: '#0D1A12',
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
      'rgba(74,222,128,0.02)',
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