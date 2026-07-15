export default {
  common: {
    back: 'Volver',
    cancel: 'Cancelar',
    save: 'Guardar',
    loading: 'Cargando...',
    error: 'Error',
    accept: "Aceptar",
    delete: "Eliminar",
    done: "Listo"
  },

  profile: {
    title: 'Mi Perfil',
    account: 'Cuenta',
    preferences: 'Preferencias',
    data: 'Datos',
    support: 'Soporte',
    session: 'Sesión',

    editPersonalData: 'Editar datos personales',
    editPersonalDataSubtitle: 'Nombre, email y direcciones',

    security: 'Seguridad y acceso',
    securitySubtitle: 'Autenticación, sesiones y acceso',

    appearance: 'Apariencia',
    appearanceSubtitle: 'Claro, oscuro o automático',

    currency: 'Moneda principal',
    language: 'Idioma',
    notifications: 'Notificaciones',
    notificationsSubtitle: 'Alertas, recordatorios y resúmenes',

    exportData: 'Exportar datos',
    exportDataSubtitle: 'Descargar gastos, ingresos y reportes',

    helpCenter: 'Centro de ayuda',
    helpCenterSubtitle: 'Preguntas frecuentes y guías',

    reportProblem: 'Reportar un problema',
    reportProblemSubtitle: 'Avisanos si algo no funciona',

    about: 'Acerca de Spendly',

    logout: 'Cerrar sesión',
    logoutConfirmTitle: 'Cerrar sesión',
    logoutConfirmText:
      '¿Estás seguro de que querés cerrar sesión en Spendly?',

    activeAccount: 'Cuenta activa',
    inactiveAccount: 'Cuenta inactiva',

    defaultUser: 'Usuario',
    verifyIdentity: 'Verificar identidad',
    version: 'Versión',
    profilePhoto: 'Foto de perfil',
    viewProfilePhoto: 'Ver foto de perfil',
    updatePhoto: 'Actualizar foto',
    addPhoto: 'Agregar foto',
    deletePhoto: 'Eliminar foto',

  },

  navigation: {
    home: 'Inicio',
    transactions: 'Movimientos',
    stats: 'Estadísticas',
    goals: 'Metas',
  },

  language: {
    title: 'Idioma',
    subtitle: 'Elegí el idioma de la aplicación',
    spanish: 'Español',
    english: 'Inglés',
    portuguese: 'Portugués',
    russian: 'Ruso',
    chinese: 'Chino',
    french: 'Francés',
    german: 'Alemán',

    currentLanguage: 'Idioma actual',
    availableLanguages: 'Idiomas disponibles',
    current: 'Actual',
    saving: 'Guardando idioma...',
    changeInfo:
      'El cambio se aplica inmediatamente en las pantallas que ya tienen traducción.',
  },

  about: {
  title: 'Acerca de Spendly',
  appSubtitle:
    'Gestión inteligente de gastos, ingresos y metas financieras.',
  versionPrefix: 'Versión',
  aboutApp: 'Sobre la aplicación',
  descriptionOne:
    'Spendly es una aplicación móvil pensada para ayudarte a registrar, organizar y comprender tus movimientos financieros de forma simple.',
  descriptionTwo:
    'Permite administrar gastos e ingresos, consultar estadísticas, escanear tickets mediante inteligencia artificial y trabajar con metas de ahorro.',
  information: 'Información',
  currentVersion: 'Versión actual',
  status: 'Estado',
  beta: 'Beta',
  platform: 'Plataforma',
  mobileApp: 'Aplicación móvil',
  documentation: 'Documentación',
  terms: 'Términos y condiciones',
  termsSubtitle: 'Condiciones de uso de Spendly',
  privacy: 'Política de privacidad',
  privacySubtitle: 'Cómo protegemos tus datos',
  rights: 'Todos los derechos reservados.',
},

  categories: {
  food: "Comida",
  transport: "Transporte",
  supermarket: "Supermercado",
  services: "Servicios",
  health: "Salud",
  education: "Educación",
  entertainment: "Entretenimiento",
  clothing: "Ropa",
  technology: "Tecnología",
  salary: "Salario",
  freelance: "Freelance",
  investments: "Inversiones",
  sales: "Ventas",
  gifts: "Regalos",
  refunds: "Reembolsos",
  other: "Otros"
},

methods: {
  cash: "Efectivo",
  debitCard: "Tarjeta de débito",
  creditCard: "Tarjeta de crédito",
  transfer: "Transferencia",
  bankTransfer: "Transferencia bancaria",
  deposit: "Depósito",
  digitalWallet: 'Billetera digital',
  contactlessPayment: 'Pago sin contacto',
  bankAccount: 'Cuenta bancaria',
  other: "Otro"
},

transactionList: {
  unknownDate: "Fecha desconocida",
  today: "Hoy",
  yesterday: "Ayer",
  startAdding: "Empezá agregando uno ahora.",
  loadError: "No se pudieron cargar los {items}.",
  deleteTitle: "Eliminar {item}",
  deleteConfirm: "¿Seguro que querés eliminar \"{description}\"?",
  deleteError: "No se pudo eliminar el {item}.",
  searchPlaceholder: "Buscar {items}...",
  sortTitle: "Ordenar movimientos",
  clearSearch: "Limpiar búsqueda",
  records: "Registros",
  mainCategory: "Cat. principal",
  loading: "Cargando {items}...",
  noResultsTitle: "No se encontraron resultados",
  noResultsText: "Probá con otra búsqueda o quitá los filtros aplicados.",
  clearFilters: "Limpiar filtros",
  deleteHint: "Mantené presionado un movimiento para eliminarlo",
  sort: {
    recent: "Más recientes",
    oldest: "Más antiguos",
    highest: "Mayor monto",
    lowest: "Menor monto"
  },
  income: {
    title: "Ingresos",
    subtitle: "Controlá el dinero que recibís",
    summaryLabel: "Total ingresado este mes",
    singular: "ingreso",
    plural: "ingresos",
    emptyTitle: "Sin ingresos registrados",
    emptyDescription: "Todavía no registraste ningún ingreso este mes.",
    emptyButton: "Agregar primer ingreso",
    defaultDescription: "Ingreso sin descripción"
  },
  expense: {
    title: "Gastos",
    subtitle: "Controlá tus movimientos recientes",
    summaryLabel: "Total gastado este mes",
    singular: "gasto",
    plural: "gastos",
    emptyTitle: "Sin gastos registrados",
    emptyDescription: "Todavía no cargaste ningún gasto este mes.",
    emptyButton: "Agregar primer gasto",
    defaultDescription: "Gasto sin descripción"
  }
},

addTransaction: {
  categoryPlaceholder: "Seleccioná una categoría",
  description: "Descripción",
  dateTime: "Fecha y hora",
  noteOptional: "Nota (opcional)",
  category: "Categoría",
  saveErrorTitle: "No se pudo guardar",
  saveErrorMessage: "Ocurrió un error al registrar la transacción.",
  errors: {
    amountRequired: "El monto es obligatorio",
    amountPositive: "El monto debe ser mayor a 0",
    categoryRequired: "Seleccioná una categoría"
  },
  income: {
    title: "Nuevo ingreso",
    amountQuestion: "¿Cuánto recibiste?",
    descriptionPlaceholder: "Ej: Sueldo, venta, trabajo freelance...",
    descriptionFallback: "Ingreso sin descripción",
    categoryLabel: "Categoría del ingreso *",
    methodLabel: "Medio de recepción",
    notePlaceholder: "Agregá una nota sobre el ingreso...",
    saveButton: "Guardar ingreso",
    savingText: "Guardando ingreso...",
    successTitle: "Ingreso registrado",
    successMessage: "El ingreso se guardó correctamente."
  },
  expense: {
    title: "Nuevo gasto",
    amountQuestion: "¿Cuánto gastaste?",
    descriptionPlaceholder: "Ej: McDonald's, Uber, Netflix...",
    descriptionFallback: "Gasto sin descripción",
    categoryLabel: "Categoría del gasto *",
    methodLabel: "Método de pago",
    notePlaceholder: "Agregá una nota sobre el gasto...",
    saveButton: "Guardar gasto",
    savingText: "Guardando gasto...",
    successTitle: "Gasto registrado",
    successMessage: "El gasto se guardó correctamente."
  }
},

currency: {
  title: 'Moneda principal',
  chooseCurrency: 'Elegí tu moneda',
  description:
    'Esta moneda se usará como referencia para mostrar gastos, reportes, presupuestos y estadísticas dentro de Spendly.',
  currentCurrency: 'Moneda actual',
  example: 'Ejemplo',
  availableCurrencies: 'Monedas disponibles',
  current: 'Actual',
  loading: 'Cargando monedas...',
  saving: 'Guardando',
  syncInfo:
    'La moneda seleccionada se guarda en este dispositivo y se sincroniza con tu cuenta.',
  loadError: 'No se pudo cargar la moneda seleccionada.',
  saveError: 'No se pudo guardar la moneda seleccionada.',

  currencies: {
    ars: 'Peso argentino',
    usd: 'Dólar estadounidense',
    eur: 'Euro',
    gbp: 'Libra esterlina',
    brl: 'Real brasileño',
    clp: 'Peso chileno',
    uyu: 'Peso uruguayo',
    mxn: 'Peso mexicano',
    rub: 'Rublo ruso',
    cny: 'Yuan chino',
  },
},

helpCenter: {
  title: 'Centro de ayuda',
  heroTitle: '¿Cómo podemos ayudarte?',
  heroText:
    'Encontrá respuestas rápidas y aprendé a usar las principales funciones de Spendly.',
  searchPlaceholder: 'Buscar una pregunta...',
  faqTitle: 'Preguntas frecuentes',
  noResultsTitle: 'No encontramos resultados',
  noResultsText:
    'Probá buscando con otras palabras o revisá la guía rápida.',
  clearSearch: 'Limpiar búsqueda',
  moreHelpTitle: '¿Todavía necesitás ayuda?',
  moreHelpText:
    'Podés reportar un problema y contarnos qué está pasando.',
  reportProblem: 'Reportar un problema',

  faq: {
    addTransaction: {
      question: '¿Cómo agrego un gasto o un ingreso?',
      answer:
        'Entrá en Movimientos, elegí Gastos o Ingresos y tocá el botón +. Completá el monto, la categoría y los datos opcionales antes de guardar.',
    },
    editTransaction: {
      question: '¿Puedo editar un movimiento?',
      answer:
        'La edición depende de la versión disponible. Desde el detalle del movimiento podrás modificar sus datos cuando esta función esté habilitada.',
    },
    deleteTransaction: {
      question: '¿Cómo elimino un movimiento?',
      answer:
        'En la lista de movimientos, mantené presionada la operación que querés eliminar y confirmá la acción.',
    },
    currency: {
      question: '¿Cómo cambio la moneda principal?',
      answer:
        'Abrí Perfil, entrá en Moneda principal y seleccioná la moneda que querés usar. Los montos se mostrarán con ese formato.',
    },
    language: {
      question: '¿Cómo cambio el idioma?',
      answer:
        'Desde Perfil, entrá en Idioma y seleccioná una de las opciones disponibles. El cambio se aplica inmediatamente.',
    },
    theme: {
      question: '¿Cómo activo el modo oscuro?',
      answer:
        'En Perfil, abrí Apariencia y elegí Claro, Oscuro o Automático para seguir el tema del dispositivo.',
    },
    scan: {
      question: '¿Cómo funciona el escaneo de tickets?',
      answer:
        'Entrá en Escanear, sacá una foto o elegí una imagen de la galería. Spendly enviará el ticket al sistema de análisis para detectar sus datos.',
    },
    security: {
      question: '¿Puedo proteger mi cuenta con PIN o biometría?',
      answer:
        'Sí. Entrá en Perfil, luego en Seguridad y acceso, y configurá el PIN o la autenticación biométrica disponibles en tu dispositivo.',
    },
    offline: {
      question: '¿Spendly funciona sin conexión?',
      answer:
        'Algunas preferencias pueden mantenerse en el dispositivo, pero las funciones que consultan o guardan información en el servidor necesitan conexión.',
    },
    goals: {
      question: '¿Cómo funcionan las metas financieras?',
      answer:
        'Las metas permiten definir un objetivo de ahorro, asignarle un monto y seguir su progreso. Esta función puede depender de la disponibilidad del backend.',
    },
  },

  guide: {
    title: 'Guía rápida de uso',
    description:
      'Seguí estos pasos para empezar a organizar tus finanzas con Spendly.',
    steps: {
      account: {
        title: 'Revisá tu perfil',
        description:
          'Completá tus datos, elegí idioma, moneda, apariencia y opciones de seguridad.',
      },
      transaction: {
        title: 'Registrá tus movimientos',
        description:
          'Agregá cada gasto o ingreso indicando monto, categoría, fecha y descripción.',
      },
      movements: {
        title: 'Consultá y buscá',
        description:
          'Usá el listado para buscar, ordenar y revisar todos tus movimientos recientes.',
      },
      stats: {
        title: 'Analizá tus estadísticas',
        description:
          'Revisá totales, categorías principales y movimientos destacados para entender mejor tus hábitos.',
      },
      preferences: {
        title: 'Personalizá Spendly',
        description:
          'Configurá tema, idioma, moneda y seguridad para adaptar la aplicación a tus preferencias.',
      },
    },
  },
},

terms: {
  title: 'Términos y condiciones',
  subtitle: 'Condiciones generales para utilizar Spendly y sus funcionalidades.',
  contentTitle: 'Condiciones de uso',
  meta: {
    versionLabel: 'Versión legal',
    versionValue: '1.0',
    updatedLabel: 'Última actualización',
    updatedValue: 'Julio de 2026',
    responsibleLabel: 'Responsable'
  },
  notice: 'Este documento es una versión informativa preparada para Spendly. Para una publicación comercial definitiva, Team GST debería solicitar revisión legal profesional.',
  sections: {
    acceptance: {
      title: 'Aceptación de los términos',
      text: 'Al crear una cuenta, acceder o utilizar Spendly, aceptás estas condiciones. Si no estás de acuerdo, deberás dejar de utilizar la aplicación.'
    },
    permittedUse: {
      title: 'Uso permitido de Spendly',
      text: 'Spendly está destinada a la organización financiera personal. No podrá utilizarse para actividades ilegales, fraudulentas, abusivas o que afecten el funcionamiento de la plataforma.'
    },
    account: {
      title: 'Cuenta y credenciales',
      text: 'Sos responsable de mantener seguras tus credenciales, PIN y métodos biométricos. También debés informar cualquier acceso no autorizado y mantener actualizados los datos de tu cuenta.'
    },
    financialData: {
      title: 'Información financiera',
      text: 'Los montos, categorías, descripciones y demás datos cargados por el usuario deben revisarse antes de guardarse. Spendly organiza información, pero no garantiza que los registros ingresados sean completos o exactos.'
    },
    ai: {
      title: 'OCR e inteligencia artificial',
      text: 'El escaneo de tickets puede utilizar OCR e inteligencia artificial. Los resultados pueden contener errores, por lo que siempre deberás revisar y corregir la información antes de confirmarla.'
    },
    availability: {
      title: 'Disponibilidad del servicio',
      text: 'Team GST realizará esfuerzos razonables para mantener Spendly disponible. Algunas funciones pueden interrumpirse por mantenimiento, actualizaciones, fallas de infraestructura o servicios de terceros.'
    },
    security: {
      title: 'Seguridad y acceso',
      text: 'Spendly utiliza autenticación, manejo seguro de contraseñas y controles de acceso. Ningún sistema es completamente infalible, por lo que también deberás proteger tu dispositivo y tus credenciales.'
    },
    intellectualProperty: {
      title: 'Propiedad intelectual',
      text: 'El nombre Spendly, su diseño, código, textos, recursos visuales y documentación pertenecen a Team GST o a sus respectivos autores. No podrán copiarse o redistribuirse sin autorización.'
    },
    updates: {
      title: 'Actualizaciones y cambios',
      text: 'Spendly puede incorporar, modificar o retirar funciones. Estos términos también podrán actualizarse, y la fecha de última modificación se mostrará dentro de la aplicación.'
    },
    liability: {
      title: 'Limitación de responsabilidad',
      text: 'Spendly no brinda asesoramiento financiero, contable, tributario ni legal. Las decisiones tomadas a partir de la información mostrada son responsabilidad del usuario.'
    },
    suspension: {
      title: 'Suspensión o cierre de cuenta',
      text: 'Team GST podrá limitar o suspender cuentas utilizadas de forma abusiva, fraudulenta o contraria a estas condiciones. El usuario podrá solicitar la eliminación de su cuenta cuando esta función esté disponible.'
    },
    contact: {
      title: 'Contacto',
      text: 'Las consultas sobre estos términos podrán enviarse mediante Centro de ayuda o Reportar un problema dentro de Spendly.'
    }
  }
},

privacy: {
  title: 'Política de privacidad',
  subtitle: 'Cómo Spendly recopila, utiliza y protege la información del usuario.',
  contentTitle: 'Tratamiento de datos',
  meta: {
    versionLabel: 'Versión legal',
    versionValue: '1.0',
    updatedLabel: 'Última actualización',
    updatedValue: 'Julio de 2026',
    responsibleLabel: 'Responsable'
  },
  notice: 'Esta política describe el funcionamiento actual de Spendly. Antes de una publicación comercial definitiva, Team GST debería validar el documento con asesoramiento legal.',
  sections: {
    collection: {
      title: 'Información que recopilamos',
      text: 'Spendly puede tratar nombre, correo electrónico, información de perfil, gastos, ingresos, categorías, fechas, descripciones, metas, preferencias y datos técnicos necesarios para operar la aplicación.'
    },
    use: {
      title: 'Cómo utilizamos la información',
      text: 'La información se utiliza para autenticar usuarios, mostrar balances, generar estadísticas, guardar preferencias, mejorar la experiencia y prestar las funciones principales de Spendly.'
    },
    financialData: {
      title: 'Datos financieros personales',
      text: 'Los movimientos registrados se utilizan únicamente para ofrecer herramientas de organización personal. Spendly no es una entidad bancaria y no administra fondos ni realiza operaciones financieras por cuenta del usuario.'
    },
    ai: {
      title: 'Tickets, OCR e inteligencia artificial',
      text: 'Las imágenes de tickets pueden enviarse a servicios de procesamiento para extraer comercio, importe, fecha, categoría y descripción. El usuario puede revisar los resultados antes de guardarlos.'
    },
    deviceStorage: {
      title: 'Datos almacenados en el dispositivo',
      text: 'Algunas preferencias, como sesión, tema, idioma, moneda, PIN o biometría, pueden almacenarse localmente mediante mecanismos del dispositivo para mejorar la continuidad de uso.'
    },
    security: {
      title: 'Seguridad de la información',
      text: 'Spendly utiliza autenticación, contraseñas protegidas y conexiones seguras. Aunque se aplican medidas razonables, ningún sistema puede garantizar seguridad absoluta.'
    },
    services: {
      title: 'Servicios e infraestructura',
      text: 'Spendly puede utilizar servicios como Railway, PostgreSQL, FastAPI, Expo y proveedores de procesamiento de imágenes. Estos servicios intervienen únicamente para alojar, procesar o entregar las funcionalidades de la aplicación.'
    },
    retention: {
      title: 'Conservación de datos',
      text: 'Los datos podrán conservarse mientras la cuenta permanezca activa o durante el tiempo necesario para prestar el servicio, cumplir obligaciones técnicas y resolver incidencias.'
    },
    rights: {
      title: 'Derechos del usuario',
      text: 'El usuario podrá solicitar acceso, corrección, exportación o eliminación de sus datos cuando las funciones correspondientes estén disponibles y de acuerdo con las capacidades técnicas del proyecto.'
    },
    deletion: {
      title: 'Eliminación de datos',
      text: 'La eliminación de una cuenta puede implicar el borrado de movimientos, preferencias y demás información asociada, salvo datos que deban conservarse temporalmente por motivos técnicos o de seguridad.'
    },
    academic: {
      title: 'Proyecto académico',
      text: 'Spendly es un proyecto académico en desarrollo. Sus funcionalidades, infraestructura y prácticas de tratamiento de datos pueden evolucionar en futuras versiones.'
    },
    contact: {
      title: 'Contacto sobre privacidad',
      text: 'Las consultas o solicitudes relacionadas con privacidad podrán enviarse mediante Centro de ayuda o Reportar un problema dentro de Spendly.'
    }
  }
},

editProfile: {
  title: 'Editar perfil',
  loading: 'Cargando perfil...',
  heroTitle: 'Tus datos personales',
  heroText:
    'Actualizá la información que utilizamos para personalizar tu experiencia en Spendly.',
  personalInformation: 'Información personal',
  displayName: 'Nombre para mostrar',
  displayNamePlaceholder: 'Ej: Pedro',
  displayNameHelper:
    'Este nombre se usará en saludos y mensajes dentro de la aplicación.',
  fullName: 'Nombre completo',
  fullNamePlaceholder: 'Tu nombre completo',
  email: 'Correo electrónico',
  emailHelper:
    'Por motivos de seguridad, el correo electrónico no puede modificarse.',
  memberSince: 'Miembro desde',
  notAvailable: 'No disponible',
  saveChanges: 'Guardar cambios',
  saving: 'Guardando...',
  successTitle: 'Perfil actualizado',
  successMessage:
    'Tus datos se actualizaron correctamente.',
  loadError:
    'No se pudieron cargar los datos del perfil.',
  saveError:
    'No se pudieron guardar los cambios.',

  validation: {
    displayNameRequired:
      'El nombre para mostrar es obligatorio.',
    displayNameTooShort:
      'El nombre para mostrar debe tener al menos 2 caracteres.',
    fullNameRequired:
      'El nombre completo es obligatorio.',
    fullNameTooShort:
      'El nombre completo debe tener al menos 3 caracteres.',
  },
},

stats: {
  title: 'Estadísticas',
  loading: 'Cargando estadísticas...',
  loadError: 'No se pudieron cargar las estadísticas.',
  periodLabel: 'Período',
  noPreviousComparison: 'Sin comparación previa',
  comparisonValue: '{value} vs. período anterior',
  noData: 'Sin datos',
  noDescription: 'Sin descripción',
  percentageOfTotal: '{value}% del total',
  topCategory: 'Categoría principal',
  monthlyEvolution: 'Evolución de los últimos 6 meses',
  expenseByCategory: 'Gastos por categoría',
  incomeByCategory: 'Ingresos por categoría',
  recentTransactions: 'Movimientos recientes',
  searchPlaceholder: 'Buscar movimiento o categoría...',
  emptyCategoriesTitle: 'Sin datos por categoría',
  emptyCategoriesText: 'Cuando registres movimientos durante este período, vas a ver el desglose acá.',
  emptyTransactionsTitle: 'No hay movimientos',
  emptyTransactionsText: 'Todavía no existen movimientos para el período seleccionado.',
  noSearchResults: 'No encontramos movimientos que coincidan con la búsqueda.',
  clearSearch: 'Limpiar búsqueda',
  addExpense: 'Agregar gasto',
  addIncome: 'Agregar ingreso',
  periods: { currentMonth: 'Este mes', previousMonth: 'Mes anterior', threeMonths: 'Últimos 3 meses', sixMonths: 'Últimos 6 meses', currentYear: 'Este año', all: 'Todo' },
  views: { overview: 'Resumen', expense: 'Gastos', income: 'Ingresos' },
  hero: { balance: 'Balance del período', totalExpenses: 'Total gastado', totalIncome: 'Total ingresado' },
  metrics: { income: 'Ingresos', expenses: 'Gastos', balance: 'Balance', records: 'Registros', savingsRate: 'Tasa de ahorro: {value}', recordsBreakdown: '{expenses} gastos · {income} ingresos' },
  insights: { averageExpense: 'Gasto promedio', averageIncome: 'Ingreso promedio', perExpense: 'por gasto', perIncome: 'por ingreso', highestExpense: 'Mayor gasto', highestIncome: 'Mayor ingreso' },
},

security: {
  title: 'Seguridad y acceso',
  heroTitle: 'Protegé tu cuenta',
  heroText: 'Administrá tu contraseña, métodos de acceso y seguridad local del dispositivo.',
  access: 'Acceso',
  sessions: 'Sesión',
  changePassword: 'Cambiar contraseña',
  changePasswordSubtitle: 'Actualizá tu clave de acceso',
  biometric: 'Face ID / huella',
  accessPin: 'PIN de acceso',
  enabled: 'Activado',
  disabled: 'Desactivado',
  connectedDevices: 'Dispositivos conectados',
  connectedDevicesSubtitle: 'Ver sesiones activas',
  logoutDevice: 'Cerrar sesión en este dispositivo',
  logoutDeviceSubtitle: 'Salir de Spendly en este celular',
  biometricUnavailable: 'Este dispositivo no soporta autenticación biométrica.',
  biometricNotConfigured: 'No tenés Face ID, huella o biometría configurada.',
  enableBiometricPrompt: 'Activar acceso biométrico para Spendly',
  disableBiometricPrompt: 'Desactivar acceso biométrico para Spendly',
  createPin: 'Crear PIN',
  confirmPin: 'Confirmar PIN',
  disablePin: 'Desactivar PIN',
  createPinText: 'Ingresá un PIN de 4 dígitos para proteger Spendly.',
  confirmPinText: 'Volvé a ingresar el PIN para confirmarlo.',
  disablePinText: 'Ingresá tu PIN actual para desactivarlo.',
  pinMismatch: 'Los PIN no coinciden.',
  incorrectPin: 'PIN incorrecto.',
  logoutTitle: 'Cerrar sesión',
  logoutConfirm: '¿Querés cerrar sesión en este dispositivo?',
  logout: 'Cerrar sesión',
},

sessions: {
  title: 'Dispositivos conectados', loading: 'Cargando sesiones...', loadError: 'No se pudieron cargar las sesiones.',
  heroTitle: 'Sesiones activas', heroText: 'Revisá los dispositivos donde tu cuenta está iniciada y cerrá accesos que no reconozcas.',
  currentSession: 'Sesión actual', otherDevices: 'Otros dispositivos', current: 'Actual', unknownDevice: 'Dispositivo desconocido', noData: 'Sin datos',
  ip: 'IP', lastActivity: 'Última actividad', created: 'Creada', closeSession: 'Cerrar sesión', closeAll: 'Cerrar todas', close: 'Cerrar',
  currentNotDetectedTitle: 'Sesión actual no detectada', currentNotDetectedText: 'No pudimos identificar cuál de las sesiones corresponde a este dispositivo.',
  allGoodTitle: 'Todo en orden', allGoodText: 'No hay otros dispositivos conectados a tu cuenta.',
  info: 'Cuando cerrás una sesión, ese dispositivo debe volver a iniciar sesión para acceder a Spendly.',
  singleModalTitle: 'Cerrar sesión', singleModalText: '¿Querés cerrar sesión en este dispositivo?',
  allModalTitle: 'Cerrar otras sesiones', allModalText: 'Esto cerrará tu cuenta en todos los demás dispositivos, pero mantendrá activa esta sesión.',
  passwordPlaceholder: 'Contraseña actual', passwordRequired: 'Ingresá tu contraseña.', successTitle: 'Sesiones actualizadas',
  singleSuccess: 'La sesión se cerró correctamente.', allSuccess: 'Las demás sesiones se cerraron correctamente.',
  singleError: 'No se pudo cerrar la sesión.', allError: 'No se pudieron cerrar las sesiones.',
},

pinUnlock: {
  loading: 'Cargando seguridad...',
  title: 'Desbloquear Spendly',
  subtitle: 'Ingresá tu PIN de acceso para continuar.',
  lockedTitle: 'PIN bloqueado',
  lockedSubtitle: 'Probá nuevamente en {time}.',
  tooManyAttempts: 'Demasiados intentos fallidos.',
  incorrectWithAttempts:
    'PIN incorrecto. Intentos restantes: {attempts}.',
  attemptsUsed: 'Intentos utilizados: {used} de {max}',
  pinNotConfigured:
    'No hay un PIN configurado. Volviendo a la pantalla anterior.',
  loadError:
    'No se pudo cargar el estado de seguridad.',
  validationError:
    'No se pudo validar el PIN.',

  time: {
    hoursMinutes: '{hours} h {minutes} min',
  },
},

changePassword: {
  title: 'Cambiar contraseña',
  heroTitle: 'Actualizá tu clave',
  heroText: 'Usá una contraseña segura y diferente a la anterior para proteger tu cuenta.',
  currentPassword: 'Contraseña actual',
  currentPlaceholder: 'Ingresá tu contraseña actual',
  newPassword: 'Nueva contraseña',
  newPlaceholder: 'Mínimo 8 caracteres',
  repeatPassword: 'Repetir nueva contraseña',
  repeatPlaceholder: 'Repetí la nueva contraseña',
  save: 'Guardar nueva contraseña',
  saving: 'Guardando...',
  saveError: 'No se pudo cambiar la contraseña.',
  successTitle: 'Contraseña actualizada',
  successText: 'Tu contraseña se cambió correctamente.',
  validation: {
    required: 'Completá todos los campos.',
    minLength: 'La nueva contraseña debe tener al menos 8 caracteres.',
    samePassword: 'La nueva contraseña debe ser diferente a la actual.',
    noMatch: 'Las contraseñas nuevas no coinciden.',
  },
},

notifications: {
  title: 'Notificaciones',
  loading: 'Cargando notificaciones...',
  loadError: 'No se pudo cargar la configuración.',
  saveError: 'No se pudo guardar la configuración.',
  heroTitle: 'Avisos útiles, no molestos',
  heroText: 'Elegí recordatorios puntuales que realmente te ayuden a organizar tus finanzas.',
  generalSection: 'General', activitySection: 'Actividad', summarySection: 'Resúmenes', goalsSection: 'Metas',
  permissionTitle: 'Permiso del sistema', openSettings: 'Ajustes',
  permissionDeniedTitle: 'Permiso desactivado',
  permissionDeniedText: 'Activá las notificaciones desde los ajustes del dispositivo para poder usarlas.',
  permissionRequiredTitle: 'Permiso necesario', permissionRequiredText: 'Primero activá las notificaciones de Spendly.',
  testScheduledTitle: 'Notificación programada', testScheduledText: 'La vas a recibir en unos segundos.',
  testButton: 'Enviar notificación de prueba',
  goalsInfo: 'Los avisos de metas abrirán directamente la meta correspondiente. Solo se enviarán por vencimiento cercano, progreso importante o finalización.',
  permission: { granted: 'Permitidas', denied: 'Bloqueadas', undetermined: 'Sin configurar' },
  master: { title: 'Permitir notificaciones', subtitle: 'Control general de todos los avisos locales de Spendly.' },
  daily: { title: 'Recordatorio de movimientos', subtitle: 'Un único aviso diario para registrar gastos o ingresos pendientes.', timeTitle: 'Horario del recordatorio', timeHint: 'Elegimos horarios de tarde para evitar interrupciones durante el día.' },
  weekly: { title: 'Resumen semanal', subtitle: 'Un aviso los lunes por la tarde para revisar la semana anterior.' },
  monthly: { title: 'Resumen mensual', subtitle: 'Un aviso el primer día del mes para revisar ingresos y gastos.' },
  goalDeadline: { title: 'Metas próximas a vencer', subtitle: 'Avisar tres días antes de la fecha objetivo.' },
  goalProgress: { title: 'Progreso importante', subtitle: 'Avisar una sola vez cuando una meta alcance aproximadamente el 80%.' },
  goalCompleted: { title: 'Meta completada', subtitle: 'Celebrar cuando alcances el monto objetivo.' },
  copy: {
    dailyTitle: '¿Te quedó algún movimiento pendiente?', dailyBody: 'Registrar lo de hoy te lleva menos de un minuto.',
    weeklyTitle: 'Tu semana financiera está lista', weeklyBody: 'Revisá ingresos, gastos y balance de la semana.',
    monthlyTitle: 'Nuevo mes, nuevo resumen', monthlyBody: 'Mirá cómo cerró el mes anterior en Estadísticas.',
    testTitle: 'Spendly está listo', testBody: 'Las notificaciones funcionan correctamente.'
  },
},

goals: {
  title: 'Metas', subtitle: 'Convertí tus objetivos en progreso real.', loading: 'Cargando metas...', search: 'Buscar metas...',
  filters: { all: 'Todas', active: 'Activas', paused: 'Pausadas', completed: 'Completadas', cancelled: 'Canceladas' },
  status: { active: 'Activa', paused: 'Pausada', completed: 'Completada', cancelled: 'Cancelada' },
  priority: { low: 'Baja', medium: 'Media', high: 'Alta' },
  category: { emergency: 'Emergencia', travel: 'Viaje', home: 'Hogar', education: 'Educación', vehicle: 'Vehículo', technology: 'Tecnología', health: 'Salud', other: 'Otra' },
  summary: { active: 'Activas', completed: 'Completadas', saved: 'Total ahorrado' },
  card: { remaining: 'Falta' },
  empty: { title: 'Todavía no tenés metas', text: 'Creá tu primer objetivo y empezá a registrar aportes.' },
  actions: { create: 'Crear meta', saveChanges: 'Guardar cambios', contribute: 'Aportar', withdraw: 'Retirar', confirm: 'Confirmar', edit: 'Editar', pause: 'Pausar', resume: 'Reanudar', cancelGoal: 'Cancelar meta', delete: 'Eliminar' },
  form: { createTitle: 'Nueva meta', editTitle: 'Editar meta', namePlaceholder: 'Ej. Viaje a Japón', descriptionPlaceholder: '¿Qué querés lograr?', targetAmount: 'Monto objetivo', category: 'Categoría', priority: 'Prioridad' },
  detail: { of: 'de', history: 'Historial de movimientos' },
  movement: { aporte: 'Aporte', retiro: 'Retiro', ajuste: 'Ajuste' },
  movementForm: { aporte: 'Registrar aporte', retiro: 'Registrar retiro', ajuste: 'Registrar ajuste', amount: 'Monto', note: 'Nota opcional' },
  validation: { name: 'Ingresá un nombre para la meta.', amount: 'Ingresá un monto objetivo válido.', movementAmount: 'Ingresá un monto válido.' },
  confirm: { deleteTitle: 'Eliminar meta', deleteText: 'La meta y todo su historial se eliminarán definitivamente.', deleteMovementTitle: 'Eliminar movimiento', deleteMovementText: 'El progreso de la meta se recalculará.' },
  notifications: { deadlineTitle: 'Una meta está cerca de vencer', deadlineBody: 'La meta “{goal}” vence dentro de pocos días.', progressTitle: '¡Gran progreso!', progressBody: 'La meta “{goal}” ya alcanzó el {percentage}%.', completedTitle: '¡Meta completada!', completedBody: 'Alcanzaste el objetivo de “{goal}”.' },
  errors: { load: 'No se pudieron cargar las metas.', save: 'No se pudo guardar la meta.', movement: 'No se pudo registrar el movimiento.' }
},

support: { category: { transactions:'Transacciones', profile:'Perfil', authentication:'Autenticación', scan:'Escaneo', statistics:'Estadísticas', goals:'Metas', notifications:'Notificaciones', appearance:'Apariencia', language:'Idioma', currency:'Moneda', performance:'Rendimiento', other:'Otro' }, status:{ all:'Todos', open:'Abierto', in_review:'En revisión', resolved:'Resuelto', closed:'Cerrado' }, validation:{ subject:'El asunto debe tener al menos 5 caracteres.', description:'La descripción debe tener al menos 10 caracteres.' }, success:{ title:'Reporte enviado', text:'Guardamos tu reporte correctamente. Podés seguir su estado desde Mis reportes.' }, errors:{ submit:'No se pudo enviar el reporte.' }, report:{ title:'Reportar un problema', heroTitle:'Contanos qué pasó', heroText:'Tu reporte nos ayuda a detectar errores y mejorar Spendly.', category:'Categoría', subject:'Asunto', subjectPlaceholder:'Resumí el problema', description:'Descripción', descriptionPlaceholder:'Explicá qué ocurrió y qué esperabas que pasara.', steps:'Pasos para reproducir', stepsPlaceholder:'1. Abrí...\n2. Toqué...\n3. Ocurrió...', technicalTitle:'Incluir información técnica', technicalText:'Adjunta versión de la app, sistema operativo y modelo del dispositivo.', privacy:'No se envían contraseñas, datos bancarios ni movimientos financieros.', submit:'Enviar reporte' }, list:{ title:'Mis reportes', loading:'Cargando reportes...', emptyTitle:'Todavía no enviaste reportes', emptyText:'Cuando necesites ayuda, podés crear un reporte desde acá.', create:'Crear reporte' }, detail:{ title:'Detalle del reporte', description:'Descripción', steps:'Pasos para reproducir', dates:'Fechas', created:'Creado', updated:'Actualizado', resolved:'Resuelto', technical:'Información técnica', appVersion:'Versión de la app', platform:'Plataforma', os:'Sistema operativo', device:'Dispositivo', responseTitle:'Respuesta del equipo', pendingTitle:'Esperando respuesta', pendingText:'El equipo todavía no respondió este reporte.' } },

home: {
  greeting: 'Hola, {name}',
  welcomeBack: 'Bienvenido de nuevo',
  defaultUser: 'Usuario',
  loading: 'Cargando resumen...',
  balanceMonth: 'Balance total del mes',
  income: 'Ingresos',
  expenses: 'Gastos',
  available: 'Disponible',
  monthSummary: 'Resumen del mes',
  totalSpent: 'Total gastado',
  totalIncome: 'Total ingresado',
  topCategory: 'Categoría principal',
  noData: 'Sin datos',
  featuredGoal: 'Meta destacada',
  goalProgress: '{percent}% completado',
  recentExpenses: 'Gastos recientes',
  categories: 'Categorías',
  viewAll: 'Ver todos',
  expenseNoDescription: 'Gasto sin descripción',
  otherCategory: 'Otros',

  quick: {
    expense: 'Gasto',
    income: 'Ingreso',
    scan: 'Escanear',
    stats: 'Stats',
  },

  emptyGoal: {
    title: 'Todavía no tenés metas activas',
    text:
      'Creá una meta para seguir tu progreso desde la pantalla principal.',
    action: 'Crear meta',
  },

  emptyExpenses: {
    title: 'Todavía no hay gastos',
    text:
      'Cuando cargues tus primeros gastos, van a aparecer acá.',
    action: 'Agregar gasto',
  },

  emptyCategories: {
    title: 'Sin categorías todavía',
    text:
      'No registraste gastos en ninguna categoría durante este mes.',
  },

  date: {
    today: 'Hoy',
    yesterday: 'Ayer',
  },

  errors: {
    title: 'No pudimos actualizar la Home',
    load:
      'No se pudieron cargar los datos principales.',
    retry: 'Reintentar',
  },
},

};