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
    versionValue: 'Versão 1.0.8',
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
  mercadoPago: "Mercado Pago",
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

};