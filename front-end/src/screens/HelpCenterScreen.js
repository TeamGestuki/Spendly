/**
 * HelpCenterScreen.js
 * Centro de ayuda y guía rápida de Spendly.
 */

import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
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

function FAQItem({
  item,
  expanded,
  onPress,
  styles,
  COLORS,
}) {
  return (
    <View style={styles.faqCard}>
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.faqIconWrapper}>
          <AppIcon
            name={item.icon}
            size={18}
            color={COLORS.accent}
          />
        </View>

        <Text style={styles.faqQuestion}>
          {item.question}
        </Text>

        <AppIcon
          name={
            expanded
              ? 'chevron-up'
              : 'chevron-down'
          }
          size={18}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.faqAnswerBox}>
          <Text style={styles.faqAnswer}>
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
}

function GuideStep({
  step,
  title,
  description,
  icon,
  isLast,
  styles,
  COLORS,
}) {
  return (
    <View
      style={[
        styles.guideStep,
        isLast &&
          styles.guideStepLast,
      ]}
    >
      <View style={styles.guideLeft}>
        <View style={styles.guideNumber}>
          <Text style={styles.guideNumberText}>
            {step}
          </Text>
        </View>

        {!isLast && (
          <View style={styles.guideLine} />
        )}
      </View>

      <View style={styles.guideBody}>
        <View style={styles.guideTitleRow}>
          <AppIcon
            name={icon}
            size={18}
            color={COLORS.accent}
          />

          <Text style={styles.guideTitle}>
            {title}
          </Text>
        </View>

        <Text style={styles.guideDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

export default function HelpCenterScreen({
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

  const [
    searchText,
    setSearchText,
  ] = useState('');

  const [
    expandedId,
    setExpandedId,
  ] = useState(null);

  const faqs = useMemo(
    () => [
      {
        id: 'addTransaction',
        icon: 'add-circle-outline',
        question: t(
          'helpCenter.faq.addTransaction.question'
        ),
        answer: t(
          'helpCenter.faq.addTransaction.answer'
        ),
      },
      {
        id: 'editTransaction',
        icon: 'create-outline',
        question: t(
          'helpCenter.faq.editTransaction.question'
        ),
        answer: t(
          'helpCenter.faq.editTransaction.answer'
        ),
      },
      {
        id: 'deleteTransaction',
        icon: 'trash-outline',
        question: t(
          'helpCenter.faq.deleteTransaction.question'
        ),
        answer: t(
          'helpCenter.faq.deleteTransaction.answer'
        ),
      },
      {
        id: 'currency',
        icon: 'cash-outline',
        question: t(
          'helpCenter.faq.currency.question'
        ),
        answer: t(
          'helpCenter.faq.currency.answer'
        ),
      },
      {
        id: 'language',
        icon: 'language-outline',
        question: t(
          'helpCenter.faq.language.question'
        ),
        answer: t(
          'helpCenter.faq.language.answer'
        ),
      },
      {
        id: 'theme',
        icon: 'moon-outline',
        question: t(
          'helpCenter.faq.theme.question'
        ),
        answer: t(
          'helpCenter.faq.theme.answer'
        ),
      },
      {
        id: 'scan',
        icon: 'scan-outline',
        question: t(
          'helpCenter.faq.scan.question'
        ),
        answer: t(
          'helpCenter.faq.scan.answer'
        ),
      },
      {
        id: 'security',
        icon: 'shield-checkmark-outline',
        question: t(
          'helpCenter.faq.security.question'
        ),
        answer: t(
          'helpCenter.faq.security.answer'
        ),
      },
      {
        id: 'offline',
        icon: 'cloud-offline-outline',
        question: t(
          'helpCenter.faq.offline.question'
        ),
        answer: t(
          'helpCenter.faq.offline.answer'
        ),
      },
      {
        id: 'goals',
        icon: 'flag-outline',
        question: t(
          'helpCenter.faq.goals.question'
        ),
        answer: t(
          'helpCenter.faq.goals.answer'
        ),
      },
    ],
    [t]
  );

  const guideSteps = useMemo(
    () => [
      {
        step: '1',
        icon: 'person-circle-outline',
        title: t(
          'helpCenter.guide.steps.account.title'
        ),
        description: t(
          'helpCenter.guide.steps.account.description'
        ),
      },
      {
        step: '2',
        icon: 'add-circle-outline',
        title: t(
          'helpCenter.guide.steps.transaction.title'
        ),
        description: t(
          'helpCenter.guide.steps.transaction.description'
        ),
      },
      {
        step: '3',
        icon: 'swap-horizontal-outline',
        title: t(
          'helpCenter.guide.steps.movements.title'
        ),
        description: t(
          'helpCenter.guide.steps.movements.description'
        ),
      },
      {
        step: '4',
        icon: 'bar-chart-outline',
        title: t(
          'helpCenter.guide.steps.stats.title'
        ),
        description: t(
          'helpCenter.guide.steps.stats.description'
        ),
      },
      {
        step: '5',
        icon: 'settings-outline',
        title: t(
          'helpCenter.guide.steps.preferences.title'
        ),
        description: t(
          'helpCenter.guide.steps.preferences.description'
        ),
      },
    ],
    [t]
  );

  const normalizedSearch =
    searchText
      .trim()
      .toLowerCase();

  const filteredFaqs =
    normalizedSearch
      ? faqs.filter((item) =>
          `${item.question} ${item.answer}`
            .toLowerCase()
            .includes(normalizedSearch)
        )
      : faqs;

  const toggleFaq = (id) => {
    setExpandedId((current) =>
      current === id
        ? null
        : id
    );
  };

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
          {t('helpCenter.title')}
        </Text>

        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <AppIcon
              name="help-buoy-outline"
              size={30}
              color={COLORS.accent}
            />
          </View>

          <Text style={styles.heroTitle}>
            {t('helpCenter.heroTitle')}
          </Text>

          <Text style={styles.heroText}>
            {t('helpCenter.heroText')}
          </Text>
        </View>

        <View style={styles.searchBox}>
          <AppIcon
            name="search-outline"
            size={18}
            color={COLORS.textMuted}
          />

          <TextInput
            style={styles.searchInput}
            placeholder={t(
              'helpCenter.searchPlaceholder'
            )}
            placeholderTextColor={
              COLORS.textMuted
            }
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            returnKeyType="search"
          />

          {!!searchText && (
            <TouchableOpacity
              onPress={() =>
                setSearchText('')
              }
              activeOpacity={0.8}
            >
              <AppIcon
                name="close-circle"
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          {t('helpCenter.faqTitle')}
        </Text>

        {filteredFaqs.length > 0 ? (
          <View style={styles.faqList}>
            {filteredFaqs.map(
              (item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  expanded={
                    expandedId === item.id
                  }
                  onPress={() =>
                    toggleFaq(item.id)
                  }
                  styles={styles}
                  COLORS={COLORS}
                />
              )
            )}
          </View>
        ) : (
          <View style={styles.emptySearch}>
            <View style={styles.emptySearchIcon}>
              <AppIcon
                name="search-outline"
                size={30}
                color={COLORS.textMuted}
              />
            </View>

            <Text style={styles.emptySearchTitle}>
              {t(
                'helpCenter.noResultsTitle'
              )}
            </Text>

            <Text style={styles.emptySearchText}>
              {t(
                'helpCenter.noResultsText'
              )}
            </Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() =>
                setSearchText('')
              }
              activeOpacity={0.85}
            >
              <Text style={styles.clearButtonText}>
                {t(
                  'helpCenter.clearSearch'
                )}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {t('helpCenter.guide.title')}
        </Text>

        <View style={styles.guideCard}>
          <Text style={styles.guideIntro}>
            {t(
              'helpCenter.guide.description'
            )}
          </Text>

          {guideSteps.map(
            (item, index) => (
              <GuideStep
                key={item.step}
                {...item}
                isLast={
                  index ===
                  guideSteps.length - 1
                }
                styles={styles}
                COLORS={COLORS}
              />
            )
          )}
        </View>

        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <AppIcon
              name="chatbubble-ellipses-outline"
              size={24}
              color={COLORS.blue}
            />
          </View>

          <View style={styles.supportBody}>
            <Text style={styles.supportTitle}>
              {t(
                'helpCenter.moreHelpTitle'
              )}
            </Text>

            <Text style={styles.supportText}>
              {t(
                'helpCenter.moreHelpText'
              )}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() =>
              navigation.navigate(
                'ReportProblem'
              )
            }
            activeOpacity={0.85}
          >
            <Text
              style={
                styles.supportButtonText
              }
            >
              {t(
                'helpCenter.reportProblem'
              )}
            </Text>
          </TouchableOpacity>
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
      backgroundColor:
        COLORS.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor:
        `${COLORS.accent}29`,
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
      justifyContent: 'center',
      marginBottom: 14,
    },

    heroTitle: {
      fontSize: 21,
      fontWeight: '800',
      color: COLORS.textPrimary,
      textAlign: 'center',
      marginBottom: 7,
    },

    heroText: {
      fontSize: 13,
      color: COLORS.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },

    searchBox: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor:
        COLORS.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
      paddingHorizontal: 14,
      marginBottom: 24,
    },

    searchInput: {
      flex: 1,
      fontSize: 14,
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

    faqList: {
      gap: 10,
      marginBottom: 26,
    },

    faqCard: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: 'hidden',
    },

    faqHeader: {
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },

    faqIconWrapper: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor:
        COLORS.accentDim,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },

    faqQuestion: {
      flex: 1,
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.textPrimary,
      lineHeight: 20,
    },

    faqAnswerBox: {
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor:
        COLORS.surfaceHigh,
    },

    faqAnswer: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 20,
    },

    emptySearch: {
      alignItems: 'center',
      paddingVertical: 38,
      paddingHorizontal: 20,
      marginBottom: 26,
      backgroundColor:
        COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    emptySearchIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor:
        COLORS.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    emptySearchTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 6,
      textAlign: 'center',
    },

    emptySearchText: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
      marginBottom: 18,
    },

    clearButton: {
      backgroundColor:
        COLORS.accent,
      borderRadius: 13,
      paddingHorizontal: 18,
      paddingVertical: 11,
    },

    clearButtonText: {
      fontSize: 13,
      fontWeight: '800',
      color:
        COLORS.buttonText ||
        COLORS.bg,
    },

    guideCard: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginBottom: 20,
    },

    guideIntro: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 20,
      marginBottom: 20,
    },

    guideStep: {
      flexDirection: 'row',
      minHeight: 92,
    },

    guideStepLast: {
      minHeight: 70,
    },

    guideLeft: {
      width: 34,
      alignItems: 'center',
      marginRight: 12,
    },

    guideNumber: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor:
        COLORS.accent,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },

    guideNumberText: {
      fontSize: 12,
      fontWeight: '900',
      color:
        COLORS.buttonText ||
        COLORS.bg,
    },

    guideLine: {
      width: 2,
      flex: 1,
      backgroundColor:
        COLORS.border,
      marginTop: 4,
    },

    guideBody: {
      flex: 1,
      paddingBottom: 18,
    },

    guideTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },

    guideTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: '800',
      color: COLORS.textPrimary,
    },

    guideDescription: {
      fontSize: 12,
      color: COLORS.textSecondary,
      lineHeight: 19,
    },

    supportCard: {
      backgroundColor:
        COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 16,
      marginBottom: 10,
    },

    supportIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor:
        `${COLORS.blue}18`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },

    supportBody: {
      marginBottom: 14,
    },

    supportTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: COLORS.textPrimary,
      marginBottom: 5,
    },

    supportText: {
      fontSize: 13,
      color: COLORS.textSecondary,
      lineHeight: 20,
    },

    supportButton: {
      height: 46,
      borderRadius: 14,
      backgroundColor:
        COLORS.surfaceHigh,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      justifyContent: 'center',
    },

    supportButtonText: {
      fontSize: 13,
      fontWeight: '800',
      color: COLORS.blue,
    },

    footerText: {
      marginTop: 26,
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