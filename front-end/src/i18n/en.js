export default {
  common: {
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    loading: 'Loading...',
    error: 'Error',
    accept: "OK",
    delete: "Delete",
    done: "Done"
  },

  profile: {
    title: 'My Profile',
    account: 'Account',
    preferences: 'Preferences',
    data: 'Data',
    support: 'Support',
    session: 'Session',

    editPersonalData: 'Edit personal information',
    editPersonalDataSubtitle: 'Name, email and addresses',

    security: 'Security and access',
    securitySubtitle: 'Authentication, sessions and access',

    appearance: 'Appearance',
    appearanceSubtitle: 'Light, dark or automatic',

    currency: 'Main currency',
    language: 'Language',
    notifications: 'Notifications',
    notificationsSubtitle: 'Alerts, reminders and summaries',

    exportData: 'Export data',
    exportDataSubtitle: 'Download expenses, income and reports',

    helpCenter: 'Help center',
    helpCenterSubtitle: 'Frequently asked questions and guides',

    reportProblem: 'Report a problem',
    reportProblemSubtitle: 'Let us know if something is not working',

    about: 'About Spendly',

    logout: 'Log out',
    logoutConfirmTitle: 'Log out',
    logoutConfirmText:
      'Are you sure you want to log out of Spendly?',

    activeAccount: 'Active account',
    inactiveAccount: 'Inactive account',

    defaultUser: 'User',
    verifyIdentity: 'Verify identity',
     version: 'Version',
    profilePhoto: 'Profile photo',
    viewProfilePhoto: 'View profile photo',
    updatePhoto: 'Update photo',
    addPhoto: 'Add photo',
    deletePhoto: 'Delete photo',

  },

  navigation: {
    home: 'Home',
    transactions: 'Transactions',
    stats: 'Stats',
    goals: 'Goals',
  },

  language: {
    title: 'Language',
    subtitle: 'Choose the application language',
    spanish: 'Spanish',
    english: 'English',
    portuguese: 'Portuguese',
    russian: 'Russian',
    chinese: 'Chinese',
    french: 'French',
    german: 'German',

    currentLanguage: 'Current language',
    availableLanguages: 'Available languages',
    current: 'Current',
    saving: 'Saving language...',
    changeInfo:
      'The change is applied immediately on screens that already have translations.',
  },

  about: {
  title: 'About Spendly',
  appSubtitle:
    'Smart management of expenses, income and financial goals.',
  versionPrefix: 'Version',
  aboutApp: 'About the application',
  descriptionOne:
    'Spendly is a mobile application designed to help you record, organize and understand your financial transactions in a simple way.',
  descriptionTwo:
    'It allows you to manage expenses and income, review statistics, scan tickets using artificial intelligence and work toward savings goals.',
  information: 'Information',
  currentVersion: 'Current version',
  status: 'Status',
  beta: 'Beta',
  platform: 'Platform',
  mobileApp: 'Mobile application',
  documentation: 'Documentation',
  terms: 'Terms and conditions',
  termsSubtitle: 'Spendly terms of use',
  privacy: 'Privacy policy',
  privacySubtitle: 'How we protect your data',
  rights: 'All rights reserved.',
},


  categories: {
  food: "Food",
  transport: "Transport",
  supermarket: "Supermarket",
  services: "Utilities",
  health: "Health",
  education: "Education",
  entertainment: "Entertainment",
  clothing: "Clothing",
  technology: "Technology",
  salary: "Salary",
  freelance: "Freelance",
  investments: "Investments",
  sales: "Sales",
  gifts: "Gifts",
  refunds: "Refunds",
  other: "Other"
},

methods:
{
  cash: "Cash",
  debitCard: "Debit card",
  creditCard: "Credit card",
  transfer: "Transfer",
  bankTransfer: "Bank transfer",
  deposit: "Deposit",
  digitalWallet: 'Digital wallet',
  contactlessPayment: 'Contactless payment',
  bankAccount: 'Bank account',
  other: "Other"
},

transactionList: {
  unknownDate: "Unknown date",
  today: "Today",
  yesterday: "Yesterday",
  startAdding: "Start by adding one now.",
  loadError: "The {items} could not be loaded.",
  deleteTitle: "Delete {item}",
  deleteConfirm: "Are you sure you want to delete \"{description}\"?",
  deleteError: "The {item} could not be deleted.",
  searchPlaceholder: "Search {items}...",
  sortTitle: "Sort transactions",
  clearSearch: "Clear search",
  records: "Records",
  mainCategory: "Top category",
  loading: "Loading {items}...",
  noResultsTitle: "No results found",
  noResultsText: "Try another search or remove the applied filters.",
  clearFilters: "Clear filters",
  deleteHint: "Press and hold a transaction to delete it",
  sort: {
    recent: "Most recent",
    oldest: "Oldest",
    highest: "Highest amount",
    lowest: "Lowest amount"
  },
  income: {
    title: "Income",
    subtitle: "Keep track of the money you receive",
    summaryLabel: "Total income this month",
    singular: "income",
    plural: "income entries",
    emptyTitle: "No income recorded",
    emptyDescription: "You have not recorded any income this month yet.",
    emptyButton: "Add first income",
    defaultDescription: "Income without description"
  },
  expense: {
    title: "Expenses",
    subtitle: "Keep track of your recent transactions",
    summaryLabel: "Total spent this month",
    singular: "expense",
    plural: "expenses",
    emptyTitle: "No expenses recorded",
    emptyDescription: "You have not added any expenses this month yet.",
    emptyButton: "Add first expense",
    defaultDescription: "Expense without description"
  }
},

addTransaction: {
  categoryPlaceholder: "Select a category",
  description: "Description",
  dateTime: "Date and time",
  noteOptional: "Note (optional)",
  category: "Category",
  saveErrorTitle: "Could not save",
  saveErrorMessage: "An error occurred while recording the transaction.",
  errors: {
    amountRequired: "Amount is required",
    amountPositive: "Amount must be greater than 0",
    categoryRequired: "Select a category"
  },
  income: {
    title: "New income",
    amountQuestion: "How much did you receive?",
    descriptionPlaceholder: "Example: Salary, sale, freelance work...",
    descriptionFallback: "Income without description",
    categoryLabel: "Income category *",
    methodLabel: "Receiving method",
    notePlaceholder: "Add a note about the income...",
    saveButton: "Save income",
    savingText: "Saving income...",
    successTitle: "Income recorded",
    successMessage: "The income was saved successfully."
  },
  expense: {
    title: "New expense",
    amountQuestion: "How much did you spend?",
    descriptionPlaceholder: "Example: McDonald's, Uber, Netflix...",
    descriptionFallback: "Expense without description",
    categoryLabel: "Expense category *",
    methodLabel: "Payment method",
    notePlaceholder: "Add a note about the expense...",
    saveButton: "Save expense",
    savingText: "Saving expense...",
    successTitle: "Expense recorded",
    successMessage: "The expense was saved successfully."
  }
},

currency: {
  title: 'Main currency',
  chooseCurrency: 'Choose your currency',
  description:
    'This currency will be used as a reference for expenses, reports, budgets and statistics in Spendly.',
  currentCurrency: 'Current currency',
  example: 'Example',
  availableCurrencies: 'Available currencies',
  current: 'Current',
  loading: 'Loading currencies...',
  saving: 'Saving',
  syncInfo:
    'The selected currency is saved on this device and synchronized with your account.',
  loadError: 'The selected currency could not be loaded.',
  saveError: 'The selected currency could not be saved.',

  currencies: {
    ars: 'Argentine peso',
    usd: 'United States dollar',
    eur: 'Euro',
    gbp: 'Pound sterling',
    brl: 'Brazilian real',
    clp: 'Chilean peso',
    uyu: 'Uruguayan peso',
    mxn: 'Mexican peso',
    rub: 'Russian ruble',
    cny: 'Chinese yuan',
  },
},

helpCenter: {
  title: 'Help center',
  heroTitle: 'How can we help you?',
  heroText:
    'Find quick answers and learn how to use Spendly’s main features.',
  searchPlaceholder: 'Search for a question...',
  faqTitle: 'Frequently asked questions',
  noResultsTitle: 'No results found',
  noResultsText:
    'Try different words or review the quick guide.',
  clearSearch: 'Clear search',
  moreHelpTitle: 'Still need help?',
  moreHelpText:
    'You can report a problem and tell us what is happening.',
  reportProblem: 'Report a problem',

  faq: {
    addTransaction: {
      question: 'How do I add an expense or income?',
      answer:
        'Open Transactions, choose Expenses or Income and tap the + button. Complete the amount, category and optional details before saving.',
    },
    editTransaction: {
      question: 'Can I edit a transaction?',
      answer:
        'Editing depends on the available version. You will be able to change its data from the transaction details when this feature is enabled.',
    },
    deleteTransaction: {
      question: 'How do I delete a transaction?',
      answer:
        'In the transaction list, press and hold the operation you want to delete and confirm the action.',
    },
    currency: {
      question: 'How do I change the main currency?',
      answer:
        'Open Profile, enter Main currency and choose the currency you want to use. Amounts will be displayed using that format.',
    },
    language: {
      question: 'How do I change the language?',
      answer:
        'From Profile, open Language and choose one of the available options. The change is applied immediately.',
    },
    theme: {
      question: 'How do I enable dark mode?',
      answer:
        'In Profile, open Appearance and choose Light, Dark or Automatic to follow the device theme.',
    },
    scan: {
      question: 'How does ticket scanning work?',
      answer:
        'Open Scan, take a photo or choose an image from the gallery. Spendly will send the ticket to the analysis system to detect its data.',
    },
    security: {
      question: 'Can I protect my account with PIN or biometrics?',
      answer:
        'Yes. Open Profile, then Security and access, and configure the PIN or biometric authentication available on your device.',
    },
    offline: {
      question: 'Does Spendly work offline?',
      answer:
        'Some preferences may remain on the device, but features that read or save server data require an internet connection.',
    },
    goals: {
      question: 'How do financial goals work?',
      answer:
        'Goals let you define a savings target, assign an amount and track progress. This feature may depend on backend availability.',
    },
  },

  guide: {
    title: 'Quick start guide',
    description:
      'Follow these steps to start organizing your finances with Spendly.',
    steps: {
      account: {
        title: 'Review your profile',
        description:
          'Complete your information and choose language, currency, appearance and security options.',
      },
      transaction: {
        title: 'Record your transactions',
        description:
          'Add every expense or income with its amount, category, date and description.',
      },
      movements: {
        title: 'Review and search',
        description:
          'Use the list to search, sort and review all your recent transactions.',
      },
      stats: {
        title: 'Analyze your statistics',
        description:
          'Review totals, top categories and highlighted transactions to better understand your habits.',
      },
      preferences: {
        title: 'Customize Spendly',
        description:
          'Configure theme, language, currency and security to adapt the application to your preferences.',
      },
    },
  },
},

terms: {
  title: 'Terms and conditions',
  subtitle: 'General conditions for using Spendly and its features.',
  contentTitle: 'Terms of use',
  meta: {
    versionLabel: 'Legal version',
    versionValue: '1.0',
    updatedLabel: 'Last updated',
    updatedValue: 'July 2026',
    responsibleLabel: 'Responsible team'
  },
  notice: 'This is an informational version prepared for Spendly. Before a final commercial release, Team GST should obtain professional legal review.',
  sections: {
    acceptance: {
      title: 'Acceptance of the terms',
      text: 'By creating an account, accessing or using Spendly, you agree to these terms. If you disagree, you must stop using the application.'
    },
    permittedUse: {
      title: 'Permitted use of Spendly',
      text: 'Spendly is intended for personal financial organization. It may not be used for illegal, fraudulent, abusive activities or actions that disrupt the platform.'
    },
    account: {
      title: 'Account and credentials',
      text: 'You are responsible for protecting your credentials, PIN and biometric methods, reporting unauthorized access and keeping your account details current.'
    },
    financialData: {
      title: 'Financial information',
      text: 'Amounts, categories, descriptions and other information entered by the user must be reviewed before saving. Spendly organizes information but cannot guarantee that user-provided records are complete or accurate.'
    },
    ai: {
      title: 'OCR and artificial intelligence',
      text: 'Ticket scanning may use OCR and artificial intelligence. Results may contain errors, so you must review and correct the information before confirming it.'
    },
    availability: {
      title: 'Service availability',
      text: 'Team GST will make reasonable efforts to keep Spendly available. Features may be interrupted by maintenance, updates, infrastructure failures or third-party services.'
    },
    security: {
      title: 'Security and access',
      text: 'Spendly uses authentication, secure password handling and access controls. No system is completely infallible, so you must also protect your device and credentials.'
    },
    intellectualProperty: {
      title: 'Intellectual property',
      text: 'The Spendly name, design, code, text, visual assets and documentation belong to Team GST or their respective authors and may not be copied or redistributed without authorization.'
    },
    updates: {
      title: 'Updates and changes',
      text: 'Spendly may add, modify or remove features. These terms may also be updated, and the latest modification date will be shown in the application.'
    },
    liability: {
      title: 'Limitation of liability',
      text: 'Spendly does not provide financial, accounting, tax or legal advice. Decisions based on information displayed by the app remain the user’s responsibility.'
    },
    suspension: {
      title: 'Account suspension or closure',
      text: 'Team GST may restrict or suspend accounts used abusively, fraudulently or contrary to these terms. Users may request account deletion when that feature is available.'
    },
    contact: {
      title: 'Contact',
      text: 'Questions about these terms may be sent through Help center or Report a problem inside Spendly.'
    }
  }
},

privacy: {
  title: 'Privacy policy',
  subtitle: 'How Spendly collects, uses and protects user information.',
  contentTitle: 'Data processing',
  meta: {
    versionLabel: 'Legal version',
    versionValue: '1.0',
    updatedLabel: 'Last updated',
    updatedValue: 'July 2026',
    responsibleLabel: 'Responsible team'
  },
  notice: 'This policy describes Spendly’s current operation. Before a final commercial release, Team GST should validate it with professional legal advice.',
  sections: {
    collection: {
      title: 'Information we collect',
      text: 'Spendly may process name, email address, profile information, expenses, income, categories, dates, descriptions, goals, preferences and technical data required to operate the application.'
    },
    use: {
      title: 'How we use information',
      text: 'Information is used to authenticate users, display balances, generate statistics, save preferences, improve the experience and provide Spendly’s main features.'
    },
    financialData: {
      title: 'Personal financial data',
      text: 'Recorded transactions are used only to provide personal organization tools. Spendly is not a bank, does not hold funds and does not perform financial transactions on the user’s behalf.'
    },
    ai: {
      title: 'Tickets, OCR and artificial intelligence',
      text: 'Ticket images may be sent to processing services to extract merchant, amount, date, category and description. Users can review results before saving them.'
    },
    deviceStorage: {
      title: 'Data stored on the device',
      text: 'Some preferences, such as session, theme, language, currency, PIN or biometrics, may be stored locally using device mechanisms to improve continuity of use.'
    },
    security: {
      title: 'Information security',
      text: 'Spendly uses authentication, protected passwords and secure connections. Although reasonable safeguards are applied, no system can guarantee absolute security.'
    },
    services: {
      title: 'Services and infrastructure',
      text: 'Spendly may use Railway, PostgreSQL, FastAPI, Expo and image-processing providers. These services are used only to host, process or deliver application features.'
    },
    retention: {
      title: 'Data retention',
      text: 'Data may be retained while the account remains active or for as long as necessary to provide the service, meet technical needs and resolve incidents.'
    },
    rights: {
      title: 'User rights',
      text: 'Users may request access, correction, export or deletion of their data when the corresponding features are available and within the project’s technical capabilities.'
    },
    deletion: {
      title: 'Data deletion',
      text: 'Deleting an account may remove transactions, preferences and related information, except data that must be temporarily retained for technical or security reasons.'
    },
    academic: {
      title: 'Academic project',
      text: 'Spendly is an academic project under development. Its features, infrastructure and data practices may evolve in future versions.'
    },
    contact: {
      title: 'Privacy contact',
      text: 'Privacy questions or requests may be sent through Help center or Report a problem inside Spendly.'
    }
  }
},

editProfile: {
  title: 'Edit profile',
  loading: 'Loading profile...',
  heroTitle: 'Your personal information',
  heroText:
    'Update the information we use to personalize your Spendly experience.',
  personalInformation: 'Personal information',
  displayName: 'Display name',
  displayNamePlaceholder: 'Example: Pedro',
  displayNameHelper:
    'This name will be used in greetings and messages within the application.',
  fullName: 'Full name',
  fullNamePlaceholder: 'Your full name',
  email: 'Email address',
  emailHelper:
    'For security reasons, the email address cannot be changed.',
  memberSince: 'Member since',
  notAvailable: 'Not available',
  saveChanges: 'Save changes',
  saving: 'Saving...',
  successTitle: 'Profile updated',
  successMessage:
    'Your information was updated successfully.',
  loadError:
    'Profile information could not be loaded.',
  saveError:
    'The changes could not be saved.',

  validation: {
    displayNameRequired:
      'The display name is required.',
    displayNameTooShort:
      'The display name must contain at least 2 characters.',
    fullNameRequired:
      'The full name is required.',
    fullNameTooShort:
      'The full name must contain at least 3 characters.',
  },
},

stats: {
  title: 'Statistics',
  loading: 'Loading statistics...',
  loadError: 'Statistics could not be loaded.',
  periodLabel: 'Period',
  noPreviousComparison: 'No previous comparison',
  comparisonValue: '{value} vs. previous period',
  noData: 'No data',
  noDescription: 'No description',
  percentageOfTotal: '{value}% of total',
  topCategory: 'Top category',
  monthlyEvolution: 'Last 6 months evolution',
  expenseByCategory: 'Expenses by category',
  incomeByCategory: 'Income by category',
  recentTransactions: 'Recent transactions',
  searchPlaceholder: 'Search transaction or category...',
  emptyCategoriesTitle: 'No category data',
  emptyCategoriesText: 'Once you record transactions during this period, the breakdown will appear here.',
  emptyTransactionsTitle: 'No transactions',
  emptyTransactionsText: 'There are no transactions for the selected period yet.',
  noSearchResults: 'No transactions matched your search.',
  clearSearch: 'Clear search',
  addExpense: 'Add expense',
  addIncome: 'Add income',
  periods: { currentMonth: 'This month', previousMonth: 'Previous month', threeMonths: 'Last 3 months', sixMonths: 'Last 6 months', currentYear: 'This year', all: 'All time' },
  views: { overview: 'Overview', expense: 'Expenses', income: 'Income' },
  hero: { balance: 'Period balance', totalExpenses: 'Total expenses', totalIncome: 'Total income' },
  metrics: { income: 'Income', expenses: 'Expenses', balance: 'Balance', records: 'Records', savingsRate: 'Savings rate: {value}', recordsBreakdown: '{expenses} expenses · {income} income' },
  insights: { averageExpense: 'Average expense', averageIncome: 'Average income', perExpense: 'per expense', perIncome: 'per income', highestExpense: 'Highest expense', highestIncome: 'Highest income' },
},

security: {
  title: 'Security and access',
  heroTitle: 'Protect your account',
  heroText: 'Manage your password, access methods and local device security.',
  access: 'Access',
  sessions: 'Session',
  changePassword: 'Change password',
  changePasswordSubtitle: 'Update your access password',
  biometric: 'Face ID / fingerprint',
  accessPin: 'Access PIN',
  enabled: 'Enabled',
  disabled: 'Disabled',
  connectedDevices: 'Connected devices',
  connectedDevicesSubtitle: 'View active sessions',
  logoutDevice: 'Sign out on this device',
  logoutDeviceSubtitle: 'Sign out of Spendly on this phone',
  biometricUnavailable: 'This device does not support biometric authentication.',
  biometricNotConfigured: 'No biometric method is configured.',
  enableBiometricPrompt: 'Enable biometric access for Spendly',
  disableBiometricPrompt: 'Disable biometric access for Spendly',
  createPin: 'Create PIN',
  confirmPin: 'Confirm PIN',
  disablePin: 'Disable PIN',
  createPinText: 'Enter a 4-digit PIN to protect Spendly.',
  confirmPinText: 'Enter the PIN again to confirm it.',
  disablePinText: 'Enter your current PIN to disable it.',
  pinMismatch: 'The PINs do not match.',
  incorrectPin: 'Incorrect PIN.',
  logoutTitle: 'Sign out',
  logoutConfirm: 'Do you want to sign out on this device?',
  logout: 'Sign out',
},

sessions: {
  title: 'Connected devices', loading: 'Loading sessions...', loadError: 'Sessions could not be loaded.',
  heroTitle: 'Active sessions', heroText: 'Review the devices where your account is signed in and close any access you do not recognize.',
  currentSession: 'Current session', otherDevices: 'Other devices', current: 'Current', unknownDevice: 'Unknown device', noData: 'No data',
  ip: 'IP', lastActivity: 'Last activity', created: 'Created', closeSession: 'Close session', closeAll: 'Close all', close: 'Close',
  currentNotDetectedTitle: 'Current session not detected', currentNotDetectedText: 'We could not identify which session belongs to this device.',
  allGoodTitle: 'Everything is secure', allGoodText: 'There are no other devices connected to your account.',
  info: 'When you close a session, that device must sign in again to access Spendly.',
  singleModalTitle: 'Close session', singleModalText: 'Do you want to close the session on this device?',
  allModalTitle: 'Close other sessions', allModalText: 'This will sign your account out on every other device while keeping this session active.',
  passwordPlaceholder: 'Current password', passwordRequired: 'Enter your password.', successTitle: 'Sessions updated',
  singleSuccess: 'The session was closed successfully.', allSuccess: 'The other sessions were closed successfully.',
  singleError: 'The session could not be closed.', allError: 'The sessions could not be closed.',
},

pinUnlock: {
  loading: 'Loading security...',
  title: 'Unlock Spendly',
  subtitle: 'Enter your access PIN to continue.',
  lockedTitle: 'PIN locked',
  lockedSubtitle: 'Try again in {time}.',
  tooManyAttempts: 'Too many failed attempts.',
  incorrectWithAttempts:
    'Incorrect PIN. Attempts remaining: {attempts}.',
  attemptsUsed: 'Attempts used: {used} of {max}',
  pinNotConfigured:
    'No PIN is configured. Returning to the previous screen.',
  loadError:
    'The security status could not be loaded.',
  validationError:
    'The PIN could not be validated.',

  time: {
    hoursMinutes: '{hours} h {minutes} min',
  },
},

changePassword: {
  title: 'Change password',
  heroTitle: 'Update your password',
  heroText: 'Use a secure password that is different from the previous one to protect your account.',
  currentPassword: 'Current password',
  currentPlaceholder: 'Enter your current password',
  newPassword: 'New password',
  newPlaceholder: 'At least 8 characters',
  repeatPassword: 'Repeat new password',
  repeatPlaceholder: 'Repeat the new password',
  save: 'Save new password',
  saving: 'Saving...',
  saveError: 'The password could not be changed.',
  successTitle: 'Password updated',
  successText: 'Your password was changed successfully.',
  validation: {
    required: 'Complete all fields.',
    minLength: 'The new password must contain at least 8 characters.',
    samePassword: 'The new password must be different from the current one.',
    noMatch: 'The new passwords do not match.',
  },
},

notifications: {
  title: 'Notifications', loading: 'Loading notifications...', loadError: 'The settings could not be loaded.', saveError: 'The settings could not be saved.',
  heroTitle: 'Useful alerts, without the noise', heroText: 'Choose occasional reminders that genuinely help you manage your finances.',
  generalSection: 'General', activitySection: 'Activity', summarySection: 'Summaries', goalsSection: 'Goals',
  permissionTitle: 'System permission', openSettings: 'Settings', permissionDeniedTitle: 'Permission disabled', permissionDeniedText: 'Enable notifications in your device settings to use this feature.',
  permissionRequiredTitle: 'Permission required', permissionRequiredText: 'Enable Spendly notifications first.', testScheduledTitle: 'Notification scheduled', testScheduledText: 'You will receive it in a few seconds.', testButton: 'Send test notification',
  goalsInfo: 'Goal alerts will open the matching goal directly. They are only sent for approaching deadlines, important progress or completion.',
  permission: { granted: 'Allowed', denied: 'Blocked', undetermined: 'Not configured' },
  master: { title: 'Allow notifications', subtitle: 'Main control for all local Spendly alerts.' },
  daily: { title: 'Transaction reminder', subtitle: 'One daily reminder for pending expenses or income.', timeTitle: 'Reminder time', timeHint: 'Evening times reduce interruptions during the day.' },
  weekly: { title: 'Weekly summary', subtitle: 'One Monday evening alert to review the previous week.' },
  monthly: { title: 'Monthly summary', subtitle: 'One alert on the first day of the month to review income and expenses.' },
  goalDeadline: { title: 'Goals nearing their deadline', subtitle: 'Notify three days before the target date.' },
  goalProgress: { title: 'Important progress', subtitle: 'Notify once when a goal reaches approximately 80%.' },
  goalCompleted: { title: 'Goal completed', subtitle: 'Celebrate when you reach the target amount.' },
  copy: { dailyTitle: 'Any transaction still pending?', dailyBody: 'Recording today’s activity takes less than a minute.', weeklyTitle: 'Your weekly financial summary is ready', weeklyBody: 'Review income, expenses and your weekly balance.', monthlyTitle: 'A new month, a new summary', monthlyBody: 'See how the previous month ended in Statistics.', testTitle: 'Spendly is ready', testBody: 'Notifications are working correctly.' },
},

goals: {
  title: 'Goals', subtitle: 'Turn your objectives into real progress.', loading: 'Loading goals...', search: 'Search goals...',
  filters: { all: 'All', active: 'Active', paused: 'Paused', completed: 'Completed', cancelled: 'Cancelled' },
  status: { active: 'Active', paused: 'Paused', completed: 'Completed', cancelled: 'Cancelled' },
  priority: { low: 'Low', medium: 'Medium', high: 'High' },
  category: { emergency: 'Emergency', travel: 'Travel', home: 'Home', education: 'Education', vehicle: 'Vehicle', technology: 'Technology', health: 'Health', other: 'Other' },
  summary: { active: 'Active', completed: 'Completed', saved: 'Total saved' }, card: { remaining: 'Remaining' },
  empty: { title: 'You do not have any goals yet', text: 'Create your first objective and start recording contributions.' },
  actions: { create: 'Create goal', saveChanges: 'Save changes', contribute: 'Contribute', withdraw: 'Withdraw', confirm: 'Confirm', edit: 'Edit', pause: 'Pause', resume: 'Resume', cancelGoal: 'Cancel goal', delete: 'Delete' },
  form: { createTitle: 'New goal', editTitle: 'Edit goal', namePlaceholder: 'E.g. Trip to Japan', descriptionPlaceholder: 'What do you want to achieve?', targetAmount: 'Target amount', category: 'Category', priority: 'Priority' },
  detail: { of: 'of', history: 'Movement history' }, movement: { aporte: 'Contribution', retiro: 'Withdrawal', ajuste: 'Adjustment' },
  movementForm: { aporte: 'Add contribution', retiro: 'Add withdrawal', ajuste: 'Add adjustment', amount: 'Amount', note: 'Optional note' },
  validation: { name: 'Enter a name for the goal.', amount: 'Enter a valid target amount.', movementAmount: 'Enter a valid amount.' },
  confirm: { deleteTitle: 'Delete goal', deleteText: 'The goal and its entire history will be permanently deleted.', deleteMovementTitle: 'Delete movement', deleteMovementText: 'The goal progress will be recalculated.' },
  notifications: { deadlineTitle: 'A goal is nearing its deadline', deadlineBody: 'The goal “{goal}” is due in a few days.', progressTitle: 'Great progress!', progressBody: 'The goal “{goal}” has reached {percentage}%.', completedTitle: 'Goal completed!', completedBody: 'You reached the target for “{goal}”.' },
  errors: { load: 'Goals could not be loaded.', save: 'The goal could not be saved.', movement: 'The movement could not be recorded.' }
},

support: { category:{ transactions:'Transactions', profile:'Profile', authentication:'Authentication', scan:'Scanning', statistics:'Statistics', goals:'Goals', notifications:'Notifications', appearance:'Appearance', language:'Language', currency:'Currency', performance:'Performance', other:'Other' }, status:{ all:'All', open:'Open', in_review:'In review', resolved:'Resolved', closed:'Closed' }, validation:{ subject:'The subject must contain at least 5 characters.', description:'The description must contain at least 10 characters.' }, success:{ title:'Report sent', text:'Your report was saved. You can follow its status from My reports.' }, errors:{ submit:'The report could not be sent.' }, report:{ title:'Report a problem', heroTitle:'Tell us what happened', heroText:'Your report helps us find issues and improve Spendly.', category:'Category', subject:'Subject', subjectPlaceholder:'Summarize the problem', description:'Description', descriptionPlaceholder:'Explain what happened and what you expected.', steps:'Steps to reproduce', stepsPlaceholder:'1. Open...\n2. Tap...\n3. It happens...', technicalTitle:'Include technical information', technicalText:'Adds the app version, operating system and device model.', privacy:'Passwords, banking data and financial movements are never sent.', submit:'Send report' }, list:{ title:'My reports', loading:'Loading reports...', emptyTitle:'You have not sent any reports yet', emptyText:'Create a report here whenever you need help.', create:'Create report' }, detail:{ title:'Report details', description:'Description', steps:'Steps to reproduce', dates:'Dates', created:'Created', updated:'Updated', resolved:'Resolved', technical:'Technical information', appVersion:'App version', platform:'Platform', os:'Operating system', device:'Device', responseTitle:'Team response', pendingTitle:'Waiting for a response', pendingText:'The team has not responded to this report yet.' } },


home: {
  greeting: 'Hello, {name}',
  welcomeBack: 'Welcome back',
  defaultUser: 'User',
  loading: 'Loading summary...',
  balanceMonth: 'Total monthly balance',
  income: 'Income',
  expenses: 'Expenses',
  available: 'Available',
  monthSummary: 'Monthly summary',
  totalSpent: 'Total spent',
  totalIncome: 'Total income',
  topCategory: 'Top category',
  noData: 'No data',
  featuredGoal: 'Featured goal',
  goalProgress: '{percent}% completed',
  recentExpenses: 'Recent expenses',
  categories: 'Categories',
  viewAll: 'View all',
  expenseNoDescription: 'Expense without description',
  otherCategory: 'Other',

  quick: {
    expense: 'Expense',
    income: 'Income',
    scan: 'Scan',
    stats: 'Stats',
  },

  emptyGoal: {
    title: 'You do not have active goals yet',
    text:
      'Create a goal to track progress from the Home screen.',
    action: 'Create goal',
  },

  emptyExpenses: {
    title: 'No expenses yet',
    text:
      'Your first expenses will appear here.',
    action: 'Add expense',
  },

  emptyCategories: {
    title: 'No categories yet',
    text:
      'No expenses were recorded in any category this month.',
  },

  date: {
    today: 'Today',
    yesterday: 'Yesterday',
  },

  errors: {
    title: 'We could not update Home',
    load:
      'The main data could not be loaded.',
    retry: 'Retry',
  },
},

register: {
  tagline: 'Smart expense management', title: 'Create account', subtitle: 'Start managing your finances',
  fullName: 'Full name', fullNamePlaceholder: 'Your name', email: 'Email address', emailPlaceholder: 'you@email.com',
  password: 'Password', passwordPlaceholder: '********', confirmPassword: 'Confirm password', passwordRequirement: 'At least 8 characters',
  termsPrefix: 'I accept the', terms: 'Terms and conditions', and: 'and the', privacy: 'Privacy policy',
  create: 'Create account', creating: 'Creating account...', or: 'or', haveAccount: 'Already have an account?', login: 'Log in',
  validation: { name: 'Enter at least 2 characters.', email: 'Enter a valid email address.', password: 'The password must contain at least 8 characters.', confirm: 'Passwords do not match.', terms: 'You must accept the terms and privacy policy.' },
  errors: { emailExists: 'This email is already registered. Try another one or log in.', generic: 'We could not create the account. Please try again.' },
},

login: {
  tagline: 'Smart expense management',
  title: 'Log in',
  subtitle: 'Welcome back',
  email: 'Email address',
  emailPlaceholder: 'you@email.com',
  password: 'Password',
  passwordPlaceholder: '••••••••',
  forgotPassword: 'Forgot your password?',
  rememberSession: 'Keep me signed in',
  submit: 'Log in',
  verifying: 'Verifying...',
  or: 'or',
  noAccount: 'Do not have an account?',
  register: 'Sign up',
  footerPrefix: 'By continuing, you accept the',
  terms: 'Terms and conditions',
  and: 'and the',
  privacy: 'Privacy policy',
  validation: {
    email: 'Enter a valid email address.',
    password: 'Enter your password.',
  },
  errors: {
    invalidCredentials: 'The email or password is incorrect.',
    connection: 'We could not connect to the server. Check your connection.',
    generic: 'We could not log you in. Please try again.',
  },
},

};