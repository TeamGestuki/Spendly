
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
import { useLanguage } from '../context/LanguageContext';

function AppIcon({ name, size = 20, color }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function MetaItem({ icon, label, value, styles, COLORS }) {
  return (
    <View style={styles.metaItem}>
      <View style={styles.metaIcon}>
        <AppIcon name={icon} size={17} color={COLORS.accent} />
      </View>
      <View style={styles.metaBody}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
}

function LegalCard({ icon, title, text, isLast, styles, COLORS }) {
  return (
    <View style={[styles.legalCard, isLast && styles.legalCardLast]}>
      <View style={styles.legalHeader}>
        <View style={styles.legalIcon}>
          <AppIcon name={icon} size={20} color={COLORS.accent} />
        </View>
        <Text style={styles.legalTitle}>{title}</Text>
      </View>
      <Text style={styles.legalText}>{text}</Text>
    </View>
  );
}

export default function PrivacyScreen({ navigation }) {
  const { colors: COLORS, isDark } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () => createStyles(COLORS),
    [COLORS]
  );

  const sections = useMemo(
    () => [
      {
        icon: 'download-outline',
        title: t('privacy.sections.collection.title'),
        text: t('privacy.sections.collection.text'),
      },
      {
        icon: 'analytics-outline',
        title: t('privacy.sections.use.title'),
        text: t('privacy.sections.use.text'),
      },
      {
        icon: 'wallet-outline',
        title: t('privacy.sections.financialData.title'),
        text: t('privacy.sections.financialData.text'),
      },
      {
        icon: 'scan-outline',
        title: t('privacy.sections.ai.title'),
        text: t('privacy.sections.ai.text'),
      },
      {
        icon: 'phone-portrait-outline',
        title: t('privacy.sections.deviceStorage.title'),
        text: t('privacy.sections.deviceStorage.text'),
      },
      {
        icon: 'lock-closed-outline',
        title: t('privacy.sections.security.title'),
        text: t('privacy.sections.security.text'),
      },
      {
        icon: 'server-outline',
        title: t('privacy.sections.services.title'),
        text: t('privacy.sections.services.text'),
      },
      {
        icon: 'time-outline',
        title: t('privacy.sections.retention.title'),
        text: t('privacy.sections.retention.text'),
      },
      {
        icon: 'person-outline',
        title: t('privacy.sections.rights.title'),
        text: t('privacy.sections.rights.text'),
      },
      {
        icon: 'trash-outline',
        title: t('privacy.sections.deletion.title'),
        text: t('privacy.sections.deletion.text'),
      },
      {
        icon: 'school-outline',
        title: t('privacy.sections.academic.title'),
        text: t('privacy.sections.academic.text'),
      },
      {
        icon: 'mail-outline',
        title: t('privacy.sections.contact.title'),
        text: t('privacy.sections.contact.text'),
      }
    ],
    [t]
  );

  return (
    <View style={styles.flex}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.bg}
      />

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
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
          {t('privacy.title')}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="shield-checkmark-outline"
              size={30}
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.heroTitle}>
            {t('privacy.title')}
          </Text>

          <Text style={styles.heroSubtitle}>
            {t('privacy.subtitle')}
          </Text>
        </View>

        <View style={styles.metaCard}>
          <MetaItem
            icon="document-text-outline"
            label={t('privacy.meta.versionLabel')}
            value={t('privacy.meta.versionValue')}
            styles={styles}
            COLORS={COLORS}
          />
          <MetaItem
            icon="calendar-outline"
            label={t('privacy.meta.updatedLabel')}
            value={t('privacy.meta.updatedValue')}
            styles={styles}
            COLORS={COLORS}
          />
          <MetaItem
            icon="people-outline"
            label={t('privacy.meta.responsibleLabel')}
            value="Team GST"
            styles={styles}
            COLORS={COLORS}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {t('privacy.contentTitle')}
        </Text>

        <View style={styles.legalList}>
          {sections.map((section, index) => (
            <LegalCard
              key={section.title}
              icon={section.icon}
              title={section.title}
              text={section.text}
              isLast={index === sections.length - 1}
              styles={styles}
              COLORS={COLORS}
            />
          ))}
        </View>

        <View style={styles.noticeCard}>
          <AppIcon
            name="information-circle-outline"
            size={20}
            color={COLORS.blue}
          />
          <Text style={styles.noticeText}>
            {t('privacy.notice')}
          </Text>
        </View>

        <Text style={styles.footerText}>
          Spendly © 2026
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
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    topBarSpacer: {
      width: 40,
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
      borderColor: `${COLORS.accent}29`,
      padding: 22,
      marginBottom: 18,
      alignItems: 'center',
    },
    heroIcon: {
      width: 62,
      height: 62,
      borderRadius: 31,
      backgroundColor: COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    heroTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: COLORS.textPrimary,
      textAlign: 'center',
      marginBottom: 7,
    },
    heroSubtitle: {
      fontSize: 13,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    metaCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginBottom: 22,
      overflow: 'hidden',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    metaIcon: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metaBody: {
      flex: 1,
    },
    metaLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginBottom: 3,
    },
    metaValue: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.textPrimary,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 10,
      marginLeft: 2,
    },
    legalList: {
      gap: 10,
    },
    legalCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 17,
    },
    legalCardLast: {
      marginBottom: 0,
    },
    legalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 11,
      marginBottom: 10,
    },
    legalIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      backgroundColor: COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    legalTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.textPrimary,
      lineHeight: 21,
    },
    legalText: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 21,
    },
    noticeCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
      marginTop: 18,
    },
    noticeText: {
      flex: 1,
      fontSize: 12,
      color: COLORS.textSecondary,
      lineHeight: 18,
    },
    footerText: {
      marginTop: 28,
      textAlign: 'center',
      fontSize: 12,
      color: COLORS.textMuted,
      fontWeight: '600',
    },
    bottomSpacer: {
      height: 30,
    },
  });
}
