import React, { useMemo } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  {
    value: 'system',
    title: 'Automático',
    description:
      'Usa el tema configurado en tu dispositivo.',
    icon: 'phone-portrait-outline',
  },
  {
    value: 'light',
    title: 'Claro',
    description:
      'Mantiene Spendly siempre en modo claro.',
    icon: 'sunny-outline',
  },
  {
    value: 'dark',
    title: 'Oscuro',
    description:
      'Mantiene Spendly siempre en modo oscuro.',
    icon: 'moon-outline',
  },
];

function AppIcon({
  name,
  size = 20,
  color,
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  );
}

export default function ThemeSettingsScreen({
  navigation,
}) {
  const {
    colors,
    isDark,
    themeMode,
    setTheme,
  } = useTheme();

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const handleSelectTheme = async (mode) => {
    await setTheme(mode);
  };

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={colors.bg}
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Apariencia
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View
            style={
              styles.heroIconWrapper
            }
          >
            <AppIcon
              name={
                isDark
                  ? 'moon'
                  : 'sunny'
              }
              size={28}
              color={colors.accent}
            />
          </View>

          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>
              Apariencia de Spendly
            </Text>

            <Text style={styles.heroDescription}>
              Elegí cómo querés que se vea la aplicación.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Tema
        </Text>

        <View style={styles.optionsCard}>
          {THEME_OPTIONS.map(
            (option, index) => {
              const isSelected =
                themeMode === option.value;

              const isLast =
                index ===
                THEME_OPTIONS.length - 1;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    isLast &&
                      styles.optionItemLast,
                    isSelected &&
                      styles.optionItemSelected,
                  ]}
                  onPress={() =>
                    handleSelectTheme(
                      option.value
                    )
                  }
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.optionIconWrapper,
                      isSelected && {
                        backgroundColor:
                          colors.accentDim,
                      },
                    ]}
                  >
                    <AppIcon
                      name={option.icon}
                      size={21}
                      color={
                        isSelected
                          ? colors.accent
                          : colors.textSecondary
                      }
                    />
                  </View>

                  <View
                    style={
                      styles.optionBody
                    }
                  >
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected &&
                          styles.optionTitleSelected,
                      ]}
                    >
                      {option.title}
                    </Text>

                    <Text
                      style={
                        styles.optionDescription
                      }
                    >
                      {option.description}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      isSelected &&
                        styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        <View style={styles.infoCard}>
          <AppIcon
            name="information-circle-outline"
            size={20}
            color={colors.blue}
          />

          <Text style={styles.infoText}>
            La opción Automático cambia entre claro y oscuro según la configuración del teléfono.
          </Text>
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>
            Vista previa
          </Text>

          <View style={styles.previewPanel}>
            <View style={styles.previewHeader}>
              <View>
                <Text
                  style={
                    styles.previewTitle
                  }
                >
                  Spendly
                </Text>

                <Text
                  style={
                    styles.previewSubtitle
                  }
                >
                  Resumen mensual
                </Text>
              </View>

              <View
                style={
                  styles.previewAvatar
                }
              >
                <Text
                  style={
                    styles.previewAvatarText
                  }
                >
                  S
                </Text>
              </View>
            </View>

            <View
              style={styles.previewBalance}
            >
              <Text
                style={
                  styles.previewBalanceLabel
                }
              >
                Balance
              </Text>

              <Text
                style={
                  styles.previewBalanceValue
                }
              >
                $ 125.000
              </Text>
            </View>

            <View
              style={styles.previewRow}
            >
              <View
                style={
                  styles.previewSmallCard
                }
              >
                <Text
                  style={
                    styles.previewSmallLabel
                  }
                >
                  Ingresos
                </Text>

                <Text
                  style={[
                    styles.previewSmallValue,
                    {
                      color:
                        colors.accent,
                    },
                  ]}
                >
                  $ 200.000
                </Text>
              </View>

              <View
                style={
                  styles.previewSmallCard
                }
              >
                <Text
                  style={
                    styles.previewSmallLabel
                  }
                >
                  Gastos
                </Text>

                <Text
                  style={[
                    styles.previewSmallValue,
                    {
                      color: colors.red,
                    },
                  ]}
                >
                  $ 75.000
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.bg,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    headerTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.textPrimary,
    },

    headerSpacer: {
      width: 40,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 6,
      paddingBottom: 30,
    },

    heroCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      marginBottom: 24,
    },

    heroIconWrapper: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor:
        colors.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroTextBlock: {
      flex: 1,
    },

    heroTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 4,
    },

    heroDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
      marginLeft: 2,
    },

    optionsCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      marginBottom: 18,
    },

    optionItem: {
      minHeight: 84,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor:
        colors.border,
    },

    optionItemLast: {
      borderBottomWidth: 0,
    },

    optionItemSelected: {
      backgroundColor:
        colors.accentDim,
    },

    optionIconWrapper: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor:
        colors.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },

    optionBody: {
      flex: 1,
    },

    optionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 3,
    },

    optionTitleSelected: {
      color: colors.accent,
    },

    optionDescription: {
      fontSize: 11,
      color: colors.textSecondary,
      lineHeight: 17,
    },

    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor:
        colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    radioOuterSelected: {
      borderColor:
        colors.accent,
    },

    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor:
        colors.accent,
    },

    infoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor:
        colors.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 22,
    },

    infoText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },

    previewCard: {
      marginBottom: 10,
    },

    previewLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
      marginLeft: 2,
    },

    previewPanel: {
      backgroundColor:
        colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
    },

    previewHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 18,
    },

    previewTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: 2,
    },

    previewSubtitle: {
      fontSize: 11,
      color: colors.textSecondary,
    },

    previewAvatar: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor:
        colors.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
    },

    previewAvatarText: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.accent,
    },

    previewBalance: {
      backgroundColor:
        colors.surfaceHigh,
      borderRadius: 18,
      padding: 16,
      marginBottom: 12,
    },

    previewBalanceLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      marginBottom: 5,
    },

    previewBalanceValue: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.textPrimary,
    },

    previewRow: {
      flexDirection: 'row',
      gap: 10,
    },

    previewSmallCard: {
      flex: 1,
      backgroundColor:
        colors.surfaceHigh,
      borderRadius: 16,
      padding: 14,
    },

    previewSmallLabel: {
      fontSize: 10,
      color: colors.textSecondary,
      marginBottom: 5,
    },

    previewSmallValue: {
      fontSize: 13,
      fontWeight: '800',
    },
  });
}