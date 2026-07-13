import React, {
  useMemo,
} from 'react';

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

const APP_VERSION = '1.0.8';

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

function InfoRow({
  icon,
  iconColor,
  label,
  value,
  isLast,
  styles,
  COLORS,
}) {
  return (
    <View
      style={[
        styles.infoRow,
        isLast && styles.infoRowLast,
      ]}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor: `${iconColor}18`,
          },
        ]}
      >
        <AppIcon
          name={icon}
          size={19}
          color={iconColor}
        />
      </View>

      <View style={styles.infoBody}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>

      <AppIcon
        name="checkmark-circle-outline"
        size={18}
        color={COLORS.accent}
      />
    </View>
  );
}

export default function AboutSpendlyScreen({
  navigation,
}) {
  const {
    colors: COLORS,
    isDark,
  } = useTheme();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );

  return (
    <View style={styles.flex}>
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
        >
          <AppIcon
            name="chevron-back"
            size={22}
            color={COLORS.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.topBarTitle}>
          Acerca de Spendly
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.logoWrapper}>
            <AppIcon
              name="wallet-outline"
              size={42}
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.appName}>
            Spendly
          </Text>

          <Text style={styles.appSubtitle}>
            Gestión inteligente de gastos,
            ingresos y metas financieras.
          </Text>

          <View style={styles.versionBadge}>
            <View style={styles.versionDot} />

            <Text style={styles.versionText}>
              Versión {APP_VERSION}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Sobre la aplicación
        </Text>

        <View style={styles.card}>
          <Text style={styles.description}>
            Spendly es una aplicación móvil
            pensada para ayudarte a registrar,
            organizar y comprender tus
            movimientos financieros de forma
            simple.
          </Text>

          <Text style={styles.description}>
            Permite administrar gastos e
            ingresos, consultar estadísticas,
            escanear tickets mediante
            inteligencia artificial y trabajar
            con metas de ahorro.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Información
        </Text>

        <View style={styles.card}>
          <InfoRow
            styles={styles}
            COLORS={COLORS}
            icon="layers-outline"
            iconColor={COLORS.purple}
            label="Versión actual"
            value={APP_VERSION}
          />

          <InfoRow
            styles={styles}
            COLORS={COLORS}
            icon="construct-outline"
            iconColor={COLORS.orange}
            label="Estado"
            value="Beta"
          />

          <InfoRow
            styles={styles}
            COLORS={COLORS}
            icon="phone-portrait-outline"
            iconColor={COLORS.blue}
            label="Plataforma"
            value="Aplicación móvil"
            isLast
          />
        </View>

            <Text style={styles.sectionTitle}>
            Documentación
            </Text>

            <View style={styles.card}>

            <TouchableOpacity
                style={styles.infoRow}
                activeOpacity={0.8}
                onPress={() =>
                navigation.navigate('Terms')
                }
            >
                <View
                style={[
                    styles.infoIcon,
                    {
                    backgroundColor: `${COLORS.orange}18`,
                    },
                ]}
                >
                <AppIcon
                    name="document-text-outline"
                    size={20}
                    color={COLORS.orange}
                />
                </View>

                <View style={styles.infoBody}>
                <Text style={styles.infoValue}>
                    Términos y condiciones
                </Text>

                <Text style={styles.infoLabel}>
                    Condiciones de uso de Spendly
                </Text>
                </View>

                <AppIcon
                name="chevron-forward"
                size={18}
                color={COLORS.textMuted}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                styles.infoRow,
                styles.infoRowLast,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                navigation.navigate('Privacy')
                }
            >
                <View
                style={[
                    styles.infoIcon,
                    {
                    backgroundColor: `${COLORS.blue}18`,
                    },
                ]}
                >
                <AppIcon
                    name="shield-checkmark-outline"
                    size={20}
                    color={COLORS.blue}
                />
                </View>

                <View style={styles.infoBody}>
                <Text style={styles.infoValue}>
                    Política de privacidad
                </Text>

                <Text style={styles.infoLabel}>
                    Cómo protegemos tus datos
                </Text>
                </View>

                <AppIcon
                name="chevron-forward"
                size={18}
                color={COLORS.textMuted}
                />
            </TouchableOpacity>

            </View>

        <Text style={styles.footerText}>
          Spendly © 2026
        </Text>

        <Text style={styles.footerSubtext}>
          Todos los derechos reservados.
        </Text>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
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
      justifyContent: 'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: COLORS.bg,
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

    topBarTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },

    topBarSpacer: {
      width: 40,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 30,
    },

    heroCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 26,
      alignItems: 'center',
      marginBottom: 26,
    },

    logoWrapper: {
      width: 86,
      height: 86,
      borderRadius: 26,
      backgroundColor: COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: `${COLORS.accent}40`,
    },

    appName: {
      fontSize: 28,
      fontWeight: '900',
      color: COLORS.textPrimary,
      marginBottom: 7,
    },

    appSubtitle: {
      fontSize: 13,
      lineHeight: 20,
      textAlign: 'center',
      color: COLORS.textSecondary,
      maxWidth: 280,
    },

    versionBadge: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: COLORS.surfaceHigh,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },

    versionDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: COLORS.accent,
    },

    versionText: {
      fontSize: 12,
      fontWeight: '700',
      color: COLORS.textSecondary,
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
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
      padding: 18,
      marginBottom: 22,
    },

    description: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 21,
      marginBottom: 10,
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },

    infoRowLast: {
      borderBottomWidth: 0,
    },

    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    infoBody: {
      flex: 1,
    },

    infoLabel: {
      fontSize: 11,
      color: COLORS.textMuted,
      marginBottom: 3,
    },

    infoValue: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },

    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 22,
    },

    featureCard: {
      width: '48%',
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
    },

    featureIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },

    featureTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 5,
    },

    featureText: {
      fontSize: 11,
      lineHeight: 17,
      color: COLORS.textSecondary,
    },

    developmentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 13,
      backgroundColor: COLORS.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: `${COLORS.accent}45`,
      padding: 18,
      marginBottom: 28,
    },

    developmentIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
    },

    developmentBody: {
      flex: 1,
    },

    developmentTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 4,
    },

    developmentText: {
      fontSize: 11,
      color: COLORS.textSecondary,
      lineHeight: 17,
    },

    footerText: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.textPrimary,
      textAlign: 'center',
    },

    footerSubtext: {
      marginTop: 4,
      fontSize: 11,
      color: COLORS.textMuted,
      textAlign: 'center',
    },
  });
}