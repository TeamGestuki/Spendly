export default {
  common: {
    back: 'Voltar',
    cancel: 'Cancelar',
    save: 'Salvar',
    loading: 'Carregando...',
    error: 'Erro',
    accept: "Aceitar",
    delete: "Excluir",
    done: "Concluído"
  },

  profile: {
    title: 'Meu Perfil',
    account: 'Conta',
    preferences: 'Preferências',
    data: 'Dados',
    support: 'Suporte',
    session: 'Sessão',

    editPersonalData: 'Editar dados pessoais',
    editPersonalDataSubtitle: 'Nome, e-mail e endereços',

    security: 'Segurança e acesso',
    securitySubtitle: 'Autenticação, sessões e acesso',

    appearance: 'Aparência',
    appearanceSubtitle: 'Claro, escuro ou automático',

    currency: 'Moeda principal',
    language: 'Idioma',
    notifications: 'Notificações',
    notificationsSubtitle: 'Alertas, lembretes e resumos',

    exportData: 'Exportar dados',
    exportDataSubtitle: 'Baixar despesas, receitas e relatórios',

    helpCenter: 'Central de ajuda',
    helpCenterSubtitle: 'Perguntas frequentes e guias',

    reportProblem: 'Relatar um problema',
    reportProblemSubtitle: 'Avise-nos se algo não estiver funcionando',

    about: 'Sobre o Spendly',

    logout: 'Sair',
    logoutConfirmTitle: 'Sair',
    logoutConfirmText:
      'Tem certeza de que deseja sair do Spendly?',

    activeAccount: 'Conta ativa',
    inactiveAccount: 'Conta inativa',

    defaultUser: 'Usuário',
    verifyIdentity: 'Verificar identidade',
    version: 'Versão',
    profilePhoto: 'Foto de perfil',
    viewProfilePhoto: 'Ver foto de perfil',
    updatePhoto: 'Atualizar foto',
    addPhoto: 'Adicionar foto',
    deletePhoto: 'Excluir foto',

  },

  navigation: {
    home: 'Início',
    transactions: 'Movimentações',
    stats: 'Estatísticas',
    goals: 'Metas',
  },

  language: {
    title: 'Idioma',
    subtitle: 'Escolha o idioma do aplicativo',
    spanish: 'Espanhol',
    english: 'Inglês',
    portuguese: 'Português',
    russian: 'Russo',
    chinese: 'Chinês',
    french: 'Francês',
    german: 'Alemão',

    currentLanguage: 'Idioma atual',
    availableLanguages: 'Idiomas disponíveis',
    current: 'Atual',
    saving: 'Salvando idioma...',
    changeInfo:
      'A alteração é aplicada imediatamente nas telas que já possuem tradução.',
  },

  about: {
  title: 'Sobre o Spendly',
  appSubtitle:
    'Gestão inteligente de despesas, receitas e metas financeiras.',
  versionPrefix: 'Versão',
  aboutApp: 'Sobre o aplicativo',
  descriptionOne:
    'O Spendly é um aplicativo móvel criado para ajudar você a registrar, organizar e entender suas movimentações financeiras de forma simples.',
  descriptionTwo:
    'Ele permite administrar despesas e receitas, consultar estatísticas, escanear comprovantes com inteligência artificial e acompanhar metas de economia.',
  information: 'Informações',
  currentVersion: 'Versão atual',
  status: 'Status',
  beta: 'Beta',
  platform: 'Plataforma',
  mobileApp: 'Aplicativo móvel',
  documentation: 'Documentação',
  terms: 'Termos e condições',
  termsSubtitle: 'Condições de uso do Spendly',
  privacy: 'Política de privacidade',
  privacySubtitle: 'Como protegemos seus dados',
  rights: 'Todos os direitos reservados.',
},

  categories:
{
  food: "Alimentação",
  transport: "Transporte",
  supermarket: "Supermercado",
  services: "Serviços",
  health: "Saúde",
  education: "Educação",
  entertainment: "Entretenimento",
  clothing: "Roupas",
  technology: "Tecnologia",
  salary: "Salário",
  freelance: "Freelance",
  investments: "Investimentos",
  sales: "Vendas",
  gifts: "Presentes",
  refunds: "Reembolsos",
  other: "Outros"
},

methods: {
  cash: "Dinheiro",
  debitCard: "Cartão de débito",
  creditCard: "Cartão de crédito",
  transfer: "Transferência",
  bankTransfer: "Transferência bancária",
  digitalWallet: 'Carteira digital',
  contactlessPayment: 'Pagamento por aproximação',
  bankAccount: 'Conta bancária',
  deposit: "Depósito",
  other: "Outro"
},

transactionList: {
  unknownDate: "Data desconhecida",
  today: "Hoje",
  yesterday: "Ontem",
  startAdding: "Comece adicionando um agora.",
  loadError: "Não foi possível carregar os {items}.",
  deleteTitle: "Excluir {item}",
  deleteConfirm: "Tem certeza de que deseja excluir \"{description}\"?",
  deleteError: "Não foi possível excluir o {item}.",
  searchPlaceholder: "Buscar {items}...",
  sortTitle: "Ordenar movimentações",
  clearSearch: "Limpar busca",
  records: "Registros",
  mainCategory: "Categoria principal",
  loading: "Carregando {items}...",
  noResultsTitle: "Nenhum resultado encontrado",
  noResultsText: "Tente outra busca ou remova os filtros aplicados.",
  clearFilters: "Limpar filtros",
  deleteHint: "Mantenha uma movimentação pressionada para excluí-la",
  sort: {
    recent: "Mais recentes",
    oldest: "Mais antigos",
    highest: "Maior valor",
    lowest: "Menor valor"
  },
  income: {
    title: "Receitas",
    subtitle: "Controle o dinheiro que você recebe",
    summaryLabel: "Total recebido este mês",
    singular: "receita",
    plural: "receitas",
    emptyTitle: "Nenhuma receita registrada",
    emptyDescription: "Você ainda não registrou nenhuma receita este mês.",
    emptyButton: "Adicionar primeira receita",
    defaultDescription: "Receita sem descrição"
  },
  expense: {
    title: "Despesas",
    subtitle: "Controle suas movimentações recentes",
    summaryLabel: "Total gasto este mês",
    singular: "despesa",
    plural: "despesas",
    emptyTitle: "Nenhuma despesa registrada",
    emptyDescription: "Você ainda não adicionou nenhuma despesa este mês.",
    emptyButton: "Adicionar primeira despesa",
    defaultDescription: "Despesa sem descrição"
  }
},

addTransaction:
{
  categoryPlaceholder: "Selecione uma categoria",
  description: "Descrição",
  dateTime: "Data e hora",
  noteOptional: "Observação (opcional)",
  category: "Categoria",
  saveErrorTitle: "Não foi possível salvar",
  saveErrorMessage: "Ocorreu um erro ao registrar a movimentação.",
  errors: {
    amountRequired: "O valor é obrigatório",
    amountPositive: "O valor deve ser maior que 0",
    categoryRequired: "Selecione uma categoria"
  },
  income: {
    title: "Nova receita",
    amountQuestion: "Quanto você recebeu?",
    descriptionPlaceholder: "Ex.: Salário, venda, trabalho freelance...",
    descriptionFallback: "Receita sem descrição",
    categoryLabel: "Categoria da receita *",
    methodLabel: "Meio de recebimento",
    notePlaceholder: "Adicione uma observação sobre a receita...",
    saveButton: "Salvar receita",
    savingText: "Salvando receita...",
    successTitle: "Receita registrada",
    successMessage: "A receita foi salva corretamente."
  },
  expense: {
    title: "Nova despesa",
    amountQuestion: "Quanto você gastou?",
    descriptionPlaceholder: "Ex.: McDonald's, Uber, Netflix...",
    descriptionFallback: "Despesa sem descrição",
    categoryLabel: "Categoria da despesa *",
    methodLabel: "Método de pagamento",
    notePlaceholder: "Adicione uma observação sobre a despesa...",
    saveButton: "Salvar despesa",
    savingText: "Salvando despesa...",
    successTitle: "Despesa registrada",
    successMessage: "A despesa foi salva corretamente."
  }
},

currency: {
  title: 'Moeda principal',
  chooseCurrency: 'Escolha sua moeda',
  description:
    'Esta moeda será usada como referência para mostrar despesas, relatórios, orçamentos e estatísticas no Spendly.',
  currentCurrency: 'Moeda atual',
  example: 'Exemplo',
  availableCurrencies: 'Moedas disponíveis',
  current: 'Atual',
  loading: 'Carregando moedas...',
  saving: 'Salvando',
  syncInfo:
    'A moeda selecionada é salva neste dispositivo e sincronizada com sua conta.',
  loadError: 'Não foi possível carregar a moeda selecionada.',
  saveError: 'Não foi possível salvar a moeda selecionada.',

  currencies: {
    ars: 'Peso argentino',
    usd: 'Dólar americano',
    eur: 'Euro',
    gbp: 'Libra esterlina',
    brl: 'Real brasileiro',
    clp: 'Peso chileno',
    uyu: 'Peso uruguaio',
    mxn: 'Peso mexicano',
    rub: 'Rublo russo',
    cny: 'Yuan chinês',
  },
},

helpCenter: {
  title: 'Central de ajuda',
  heroTitle: 'Como podemos ajudar?',
  heroText:
    'Encontre respostas rápidas e aprenda a usar as principais funções do Spendly.',
  searchPlaceholder: 'Buscar uma pergunta...',
  faqTitle: 'Perguntas frequentes',
  noResultsTitle: 'Nenhum resultado encontrado',
  noResultsText:
    'Tente usar outras palavras ou consulte o guia rápido.',
  clearSearch: 'Limpar busca',
  moreHelpTitle: 'Ainda precisa de ajuda?',
  moreHelpText:
    'Você pode relatar um problema e nos contar o que está acontecendo.',
  reportProblem: 'Relatar um problema',

  faq: {
    addTransaction: {
      question: 'Como adiciono uma despesa ou receita?',
      answer:
        'Abra Movimentações, escolha Despesas ou Receitas e toque no botão +. Preencha o valor, a categoria e os dados opcionais antes de salvar.',
    },
    editTransaction: {
      question: 'Posso editar uma movimentação?',
      answer:
        'A edição depende da versão disponível. Você poderá alterar os dados nos detalhes da movimentação quando esta função estiver habilitada.',
    },
    deleteTransaction: {
      question: 'Como excluo uma movimentação?',
      answer:
        'Na lista de movimentações, mantenha pressionada a operação que deseja excluir e confirme a ação.',
    },
    currency: {
      question: 'Como altero a moeda principal?',
      answer:
        'Abra Perfil, entre em Moeda principal e selecione a moeda que deseja usar. Os valores serão exibidos nesse formato.',
    },
    language: {
      question: 'Como altero o idioma?',
      answer:
        'Em Perfil, abra Idioma e selecione uma das opções disponíveis. A alteração é aplicada imediatamente.',
    },
    theme: {
      question: 'Como ativo o modo escuro?',
      answer:
        'Em Perfil, abra Aparência e escolha Claro, Escuro ou Automático para seguir o tema do dispositivo.',
    },
    scan: {
      question: 'Como funciona a leitura de comprovantes?',
      answer:
        'Abra Escanear, tire uma foto ou escolha uma imagem da galeria. O Spendly enviará o comprovante ao sistema de análise para detectar seus dados.',
    },
    security: {
      question: 'Posso proteger minha conta com PIN ou biometria?',
      answer:
        'Sim. Abra Perfil, depois Segurança e acesso, e configure o PIN ou a autenticação biométrica disponível no dispositivo.',
    },
    offline: {
      question: 'O Spendly funciona sem internet?',
      answer:
        'Algumas preferências podem permanecer no dispositivo, mas as funções que consultam ou salvam dados no servidor precisam de conexão.',
    },
    goals: {
      question: 'Como funcionam as metas financeiras?',
      answer:
        'As metas permitem definir um objetivo de economia, atribuir um valor e acompanhar o progresso. Esta função pode depender da disponibilidade do backend.',
    },
  },

  guide: {
    title: 'Guia rápido de uso',
    description:
      'Siga estes passos para começar a organizar suas finanças com o Spendly.',
    steps: {
      account: {
        title: 'Revise seu perfil',
        description:
          'Complete seus dados e escolha idioma, moeda, aparência e opções de segurança.',
      },
      transaction: {
        title: 'Registre suas movimentações',
        description:
          'Adicione cada despesa ou receita informando valor, categoria, data e descrição.',
      },
      movements: {
        title: 'Consulte e pesquise',
        description:
          'Use a lista para pesquisar, ordenar e revisar todas as movimentações recentes.',
      },
      stats: {
        title: 'Analise suas estatísticas',
        description:
          'Revise totais, categorias principais e movimentações em destaque para entender melhor seus hábitos.',
      },
      preferences: {
        title: 'Personalize o Spendly',
        description:
          'Configure tema, idioma, moeda e segurança para adaptar o aplicativo às suas preferências.',
      },
    },
  },
},

terms: {
  title: 'Termos e condições',
  subtitle: 'Condições gerais para usar o Spendly e suas funcionalidades.',
  contentTitle: 'Condições de uso',
  meta: {
    versionLabel: 'Versão legal',
    versionValue: '1.0',
    updatedLabel: 'Última atualização',
    updatedValue: 'Julho de 2026',
    responsibleLabel: 'Equipe responsável'
  },
  notice: 'Esta é uma versão informativa preparada para o Spendly. Antes de uma publicação comercial definitiva, a Team GST deve solicitar revisão jurídica profissional.',
  sections: {
    acceptance: {
      title: 'Aceitação dos termos',
      text: 'Ao criar uma conta, acessar ou usar o Spendly, você aceita estes termos. Caso não concorde, deverá deixar de utilizar o aplicativo.'
    },
    permittedUse: {
      title: 'Uso permitido do Spendly',
      text: 'O Spendly destina-se à organização financeira pessoal e não pode ser usado para atividades ilegais, fraudulentas, abusivas ou que prejudiquem a plataforma.'
    },
    account: {
      title: 'Conta e credenciais',
      text: 'Você é responsável por proteger suas credenciais, PIN e métodos biométricos, informar acessos não autorizados e manter os dados da conta atualizados.'
    },
    financialData: {
      title: 'Informações financeiras',
      text: 'Valores, categorias, descrições e outros dados inseridos devem ser revisados antes de serem salvos. O Spendly organiza informações, mas não garante que os registros do usuário sejam completos ou exatos.'
    },
    ai: {
      title: 'OCR e inteligência artificial',
      text: 'A leitura de comprovantes pode usar OCR e inteligência artificial. Os resultados podem conter erros e devem ser revisados antes da confirmação.'
    },
    availability: {
      title: 'Disponibilidade do serviço',
      text: 'A Team GST fará esforços razoáveis para manter o Spendly disponível. Funções podem ser interrompidas por manutenção, atualizações, falhas ou serviços externos.'
    },
    security: {
      title: 'Segurança e acesso',
      text: 'O Spendly usa autenticação, proteção de senhas e controles de acesso. Nenhum sistema é infalível, portanto o usuário também deve proteger o dispositivo e as credenciais.'
    },
    intellectualProperty: {
      title: 'Propriedade intelectual',
      text: 'O nome Spendly, design, código, textos, recursos visuais e documentação pertencem à Team GST ou aos respectivos autores e não podem ser copiados sem autorização.'
    },
    updates: {
      title: 'Atualizações e alterações',
      text: 'O Spendly pode adicionar, modificar ou remover funções. Estes termos também podem ser atualizados e a data da última alteração será exibida no aplicativo.'
    },
    liability: {
      title: 'Limitação de responsabilidade',
      text: 'O Spendly não oferece aconselhamento financeiro, contábil, tributário ou jurídico. As decisões tomadas com base nas informações do aplicativo são responsabilidade do usuário.'
    },
    suspension: {
      title: 'Suspensão ou encerramento da conta',
      text: 'A Team GST poderá restringir ou suspender contas usadas de forma abusiva, fraudulenta ou contrária a estes termos. A exclusão poderá ser solicitada quando a função estiver disponível.'
    },
    contact: {
      title: 'Contato',
      text: 'Dúvidas sobre estes termos podem ser enviadas pela Central de ajuda ou por Relatar um problema.'
    }
  }
},

privacy: {
  title: 'Política de privacidade',
  subtitle: 'Como o Spendly coleta, usa e protege as informações do usuário.',
  contentTitle: 'Tratamento de dados',
  meta: {
    versionLabel: 'Versão legal',
    versionValue: '1.0',
    updatedLabel: 'Última atualização',
    updatedValue: 'Julho de 2026',
    responsibleLabel: 'Equipe responsável'
  },
  notice: 'Esta política descreve o funcionamento atual do Spendly. Antes de uma publicação comercial definitiva, a Team GST deve validá-la com orientação jurídica profissional.',
  sections: {
    collection: {
      title: 'Informações coletadas',
      text: 'O Spendly pode tratar nome, e-mail, perfil, despesas, receitas, categorias, datas, descrições, metas, preferências e dados técnicos necessários ao funcionamento.'
    },
    use: {
      title: 'Uso das informações',
      text: 'As informações são usadas para autenticar usuários, exibir saldos, gerar estatísticas, salvar preferências, melhorar a experiência e oferecer as funções principais.'
    },
    financialData: {
      title: 'Dados financeiros pessoais',
      text: 'As movimentações são usadas apenas para organização pessoal. O Spendly não é banco, não guarda valores e não realiza operações financeiras em nome do usuário.'
    },
    ai: {
      title: 'Comprovantes, OCR e inteligência artificial',
      text: 'Imagens podem ser enviadas a serviços de processamento para extrair estabelecimento, valor, data, categoria e descrição. O usuário pode revisar os resultados antes de salvar.'
    },
    deviceStorage: {
      title: 'Dados armazenados no dispositivo',
      text: 'Sessão, tema, idioma, moeda, PIN ou biometria podem ser armazenados localmente para manter a continuidade de uso.'
    },
    security: {
      title: 'Segurança da informação',
      text: 'O Spendly usa autenticação, senhas protegidas e conexões seguras. Apesar das medidas adotadas, nenhum sistema garante segurança absoluta.'
    },
    services: {
      title: 'Serviços e infraestrutura',
      text: 'O Spendly pode utilizar Railway, PostgreSQL, FastAPI, Expo e provedores de processamento de imagens apenas para hospedar, processar ou entregar funções.'
    },
    retention: {
      title: 'Conservação de dados',
      text: 'Os dados podem ser mantidos enquanto a conta estiver ativa ou pelo tempo necessário para prestar o serviço, atender necessidades técnicas e resolver incidentes.'
    },
    rights: {
      title: 'Direitos do usuário',
      text: 'O usuário poderá solicitar acesso, correção, exportação ou exclusão quando as funções estiverem disponíveis e dentro das capacidades técnicas do projeto.'
    },
    deletion: {
      title: 'Exclusão de dados',
      text: 'A exclusão da conta pode remover movimentações, preferências e dados associados, exceto informações mantidas temporariamente por motivos técnicos ou de segurança.'
    },
    academic: {
      title: 'Projeto acadêmico',
      text: 'O Spendly é um projeto acadêmico em desenvolvimento. Suas funções, infraestrutura e práticas de dados podem evoluir.'
    },
    contact: {
      title: 'Contato sobre privacidade',
      text: 'Dúvidas ou solicitações podem ser enviadas pela Central de ajuda ou por Relatar um problema.'
    }
  }
},

editProfile: {
  title: 'Editar perfil',
  loading: 'Carregando perfil...',
  heroTitle: 'Seus dados pessoais',
  heroText:
    'Atualize as informações que usamos para personalizar sua experiência no Spendly.',
  personalInformation: 'Informações pessoais',
  displayName: 'Nome de exibição',
  displayNamePlaceholder: 'Exemplo: Pedro',
  displayNameHelper:
    'Este nome será usado em saudações e mensagens dentro do aplicativo.',
  fullName: 'Nome completo',
  fullNamePlaceholder: 'Seu nome completo',
  email: 'E-mail',
  emailHelper:
    'Por motivos de segurança, o e-mail não pode ser alterado.',
  memberSince: 'Membro desde',
  notAvailable: 'Não disponível',
  saveChanges: 'Salvar alterações',
  saving: 'Salvando...',
  successTitle: 'Perfil atualizado',
  successMessage:
    'Seus dados foram atualizados com sucesso.',
  loadError:
    'Não foi possível carregar os dados do perfil.',
  saveError:
    'Não foi possível salvar as alterações.',

  validation: {
    displayNameRequired:
      'O nome de exibição é obrigatório.',
    displayNameTooShort:
      'O nome de exibição deve ter pelo menos 2 caracteres.',
    fullNameRequired:
      'O nome completo é obrigatório.',
    fullNameTooShort:
      'O nome completo deve ter pelo menos 3 caracteres.',
  },
},

stats: {
  title: 'Estatísticas', loading: 'Carregando estatísticas...', loadError: 'Não foi possível carregar as estatísticas.', periodLabel: 'Período', noPreviousComparison: 'Sem comparação anterior', comparisonValue: '{value} vs. período anterior', noData: 'Sem dados', noDescription: 'Sem descrição', percentageOfTotal: '{value}% do total', topCategory: 'Categoria principal', monthlyEvolution: 'Evolução dos últimos 6 meses', expenseByCategory: 'Despesas por categoria', incomeByCategory: 'Receitas por categoria', recentTransactions: 'Movimentações recentes', searchPlaceholder: 'Buscar movimentação ou categoria...', emptyCategoriesTitle: 'Sem dados por categoria', emptyCategoriesText: 'Quando você registrar movimentações neste período, o detalhamento aparecerá aqui.', emptyTransactionsTitle: 'Nenhuma movimentação', emptyTransactionsText: 'Ainda não existem movimentações no período selecionado.', noSearchResults: 'Nenhuma movimentação corresponde à busca.', clearSearch: 'Limpar busca', addExpense: 'Adicionar despesa', addIncome: 'Adicionar receita',
  periods: { currentMonth: 'Este mês', previousMonth: 'Mês anterior', threeMonths: 'Últimos 3 meses', sixMonths: 'Últimos 6 meses', currentYear: 'Este ano', all: 'Todo o período' },
  views: { overview: 'Resumo', expense: 'Despesas', income: 'Receitas' },
  hero: { balance: 'Saldo do período', totalExpenses: 'Total de despesas', totalIncome: 'Total de receitas' },
  metrics: { income: 'Receitas', expenses: 'Despesas', balance: 'Saldo', records: 'Registros', savingsRate: 'Taxa de economia: {value}', recordsBreakdown: '{expenses} despesas · {income} receitas' },
  insights: { averageExpense: 'Despesa média', averageIncome: 'Receita média', perExpense: 'por despesa', perIncome: 'por receita', highestExpense: 'Maior despesa', highestIncome: 'Maior receita' },
},

security: {
  title: 'Segurança e acesso',
  heroTitle: 'Proteja sua conta',
  heroText: 'Gerencie sua senha, métodos de acesso e segurança local do dispositivo.',
  access: 'Acesso',
  sessions: 'Sessão',
  changePassword: 'Alterar senha',
  changePasswordSubtitle: 'Atualize sua senha de acesso',
  biometric: 'Face ID / impressão digital',
  accessPin: 'PIN de acesso',
  enabled: 'Ativado',
  disabled: 'Desativado',
  connectedDevices: 'Dispositivos conectados',
  connectedDevicesSubtitle: 'Ver sessões ativas',
  logoutDevice: 'Sair neste dispositivo',
  logoutDeviceSubtitle: 'Sair do Spendly neste celular',
  biometricUnavailable: 'Este dispositivo não suporta autenticação biométrica.',
  biometricNotConfigured: 'Nenhuma biometria está configurada.',
  enableBiometricPrompt: 'Ativar acesso biométrico no Spendly',
  disableBiometricPrompt: 'Desativar acesso biométrico no Spendly',
  createPin: 'Criar PIN',
  confirmPin: 'Confirmar PIN',
  disablePin: 'Desativar PIN',
  createPinText: 'Digite um PIN de 4 dígitos para proteger o Spendly.',
  confirmPinText: 'Digite o PIN novamente.',
  disablePinText: 'Digite seu PIN atual para desativá-lo.',
  pinMismatch: 'Os PINs não coincidem.',
  incorrectPin: 'PIN incorreto.',
  logoutTitle: 'Sair',
  logoutConfirm: 'Deseja sair neste dispositivo?',
  logout: 'Sair',
},

sessions: {
  title: 'Dispositivos conectados', loading: 'Carregando sessões...', loadError: 'Não foi possível carregar as sessões.',
  heroTitle: 'Sessões ativas', heroText: 'Revise os dispositivos conectados à sua conta e encerre acessos que você não reconheça.',
  currentSession: 'Sessão atual', otherDevices: 'Outros dispositivos', current: 'Atual', unknownDevice: 'Dispositivo desconhecido', noData: 'Sem dados',
  ip: 'IP', lastActivity: 'Última atividade', created: 'Criada', closeSession: 'Encerrar sessão', closeAll: 'Encerrar todas', close: 'Encerrar',
  currentNotDetectedTitle: 'Sessão atual não detectada', currentNotDetectedText: 'Não foi possível identificar qual sessão corresponde a este dispositivo.',
  allGoodTitle: 'Tudo certo', allGoodText: 'Não há outros dispositivos conectados à sua conta.',
  info: 'Ao encerrar uma sessão, o dispositivo precisará entrar novamente para acessar o Spendly.',
  singleModalTitle: 'Encerrar sessão', singleModalText: 'Deseja encerrar a sessão neste dispositivo?',
  allModalTitle: 'Encerrar outras sessões', allModalText: 'Sua conta será desconectada de todos os outros dispositivos, mantendo esta sessão ativa.',
  passwordPlaceholder: 'Senha atual', passwordRequired: 'Digite sua senha.', successTitle: 'Sessões atualizadas',
  singleSuccess: 'A sessão foi encerrada com sucesso.', allSuccess: 'As outras sessões foram encerradas com sucesso.',
  singleError: 'Não foi possível encerrar a sessão.', allError: 'Não foi possível encerrar as sessões.',
},

pinUnlock: {
  loading: 'Carregando segurança...',
  title: 'Desbloquear o Spendly',
  subtitle: 'Digite seu PIN de acesso para continuar.',
  lockedTitle: 'PIN bloqueado',
  lockedSubtitle: 'Tente novamente em {time}.',
  tooManyAttempts: 'Muitas tentativas incorretas.',
  incorrectWithAttempts:
    'PIN incorreto. Tentativas restantes: {attempts}.',
  attemptsUsed: 'Tentativas usadas: {used} de {max}',
  pinNotConfigured:
    'Nenhum PIN está configurado. Voltando à tela anterior.',
  loadError:
    'Não foi possível carregar o estado de segurança.',
  validationError:
    'Não foi possível validar o PIN.',

  time: {
    hoursMinutes: '{hours} h {minutes} min',
  },
},

changePassword: {
  title: 'Alterar senha',
  heroTitle: 'Atualize sua senha',
  heroText: 'Use uma senha segura e diferente da anterior para proteger sua conta.',
  currentPassword: 'Senha atual',
  currentPlaceholder: 'Digite sua senha atual',
  newPassword: 'Nova senha',
  newPlaceholder: 'Mínimo de 8 caracteres',
  repeatPassword: 'Repetir nova senha',
  repeatPlaceholder: 'Repita a nova senha',
  save: 'Salvar nova senha',
  saving: 'Salvando...',
  saveError: 'Não foi possível alterar a senha.',
  successTitle: 'Senha atualizada',
  successText: 'Sua senha foi alterada com sucesso.',
  validation: {
    required: 'Preencha todos os campos.',
    minLength: 'A nova senha deve ter pelo menos 8 caracteres.',
    samePassword: 'A nova senha deve ser diferente da atual.',
    noMatch: 'As novas senhas não coincidem.',
  },
},

notifications: {
  title: 'Notificações',
  loading: 'Carregando notificações...',
  loadError: 'No se pudo cargar la configuración.',
  saveError: 'No se pudo guardar la configuración.',
  heroTitle: 'Avisos úteis, sem incomodar',
  heroText: 'Escolha lembretes pontuais que realmente ajudem a organizar suas finanças.',
  generalSection: 'General', activitySection: 'Atividade', summarySection: 'Resumos', goalsSection: 'Metas',
  permissionTitle: 'Permissão do sistema', openSettings: 'Configurações',
  permissionDeniedTitle: 'Permiso desactivado',
  permissionDeniedText: 'Activá las notificaciones desde los ajustes del dispositivo para poder usarlas.',
  permissionRequiredTitle: 'Permiso necesario', permissionRequiredText: 'Primero activá las notificaciones de Spendly.',
  testScheduledTitle: 'Notificación programada', testScheduledText: 'La vas a recibir en unos segundos.',
  testButton: 'Enviar notificação de teste',
  goalsInfo: 'Los avisos de metas abrirán directamente la meta correspondiente. Solo se enviarán por vencimiento cercano, progreso importante o finalización.',
  permission: { granted: 'Permitidas', denied: 'Bloqueadas', undetermined: 'Não configuradas' },
  master: { title: 'Permitir notificações', subtitle: 'Control general de todos los avisos locales de Spendly.' },
  daily: { title: 'Lembrete de movimentações', subtitle: 'Un único aviso diario para registrar gastos o ingresos pendientes.', timeTitle: 'Horario del recordatorio', timeHint: 'Elegimos horarios de tarde para evitar interrupciones durante el día.' },
  weekly: { title: 'Resumo semanal', subtitle: 'Un aviso los lunes por la tarde para revisar la semana anterior.' },
  monthly: { title: 'Resumo mensal', subtitle: 'Un aviso el primer día del mes para revisar ingresos y gastos.' },
  goalDeadline: { title: 'Metas próximas a vencer', subtitle: 'Avisar tres días antes de la fecha objetivo.' },
  goalProgress: { title: 'Progreso importante', subtitle: 'Avisar una sola vez cuando una meta alcance aproximadamente el 80%.' },
  goalCompleted: { title: 'Meta concluída', subtitle: 'Celebrar cuando alcances el monto objetivo.' },
  copy: {
    dailyTitle: '¿Te quedó algún movimiento pendiente?', dailyBody: 'Registrar lo de hoy te lleva menos de un minuto.',
    weeklyTitle: 'Tu semana financiera está lista', weeklyBody: 'Revisá ingresos, gastos y balance de la semana.',
    monthlyTitle: 'Nuevo mes, nuevo resumen', monthlyBody: 'Mirá cómo cerró el mes anterior en Estadísticas.',
    testTitle: 'Spendly está listo', testBody: 'Las notificaciones funcionan correctamente.'
  },
},

goals: {
  title: 'Metas', subtitle: 'Transforme seus objetivos em progresso real.', loading: 'Carregando metas...', search: 'Buscar metas...',
  filters: { all: 'Todas', active: 'Ativas', paused: 'Pausadas', completed: 'Concluídas', cancelled: 'Canceladas' },
  status: { active: 'Ativa', paused: 'Pausada', completed: 'Concluída', cancelled: 'Cancelada' },
  priority: { low: 'Baixa', medium: 'Média', high: 'Alta' },
  category: { emergency: 'Emergência', travel: 'Viagem', home: 'Casa', education: 'Educação', vehicle: 'Veículo', technology: 'Tecnologia', health: 'Saúde', other: 'Outra' },
  summary: { active: 'Ativas', completed: 'Concluídas', saved: 'Total economizado' }, card: { remaining: 'Falta' },
  empty: { title: 'Você ainda não tem metas', text: 'Crie seu primeiro objetivo e comece a registrar contribuições.' },
  actions: { create: 'Criar meta', saveChanges: 'Salvar alterações', contribute: 'Contribuir', withdraw: 'Retirar', confirm: 'Confirmar', edit: 'Editar', pause: 'Pausar', resume: 'Retomar', cancelGoal: 'Cancelar meta', delete: 'Excluir' },
  form: { createTitle: 'Nova meta', editTitle: 'Editar meta', namePlaceholder: 'Ex. Viagem ao Japão', descriptionPlaceholder: 'O que você quer alcançar?', targetAmount: 'Valor-alvo', category: 'Categoria', priority: 'Prioridade' },
  detail: { of: 'de', history: 'Histórico de movimentações' }, movement: { aporte: 'Contribuição', retiro: 'Retirada', ajuste: 'Ajuste' },
  movementForm: { aporte: 'Registrar contribuição', retiro: 'Registrar retirada', ajuste: 'Registrar ajuste', amount: 'Valor', note: 'Nota opcional' },
  validation: { name: 'Digite um nome para a meta.', amount: 'Digite um valor-alvo válido.', movementAmount: 'Digite um valor válido.' },
  confirm: { deleteTitle: 'Excluir meta', deleteText: 'A meta e todo o histórico serão excluídos definitivamente.', deleteMovementTitle: 'Excluir movimentação', deleteMovementText: 'O progresso da meta será recalculado.' },
  notifications: { deadlineTitle: 'Uma meta está perto do prazo', deadlineBody: 'A meta “{goal}” vence em poucos dias.', progressTitle: 'Ótimo progresso!', progressBody: 'A meta “{goal}” chegou a {percentage}%.', completedTitle: 'Meta concluída!', completedBody: 'Você alcançou o objetivo de “{goal}”.' },
  errors: { load: 'Não foi possível carregar as metas.', save: 'Não foi possível salvar a meta.', movement: 'Não foi possível registrar a movimentação.' }
},

support: { category:{ transactions:'Transações', profile:'Perfil', authentication:'Autenticação', scan:'Escaneamento', statistics:'Estatísticas', goals:'Metas', notifications:'Notificações', appearance:'Aparência', language:'Idioma', currency:'Moeda', performance:'Desempenho', other:'Outro' }, status:{ all:'Todos', open:'Aberto', in_review:'Em análise', resolved:'Resolvido', closed:'Fechado' }, validation:{ subject:'O assunto deve ter pelo menos 5 caracteres.', description:'A descrição deve ter pelo menos 10 caracteres.' }, success:{ title:'Relatório enviado', text:'Seu relatório foi salvo. Acompanhe o estado em Meus relatórios.' }, errors:{ submit:'Não foi possível enviar o relatório.' }, report:{ title:'Relatar um problema', heroTitle:'Conte o que aconteceu', heroText:'Seu relatório ajuda a melhorar o Spendly.', category:'Categoria', subject:'Assunto', subjectPlaceholder:'Resuma o problema', description:'Descrição', descriptionPlaceholder:'Explique o que aconteceu e o que esperava.', steps:'Passos para reproduzir', stepsPlaceholder:'1. Abra...\n2. Toque...\n3. Ocorre...', technicalTitle:'Incluir informações técnicas', technicalText:'Inclui versão do app, sistema e modelo do dispositivo.', privacy:'Senhas e dados financeiros não são enviados.', submit:'Enviar relatório' }, list:{ title:'Meus relatórios', loading:'Carregando relatórios...', emptyTitle:'Você ainda não enviou relatórios', emptyText:'Crie um relatório quando precisar de ajuda.', create:'Criar relatório' }, detail:{ title:'Detalhes do relatório', description:'Descrição', steps:'Passos para reproduzir', dates:'Datas', created:'Criado', updated:'Atualizado', resolved:'Resolvido', technical:'Informações técnicas', appVersion:'Versão do app', platform:'Plataforma', os:'Sistema operacional', device:'Dispositivo', responseTitle:'Resposta da equipe', pendingTitle:'Aguardando resposta', pendingText:'A equipe ainda não respondeu este relatório.' } },


home: {
  greeting: 'Olá, {name}',
  welcomeBack: 'Bem-vindo de volta',
  defaultUser: 'Usuário',
  loading: 'Carregando resumo...',
  balanceMonth: 'Saldo total do mês',
  income: 'Receitas',
  expenses: 'Despesas',
  available: 'Disponível',
  monthSummary: 'Resumo do mês',
  totalSpent: 'Total gasto',
  totalIncome: 'Total recebido',
  topCategory: 'Principal categoria',
  noData: 'Sem dados',
  featuredGoal: 'Meta em destaque',
  goalProgress: '{percent}% concluído',
  recentExpenses: 'Despesas recentes',
  categories: 'Categorias',
  viewAll: 'Ver todos',
  expenseNoDescription: 'Despesa sem descrição',
  otherCategory: 'Outros',

  quick: {
    expense: 'Despesa',
    income: 'Receita',
    scan: 'Escanear',
    stats: 'Stats',
  },

  emptyGoal: {
    title: 'Você ainda não tem metas ativas',
    text:
      'Crie uma meta para acompanhar o progresso na tela inicial.',
    action: 'Criar meta',
  },

  emptyExpenses: {
    title: 'Ainda não há despesas',
    text:
      'Suas primeiras despesas aparecerão aqui.',
    action: 'Adicionar despesa',
  },

  emptyCategories: {
    title: 'Ainda não há categorias',
    text:
      'Nenhuma despesa foi registrada por categoria neste mês.',
  },

  date: {
    today: 'Hoje',
    yesterday: 'Ontem',
  },

  errors: {
    title: 'Não foi possível atualizar a Home',
    load:
      'Não foi possível carregar os dados principais.',
    retry: 'Tentar novamente',
  },
},

register: {
  tagline: 'Gestão inteligente de despesas', title: 'Criar conta', subtitle: 'Comece a gerenciar suas finanças',
  fullName: 'Nome completo', fullNamePlaceholder: 'Seu nome', email: 'E-mail', emailPlaceholder: 'voce@email.com',
  password: 'Senha', passwordPlaceholder: '********', confirmPassword: 'Confirmar senha', passwordRequirement: 'No mínimo 8 caracteres',
  termsPrefix: 'Aceito os', terms: 'Termos e condições', and: 'e a', privacy: 'Política de privacidade',
  create: 'Criar conta', creating: 'Criando conta...', or: 'ou', haveAccount: 'Já tem uma conta?', login: 'Entrar',
  validation: { name: 'Digite pelo menos 2 caracteres.', email: 'Digite um e-mail válido.', password: 'A senha deve ter pelo menos 8 caracteres.', confirm: 'As senhas não coincidem.', terms: 'Você deve aceitar os termos e a política de privacidade.' },
  errors: { emailExists: 'Este e-mail já está registrado. Use outro ou entre na sua conta.', generic: 'Não foi possível criar a conta. Tente novamente.' },
},

login: {
  tagline: 'Gestão inteligente de despesas',
  title: 'Entrar',
  subtitle: 'Bem-vindo de volta',
  email: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  password: 'Senha',
  passwordPlaceholder: '••••••••',
  forgotPassword: 'Esqueceu sua senha?',
  rememberSession: 'Manter sessão iniciada',
  submit: 'Entrar',
  verifying: 'Verificando...',
  or: 'ou',
  noAccount: 'Ainda não tem uma conta?',
  register: 'Cadastre-se',
  footerPrefix: 'Ao continuar, você aceita os',
  terms: 'Termos e condições',
  and: 'e a',
  privacy: 'Política de privacidade',
  validation: {
    email: 'Digite um e-mail válido.',
    password: 'Digite sua senha.',
  },
  errors: {
    invalidCredentials: 'O e-mail ou a senha estão incorretos.',
    connection: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
    generic: 'Não foi possível entrar. Tente novamente.',
  },
},

scan: {
  title: 'Escanear comprovante',
  heroTitle: 'Envie um recibo ou comprovante',
  heroText: 'O Spendly analisará a imagem e preencherá automaticamente os dados da despesa para você revisar antes de salvar.',
  camera: 'Câmera',
  cameraText: 'Tire uma foto nítida do comprovante.',
  gallery: 'Galeria',
  galleryText: 'Escolha uma imagem salva no dispositivo.',
  change: 'Alterar imagem',
  remove: 'Excluir',
  analyze: 'Analisar comprovante',
  analyzing: 'Analisando comprovante...',
  reviewTitle: 'Revise os dados detectados',
  reviewText: 'Você pode corrigir qualquer dado antes de criar a despesa.',
  saveExpense: 'Salvar despesa',
  saving: 'Salvando despesa...',
  startAgain: 'Escanear outro comprovante',
  fields: {
    amount: 'Valor',
    description: 'Descrição',
    category: 'Categoria',
    date: 'Data',
    currency: 'Moeda',
    paymentMethod: 'Método de pagamento',
  },
  permissions: {
    title: 'Permissão necessária',
    camera: 'Precisamos acessar a câmera para tirar uma foto.',
    gallery: 'Precisamos acessar a galeria para escolher uma imagem.',
  },
  validation: {
    amount: 'Digite um valor válido maior que zero.',
    description: 'Digite uma descrição.',
    date: 'A data deve estar no formato YYYY-MM-DD.',
  },
  errors: {
    title: 'Não foi possível processar',
    analyze: 'Não foi possível analisar o comprovante.',
    save: 'Não foi possível salvar a despesa.',
  },
  success: {
    title: 'Despesa registrada',
    text: 'A despesa foi criada corretamente a partir do comprovante.',
  },
},

biometricUnlock: {
  title: 'Desbloqueie o Spendly',
  subtitle:
    'Use Face ID, Touch ID ou a autenticação do dispositivo para continuar.',
  prompt: 'Desbloquear Spendly',
  verifying: 'Verificando...',
  retry: 'Tentar novamente',
  failed:
    'Não foi possível verificar sua identidade. Tente novamente.',
  unavailable:
    'A autenticação biométrica não está disponível ou não está configurada.',
},

editTransaction: {
  expenseTitle: 'Editar despesa',
  incomeTitle: 'Editar receita',
  heroTitle: 'Atualize a transação',
  heroText: 'Altere os dados necessários e salve as mudanças.',
  amount: 'Valor',
  paymentMethod: 'Método de pagamento',
  date: 'Data',
  currency: 'Moeda',
  save: 'Salvar alterações',
  saving: 'Salvando alterações...',
  successTitle: 'Alterações salvas',
  successText: 'A transação foi atualizada corretamente.',
  missing: 'Não foi possível encontrar a transação que você deseja editar.',
  errors: {
    amount: 'Digite um valor válido maior que zero.',
    description: 'Digite uma descrição.',
    save: 'Não foi possível atualizar a transação.',
  },
},

passwordRecovery: { common:{errorTitle:'Não foi possível continuar'}, forgot:{title:'Recuperar senha',heading:'Esqueceu sua senha?',subtitle:'Digite o e-mail associado à conta e enviaremos um código de verificação.',emailLabel:'E-mail',emailPlaceholder:'nome@email.com',send:'Enviar código',sending:'Enviando código...',securityNote:'Por segurança, a resposta será a mesma mesmo que o e-mail não esteja cadastrado.'}, verify:{title:'Verificar código',heading:'Digite o código',subtitle:'Digite o código de 6 dígitos enviado ao seu e-mail.',confirm:'Verificar código',verifying:'Verificando...',noCode:'Não recebeu o código?',resend:'Reenviar',resending:'Reenviando...',resendIn:'Reenviar em {seconds}s',expiration:'O código expira em 10 minutos e permite no máximo 5 tentativas.',resentTitle:'Código reenviado',resentText:'Enviamos um novo código de recuperação.'}, reset:{title:'Nova senha',heading:'Crie uma nova senha',subtitle:'Escolha uma senha segura que ainda não tenha utilizado.',passwordLabel:'Nova senha',passwordPlaceholder:'Mínimo de 8 caracteres',confirmLabel:'Confirmar senha',confirmPlaceholder:'Repita a senha',requirements:'Use pelo menos 8 caracteres e combine letras, números e símbolos.',save:'Atualizar senha',saving:'Atualizando...',successTitle:'Senha atualizada',successText:'Sua senha foi atualizada. Todas as sessões anteriores foram encerradas.',goToLogin:'Ir para o login'}, errors:{emailRequired:'Digite seu e-mail.',emailInvalid:'Digite um e-mail válido.',sendCode:'Não foi possível enviar o código.',codeIncomplete:'Digite os 6 dígitos.',verifyCode:'Não foi possível verificar o código.',resend:'Não foi possível reenviar o código.',invalidRequest:'A solicitação é inválida.',passwordLength:'A senha deve ter pelo menos 8 caracteres.',passwordMismatch:'As senhas não coincidem.',reset:'Não foi possível atualizar a senha.'}},


};