import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCY_STORAGE_KEY = 'preferred_currency';

export const CURRENCIES = [
  {
    code: 'ARS',
    name: 'Peso argentino',
    symbol: '$',
    locale: 'es-AR',
  },
  {
    code: 'USD',
    name: 'Dólar estadounidense',
    symbol: 'US$',
    locale: 'en-US',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'es-ES',
  },
  {
    code: 'GBP',
    name: 'Libra esterlina',
    symbol: '£',
    locale: 'en-GB',
  },
  {
    code: 'BRL',
    name: 'Real brasileño',
    symbol: 'R$',
    locale: 'pt-BR',
  },
  {
    code: 'CLP',
    name: 'Peso chileno',
    symbol: '$',
    locale: 'es-CL',
  },
  {
    code: 'UYU',
    name: 'Peso uruguayo',
    symbol: '$U',
    locale: 'es-UY',
  },
  {
    code: 'MXN',
    name: 'Peso mexicano',
    symbol: '$',
    locale: 'es-MX',
  },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];

export const getCurrencyByCode = (code) => {
  return (
    CURRENCIES.find((currency) => currency.code === code) ||
    DEFAULT_CURRENCY
  );
};

export const getPreferredCurrency = async () => {
  const savedCode = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
  return getCurrencyByCode(savedCode);
};

export const setPreferredCurrency = async (code) => {
  const currency = getCurrencyByCode(code);

  await AsyncStorage.setItem(
    CURRENCY_STORAGE_KEY,
    currency.code
  );

  return currency;
};

export const formatMoney = (
  amount,
  currency = DEFAULT_CURRENCY
) => {
  const value = Number(amount) || 0;

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency.symbol} ${value.toFixed(2)}`;
  }
};