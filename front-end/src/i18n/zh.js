export default {
  common: {
    back: '返回',
    cancel: '取消',
    save: '保存',
    loading: '加载中...',
    error: '错误',
    accept: "确定",
    delete: "删除",
    done: "完成"
  },

  profile: {
    title: '我的个人资料',
    account: '账户',
    preferences: '偏好设置',
    data: '数据',
    support: '支持',
    session: '会话',

    editPersonalData: '编辑个人信息',
    editPersonalDataSubtitle:
      '姓名、电子邮箱和地址',

    security: '安全与访问',

    securitySubtitle:
      '身份验证、会话和访问',

    appearance: '外观',

    appearanceSubtitle:
      '浅色、深色或跟随系统',

    currency: '主要货币',

    language: '语言',

    notifications: '通知',

    notificationsSubtitle:
      '提醒、通知和摘要',

    exportData: '导出数据',

    exportDataSubtitle:
      '下载支出、收入和报告',

    helpCenter: '帮助中心',

    helpCenterSubtitle:
      '常见问题和使用指南',

    reportProblem: '报告问题',

    reportProblemSubtitle:
      '如果出现问题，请告诉我们',

    about: '关于 Spendly',

    logout: '退出登录',

    logoutConfirmTitle: '退出登录',

    logoutConfirmText:
      '确定要退出 Spendly 吗？',

    activeAccount: '账户已激活',

    inactiveAccount: '账户未激活',

    defaultUser: '用户',
    verifyIdentity: '验证身份',
    versionValue: '版本 1.0.8',
    profilePhoto: '个人资料照片',
    viewProfilePhoto: '查看个人资料照片',
    updatePhoto: '更新照片',
    addPhoto: '添加照片',
    deletePhoto: '删除照片',

  },

  navigation: {
    home: '首页',
    transactions: '交易',
    stats: '统计',
    goals: '目标',
  },

  language: {
    title: '语言',
    subtitle: '选择应用程序语言',
    spanish: '西班牙语',
    english: '英语',
    portuguese: '葡萄牙语',
    russian: '俄语',
    chinese: '中文',
    french: '法语',
    german: '德语',

    currentLanguage: '当前语言',
    availableLanguages: '可用语言',
    current: '当前',
    saving: '正在保存语言...',
    changeInfo:
      '语言更改会立即应用于已完成翻译的页面。',
  },

  about: {
  title: '关于 Spendly',
  appSubtitle:
    '智能管理支出、收入和财务目标。',
  versionPrefix: '版本',
  aboutApp: '关于应用',
  descriptionOne:
    'Spendly 是一款移动应用，旨在帮助您以简单的方式记录、整理和了解财务交易。',
  descriptionTwo:
    '它可以管理支出和收入、查看统计数据、使用人工智能扫描票据并跟踪储蓄目标。',
  information: '信息',
  currentVersion: '当前版本',
  status: '状态',
  beta: '测试版',
  platform: '平台',
  mobileApp: '移动应用',
  documentation: '文档',
  terms: '条款与条件',
  termsSubtitle: 'Spendly 使用条款',
  privacy: '隐私政策',
  privacySubtitle: '我们如何保护您的数据',
  rights: '版权所有。',
},

  categories:
{
  food: "餐饮",
  transport: "交通",
  supermarket: "超市",
  services: "服务",
  health: "健康",
  education: "教育",
  entertainment: "娱乐",
  clothing: "服装",
  technology: "科技",
  salary: "工资",
  freelance: "自由职业",
  investments: "投资",
  sales: "销售",
  gifts: "礼物",
  refunds: "退款",
  other: "其他"
},

methods: {
  cash: "现金",
  debitCard: "借记卡",
  creditCard: "信用卡",
  transfer: "转账",
  bankTransfer: "银行转账",
  digitalWallet: '数字钱包',
  contactlessPayment: 'NFC 无接触支付',
  bankAccount: '银行账户',
  deposit: "存款",
  other: "其他"
},

transactionList: {
  unknownDate: "未知日期",
  today: "今天",
  yesterday: "昨天",
  startAdding: "现在添加第一条记录。",
  loadError: "无法加载{items}。",
  deleteTitle: "删除{item}",
  deleteConfirm: "确定要删除“{description}”吗？",
  deleteError: "无法删除{item}。",
  searchPlaceholder: "搜索{items}...",
  sortTitle: "交易排序",
  clearSearch: "清除搜索",
  records: "记录",
  mainCategory: "主要类别",
  loading: "正在加载{items}...",
  noResultsTitle: "未找到结果",
  noResultsText: "请尝试其他搜索内容或移除已应用的筛选条件。",
  clearFilters: "清除筛选",
  deleteHint: "长按一笔交易即可删除",
  sort: {
    recent: "最新优先",
    oldest: "最早优先",
    highest: "金额最高",
    lowest: "金额最低"
  },
  income: {
    title: "收入",
    subtitle: "管理您收到的资金",
    summaryLabel: "本月总收入",
    singular: "收入",
    plural: "收入",
    emptyTitle: "暂无收入记录",
    emptyDescription: "您本月还没有记录任何收入。",
    emptyButton: "添加第一笔收入",
    defaultDescription: "无描述的收入"
  },
  expense: {
    title: "支出",
    subtitle: "管理最近的交易",
    summaryLabel: "本月总支出",
    singular: "支出",
    plural: "支出",
    emptyTitle: "暂无支出记录",
    emptyDescription: "您本月还没有添加任何支出。",
    emptyButton: "添加第一笔支出",
    defaultDescription: "无描述的支出"
  }
},

addTransaction: {
  categoryPlaceholder: "选择一个类别",
  description: "描述",
  dateTime: "日期和时间",
  noteOptional: "备注（可选）",
  category: "类别",
  saveErrorTitle: "无法保存",
  saveErrorMessage: "记录交易时发生错误。",
  errors: {
    amountRequired: "金额为必填项",
    amountPositive: "金额必须大于0",
    categoryRequired: "请选择一个类别"
  },
  income: {
    title: "新增收入",
    amountQuestion: "您收到了多少钱？",
    descriptionPlaceholder: "例如：工资、销售、自由职业收入...",
    descriptionFallback: "无描述的收入",
    categoryLabel: "收入类别 *",
    methodLabel: "收款方式",
    notePlaceholder: "添加关于这笔收入的备注...",
    saveButton: "保存收入",
    savingText: "正在保存收入...",
    successTitle: "收入已记录",
    successMessage: "收入已成功保存。"
  },
  expense: {
    title: "新增支出",
    amountQuestion: "您花了多少钱？",
    descriptionPlaceholder: "例如：McDonald's、Uber、Netflix...",
    descriptionFallback: "无描述的支出",
    categoryLabel: "支出类别 *",
    methodLabel: "付款方式",
    notePlaceholder: "添加关于这笔支出的备注...",
    saveButton: "保存支出",
    savingText: "正在保存支出...",
    successTitle: "支出已记录",
    successMessage: "支出已成功保存。"
  }
},

currency: {
  title: '主要货币',
  chooseCurrency: '选择您的货币',
  description:
    '该货币将作为 Spendly 中显示支出、报告、预算和统计信息的参考。',
  currentCurrency: '当前货币',
  example: '示例',
  availableCurrencies: '可用货币',
  current: '当前',
  loading: '正在加载货币...',
  saving: '正在保存',
  syncInfo:
    '所选货币会保存在此设备上，并与您的账户同步。',
  loadError: '无法加载所选货币。',
  saveError: '无法保存所选货币。',

  currencies: {
    ars: '阿根廷比索',
    usd: '美元',
    eur: '欧元',
    gbp: '英镑',
    brl: '巴西雷亚尔',
    clp: '智利比索',
    uyu: '乌拉圭比索',
    mxn: '墨西哥比索',
    rub: '俄罗斯卢布',
    cny: '人民币',
  },
},

helpCenter: {
  title: '帮助中心',
  heroTitle: '我们能为您提供什么帮助？',
  heroText:
    '快速查找答案，并了解如何使用 Spendly 的主要功能。',
  searchPlaceholder: '搜索问题...',
  faqTitle: '常见问题',
  noResultsTitle: '未找到结果',
  noResultsText:
    '请尝试其他关键词或查看快速指南。',
  clearSearch: '清除搜索',
  moreHelpTitle: '仍然需要帮助？',
  moreHelpText:
    '您可以报告问题并告诉我们发生了什么。',
  reportProblem: '报告问题',

  faq: {
    addTransaction: {
      question: '如何添加支出或收入？',
      answer:
        '打开交易页面，选择支出或收入，然后点击 + 按钮。保存前填写金额、类别和可选信息。',
    },
    editTransaction: {
      question: '可以编辑交易吗？',
      answer:
        '编辑功能取决于当前版本。启用该功能后，您可以在交易详情中修改数据。',
    },
    deleteTransaction: {
      question: '如何删除交易？',
      answer:
        '在交易列表中长按要删除的记录，然后确认操作。',
    },
    currency: {
      question: '如何更改主要货币？',
      answer:
        '打开个人资料，进入主要货币并选择要使用的货币。金额将按该格式显示。',
    },
    language: {
      question: '如何更改语言？',
      answer:
        '在个人资料中打开语言并选择可用选项之一。更改会立即应用。',
    },
    theme: {
      question: '如何启用深色模式？',
      answer:
        '在个人资料中打开外观，然后选择浅色、深色或自动模式。',
    },
    scan: {
      question: '票据扫描如何工作？',
      answer:
        '打开扫描，拍照或从图库选择图片。Spendly 会将票据发送到分析系统以识别数据。',
    },
    security: {
      question: '可以使用 PIN 或生物识别保护账户吗？',
      answer:
        '可以。打开个人资料，然后进入安全与访问，并配置设备支持的 PIN 或生物识别。',
    },
    offline: {
      question: 'Spendly 可以离线使用吗？',
      answer:
        '部分偏好设置可保存在设备上，但读取或保存服务器数据的功能需要网络连接。',
    },
    goals: {
      question: '财务目标如何工作？',
      answer:
        '目标允许您设置储蓄金额并跟踪进度。该功能可能取决于后端是否可用。',
    },
  },

  guide: {
    title: '快速使用指南',
    description:
      '按照以下步骤开始使用 Spendly 管理财务。',
    steps: {
      account: {
        title: '检查个人资料',
        description:
          '完善个人信息，并选择语言、货币、外观和安全选项。',
      },
      transaction: {
        title: '记录交易',
        description:
          '添加每笔支出或收入，包括金额、类别、日期和说明。',
      },
      movements: {
        title: '查看和搜索',
        description:
          '使用列表搜索、排序和查看最近的交易。',
      },
      stats: {
        title: '分析统计信息',
        description:
          '查看总额、主要类别和重点交易，更好地了解您的习惯。',
      },
      preferences: {
        title: '自定义 Spendly',
        description:
          '配置主题、语言、货币和安全设置。',
      },
    },
  },
},

terms: {
  title: '条款与条件',
  subtitle: '使用 Spendly 及其功能的一般条件。',
  contentTitle: '使用条款',
  meta: {
    versionLabel: '法律版本',
    versionValue: '1.0',
    updatedLabel: '最后更新',
    updatedValue: '2026 年 7 月',
    responsibleLabel: '负责团队'
  },
  notice: '本版本仅供参考。在正式商业发布前，Team GST 应进行专业法律审查。',
  sections: {
    acceptance: {
      title: '接受条款',
      text: '创建账户、访问或使用 Spendly 即表示您接受这些条款。如不同意，请停止使用本应用。'
    },
    permittedUse: {
      title: '允许的使用方式',
      text: 'Spendly 仅用于个人财务管理，不得用于违法、欺诈、滥用或破坏平台运行的活动。'
    },
    account: {
      title: '账户与凭据',
      text: '您有责任保护登录信息、PIN 和生物识别方式，并应报告任何未经授权的访问。'
    },
    financialData: {
      title: '财务信息',
      text: '保存前应核对金额、类别、说明及其他数据。Spendly 不保证用户输入内容的完整性或准确性。'
    },
    ai: {
      title: 'OCR 与人工智能',
      text: '票据扫描可能使用 OCR 和人工智能。结果可能存在错误，确认前必须检查并更正。'
    },
    availability: {
      title: '服务可用性',
      text: 'Team GST 将尽合理努力保持 Spendly 可用。维护、更新、基础设施故障或第三方服务可能导致部分功能中断。'
    },
    security: {
      title: '安全与访问',
      text: 'Spendly 使用身份验证、密码保护和访问控制，但任何系统都无法保证绝对安全。'
    },
    intellectualProperty: {
      title: '知识产权',
      text: 'Spendly 的名称、设计、代码、文本、视觉资源和文档归 Team GST 或相应作者所有。'
    },
    updates: {
      title: '更新与变更',
      text: 'Spendly 可能新增、修改或移除功能，这些条款也可能更新。'
    },
    liability: {
      title: '责任限制',
      text: 'Spendly 不提供财务、会计、税务或法律建议。用户应自行承担基于应用信息作出的决定。'
    },
    suspension: {
      title: '账户暂停或关闭',
      text: '对于滥用、欺诈或违反条款的账户，Team GST 可限制或暂停其使用。'
    },
    contact: {
      title: '联系方式',
      text: '可通过帮助中心或报告问题提出相关疑问。'
    }
  }
},

privacy: {
  title: '隐私政策',
  subtitle: 'Spendly 如何收集、使用和保护用户信息。',
  contentTitle: '数据处理',
  meta: {
    versionLabel: '法律版本',
    versionValue: '1.0',
    updatedLabel: '最后更新',
    updatedValue: '2026 年 7 月',
    responsibleLabel: '负责团队'
  },
  notice: '本政策描述 Spendly 当前的运行方式。在正式商业发布前，Team GST 应进行专业法律审查。',
  sections: {
    collection: {
      title: '我们收集的信息',
      text: 'Spendly 可能处理姓名、电子邮箱、个人资料、支出、收入、类别、日期、说明、目标、偏好设置和技术数据。'
    },
    use: {
      title: '信息的使用',
      text: '数据用于用户认证、显示余额、生成统计、保存偏好设置以及提供主要功能。'
    },
    financialData: {
      title: '个人财务数据',
      text: '交易记录仅用于个人管理。Spendly 不是银行，不持有资金，也不代表用户执行金融交易。'
    },
    ai: {
      title: '票据、OCR 与人工智能',
      text: '票据图片可能发送到处理服务，以识别商户、金额、日期、类别和说明。'
    },
    deviceStorage: {
      title: '设备上的数据',
      text: '会话、主题、语言、货币、PIN 或生物识别信息可能存储在设备本地，以保证连续使用。'
    },
    security: {
      title: '信息安全',
      text: 'Spendly 使用身份验证、密码保护和安全连接，但无法保证绝对安全。'
    },
    services: {
      title: '服务与基础设施',
      text: 'Spendly 可能使用 Railway、PostgreSQL、FastAPI、Expo 和图像处理服务，仅用于提供应用功能。'
    },
    retention: {
      title: '数据保留',
      text: '数据可能在账户有效期间或为提供服务、满足技术要求和处理故障所需的期间内保留。'
    },
    rights: {
      title: '用户权利',
      text: '在相关功能可用时，用户可申请访问、更正、导出或删除数据。'
    },
    deletion: {
      title: '数据删除',
      text: '删除账户可能会移除交易、偏好设置及相关数据，但技术或安全需要的数据可能暂时保留。'
    },
    academic: {
      title: '学术项目',
      text: 'Spendly 是正在开发的学术项目，其功能、基础设施和数据处理方式可能继续演进。'
    },
    contact: {
      title: '隐私联系',
      text: '隐私相关问题可通过帮助中心或报告问题提交。'
    }
  }
},

editProfile: {
  title: '编辑个人资料',
  loading: '正在加载个人资料...',
  heroTitle: '您的个人信息',
  heroText:
    '更新用于个性化 Spendly 体验的信息。',
  personalInformation: '个人信息',
  displayName: '显示名称',
  displayNamePlaceholder: '例如：Pedro',
  displayNameHelper:
    '该名称将用于应用内的问候和消息。',
  fullName: '完整姓名',
  fullNamePlaceholder: '您的完整姓名',
  email: '电子邮箱',
  emailHelper:
    '出于安全原因，电子邮箱无法修改。',
  memberSince: '加入时间',
  notAvailable: '不可用',
  saveChanges: '保存更改',
  saving: '正在保存...',
  successTitle: '个人资料已更新',
  successMessage:
    '您的信息已成功更新。',
  loadError:
    '无法加载个人资料信息。',
  saveError:
    '无法保存更改。',

  validation: {
    displayNameRequired:
      '显示名称为必填项。',
    displayNameTooShort:
      '显示名称至少需要 2 个字符。',
    fullNameRequired:
      '完整姓名为必填项。',
    fullNameTooShort:
      '完整姓名至少需要 3 个字符。',
  },
},

stats: {
  title: '统计', loading: '正在加载统计数据...', loadError: '无法加载统计数据。', periodLabel: '期间', noPreviousComparison: '无上一期间可比较', comparisonValue: '较上一期间 {value}', noData: '暂无数据', noDescription: '无说明', percentageOfTotal: '占总额的 {value}%', topCategory: '主要类别', monthlyEvolution: '最近 6 个月趋势', expenseByCategory: '按类别统计支出', incomeByCategory: '按类别统计收入', recentTransactions: '最近交易', searchPlaceholder: '搜索交易或类别...', emptyCategoriesTitle: '暂无类别数据', emptyCategoriesText: '在此期间记录交易后，分类明细将显示在这里。', emptyTransactionsTitle: '暂无交易', emptyTransactionsText: '所选期间尚无交易记录。', noSearchResults: '没有找到符合搜索条件的交易。', clearSearch: '清除搜索', addExpense: '添加支出', addIncome: '添加收入',
  periods: { currentMonth: '本月', previousMonth: '上个月', threeMonths: '最近 3 个月', sixMonths: '最近 6 个月', currentYear: '今年', all: '全部' },
  views: { overview: '概览', expense: '支出', income: '收入' },
  hero: { balance: '期间余额', totalExpenses: '支出总额', totalIncome: '收入总额' },
  metrics: { income: '收入', expenses: '支出', balance: '余额', records: '记录', savingsRate: '储蓄率：{value}', recordsBreakdown: '{expenses} 笔支出 · {income} 笔收入' },
  insights: { averageExpense: '平均支出', averageIncome: '平均收入', perExpense: '每笔支出', perIncome: '每笔收入', highestExpense: '最大支出', highestIncome: '最大收入' },
},

security: {
  title: '安全与访问',
  heroTitle: '保护您的账户',
  heroText: '管理密码、访问方式和设备本地安全设置。',
  access: '访问',
  sessions: '会话',
  changePassword: '修改密码',
  changePasswordSubtitle: '更新登录密码',
  biometric: '面容 ID / 指纹',
  accessPin: '访问 PIN',
  enabled: '已启用',
  disabled: '已停用',
  connectedDevices: '已连接设备',
  connectedDevicesSubtitle: '查看活动会话',
  logoutDevice: '在此设备上退出',
  logoutDeviceSubtitle: '在此手机上退出 Spendly',
  biometricUnavailable: '此设备不支持生物识别。',
  biometricNotConfigured: '设备尚未配置生物识别。',
  enableBiometricPrompt: '为 Spendly 启用生物识别',
  disableBiometricPrompt: '为 Spendly 停用生物识别',
  createPin: '创建 PIN',
  confirmPin: '确认 PIN',
  disablePin: '停用 PIN',
  createPinText: '输入 4 位 PIN 以保护 Spendly。',
  confirmPinText: '再次输入 PIN。',
  disablePinText: '输入当前 PIN 以停用。',
  pinMismatch: '两次输入的 PIN 不一致。',
  incorrectPin: 'PIN 错误。',
  logoutTitle: '退出登录',
  logoutConfirm: '确定要在此设备上退出吗？',
  logout: '退出登录',
},

sessions: {
  title: '已连接设备', loading: '正在加载会话...', loadError: '无法加载会话。', heroTitle: '活动会话', heroText: '检查账户已登录的设备，并关闭您不认识的访问。',
  currentSession: '当前会话', otherDevices: '其他设备', current: '当前', unknownDevice: '未知设备', noData: '无数据', ip: 'IP',
  lastActivity: '最近活动', created: '创建时间', closeSession: '关闭会话', closeAll: '全部关闭', close: '关闭',
  currentNotDetectedTitle: '未检测到当前会话', currentNotDetectedText: '无法确定哪个会话属于此设备。', allGoodTitle: '一切正常', allGoodText: '您的账户没有连接其他设备。',
  info: '关闭会话后，该设备需要重新登录才能访问 Spendly。', singleModalTitle: '关闭会话', singleModalText: '确定要关闭此设备上的会话吗？',
  allModalTitle: '关闭其他会话', allModalText: '这会让账户在所有其他设备上退出，但保留当前会话。', passwordPlaceholder: '当前密码', passwordRequired: '请输入密码。',
  successTitle: '会话已更新', singleSuccess: '会话已成功关闭。', allSuccess: '其他会话已成功关闭。', singleError: '无法关闭该会话。', allError: '无法关闭这些会话。',
},

};