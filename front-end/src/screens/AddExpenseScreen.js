/**
 * AddExpenseScreen.js
 * Pantalla para registrar un nuevo gasto en Spendly.
 */

import React, { useState, useRef, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createTransaction } from '../services/transactionService';

// ─── Paleta ───────────────────────────────────────────────────────────────────
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
  error:         '#F87171',
};

// ─── Opciones de categoría ────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Comida',          icon: 'bag-handle-outline',   color: COLORS.accent  },
  { label: 'Transporte',      icon: 'car-outline',           color: COLORS.blue    },
  { label: 'Supermercado',    icon: 'cart-outline',          color: COLORS.orange  },
  { label: 'Servicios',       icon: 'flash-outline',         color: COLORS.purple  },
  { label: 'Salud',           icon: 'heart-outline',         color: '#F472B4'      },
  { label: 'Educación',       icon: 'book-outline',          color: COLORS.blue    },
  { label: 'Entretenimiento', icon: 'play-circle-outline',   color: COLORS.orange  },
  { label: 'Ropa',            icon: 'shirt-outline',         color: '#F472B4'      },
  { label: 'Tecnología',      icon: 'hardware-chip-outline', color: COLORS.blue    },
  { label: 'Otros',           icon: 'grid-outline',          color: COLORS.textMuted },
];

// ─── Métodos de pago ──────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { label: 'Efectivo',           icon: 'cash-outline'          },
  { label: 'Tarjeta de débito',  icon: 'card-outline'          },
  { label: 'Tarjeta de crédito', icon: 'card-outline'          },
  { label: 'Transferencia',      icon: 'swap-horizontal-outline'},
  { label: 'Mercado Pago',       icon: 'phone-portrait-outline' },
  { label: 'Otro',               icon: 'ellipsis-horizontal-outline' },
];

function AppIcon({ name, size = 20, color = COLORS.textSecondary }) {
  return <Ionicons name={name} size={size} color={color} />;
}

// ─── Componente de campo de texto reutilizable ────────────────────────────────
function FormField({ label, error, children }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ─── Pantalla ─────────────────────────────────────────────────────────────────
export default function AddExpenseScreen({ navigation }) {
  const now = new Date();

  // ── Campos del formulario
  const [amount,        setAmount]        = useState('');
  const [description,   setDescription]   = useState('');
  const [category,      setCategory]      = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date,          setDate]          = useState(now);
  const [note,          setNote]          = useState('');

  // ── Errores
  const [amountError,   setAmountError]   = useState('');
  const [categoryError, setCategoryError] = useState('');

  // ── UI state
  const [loading,          setLoading]          = useState(false);
  const [showDatePicker,   setShowDatePicker]   = useState(false);
  const [showTimePicker,   setShowTimePicker]   = useState(false);
  const [datePickerMode,   setDatePickerMode]   = useState('date'); // iOS usa mode en el mismo picker
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal,  setShowPaymentModal]  = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;
  const amountRef   = useRef(null);

  // ── Animación del botón
  const handlePressIn  = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
  }, [buttonScale]);
  const handlePressOut = useCallback(() => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  }, [buttonScale]);

  // ── Validaciones
  const validateAmount = (val) => {
    setAmount(val);
    const n = parseFloat(val.replace(',', '.'));
    if (!val.trim())         setAmountError('El monto es obligatorio');
    else if (isNaN(n) || n <= 0) setAmountError('El monto debe ser mayor a 0');
    else                     setAmountError('');
  };

  // ── Formato fecha / hora para mostrar
  const formattedDate = date.toLocaleDateString('es-AR', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
  });

  // ── Cambio en DateTimePicker (Android/iOS)
  const onDateChange = (event, selected) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
    if (selected) setDate(selected);
  };

  // ── Guardar gasto
  const handleSave = async () => {
    // Validar monto
    const n = parseFloat(amount.replace(',', '.'));
    if (!amount.trim() || isNaN(n) || n <= 0) {
      setAmountError(!amount.trim() ? 'El monto es obligatorio' : 'El monto debe ser mayor a 0');
      return;
    }
    // Validar categoría
    if (!category) {
      setCategoryError('Seleccioná una categoría');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];

            const newExpense = {
            type: 'expense',
            amount: n,
            category,
            description: description.trim() || 'Gasto sin descripción',
            date: formattedDate,
            currency: 'ARS',
            };

      await createTransaction(newExpense);

      // Vuelve a ExpensesScreen; useFocusEffect recargará la lista
      navigation.goBack();
    } catch (e) {
      console.log('Error guardando gasto:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const isValid = !!amount && !amountError && !!category;

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppIcon name="chevron-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Nuevo gasto</Text>
        <View style={{ width: 40 }} />{/* Spacer para centrar título */}
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Monto (campo principal) ─────────────────────────────────── */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>¿Cuánto gastaste?</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              ref={amountRef}
              style={[styles.amountInput, !!amountError && styles.amountInputError]}
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
              value={amount}
              onChangeText={validateAmount}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
          {!!amountError && <Text style={styles.amountError}>{amountError}</Text>}
        </View>

        {/* ── Descripción ─────────────────────────────────────────────── */}
        <FormField label="Descripción" error="">
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ej: McDonald's, Uber, Netflix..."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              returnKeyType="next"
            />
          </View>
        </FormField>

        {/* ── Categoría ────────────────────────────────────────────────── */}
        <FormField label="Categoría *" error={categoryError}>
          <TouchableOpacity
            style={[styles.selectorBtn, !!categoryError && styles.selectorBtnError]}
            onPress={() => { setShowCategoryModal(true); setCategoryError(''); }}
            activeOpacity={0.8}
          >
            {category ? (
              <>
                <AppIcon
                  name={CATEGORIES.find(c => c.label === category)?.icon ?? 'grid-outline'}
                  size={18}
                  color={CATEGORIES.find(c => c.label === category)?.color ?? COLORS.accent}
                />
                <Text style={styles.selectorValue}>{category}</Text>
              </>
            ) : (
              <Text style={styles.selectorPlaceholder}>Seleccioná una categoría</Text>
            )}
            <AppIcon name="chevron-down" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </FormField>

        {/* ── Método de pago ───────────────────────────────────────────── */}
        <FormField label="Método de pago" error="">
          <TouchableOpacity
            style={styles.selectorBtn}
            onPress={() => setShowPaymentModal(true)}
            activeOpacity={0.8}
          >
            {paymentMethod ? (
              <>
                <AppIcon
                  name={PAYMENT_METHODS.find(p => p.label === paymentMethod)?.icon ?? 'card-outline'}
                  size={18}
                  color={COLORS.blue}
                />
                <Text style={styles.selectorValue}>{paymentMethod}</Text>
              </>
            ) : (
              <Text style={styles.selectorPlaceholder}>Efectivo (por defecto)</Text>
            )}
            <AppIcon name="chevron-down" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </FormField>

        {/* ── Fecha y hora ─────────────────────────────────────────────── */}
        <Text style={styles.label}>Fecha y hora</Text>
        <View style={styles.dateRow}>
          {/* Fecha */}
          <TouchableOpacity
            style={[styles.dateBtn, { flex: 1.5 }]}
            onPress={() => {
              if (Platform.OS === 'android') {
                setShowTimePicker(false);
                setShowDatePicker(true);
              } else {
                setDatePickerMode('date');
                setShowDatePicker(true);
              }
            }}
            activeOpacity={0.8}
          >
            <AppIcon name="calendar-outline" size={16} color={COLORS.accent} />
            <Text style={styles.dateBtnText}>{formattedDate}</Text>
          </TouchableOpacity>

          {/* Hora */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
                setShowTimePicker(true);
              } else {
                setDatePickerMode('time');
                setShowDatePicker(true);
              }
            }}
            activeOpacity={0.8}
          >
            <AppIcon name="time-outline" size={16} color={COLORS.blue} />
            <Text style={styles.dateBtnText}>{formattedTime}</Text>
          </TouchableOpacity>
        </View>

        {/* DateTimePicker — Android: muestra nativo */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
        {Platform.OS === 'android' && showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* DateTimePicker — iOS: modal inline */}
        {Platform.OS === 'ios' && showDatePicker && (
          <View style={styles.iosPickerWrapper}>
            <DateTimePicker
              value={date}
              mode={datePickerMode}
              display="spinner"
              onChange={onDateChange}
              textColor={COLORS.textPrimary}
              locale="es-AR"
              maximumDate={datePickerMode === 'date' ? new Date() : undefined}
            />
            <TouchableOpacity
              style={styles.iosPickerClose}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.iosPickerCloseText}>Listo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Nota opcional ────────────────────────────────────────────── */}
        <FormField label="Nota (opcional)" error="">
          <View style={[styles.inputWrapper, { height: 'auto', minHeight: 52 }]}>
            <TextInput
              style={[styles.input, { paddingVertical: 14, height: 'auto' }]}
              placeholder="Agregá una nota adicional..."
              placeholderTextColor={COLORS.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
        </FormField>

        {/* ── Botón guardar ────────────────────────────────────────────── */}
        <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: 8 }}>
          <TouchableOpacity
            style={[styles.saveBtn, (!isValid || loading) && styles.saveBtnDisabled]}
            onPress={handleSave}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!isValid || loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <Text style={styles.saveBtnText}>Guardando...</Text>
            ) : (
              <>
                <AppIcon name="checkmark-circle-outline" size={20} color="#0D1A12" />
                <Text style={styles.saveBtnText}>Guardar gasto</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Selección de categoría
      ══════════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Categoría</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.modalItem,
                    category === cat.label && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    setCategory(cat.label);
                    setCategoryError('');
                    setShowCategoryModal(false);
                  }}
                  activeOpacity={0.75}
                >
                  <View style={[styles.modalItemIcon, { backgroundColor: `${cat.color}18` }]}>
                    <AppIcon name={cat.icon} size={20} color={cat.color} />
                  </View>
                  <Text style={[
                    styles.modalItemText,
                    category === cat.label && { color: COLORS.accent },
                  ]}>
                    {cat.label}
                  </Text>
                  {category === cat.label && (
                    <AppIcon name="checkmark-circle" size={18} color={COLORS.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Método de pago
      ══════════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Método de pago</Text>

            {PAYMENT_METHODS.map((pm) => (
              <TouchableOpacity
                key={pm.label}
                style={[
                  styles.modalItem,
                  paymentMethod === pm.label && styles.modalItemActive,
                ]}
                onPress={() => {
                  setPaymentMethod(pm.label);
                  setShowPaymentModal(false);
                }}
                activeOpacity={0.75}
              >
                <View style={[styles.modalItemIcon, { backgroundColor: 'rgba(96,165,250,0.12)' }]}>
                  <AppIcon name={pm.icon} size={20} color={COLORS.blue} />
                </View>
                <Text style={[
                  styles.modalItemText,
                  paymentMethod === pm.label && { color: COLORS.accent },
                ]}>
                  {pm.label}
                </Text>
                {paymentMethod === pm.label && (
                  <AppIcon name="checkmark-circle" size={18} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.bg },

  // ── Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: COLORS.bg,
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

  // ── Monto principal
  amountCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24, borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.15)',
    padding: 24, marginBottom: 20,
    alignItems: 'center',
  },
  amountLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  amountRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  currencySymbol: {
    fontSize: 32, fontWeight: '700',
    color: COLORS.textMuted, marginBottom: 4,
  },
  amountInput: {
    fontSize: 46, fontWeight: '800',
    color: COLORS.textPrimary, minWidth: 100,
    textAlign: 'center', letterSpacing: -1,
  },
  amountInputError: { color: COLORS.error },
  amountError: { fontSize: 12, color: COLORS.error, marginTop: 8 },

  // ── Campos de formulario
  fieldGroup:   { marginBottom: 18 },
  label: {
    fontSize: 12, fontWeight: '600', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, height: 52,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: 5 },

  // ── Selector (categoría / pago)
  selectorBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, height: 52,
  },
  selectorBtnError: {
    borderColor: COLORS.error,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
  },
  selectorValue:       { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  selectorPlaceholder: { flex: 1, fontSize: 15, color: COLORS.textMuted },

  // ── Fecha / hora
  dateRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  dateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, height: 52,
  },
  dateBtnText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '500' },

  // iOS picker inline
  iosPickerWrapper: {
    backgroundColor: COLORS.surface,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    marginBottom: 18, overflow: 'hidden',
  },
  iosPickerClose: {
    alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 14,
  },
  iosPickerCloseText: { fontSize: 15, fontWeight: '700', color: COLORS.accent },

  // ── Botón guardar
  saveBtn: {
    backgroundColor: COLORS.accent, borderRadius: 16,
    height: 56, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  saveBtnDisabled: { backgroundColor: COLORS.accentDim, shadowOpacity: 0, elevation: 0 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#0D1A12', letterSpacing: 0.3 },

  // ── Modales (categoría / pago)
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderWidth: 1, borderColor: COLORS.border,
    paddingTop: 12, paddingHorizontal: 20, paddingBottom: 36,
    maxHeight: '75%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17, fontWeight: '800', color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  modalItemActive: { },
  modalItemIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  modalItemText: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.textPrimary },
  modalCancel: {
    marginTop: 16, height: 50, borderRadius: 14,
    backgroundColor: COLORS.surfaceHigh,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
});