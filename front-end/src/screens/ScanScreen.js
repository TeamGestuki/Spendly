import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import { analyzeTicket } from '../services/scanService';
import { createTransaction } from '../services/transactionService';

const CATEGORIES = [
  'food',
  'transport',
  'supermarket',
  'services',
  'health',
  'education',
  'entertainment',
  'clothing',
  'technology',
  'other',
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

const CATEGORY_TO_STORAGE = {
  food: 'Comida',
  transport: 'Transporte',
  supermarket: 'Supermercado',
  services: 'Servicios',
  health: 'Salud',
  education: 'Educación',
  entertainment: 'Entretenimiento',
  clothing: 'Ropa',
  technology: 'Tecnología',
  other: 'Otros',
};

const CURRENCIES = [
  'ARS',
  'USD',
  'EUR',
  'BRL',
  'CLP',
  'UYU',
  'MXN',
  'CNY',
  'RUB',
];

export default function ScanScreen({
  navigation,
}) {
  const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const {
    t,
  } = useLanguage();

  const styles = useMemo(
    () =>
      createStyles(
        COLORS
      ),
    [COLORS]
  );

  const [
    imageAsset,
    setImageAsset,
  ] = useState(null);

  const [
    analyzing,
    setAnalyzing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState(null);

  const resetProcess =
    () => {
      Keyboard.dismiss();
      setImageAsset(null);
      setResult(null);
    };

  const applyImage =
    (asset) => {
      setImageAsset(
        asset
      );
      setResult(null);
    };

  const pickImage =
    async () => {
      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();

      if (
        !permission.granted
      ) {
        Alert.alert(
          t(
            'scan.permissions.title'
          ),
          t(
            'scan.permissions.gallery'
          )
        );
        return;
      }

      const response =
        await ImagePicker
          .launchImageLibraryAsync({
            mediaTypes:
              ImagePicker
                .MediaTypeOptions
                .Images,
            quality: 0.85,
            allowsEditing: false,
          });

      if (
        !response.canceled &&
        response.assets?.[0]
      ) {
        applyImage(
          response.assets[0]
        );
      }
    };

  const takePhoto =
    async () => {
      const permission =
        await ImagePicker
          .requestCameraPermissionsAsync();

      if (
        !permission.granted
      ) {
        Alert.alert(
          t(
            'scan.permissions.title'
          ),
          t(
            'scan.permissions.camera'
          )
        );
        return;
      }

      const response =
        await ImagePicker
          .launchCameraAsync({
            quality: 0.85,
            allowsEditing: false,
          });

      if (
        !response.canceled &&
        response.assets?.[0]
      ) {
        applyImage(
          response.assets[0]
        );
      }
    };

  const handleAnalyze =
    async () => {
      if (
        !imageAsset ||
        analyzing
      ) {
        return;
      }

      try {
        setAnalyzing(true);

        const data =
          await analyzeTicket(
            imageAsset
          );

        setResult({
          type:
            'expense',
          amount:
            String(
              data.amount ??
              ''
            ),
          category:
            data.category ||
            'other',
          description:
            data.description ||
            '',
          date:
            data.date ||
            '',
          currency:
            data.currency ||
            'ARS',
          payment_method:
            data.payment_method ||
            'other',
        });
      } catch (error) {
        Alert.alert(
          t(
            'scan.errors.title'
          ),
          error.message ||
          t(
            'scan.errors.analyze'
          )
        );
      } finally {
        setAnalyzing(false);
      }
    };

  const handleSave =
    async () => {
      Keyboard.dismiss();

      const amount =
        Number(
          String(
            result?.amount ||
            ''
          ).replace(
            ',',
            '.'
          )
        );

      if (
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {
        Alert.alert(
          t(
            'common.error'
          ),
          t(
            'scan.validation.amount'
          )
        );
        return;
      }

      if (
        !result.description
          .trim()
      ) {
        Alert.alert(
          t(
            'common.error'
          ),
          t(
            'scan.validation.description'
          )
        );
        return;
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
          result.date
        )
      ) {
        Alert.alert(
          t(
            'common.error'
          ),
          t(
            'scan.validation.date'
          )
        );
        return;
      }

      try {
        setSaving(true);

        await createTransaction({
          type:
            'expense',
          amount,
          category:
            CATEGORY_TO_STORAGE[
              result.category
            ] ||
            result.category ||
            'Otros',
          description:
            result.description
              .trim(),
          date:
            result.date,
          currency:
            result.currency,
          payment_method:
            result.payment_method ||
            'other',
        });

        Alert.alert(
          t(
            'scan.success.title'
          ),
          t(
            'scan.success.text'
          ),
          [
            {
              text:
                t(
                  'common.accept'
                ),
              onPress:
                () =>
                  navigation.replace(
                    'Expenses'
                  ),
            },
          ]
        );
      } catch (error) {
        Alert.alert(
          t(
            'scan.errors.title'
          ),
          error.message ||
          t(
            'scan.errors.save'
          )
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : 'height'
      }
    >
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={
          COLORS.bg
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={
          Platform.OS ===
          'ios'
            ? 'interactive'
            : 'none'
        }
        removeClippedSubviews={
          false
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <View
          style={
            styles.topBar
          }
        >
          <TouchableOpacity
            style={
              styles.roundButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={
                COLORS.textPrimary
              }
            />
          </TouchableOpacity>

          <Text
            style={
              styles.topTitle
            }
          >
            {t(
              'scan.title'
            )}
          </Text>

          <View
            style={{
              width: 42,
            }}
          />
        </View>

        <View
          style={
            styles.hero
          }
        >
          <View
            style={
              styles.heroIcon
            }
          >
            <Ionicons
              name="scan-outline"
              size={30}
              color={
                COLORS.accent
              }
            />
          </View>

          <Text
            style={
              styles.heroTitle
            }
          >
            {t(
              'scan.heroTitle'
            )}
          </Text>

          <Text
            style={
              styles.heroText
            }
          >
            {t(
              'scan.heroText'
            )}
          </Text>
        </View>

        {!imageAsset && (
          <View
            style={
              styles.actions
            }
          >
            <TouchableOpacity
              style={
                styles.actionCard
              }
              onPress={
                takePhoto
              }
            >
              <Ionicons
                name="camera-outline"
                size={26}
                color={
                  COLORS.accent
                }
              />

              <Text
                style={
                  styles.actionTitle
                }
              >
                {t(
                  'scan.camera'
                )}
              </Text>

              <Text
                style={
                  styles.actionText
                }
              >
                {t(
                  'scan.cameraText'
                )}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.actionCard
              }
              onPress={
                pickImage
              }
            >
              <Ionicons
                name="image-outline"
                size={26}
                color={
                  COLORS.blue ||
                  COLORS.accent
                }
              />

              <Text
                style={
                  styles.actionTitle
                }
              >
                {t(
                  'scan.gallery'
                )}
              </Text>

              <Text
                style={
                  styles.actionText
                }
              >
                {t(
                  'scan.galleryText'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {imageAsset && (
          <>
            <View
              style={
                styles.previewCard
              }
            >
              <Image
                source={{
                  uri:
                    imageAsset.uri,
                }}
                style={
                  styles.preview
                }
              />

              <View
                style={
                  styles.previewActions
                }
              >
                <TouchableOpacity
                  style={
                    styles.smallAction
                  }
                  onPress={
                    pickImage
                  }
                >
                  <Ionicons
                    name="refresh-outline"
                    size={18}
                    color={
                      COLORS.textPrimary
                    }
                  />

                  <Text
                    style={
                      styles.smallActionText
                    }
                  >
                    {t(
                      'scan.change'
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.smallAction
                  }
                  onPress={
                    resetProcess
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={
                      COLORS.red ||
                      '#F87171'
                    }
                  />

                  <Text
                    style={[
                      styles.smallActionText,
                      {
                        color:
                          COLORS.red ||
                          '#F87171',
                      },
                    ]}
                  >
                    {t(
                      'scan.remove'
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {!result && (
              <TouchableOpacity
                style={
                  styles.primaryButton
                }
                onPress={
                  handleAnalyze
                }
                disabled={
                  analyzing
                }
              >
                {analyzing ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color={
                        COLORS.buttonText ||
                        COLORS.bg
                      }
                    />

                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
                      {t(
                        'scan.analyzing'
                      )}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="sparkles-outline"
                      size={21}
                      color={
                        COLORS.buttonText ||
                        COLORS.bg
                      }
                    />

                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
                      {t(
                        'scan.analyze'
                      )}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </>
        )}

        {result && (
          <View
            style={
              styles.resultCard
            }
          >
            <View
              style={
                styles.resultHeader
              }
            >
              <View
                style={
                  styles.successIcon
                }
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={
                    COLORS.buttonText ||
                    COLORS.bg
                  }
                />
              </View>

              <View
                style={{
                  flex: 1,
                }}
              >
                <Text
                  style={
                    styles.resultTitle
                  }
                >
                  {t(
                    'scan.reviewTitle'
                  )}
                </Text>

                <Text
                  style={
                    styles.resultSubtitle
                  }
                >
                  {t(
                    'scan.reviewText'
                  )}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.label
              }
            >
              {t(
                'scan.fields.amount'
              )}
            </Text>

            <TextInput
              style={
                styles.input
              }
              value={
                result.amount
              }
              onChangeText={(
                amount
              ) =>
                setResult({
                  ...result,
                  amount,
                })
              }
              keyboardType="decimal-pad"
              placeholderTextColor={
                COLORS.textMuted
              }
            />

            <Text
              style={
                styles.label
              }
            >
              {t(
                'scan.fields.description'
              )}
            </Text>

            <TextInput
              style={
                styles.input
              }
              value={
                result.description
              }
              onChangeText={(
                description
              ) =>
                setResult({
                  ...result,
                  description,
                })
              }
              placeholderTextColor={
                COLORS.textMuted
              }
            />

            <Text
              style={
                styles.label
              }
            >
              {t(
                'scan.fields.category'
              )}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.chipRow
              }
            >
              {CATEGORIES.map(
                (category) => (
                  <TouchableOpacity
                    key={
                      category
                    }
                    style={[
                      styles.chip,
                      result.category ===
                        category &&
                        styles.chipActive,
                    ]}
                    onPress={() =>
                      setResult({
                        ...result,
                        category,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        result.category ===
                          category &&
                          styles.chipTextActive,
                      ]}
                    >
                      {t(
                        `categories.${category}`
                      )}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>

            <Text
              style={
                styles.label
              }
            >
              {t(
                'scan.fields.date'
              )}
            </Text>

            <TextInput
              style={
                styles.input
              }
              value={
                result.date
              }
              onChangeText={(
                date
              ) =>
                setResult({
                  ...result,
                  date,
                })
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor={
                COLORS.textMuted
              }
              autoCapitalize="none"
            />

            <Text
              style={
                styles.label
              }
            >
              {t(
                'scan.fields.currency'
              )}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.chipRow
              }
            >
              {CURRENCIES.map(
                (currency) => (
                  <TouchableOpacity
                    key={
                      currency
                    }
                    style={[
                      styles.chip,
                      result.currency ===
                        currency &&
                        styles.chipActive,
                    ]}
                    onPress={() =>
                      setResult({
                        ...result,
                        currency,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        result.currency ===
                          currency &&
                          styles.chipTextActive,
                      ]}
                    >
                      {currency}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>


<Text
  style={
    styles.label
  }
>
  {t(
    'scan.fields.paymentMethod'
  )}
</Text>

<ScrollView
  horizontal
  showsHorizontalScrollIndicator={
    false
  }
  contentContainerStyle={
    styles.chipRow
  }
>
  {PAYMENT_METHODS.map(
    (item) => (
      <TouchableOpacity
        key={
          item.value
        }
        style={[
          styles.chip,
          result.payment_method ===
            item.value &&
            styles.chipActive,
        ]}
        onPress={() =>
          setResult({
            ...result,
            payment_method:
              item.value,
          })
        }
      >
        <Ionicons
          name={
            item.icon
          }
          size={15}
          color={
            result.payment_method ===
            item.value
              ? COLORS.accent
              : COLORS.textSecondary
          }
        />

        <Text
          style={[
            styles.chipText,
            result.payment_method ===
              item.value &&
              styles.chipTextActive,
          ]}
        >
          {t(
            `methods.${item.translationKey}`
          )}
        </Text>
      </TouchableOpacity>
    )
  )}
</ScrollView>

            <TouchableOpacity
              style={
                styles.primaryButton
              }
              onPress={
                handleSave
              }
              disabled={
                saving
              }
            >
              {saving ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color={
                      COLORS.buttonText ||
                      COLORS.bg
                    }
                  />

                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    {t(
                      'scan.saving'
                    )}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={21}
                    color={
                      COLORS.buttonText ||
                      COLORS.bg
                    }
                  />

                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    {t(
                      'scan.saveExpense'
                    )}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.secondaryButton
              }
              onPress={
                resetProcess
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                {t(
                  'scan.startAgain'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text
          style={
            styles.footer
          }
        >
          Spendly © 2026
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(COLORS) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor:
        COLORS.bg,
    },

    content: {
      flexGrow: 1,
      paddingTop: 56,
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 22,
    },

    roundButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    topTitle: {
      fontSize: 17,
      fontWeight: '700',
      color:
        COLORS.textPrimary,
    },

    hero: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      padding: 22,
      alignItems: 'center',
      marginBottom: 20,
    },

    heroIcon: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor:
        COLORS.accentDim,
      alignItems: 'center',
      justifyContent:
        'center',
      marginBottom: 14,
    },

    heroTitle: {
      fontSize: 21,
      fontWeight: '800',
      color:
        COLORS.textPrimary,
      textAlign: 'center',
    },

    heroText: {
      marginTop: 7,
      fontSize: 13,
      lineHeight: 20,
      color:
        COLORS.textSecondary,
      textAlign: 'center',
    },

    actions: {
      flexDirection: 'row',
      gap: 12,
    },

    actionCard: {
      flex: 1,
      minHeight: 145,
      borderRadius: 20,
      backgroundColor:
        COLORS.surface,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      padding: 18,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    actionTitle: {
      marginTop: 10,
      fontSize: 15,
      fontWeight: '800',
      color:
        COLORS.textPrimary,
    },

    actionText: {
      marginTop: 5,
      fontSize: 11,
      lineHeight: 16,
      color:
        COLORS.textSecondary,
      textAlign: 'center',
    },

    previewCard: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      overflow: 'hidden',
    },

    preview: {
      width: '100%',
      height: 360,
      resizeMode: 'cover',
    },

    previewActions: {
      flexDirection: 'row',
      gap: 10,
      padding: 12,
    },

    smallAction: {
      flex: 1,
      minHeight: 44,
      borderRadius: 13,
      backgroundColor:
        COLORS.surfaceHigh,
      alignItems: 'center',
      justifyContent:
        'center',
      flexDirection: 'row',
      gap: 7,
    },

    smallActionText: {
      fontSize: 12,
      fontWeight: '700',
      color:
        COLORS.textPrimary,
    },

    primaryButton: {
      marginTop: 16,
      minHeight: 54,
      borderRadius: 16,
      backgroundColor:
        COLORS.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'center',
      gap: 9,
    },

    primaryButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color:
        COLORS.buttonText ||
        COLORS.bg,
    },

    resultCard: {
      marginTop: 20,
      backgroundColor:
        COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      padding: 20,
    },

    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 22,
    },

    successIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor:
        COLORS.accent,
      alignItems: 'center',
      justifyContent:
        'center',
    },

    resultTitle: {
      fontSize: 18,
      fontWeight: '800',
      color:
        COLORS.textPrimary,
    },

    resultSubtitle: {
      marginTop: 3,
      fontSize: 11,
      color:
        COLORS.textSecondary,
    },

    label: {
      fontSize: 12,
      fontWeight: '700',
      color:
        COLORS.textSecondary,
      textTransform:
        'uppercase',
      marginBottom: 8,
      marginTop: 4,
    },

    input: {
      minHeight: 50,
      borderRadius: 14,
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      paddingHorizontal: 14,
      color:
        COLORS.textPrimary,
      fontSize: 14,
      marginBottom: 16,
    },

    chipRow: {
      gap: 8,
      paddingBottom: 16,
    },

    chip: {
      minHeight: 38,
      borderRadius: 999,
      paddingHorizontal: 14,
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor:
        COLORS.border,
      alignItems: 'center',
      justifyContent:
        'center',
      flexDirection: 'row',
      gap: 7,
    },

    chipActive: {
      backgroundColor:
        COLORS.accentDim,
      borderColor:
        COLORS.accent,
    },

    chipText: {
      fontSize: 11,
      fontWeight: '700',
      color:
        COLORS.textSecondary,
    },

    chipTextActive: {
      color:
        COLORS.accent,
    },

    secondaryButton: {
      minHeight: 48,
      borderRadius: 14,
      backgroundColor:
        COLORS.surfaceHigh,
      alignItems: 'center',
      justifyContent:
        'center',
      marginTop: 10,
    },

    secondaryButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color:
        COLORS.textSecondary,
    },

    footer: {
      marginTop: 28,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '600',
      color:
        COLORS.textMuted,
    },
  });
}
