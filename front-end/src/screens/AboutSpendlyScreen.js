/**
 * AboutSpendlyScreen.js
 * Información general y documentación legal de Spendly.
 */

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

import {
  useTheme,
} from '../context/ThemeContext';

import {
  useLanguage,
} from '../context/LanguageContext';

const APP_VERSION = '1.1.0';

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
        isLast &&
          styles.infoRowLast,
      ]}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              `${iconColor}18`,
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

function DocumentationItem({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  isLast,
  styles,
  COLORS,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.infoRow,
        isLast &&
          styles.infoRowLast,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              `${iconColor}18`,
          },
        ]}
      >
        <AppIcon
          name={icon}
          size={20}
          color={iconColor}
        />
      </View>

      <View style={styles.infoBody}>
        <Text style={styles.infoValue}>
          {title}
        </Text>

        <Text style={styles.infoLabel}>
          {subtitle}
        </Text>
      </View>

      <AppIcon
        name="chevron-forward"
        size={18}
        color={COLORS.textMuted}
      />
    </TouchableOpacity>
  );
}

export default function AboutSpendlyScreen({
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
          {t('about.title')}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
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
            {t('about.appSubtitle')}
          </Text>

          <View style={styles.versionBadge}>
            <View style={styles.versionDot} />

            <Text style={styles.versionText}>
              {t('about.versionPrefix')}{' '}
              {APP_VERSION}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('about.aboutApp')}
        </Text>

        <View style={styles.card}>
          <Text style={styles.description}>
            {t('about.descriptionOne')}
          </Text>

          <Text
            style={[
              styles.description,
              styles.descriptionLast,
            ]}
          >
            {t('about.descriptionTwo')}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t('about.information')}
        </Text>

        <View style={styles.card}>
          <InfoRow
            styles={styles}
            COLORS={COLORS}
            icon="layers-outline"
            iconColor={COLORS.purple}
            label={t(
              'about.currentVersion'
            )}
            value={APP_VERSION}
          />

          <InfoRow
            styles={styles}
            COLORS={COLORS}
            icon="construct-outline"
            iconColor={COLORS.orange}
            label={t('about.status')}
            value={t('about.beta')}
          />

          <InfoRow
            styles={styles}
            COLORS={COLORS}
            icon="phone-portrait-outline"
            iconColor={COLORS.blue}
            label={t('about.platform')}
            value={t('about.mobileApp')}
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>
          {t('about.documentation')}
        </Text>

        <View style={styles.card}>
          <DocumentationItem
            styles={styles}
            COLORS={COLORS}
            icon="document-text-outline"
            iconColor={COLORS.orange}
            title={t('about.terms')}
            subtitle={t(
              'about.termsSubtitle'
            )}
            onPress={() =>
              navigation.navigate('Terms')
            }
          />

          <DocumentationItem
            styles={styles}
            COLORS={COLORS}
            icon="shield-checkmark-outline"
            iconColor={COLORS.blue}
            title={t('about.privacy')}
            subtitle={t(
              'about.privacySubtitle'
            )}
            onPress={() =>
              navigation.navigate(
                'Privacy'
              )
            }
            isLast
          />
        </View>

        <Text style={styles.footerText}>
          Spendly © 2026
        </Text>

        <Text style={styles.footerSubtext}>
          {t('about.rights')}
        </Text>

        <View style={styles.bottomSpacer} />
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
      justifyContent:
        'space-between',
      paddingTop: 56,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: COLORS.bg,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        COLORS.surface,
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
      backgroundColor:
        COLORS.surface,
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
      backgroundColor:
        COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}40`,
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
      backgroundColor:
        COLORS.surfaceHigh,
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
      backgroundColor:
        COLORS.accent,
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
      backgroundColor:
        COLORS.surface,
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

    descriptionLast: {
      marginBottom: 0,
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        COLORS.border,
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

    bottomSpacer: {
      height: 30,
    },
  });
}
