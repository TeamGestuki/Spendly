export default {
  common: {
    back: 'Назад',
    cancel: 'Отмена',
    save: 'Сохранить',
    loading: 'Загрузка...',
    error: 'Ошибка',
    accept: "ОК",
    delete: "Удалить",
    done: "Готово"
  },

  profile: {
    title: 'Мой профиль',
    account: 'Аккаунт',
    preferences: 'Настройки',
    data: 'Данные',
    support: 'Поддержка',
    session: 'Сеанс',

    editPersonalData: 'Редактировать личные данные',
    editPersonalDataSubtitle: 'Имя, электронная почта и адреса',

    security: 'Безопасность и доступ',
    securitySubtitle: 'Аутентификация, сеансы и доступ',

    appearance: 'Внешний вид',
    appearanceSubtitle: 'Светлая, тёмная или системная тема',

    currency: 'Основная валюта',
    language: 'Язык',

    notifications: 'Уведомления',
    notificationsSubtitle: 'Оповещения, напоминания и сводки',

    exportData: 'Экспорт данных',
    exportDataSubtitle:
      'Скачать расходы, доходы и отчёты',

    helpCenter: 'Центр помощи',
    helpCenterSubtitle:
      'Часто задаваемые вопросы и руководства',

    reportProblem: 'Сообщить о проблеме',
    reportProblemSubtitle:
      'Сообщите нам, если что-то не работает',

    about: 'О Spendly',

    logout: 'Выйти',

    logoutConfirmTitle: 'Выход',

    logoutConfirmText:
      'Вы уверены, что хотите выйти из Spendly?',

    activeAccount: 'Аккаунт активен',

    inactiveAccount: 'Аккаунт неактивен',

    defaultUser: 'Пользователь',
    verifyIdentity: 'Подтвердите личность',
    version: 'Версия',
    profilePhoto: 'Фото профиля',
    viewProfilePhoto: 'Посмотреть фото профиля',
    updatePhoto: 'Обновить фото',
    addPhoto: 'Добавить фото',
    deletePhoto: 'Удалить фото',

  },

  navigation: {
    home: 'Главная',
    transactions: 'Операции',
    stats: 'Статистика',
    goals: 'Цели',
  },

  language: {
    title: 'Язык',
    subtitle: 'Выберите язык приложения',

    spanish: 'Испанский',
    english: 'Английский',
    portuguese: 'Португальский',
    russian: 'Русский',
    chinese: 'Китайский',
    french: 'Французский',
    german: 'Немецкий',

    currentLanguage: 'Текущий язык',
    availableLanguages: 'Доступные языки',
    current: 'Текущий',
    saving: 'Сохранение языка...',
    changeInfo:
      'Изменение применяется сразу на экранах, для которых уже добавлен перевод.',
  },

  about: {
  title: 'О Spendly',
  appSubtitle:
    'Умное управление расходами, доходами и финансовыми целями.',
  versionPrefix: 'Версия',
  aboutApp: 'О приложении',
  descriptionOne:
    'Spendly — мобильное приложение, которое помогает просто записывать, организовывать и анализировать финансовые операции.',
  descriptionTwo:
    'Оно позволяет управлять расходами и доходами, просматривать статистику, сканировать чеки с помощью искусственного интеллекта и работать с целями накопления.',
  information: 'Информация',
  currentVersion: 'Текущая версия',
  status: 'Статус',
  beta: 'Бета',
  platform: 'Платформа',
  mobileApp: 'Мобильное приложение',
  documentation: 'Документация',
  terms: 'Условия использования',
  termsSubtitle: 'Условия использования Spendly',
  privacy: 'Политика конфиденциальности',
  privacySubtitle: 'Как мы защищаем ваши данные',
  rights: 'Все права защищены.',
},

  categories: {
  food: "Еда",
  transport: "Транспорт",
  supermarket: "Супермаркет",
  services: "Услуги",
  health: "Здоровье",
  education: "Образование",
  entertainment: "Развлечения",
  clothing: "Одежда",
  technology: "Технологии",
  salary: "Зарплата",
  freelance: "Фриланс",
  investments: "Инвестиции",
  sales: "Продажи",
  gifts: "Подарки",
  refunds: "Возвраты",
  other: "Другое"
},

methods: {
  cash: "Наличные",
  debitCard: "Дебетовая карта",
  creditCard: "Кредитная карта",
  transfer: "Перевод",
  bankTransfer: "Банковский перевод",
  digitalWallet: 'Цифровой кошелёк',
  contactlessPayment: 'Бесконтактная оплата',
  bankAccount: 'Банковский счёт',
  deposit: "Депозит",
  other: "Другое"
},

transactionList: {
  unknownDate: "Неизвестная дата",
  today: "Сегодня",
  yesterday: "Вчера",
  startAdding: "Добавьте первую запись прямо сейчас.",
  loadError: "Не удалось загрузить {items}.",
  deleteTitle: "Удалить {item}",
  deleteConfirm: "Вы уверены, что хотите удалить «{description}»?",
  deleteError: "Не удалось удалить {item}.",
  searchPlaceholder: "Поиск: {items}...",
  sortTitle: "Сортировать операции",
  clearSearch: "Очистить поиск",
  records: "Записи",
  mainCategory: "Главная категория",
  loading: "Загрузка: {items}...",
  noResultsTitle: "Ничего не найдено",
  noResultsText: "Попробуйте другой запрос или удалите применённые фильтры.",
  clearFilters: "Очистить фильтры",
  deleteHint: "Нажмите и удерживайте операцию, чтобы удалить её",
  sort: {
    recent: "Сначала новые",
    oldest: "Сначала старые",
    highest: "Наибольшая сумма",
    lowest: "Наименьшая сумма"
  },
  income: {
    title: "Доходы",
    subtitle: "Контролируйте полученные деньги",
    summaryLabel: "Доход за этот месяц",
    singular: "доход",
    plural: "доходы",
    emptyTitle: "Доходы не зарегистрированы",
    emptyDescription: "В этом месяце вы ещё не добавили доходы.",
    emptyButton: "Добавить первый доход",
    defaultDescription: "Доход без описания"
  },
  expense: {
    title: "Расходы",
    subtitle: "Контролируйте последние операции",
    summaryLabel: "Расходы за этот месяц",
    singular: "расход",
    plural: "расходы",
    emptyTitle: "Расходы не зарегистрированы",
    emptyDescription: "В этом месяце вы ещё не добавили расходы.",
    emptyButton: "Добавить первый расход",
    defaultDescription: "Расход без описания"
  }
},

addTransaction: {
  categoryPlaceholder: "Выберите категорию",
  description: "Описание",
  dateTime: "Дата и время",
  noteOptional: "Примечание (необязательно)",
  category: "Категория",
  saveErrorTitle: "Не удалось сохранить",
  saveErrorMessage: "При сохранении операции произошла ошибка.",
  errors: {
    amountRequired: "Сумма обязательна",
    amountPositive: "Сумма должна быть больше 0",
    categoryRequired: "Выберите категорию"
  },
  income: {
    title: "Новый доход",
    amountQuestion: "Сколько вы получили?",
    descriptionPlaceholder: "Например: зарплата, продажа, фриланс...",
    descriptionFallback: "Доход без описания",
    categoryLabel: "Категория дохода *",
    methodLabel: "Способ получения",
    notePlaceholder: "Добавьте примечание к доходу...",
    saveButton: "Сохранить доход",
    savingText: "Сохранение дохода...",
    successTitle: "Доход зарегистрирован",
    successMessage: "Доход успешно сохранён."
  },
  expense: {
    title: "Новый расход",
    amountQuestion: "Сколько вы потратили?",
    descriptionPlaceholder: "Например: McDonald's, Uber, Netflix...",
    descriptionFallback: "Расход без описания",
    categoryLabel: "Категория расхода *",
    methodLabel: "Способ оплаты",
    notePlaceholder: "Добавьте примечание к расходу...",
    saveButton: "Сохранить расход",
    savingText: "Сохранение расхода...",
    successTitle: "Расход зарегистрирован",
    successMessage: "Расход успешно сохранён."
  }
},

currency: {
  title: 'Основная валюта',
  chooseCurrency: 'Выберите валюту',
  description:
    'Эта валюта будет использоваться для отображения расходов, отчётов, бюджетов и статистики в Spendly.',
  currentCurrency: 'Текущая валюта',
  example: 'Пример',
  availableCurrencies: 'Доступные валюты',
  current: 'Текущая',
  loading: 'Загрузка валют...',
  saving: 'Сохранение',
  syncInfo:
    'Выбранная валюта сохраняется на этом устройстве и синхронизируется с вашей учётной записью.',
  loadError: 'Не удалось загрузить выбранную валюту.',
  saveError: 'Не удалось сохранить выбранную валюту.',

  currencies: {
    ars: 'Аргентинское песо',
    usd: 'Доллар США',
    eur: 'Евро',
    gbp: 'Фунт стерлингов',
    brl: 'Бразильский реал',
    clp: 'Чилийское песо',
    uyu: 'Уругвайское песо',
    mxn: 'Мексиканское песо',
    rub: 'Российский рубль',
    cny: 'Китайский юань',
  },
},

helpCenter: {
  title: 'Центр помощи',
  heroTitle: 'Чем мы можем помочь?',
  heroText:
    'Найдите быстрые ответы и узнайте, как пользоваться основными функциями Spendly.',
  searchPlaceholder: 'Найти вопрос...',
  faqTitle: 'Часто задаваемые вопросы',
  noResultsTitle: 'Ничего не найдено',
  noResultsText:
    'Попробуйте другие слова или ознакомьтесь с кратким руководством.',
  clearSearch: 'Очистить поиск',
  moreHelpTitle: 'Всё ещё нужна помощь?',
  moreHelpText:
    'Вы можете сообщить о проблеме и рассказать, что произошло.',
  reportProblem: 'Сообщить о проблеме',

  faq: {
    addTransaction: {
      question: 'Как добавить расход или доход?',
      answer:
        'Откройте раздел операций, выберите расходы или доходы и нажмите кнопку +. Укажите сумму, категорию и дополнительные данные перед сохранением.',
    },
    editTransaction: {
      question: 'Можно ли изменить операцию?',
      answer:
        'Редактирование зависит от доступной версии. Изменить данные можно будет в деталях операции после включения этой функции.',
    },
    deleteTransaction: {
      question: 'Как удалить операцию?',
      answer:
        'В списке операций нажмите и удерживайте нужную запись, затем подтвердите удаление.',
    },
    currency: {
      question: 'Как изменить основную валюту?',
      answer:
        'Откройте профиль, перейдите в раздел основной валюты и выберите нужный вариант. Суммы будут отображаться в выбранном формате.',
    },
    language: {
      question: 'Как изменить язык?',
      answer:
        'В профиле откройте раздел языка и выберите один из доступных вариантов. Изменение применяется сразу.',
    },
    theme: {
      question: 'Как включить тёмную тему?',
      answer:
        'В профиле откройте раздел оформления и выберите светлую, тёмную или автоматическую тему.',
    },
    scan: {
      question: 'Как работает сканирование чеков?',
      answer:
        'Откройте сканирование, сделайте фото или выберите изображение из галереи. Spendly отправит чек в систему анализа для распознавания данных.',
    },
    security: {
      question: 'Можно ли защитить аккаунт PIN-кодом или биометрией?',
      answer:
        'Да. Откройте профиль, затем безопасность и доступ, и настройте PIN-код или биометрическую аутентификацию устройства.',
    },
    offline: {
      question: 'Работает ли Spendly без интернета?',
      answer:
        'Некоторые настройки могут храниться на устройстве, но функции чтения и сохранения серверных данных требуют подключения.',
    },
    goals: {
      question: 'Как работают финансовые цели?',
      answer:
        'Цели позволяют задать сумму накопления и отслеживать прогресс. Работа функции может зависеть от доступности backend.',
    },
  },

  guide: {
    title: 'Краткое руководство',
    description:
      'Следуйте этим шагам, чтобы начать управлять финансами в Spendly.',
    steps: {
      account: {
        title: 'Проверьте профиль',
        description:
          'Заполните данные и выберите язык, валюту, оформление и параметры безопасности.',
      },
      transaction: {
        title: 'Записывайте операции',
        description:
          'Добавляйте расходы и доходы с суммой, категорией, датой и описанием.',
      },
      movements: {
        title: 'Просматривайте и ищите',
        description:
          'Используйте список для поиска, сортировки и просмотра последних операций.',
      },
      stats: {
        title: 'Анализируйте статистику',
        description:
          'Просматривайте итоги, основные категории и важные операции.',
      },
      preferences: {
        title: 'Настройте Spendly',
        description:
          'Измените тему, язык, валюту и безопасность под свои предпочтения.',
      },
    },
  },
},

terms: {
  title: 'Условия использования',
  subtitle: 'Общие условия использования Spendly и его функций.',
  contentTitle: 'Условия использования',
  meta: {
    versionLabel: 'Юридическая версия',
    versionValue: '1.0',
    updatedLabel: 'Последнее обновление',
    updatedValue: 'Июль 2026 г.',
    responsibleLabel: 'Ответственная команда'
  },
  notice: 'Это информационная версия. Перед окончательным коммерческим выпуском Team GST следует получить профессиональную юридическую проверку.',
  sections: {
    acceptance: {
      title: 'Принятие условий',
      text: 'Создавая аккаунт, открывая или используя Spendly, вы принимаете эти условия. Если вы не согласны, прекратите использование приложения.'
    },
    permittedUse: {
      title: 'Разрешённое использование',
      text: 'Spendly предназначен для личной финансовой организации и не может использоваться в незаконных, мошеннических или вредоносных целях.'
    },
    account: {
      title: 'Аккаунт и данные доступа',
      text: 'Вы отвечаете за защиту логина, пароля, PIN-кода и биометрии, а также за сообщение о несанкционированном доступе.'
    },
    financialData: {
      title: 'Финансовая информация',
      text: 'Суммы, категории, описания и другие данные следует проверять до сохранения. Spendly не гарантирует полноту или точность введённой информации.'
    },
    ai: {
      title: 'OCR и искусственный интеллект',
      text: 'Сканирование чеков может использовать OCR и искусственный интеллект. Результаты могут содержать ошибки и требуют проверки.'
    },
    availability: {
      title: 'Доступность сервиса',
      text: 'Team GST приложит разумные усилия для доступности Spendly. Функции могут временно прерываться из-за обслуживания, обновлений или внешних сервисов.'
    },
    security: {
      title: 'Безопасность и доступ',
      text: 'Spendly использует аутентификацию, защищённые пароли и контроль доступа. Ни одна система не гарантирует абсолютную безопасность.'
    },
    intellectualProperty: {
      title: 'Интеллектуальная собственность',
      text: 'Название, дизайн, код, тексты, визуальные материалы и документация Spendly принадлежат Team GST или соответствующим авторам.'
    },
    updates: {
      title: 'Обновления и изменения',
      text: 'Spendly может добавлять, изменять или удалять функции. Эти условия также могут обновляться.'
    },
    liability: {
      title: 'Ограничение ответственности',
      text: 'Spendly не предоставляет финансовых, бухгалтерских, налоговых или юридических консультаций. Решения принимает пользователь.'
    },
    suspension: {
      title: 'Блокировка или закрытие аккаунта',
      text: 'Team GST может ограничить или заблокировать аккаунты, используемые мошеннически, злоупотребляюще или в нарушение условий.'
    },
    contact: {
      title: 'Контакт',
      text: 'Вопросы можно отправить через Центр помощи или Сообщить о проблеме.'
    }
  }
},

privacy: {
  title: 'Политика конфиденциальности',
  subtitle: 'Как Spendly собирает, использует и защищает данные пользователя.',
  contentTitle: 'Обработка данных',
  meta: {
    versionLabel: 'Юридическая версия',
    versionValue: '1.0',
    updatedLabel: 'Последнее обновление',
    updatedValue: 'Июль 2026 г.',
    responsibleLabel: 'Ответственная команда'
  },
  notice: 'Эта политика описывает текущую работу Spendly. Перед коммерческим выпуском Team GST следует провести юридическую проверку.',
  sections: {
    collection: {
      title: 'Собираемая информация',
      text: 'Spendly может обрабатывать имя, электронную почту, данные профиля, расходы, доходы, категории, даты, описания, цели, настройки и технические данные.'
    },
    use: {
      title: 'Использование информации',
      text: 'Данные используются для входа, отображения балансов, статистики, сохранения настроек и предоставления основных функций.'
    },
    financialData: {
      title: 'Личные финансовые данные',
      text: 'Операции используются только для личной организации. Spendly не является банком, не хранит средства и не проводит финансовые операции.'
    },
    ai: {
      title: 'Чеки, OCR и искусственный интеллект',
      text: 'Изображения чеков могут отправляться сервисам обработки для распознавания магазина, суммы, даты, категории и описания.'
    },
    deviceStorage: {
      title: 'Данные на устройстве',
      text: 'Сессия, тема, язык, валюта, PIN-код или биометрия могут храниться локально для удобства использования.'
    },
    security: {
      title: 'Безопасность информации',
      text: 'Spendly использует аутентификацию, защищённые пароли и безопасные соединения, но не может гарантировать абсолютную безопасность.'
    },
    services: {
      title: 'Сервисы и инфраструктура',
      text: 'Spendly может использовать Railway, PostgreSQL, FastAPI, Expo и сервисы обработки изображений только для работы приложения.'
    },
    retention: {
      title: 'Хранение данных',
      text: 'Данные могут храниться, пока аккаунт активен, или столько, сколько нужно для работы сервиса и устранения ошибок.'
    },
    rights: {
      title: 'Права пользователя',
      text: 'Пользователь сможет запросить доступ, исправление, экспорт или удаление данных, когда соответствующие функции будут доступны.'
    },
    deletion: {
      title: 'Удаление данных',
      text: 'Удаление аккаунта может удалить операции, настройки и связанные данные, кроме временно необходимых технических записей.'
    },
    academic: {
      title: 'Учебный проект',
      text: 'Spendly — учебный проект в разработке. Функции, инфраструктура и практики обработки данных могут изменяться.'
    },
    contact: {
      title: 'Контакт по конфиденциальности',
      text: 'Запросы можно отправить через Центр помощи или Сообщить о проблеме.'
    }
  }
},

editProfile: {
  title: 'Редактировать профиль',
  loading: 'Загрузка профиля...',
  heroTitle: 'Ваши личные данные',
  heroText:
    'Обновите информацию, используемую для персонализации Spendly.',
  personalInformation: 'Личная информация',
  displayName: 'Отображаемое имя',
  displayNamePlaceholder: 'Например: Пётр',
  displayNameHelper:
    'Это имя будет использоваться в приветствиях и сообщениях приложения.',
  fullName: 'Полное имя',
  fullNamePlaceholder: 'Ваше полное имя',
  email: 'Электронная почта',
  emailHelper:
    'По соображениям безопасности адрес электронной почты нельзя изменить.',
  memberSince: 'Дата регистрации',
  notAvailable: 'Недоступно',
  saveChanges: 'Сохранить изменения',
  saving: 'Сохранение...',
  successTitle: 'Профиль обновлён',
  successMessage:
    'Ваши данные успешно обновлены.',
  loadError:
    'Не удалось загрузить данные профиля.',
  saveError:
    'Не удалось сохранить изменения.',

  validation: {
    displayNameRequired:
      'Отображаемое имя обязательно.',
    displayNameTooShort:
      'Отображаемое имя должно содержать не менее 2 символов.',
    fullNameRequired:
      'Полное имя обязательно.',
    fullNameTooShort:
      'Полное имя должно содержать не менее 3 символов.',
  },
},

stats: {
  title: 'Статистика', loading: 'Загрузка статистики...', loadError: 'Не удалось загрузить статистику.', periodLabel: 'Период', noPreviousComparison: 'Нет данных для сравнения', comparisonValue: '{value} к предыдущему периоду', noData: 'Нет данных', noDescription: 'Без описания', percentageOfTotal: '{value}% от общей суммы', topCategory: 'Главная категория', monthlyEvolution: 'Динамика за последние 6 месяцев', expenseByCategory: 'Расходы по категориям', incomeByCategory: 'Доходы по категориям', recentTransactions: 'Последние операции', searchPlaceholder: 'Найти операцию или категорию...', emptyCategoriesTitle: 'Нет данных по категориям', emptyCategoriesText: 'После добавления операций за этот период здесь появится разбивка.', emptyTransactionsTitle: 'Нет операций', emptyTransactionsText: 'За выбранный период операций пока нет.', noSearchResults: 'Операции по вашему запросу не найдены.', clearSearch: 'Очистить поиск', addExpense: 'Добавить расход', addIncome: 'Добавить доход',
  periods: { currentMonth: 'Этот месяц', previousMonth: 'Прошлый месяц', threeMonths: 'Последние 3 месяца', sixMonths: 'Последние 6 месяцев', currentYear: 'Этот год', all: 'Всё время' },
  views: { overview: 'Обзор', expense: 'Расходы', income: 'Доходы' },
  hero: { balance: 'Баланс за период', totalExpenses: 'Общие расходы', totalIncome: 'Общие доходы' },
  metrics: { income: 'Доходы', expenses: 'Расходы', balance: 'Баланс', records: 'Записи', savingsRate: 'Норма сбережений: {value}', recordsBreakdown: '{expenses} расходов · {income} доходов' },
  insights: { averageExpense: 'Средний расход', averageIncome: 'Средний доход', perExpense: 'на расход', perIncome: 'на доход', highestExpense: 'Крупнейший расход', highestIncome: 'Крупнейший доход' },
},

security: {
  title: 'Безопасность и доступ',
  heroTitle: 'Защитите аккаунт',
  heroText: 'Управляйте паролем, способами входа и локальной защитой устройства.',
  access: 'Доступ',
  sessions: 'Сеанс',
  changePassword: 'Изменить пароль',
  changePasswordSubtitle: 'Обновить пароль доступа',
  biometric: 'Face ID / отпечаток',
  accessPin: 'PIN-код',
  enabled: 'Включено',
  disabled: 'Отключено',
  connectedDevices: 'Подключённые устройства',
  connectedDevicesSubtitle: 'Просмотреть активные сеансы',
  logoutDevice: 'Выйти на этом устройстве',
  logoutDeviceSubtitle: 'Выйти из Spendly на этом телефоне',
  biometricUnavailable: 'Устройство не поддерживает биометрию.',
  biometricNotConfigured: 'Биометрия не настроена.',
  enableBiometricPrompt: 'Включить биометрию для Spendly',
  disableBiometricPrompt: 'Отключить биометрию для Spendly',
  createPin: 'Создать PIN',
  confirmPin: 'Подтвердить PIN',
  disablePin: 'Отключить PIN',
  createPinText: 'Введите 4-значный PIN-код.',
  confirmPinText: 'Введите PIN повторно.',
  disablePinText: 'Введите текущий PIN.',
  pinMismatch: 'PIN-коды не совпадают.',
  incorrectPin: 'Неверный PIN-код.',
  logoutTitle: 'Выйти',
  logoutConfirm: 'Выйти на этом устройстве?',
  logout: 'Выйти',
},

sessions: {
  title: 'Подключённые устройства', loading: 'Загрузка сеансов...', loadError: 'Не удалось загрузить сеансы.',
  heroTitle: 'Активные сеансы', heroText: 'Проверьте устройства, на которых выполнен вход, и завершите незнакомые сеансы.',
  currentSession: 'Текущий сеанс', otherDevices: 'Другие устройства', current: 'Текущий', unknownDevice: 'Неизвестное устройство', noData: 'Нет данных',
  ip: 'IP', lastActivity: 'Последняя активность', created: 'Создан', closeSession: 'Завершить сеанс', closeAll: 'Завершить все', close: 'Завершить',
  currentNotDetectedTitle: 'Текущий сеанс не определён', currentNotDetectedText: 'Не удалось определить, какой сеанс относится к этому устройству.',
  allGoodTitle: 'Всё в порядке', allGoodText: 'Других подключённых устройств нет.',
  info: 'После завершения сеанса на устройстве потребуется снова войти в Spendly.',
  singleModalTitle: 'Завершить сеанс', singleModalText: 'Завершить сеанс на этом устройстве?',
  allModalTitle: 'Завершить другие сеансы', allModalText: 'Будет выполнен выход на всех других устройствах, а текущий сеанс останется активным.',
  passwordPlaceholder: 'Текущий пароль', passwordRequired: 'Введите пароль.', successTitle: 'Сеансы обновлены',
  singleSuccess: 'Сеанс успешно завершён.', allSuccess: 'Другие сеансы успешно завершены.',
  singleError: 'Не удалось завершить сеанс.', allError: 'Не удалось завершить сеансы.',
},

pinUnlock: {
  loading: 'Загрузка безопасности...',
  title: 'Разблокировать Spendly',
  subtitle: 'Введите PIN-код для продолжения.',
  lockedTitle: 'PIN заблокирован',
  lockedSubtitle: 'Повторите попытку через {time}.',
  tooManyAttempts: 'Слишком много неверных попыток.',
  incorrectWithAttempts:
    'Неверный PIN. Осталось попыток: {attempts}.',
  attemptsUsed: 'Использовано попыток: {used} из {max}',
  pinNotConfigured:
    'PIN-код не настроен. Возврат на предыдущий экран.',
  loadError:
    'Не удалось загрузить состояние безопасности.',
  validationError:
    'Не удалось проверить PIN-код.',

  time: {
    hoursMinutes: '{hours} ч {minutes} мин',
  },
},

changePassword: {
  title: 'Изменить пароль',
  heroTitle: 'Обновите пароль',
  heroText: 'Используйте надёжный пароль, отличный от предыдущего.',
  currentPassword: 'Текущий пароль',
  currentPlaceholder: 'Введите текущий пароль',
  newPassword: 'Новый пароль',
  newPlaceholder: 'Не менее 8 символов',
  repeatPassword: 'Повторите новый пароль',
  repeatPlaceholder: 'Введите новый пароль повторно',
  save: 'Сохранить новый пароль',
  saving: 'Сохранение...',
  saveError: 'Не удалось изменить пароль.',
  successTitle: 'Пароль обновлён',
  successText: 'Пароль успешно изменён.',
  validation: {
    required: 'Заполните все поля.',
    minLength: 'Новый пароль должен содержать не менее 8 символов.',
    samePassword: 'Новый пароль должен отличаться от текущего.',
    noMatch: 'Новые пароли не совпадают.',
  },
},

notifications: {
  title: 'Уведомления', loading: 'Загрузка уведомлений...', loadError: 'The settings could not be loaded.', saveError: 'The settings could not be saved.',
  heroTitle: 'Полезные уведомления без лишнего шума', heroText: 'Choose occasional reminders that genuinely help you manage your finances.',
  generalSection: 'Общие', activitySection: 'Активность', summarySection: 'Сводки', goalsSection: 'Цели',
  permissionTitle: 'System permission', openНастройки: 'Настройки', permissionDeniedTitle: 'Permission disabled', permissionDeniedText: 'Enable notifications in your device settings to use this feature.',
  permissionRequiredTitle: 'Permission required', permissionRequiredText: 'Enable Spendly notifications first.', testScheduledTitle: 'Notification scheduled', testScheduledText: 'You will receive it in a few seconds.', testButton: 'Send test notification',
  goalsInfo: 'Goal alerts will open the matching goal directly. They are only sent for approaching deadlines, important progress or completion.',
  permission: { granted: 'Разрешены', denied: 'Заблокированы', undetermined: 'Не настроены' },
  master: { title: 'Allow notifications', subtitle: 'Main control for all local Spendly alerts.' },
  daily: { title: 'Transaction reminder', subtitle: 'One daily reminder for pending expenses or income.', timeTitle: 'Reminder time', timeHint: 'Evening times reduce interruptions during the day.' },
  weekly: { title: 'Еженедельная сводка', subtitle: 'One Monday evening alert to review the previous week.' },
  monthly: { title: 'Ежемесячная сводка', subtitle: 'One alert on the first day of the month to review income and expenses.' },
  goalDeadline: { title: 'Цели nearing their deadline', subtitle: 'Notify three days before the target date.' },
  goalProgress: { title: 'Important progress', subtitle: 'Notify once when a goal reaches approximately 80%.' },
  goalCompleted: { title: 'Цель достигнута', subtitle: 'Celebrate when you reach the target amount.' },
  copy: { dailyTitle: 'Any transaction still pending?', dailyBody: 'Recording today’s activity takes less than a minute.', weeklyTitle: 'Your weekly financial summary is ready', weeklyBody: 'Review income, expenses and your weekly balance.', monthlyTitle: 'A new month, a new summary', monthlyBody: 'See how the previous month ended in Statistics.', testTitle: 'Spendly is ready', testBody: 'Notifications are working correctly.' },
},

};