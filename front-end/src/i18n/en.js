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
    versionValue: 'Version 1.0.8',
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
  mercadoPago: "Mercado Pago",
  deposit: "Deposit",
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


};