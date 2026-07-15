import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const SETTINGS_KEY = 'spendly_notification_settings';
const IDS_KEY = 'spendly_notification_ids';
const CHANNEL_ID = 'spendly-reminders';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: false,
  dailyReminder: false,
  dailyHour: 20,
  dailyMinute: 0,
  weeklySummary: true,
  monthlySummary: true,
  goalDeadline: true,
  goalProgress: true,
  goalCompleted: true,
};

const DEFAULT_IDS = {
  dailyReminder: null,
  weeklySummary: null,
  monthlySummary: null,
  goals: {},
};

export async function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Spendly',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180],
      sound: null,
    });
  }
}

export async function getNotificationPermissionStatus() {
  return (await Notifications.getPermissionsAsync()).status;
}

export async function requestNotificationPermissions() {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return current.status;
  return (await Notifications.requestPermissionsAsync()).status;
}

export async function getNotificationSettings() {
  const saved = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!saved) return DEFAULT_NOTIFICATION_SETTINGS;

  try {
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export async function saveNotificationSettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}

async function getStoredIds() {
  const saved = await AsyncStorage.getItem(IDS_KEY);
  if (!saved) return DEFAULT_IDS;

  try {
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_IDS,
      ...parsed,
      goals: { ...DEFAULT_IDS.goals, ...(parsed.goals || {}) },
    };
  } catch {
    return DEFAULT_IDS;
  }
}

async function saveStoredIds(ids) {
  await AsyncStorage.setItem(IDS_KEY, JSON.stringify(ids));
}

async function cancelById(id) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {}
}

function trigger(type, values) {
  return {
    type,
    channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
    ...values,
  };
}

export async function syncBaseNotifications({ settings, copy }) {
  const ids = await getStoredIds();

  await Promise.all([
    cancelById(ids.dailyReminder),
    cancelById(ids.weeklySummary),
    cancelById(ids.monthlySummary),
  ]);

  ids.dailyReminder = null;
  ids.weeklySummary = null;
  ids.monthlySummary = null;

  if (!settings.enabled) {
    await saveStoredIds(ids);
    return ids;
  }

  if (settings.dailyReminder) {
    ids.dailyReminder = await Notifications.scheduleNotificationAsync({
      content: {
        title: copy.dailyTitle,
        body: copy.dailyBody,
        data: { screen: 'AddExpense', source: 'daily_reminder' },
      },
      trigger: trigger(Notifications.SchedulableTriggerInputTypes.DAILY, {
        hour: settings.dailyHour,
        minute: settings.dailyMinute,
      }),
    });
  }

  if (settings.weeklySummary) {
    ids.weeklySummary = await Notifications.scheduleNotificationAsync({
      content: {
        title: copy.weeklyTitle,
        body: copy.weeklyBody,
        data: { screen: 'Stats', source: 'weekly_summary' },
      },
      trigger: trigger(Notifications.SchedulableTriggerInputTypes.WEEKLY, {
        weekday: 2,
        hour: 19,
        minute: 0,
      }),
    });
  }

  if (settings.monthlySummary) {
    ids.monthlySummary = await Notifications.scheduleNotificationAsync({
      content: {
        title: copy.monthlyTitle,
        body: copy.monthlyBody,
        data: { screen: 'Stats', source: 'monthly_summary' },
      },
      trigger: trigger(Notifications.SchedulableTriggerInputTypes.MONTHLY, {
        day: 1,
        hour: 19,
        minute: 0,
      }),
    });
  }

  await saveStoredIds(ids);
  return ids;
}

export async function scheduleGoalDeadlineNotification({
  goalId,
  goalName,
  targetDate,
  title,
  body,
}) {
  await cancelGoalNotifications(goalId);
  const settings = await getNotificationSettings();

  if (!settings.enabled || !settings.goalDeadline || !targetDate) return null;

  const date = new Date(targetDate);
  date.setDate(date.getDate() - 3);
  date.setHours(19, 0, 0, 0);
  if (date.getTime() <= Date.now()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: body.replace('{goal}', goalName),
      data: { screen: 'Goals', goalId, source: 'goal_deadline' },
    },
    trigger: date,
  });

  const ids = await getStoredIds();
  ids.goals[String(goalId)] = [id];
  await saveStoredIds(ids);
  return id;
}

export async function sendGoalProgressNotification({
  goalId,
  goalName,
  percentage,
  title,
  body,
}) {
  const settings = await getNotificationSettings();
  if (!settings.enabled || !settings.goalProgress || percentage < 80 || percentage >= 100) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: body
        .replace('{goal}', goalName)
        .replace('{percentage}', String(Math.round(percentage))),
      data: { screen: 'Goals', goalId, source: 'goal_progress' },
    },
    trigger: null,
  });
}

export async function sendGoalCompletedNotification({ goalId, goalName, title, body }) {
  const settings = await getNotificationSettings();
  await cancelGoalNotifications(goalId);
  if (!settings.enabled || !settings.goalCompleted) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: body.replace('{goal}', goalName),
      data: { screen: 'Goals', goalId, source: 'goal_completed' },
    },
    trigger: null,
  });
}

export async function cancelGoalNotifications(goalId) {
  const ids = await getStoredIds();
  const goalIds = ids.goals[String(goalId)] || [];
  await Promise.all(goalIds.map(cancelById));
  delete ids.goals[String(goalId)];
  await saveStoredIds(ids);
}

export async function cancelAllSpendlyNotifications() {
  const ids = await getStoredIds();
  const goalIds = Object.values(ids.goals).flat();
  await Promise.all([
    cancelById(ids.dailyReminder),
    cancelById(ids.weeklySummary),
    cancelById(ids.monthlySummary),
    ...goalIds.map(cancelById),
  ]);
  await saveStoredIds(DEFAULT_IDS);
}

export function addNotificationNavigationListener(navigationRef) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data || {};
    if (!data.screen || !navigationRef?.current) return;

    if (data.screen === 'Goals') {
      navigationRef.current.navigate('Goals', { goalId: data.goalId });
      return;
    }

    navigationRef.current.navigate(data.screen, data.params);
  });
}
