export default {
  common: {
    back: 'Retour',
    cancel: 'Annuler',
    save: 'Enregistrer',
    loading: 'Chargement...',
    error: 'Erreur',
    accept: "Accepter",
    delete: "Supprimer",
    done: "Terminé"
  },

  profile: {
    title: 'Mon profil',
    account: 'Compte',
    preferences: 'Préférences',
    data: 'Données',
    support: 'Assistance',
    session: 'Session',

    editPersonalData:
      'Modifier les informations personnelles',

    editPersonalDataSubtitle:
      'Nom, e-mail et adresses',

    security:
      'Sécurité et accès',

    securitySubtitle:
      'Authentification, sessions et accès',

    appearance:
      'Apparence',

    appearanceSubtitle:
      'Clair, sombre ou automatique',

    currency:
      'Devise principale',

    language:
      'Langue',

    notifications:
      'Notifications',

    notificationsSubtitle:
      'Alertes, rappels et résumés',

    exportData:
      'Exporter les données',

    exportDataSubtitle:
      'Télécharger les dépenses, revenus et rapports',

    helpCenter:
      'Centre d’aide',

    helpCenterSubtitle:
      'Questions fréquentes et guides',

    reportProblem:
      'Signaler un problème',

    reportProblemSubtitle:
      'Prévenez-nous si quelque chose ne fonctionne pas',

    about:
      'À propos de Spendly',

    logout:
      'Se déconnecter',

    logoutConfirmTitle:
      'Se déconnecter',

    logoutConfirmText:
      'Voulez-vous vraiment vous déconnecter de Spendly ?',

    activeAccount:
      'Compte actif',

    inactiveAccount:
      'Compte inactif',

    defaultUser: 'Utilisateur',
    verifyIdentity: 'Vérifier l’identité',
    version: 'Version',
    profilePhoto: 'Photo de profil',
    viewProfilePhoto: 'Voir la photo de profil',
    updatePhoto: 'Modifier la photo',
    addPhoto: 'Ajouter une photo',
    deletePhoto: 'Supprimer la photo',

  },

  navigation: {
    home: 'Accueil',
    transactions: 'Mouvements',
    stats: 'Statistiques',
    goals: 'Objectifs',
  },

  language: {
    title:
      'Langue',
    subtitle:
      'Choisissez la langue de l’application',
    spanish:
      'Espagnol',
    english:
      'Anglais',
    portuguese:
      'Portugais',
    russian:
      'Russe',
    chinese:
      'Chinois',
    french:
      'Français',
    german:
      'Allemand',

    currentLanguage: 'Langue actuelle',
    availableLanguages: 'Langues disponibles',
    current: 'Actuelle',
    saving: 'Enregistrement de la langue...',
    changeInfo:
      'Le changement s’applique immédiatement aux écrans déjà traduits.',
  },

  about: {
  title: 'À propos de Spendly',
  appSubtitle:
    'Gestion intelligente des dépenses, revenus et objectifs financiers.',
  versionPrefix: 'Version',
  aboutApp: 'À propos de l’application',
  descriptionOne:
    'Spendly est une application mobile conçue pour vous aider à enregistrer, organiser et comprendre facilement vos mouvements financiers.',
  descriptionTwo:
    'Elle permet de gérer les dépenses et revenus, consulter des statistiques, scanner des tickets avec l’intelligence artificielle et suivre des objectifs d’épargne.',
  information: 'Informations',
  currentVersion: 'Version actuelle',
  status: 'État',
  beta: 'Bêta',
  platform: 'Plateforme',
  mobileApp: 'Application mobile',
  documentation: 'Documentation',
  terms: 'Conditions générales',
  termsSubtitle: 'Conditions d’utilisation de Spendly',
  privacy: 'Politique de confidentialité',
  privacySubtitle: 'Comment nous protégeons vos données',
  rights: 'Tous droits réservés.',
},


  categories: {
  food: "Alimentation",
  transport: "Transport",
  supermarket: "Supermarché",
  services: "Services",
  health: "Santé",
  education: "Éducation",
  entertainment: "Divertissement",
  clothing: "Vêtements",
  technology: "Technologie",
  salary: "Salaire",
  freelance: "Freelance",
  investments: "Investissements",
  sales: "Ventes",
  gifts: "Cadeaux",
  refunds: "Remboursements",
  other: "Autres"
},

methods: {
  cash: "Espèces",
  debitCard: "Carte de débit",
  creditCard: "Carte de crédit",
  transfer: "Virement",
  bankTransfer: "Virement bancaire",
  digitalWallet: 'Portefeuille numérique',
  contactlessPayment: 'Paiement sans contact',
  bankAccount: 'Compte bancaire',
  deposit: "Dépôt",
  other: "Autre"
},

transactionList: {
  unknownDate: "Date inconnue",
  today: "Aujourd’hui",
  yesterday: "Hier",
  startAdding: "Commencez par en ajouter un maintenant.",
  loadError: "Impossible de charger les {items}.",
  deleteTitle: "Supprimer {item}",
  deleteConfirm: "Voulez-vous vraiment supprimer « {description} » ?",
  deleteError: "Impossible de supprimer {item}.",
  searchPlaceholder: "Rechercher des {items}...",
  sortTitle: "Trier les mouvements",
  clearSearch: "Effacer la recherche",
  records: "Enregistrements",
  mainCategory: "Catégorie principale",
  loading: "Chargement des {items}...",
  noResultsTitle: "Aucun résultat trouvé",
  noResultsText: "Essayez une autre recherche ou retirez les filtres appliqués.",
  clearFilters: "Effacer les filtres",
  deleteHint: "Maintenez un mouvement enfoncé pour le supprimer",
  sort: {
    recent: "Plus récents",
    oldest: "Plus anciens",
    highest: "Montant le plus élevé",
    lowest: "Montant le plus faible"
  },
  income: {
    title: "Revenus",
    subtitle: "Suivez l’argent que vous recevez",
    summaryLabel: "Total reçu ce mois-ci",
    singular: "revenu",
    plural: "revenus",
    emptyTitle: "Aucun revenu enregistré",
    emptyDescription: "Vous n’avez encore enregistré aucun revenu ce mois-ci.",
    emptyButton: "Ajouter le premier revenu",
    defaultDescription: "Revenu sans description"
  },
  expense: {
    title: "Dépenses",
    subtitle: "Suivez vos mouvements récents",
    summaryLabel: "Total dépensé ce mois-ci",
    singular: "dépense",
    plural: "dépenses",
    emptyTitle: "Aucune dépense enregistrée",
    emptyDescription: "Vous n’avez encore ajouté aucune dépense ce mois-ci.",
    emptyButton: "Ajouter la première dépense",
    defaultDescription: "Dépense sans description"
  }
},

addTransaction: {
  categoryPlaceholder: "Sélectionnez une catégorie",
  description: "Description",
  dateTime: "Date et heure",
  noteOptional: "Note (facultative)",
  category: "Catégorie",
  saveErrorTitle: "Enregistrement impossible",
  saveErrorMessage: "Une erreur s’est produite lors de l’enregistrement du mouvement.",
  errors: {
    amountRequired: "Le montant est obligatoire",
    amountPositive: "Le montant doit être supérieur à 0",
    categoryRequired: "Sélectionnez une catégorie"
  },
  income: {
    title: "Nouveau revenu",
    amountQuestion: "Combien avez-vous reçu ?",
    descriptionPlaceholder: "Ex. : salaire, vente, travail freelance...",
    descriptionFallback: "Revenu sans description",
    categoryLabel: "Catégorie du revenu *",
    methodLabel: "Mode de réception",
    notePlaceholder: "Ajoutez une note sur le revenu...",
    saveButton: "Enregistrer le revenu",
    savingText: "Enregistrement du revenu...",
    successTitle: "Revenu enregistré",
    successMessage: "Le revenu a été enregistré correctement."
  },
  expense: {
    title: "Nouvelle dépense",
    amountQuestion: "Combien avez-vous dépensé ?",
    descriptionPlaceholder: "Ex. : McDonald's, Uber, Netflix...",
    descriptionFallback: "Dépense sans description",
    categoryLabel: "Catégorie de la dépense *",
    methodLabel: "Mode de paiement",
    notePlaceholder: "Ajoutez une note sur la dépense...",
    saveButton: "Enregistrer la dépense",
    savingText: "Enregistrement de la dépense...",
    successTitle: "Dépense enregistrée",
    successMessage: "La dépense a été enregistrée correctement."
  }
},

currency: {
  title: 'Devise principale',
  chooseCurrency: 'Choisissez votre devise',
  description:
    'Cette devise servira de référence pour afficher les dépenses, rapports, budgets et statistiques dans Spendly.',
  currentCurrency: 'Devise actuelle',
  example: 'Exemple',
  availableCurrencies: 'Devises disponibles',
  current: 'Actuelle',
  loading: 'Chargement des devises...',
  saving: 'Enregistrement',
  syncInfo:
    'La devise sélectionnée est enregistrée sur cet appareil et synchronisée avec votre compte.',
  loadError: 'Impossible de charger la devise sélectionnée.',
  saveError: 'Impossible d’enregistrer la devise sélectionnée.',

  currencies: {
    ars: 'Peso argentin',
    usd: 'Dollar américain',
    eur: 'Euro',
    gbp: 'Livre sterling',
    brl: 'Réal brésilien',
    clp: 'Peso chilien',
    uyu: 'Peso uruguayen',
    mxn: 'Peso mexicain',
    rub: 'Rouble russe',
    cny: 'Yuan chinois',
  },
},

helpCenter: {
  title: 'Centre d’aide',
  heroTitle: 'Comment pouvons-nous vous aider ?',
  heroText:
    'Trouvez des réponses rapides et découvrez comment utiliser les principales fonctions de Spendly.',
  searchPlaceholder: 'Rechercher une question...',
  faqTitle: 'Questions fréquentes',
  noResultsTitle: 'Aucun résultat trouvé',
  noResultsText:
    'Essayez avec d’autres mots ou consultez le guide rapide.',
  clearSearch: 'Effacer la recherche',
  moreHelpTitle: 'Vous avez encore besoin d’aide ?',
  moreHelpText:
    'Vous pouvez signaler un problème et nous expliquer ce qui se passe.',
  reportProblem: 'Signaler un problème',

  faq: {
    addTransaction: {
      question: 'Comment ajouter une dépense ou un revenu ?',
      answer:
        'Ouvrez Mouvements, choisissez Dépenses ou Revenus et appuyez sur le bouton +. Complétez le montant, la catégorie et les informations facultatives avant d’enregistrer.',
    },
    editTransaction: {
      question: 'Puis-je modifier un mouvement ?',
      answer:
        'La modification dépend de la version disponible. Vous pourrez changer les données depuis le détail du mouvement lorsque cette fonction sera activée.',
    },
    deleteTransaction: {
      question: 'Comment supprimer un mouvement ?',
      answer:
        'Dans la liste des mouvements, maintenez l’opération appuyée puis confirmez la suppression.',
    },
    currency: {
      question: 'Comment changer la devise principale ?',
      answer:
        'Ouvrez Profil, accédez à Devise principale et sélectionnez la devise souhaitée. Les montants utiliseront ce format.',
    },
    language: {
      question: 'Comment changer la langue ?',
      answer:
        'Depuis Profil, ouvrez Langue et choisissez une option disponible. Le changement est appliqué immédiatement.',
    },
    theme: {
      question: 'Comment activer le mode sombre ?',
      answer:
        'Dans Profil, ouvrez Apparence et choisissez Clair, Sombre ou Automatique.',
    },
    scan: {
      question: 'Comment fonctionne le scan des tickets ?',
      answer:
        'Ouvrez Scanner, prenez une photo ou choisissez une image dans la galerie. Spendly l’enverra au système d’analyse pour détecter les données.',
    },
    security: {
      question: 'Puis-je protéger mon compte avec un code PIN ou la biométrie ?',
      answer:
        'Oui. Ouvrez Profil, puis Sécurité et accès, et configurez le PIN ou l’authentification biométrique disponible.',
    },
    offline: {
      question: 'Spendly fonctionne-t-il hors connexion ?',
      answer:
        'Certaines préférences peuvent rester sur l’appareil, mais les fonctions qui lisent ou enregistrent des données serveur nécessitent une connexion.',
    },
    goals: {
      question: 'Comment fonctionnent les objectifs financiers ?',
      answer:
        'Les objectifs permettent de définir une somme à économiser et de suivre sa progression. Cette fonction peut dépendre de la disponibilité du backend.',
    },
  },

  guide: {
    title: 'Guide de démarrage rapide',
    description:
      'Suivez ces étapes pour commencer à organiser vos finances avec Spendly.',
    steps: {
      account: {
        title: 'Vérifiez votre profil',
        description:
          'Complétez vos données et choisissez la langue, la devise, l’apparence et la sécurité.',
      },
      transaction: {
        title: 'Enregistrez vos mouvements',
        description:
          'Ajoutez chaque dépense ou revenu avec son montant, sa catégorie, sa date et sa description.',
      },
      movements: {
        title: 'Consultez et recherchez',
        description:
          'Utilisez la liste pour rechercher, trier et consulter vos mouvements récents.',
      },
      stats: {
        title: 'Analysez vos statistiques',
        description:
          'Consultez les totaux, les catégories principales et les mouvements importants.',
      },
      preferences: {
        title: 'Personnalisez Spendly',
        description:
          'Configurez le thème, la langue, la devise et la sécurité selon vos préférences.',
      },
    },
  },
},

terms: {
  title: 'Conditions générales',
  subtitle: 'Conditions générales d’utilisation de Spendly et de ses fonctionnalités.',
  contentTitle: 'Conditions d’utilisation',
  meta: {
    versionLabel: 'Version juridique',
    versionValue: '1.0',
    updatedLabel: 'Dernière mise à jour',
    updatedValue: 'Juillet 2026',
    responsibleLabel: 'Équipe responsable'
  },
  notice: 'Cette version est fournie à titre informatif. Avant une diffusion commerciale définitive, Team GST devrait demander une validation juridique professionnelle.',
  sections: {
    acceptance: {
      title: 'Acceptation des conditions',
      text: 'En créant un compte, en accédant à Spendly ou en l’utilisant, vous acceptez ces conditions. Dans le cas contraire, vous devez cesser d’utiliser l’application.'
    },
    permittedUse: {
      title: 'Utilisation autorisée',
      text: 'Spendly est destiné à l’organisation financière personnelle et ne doit pas être utilisé à des fins illégales, frauduleuses, abusives ou perturbant la plateforme.'
    },
    account: {
      title: 'Compte et identifiants',
      text: 'Vous êtes responsable de la protection de vos identifiants, de votre PIN et de la biométrie, ainsi que du signalement de tout accès non autorisé.'
    },
    financialData: {
      title: 'Informations financières',
      text: 'Les montants, catégories, descriptions et autres données doivent être vérifiés avant l’enregistrement. Spendly organise les informations mais ne garantit pas l’exactitude des données saisies.'
    },
    ai: {
      title: 'OCR et intelligence artificielle',
      text: 'Le scan de tickets peut utiliser l’OCR et l’intelligence artificielle. Les résultats peuvent comporter des erreurs et doivent être vérifiés avant confirmation.'
    },
    availability: {
      title: 'Disponibilité du service',
      text: 'Team GST fera des efforts raisonnables pour maintenir Spendly disponible. Certaines fonctions peuvent être interrompues pour maintenance, mise à jour ou panne externe.'
    },
    security: {
      title: 'Sécurité et accès',
      text: 'Spendly utilise l’authentification, la protection des mots de passe et des contrôles d’accès. Aucun système n’est infaillible.'
    },
    intellectualProperty: {
      title: 'Propriété intellectuelle',
      text: 'Le nom Spendly, le design, le code, les textes, les ressources visuelles et la documentation appartiennent à Team GST ou à leurs auteurs respectifs.'
    },
    updates: {
      title: 'Mises à jour et modifications',
      text: 'Spendly peut ajouter, modifier ou supprimer des fonctions. Ces conditions peuvent également évoluer et la date de mise à jour sera affichée.'
    },
    liability: {
      title: 'Limitation de responsabilité',
      text: 'Spendly ne fournit aucun conseil financier, comptable, fiscal ou juridique. Les décisions prises à partir des informations affichées relèvent de l’utilisateur.'
    },
    suspension: {
      title: 'Suspension ou fermeture du compte',
      text: 'Team GST peut limiter ou suspendre les comptes utilisés de manière abusive, frauduleuse ou contraire aux présentes conditions.'
    },
    contact: {
      title: 'Contact',
      text: 'Les questions peuvent être envoyées via le Centre d’aide ou Signaler un problème.'
    }
  }
},

privacy: {
  title: 'Politique de confidentialité',
  subtitle: 'Comment Spendly collecte, utilise et protège les informations de l’utilisateur.',
  contentTitle: 'Traitement des données',
  meta: {
    versionLabel: 'Version juridique',
    versionValue: '1.0',
    updatedLabel: 'Dernière mise à jour',
    updatedValue: 'Juillet 2026',
    responsibleLabel: 'Équipe responsable'
  },
  notice: 'Cette politique décrit le fonctionnement actuel de Spendly. Avant une diffusion commerciale définitive, Team GST devrait la faire valider juridiquement.',
  sections: {
    collection: {
      title: 'Informations collectées',
      text: 'Spendly peut traiter le nom, l’e-mail, le profil, les dépenses, les revenus, les catégories, les dates, les descriptions, les objectifs, les préférences et les données techniques.'
    },
    use: {
      title: 'Utilisation des informations',
      text: 'Les données servent à authentifier les utilisateurs, afficher les soldes, générer des statistiques, enregistrer les préférences et fournir les fonctions principales.'
    },
    financialData: {
      title: 'Données financières personnelles',
      text: 'Les mouvements sont utilisés uniquement pour l’organisation personnelle. Spendly n’est pas une banque et ne détient aucun fonds.'
    },
    ai: {
      title: 'Tickets, OCR et intelligence artificielle',
      text: 'Les images peuvent être envoyées à des services de traitement afin d’extraire le commerce, le montant, la date, la catégorie et la description.'
    },
    deviceStorage: {
      title: 'Données stockées sur l’appareil',
      text: 'La session, le thème, la langue, la devise, le PIN ou la biométrie peuvent être conservés localement pour assurer la continuité d’utilisation.'
    },
    security: {
      title: 'Sécurité des informations',
      text: 'Spendly utilise l’authentification, des mots de passe protégés et des connexions sécurisées, sans pouvoir garantir une sécurité absolue.'
    },
    services: {
      title: 'Services et infrastructure',
      text: 'Spendly peut utiliser Railway, PostgreSQL, FastAPI, Expo et des prestataires de traitement d’images uniquement pour fournir ses fonctionnalités.'
    },
    retention: {
      title: 'Conservation des données',
      text: 'Les données peuvent être conservées pendant la durée d’activité du compte ou le temps nécessaire au fonctionnement du service.'
    },
    rights: {
      title: 'Droits de l’utilisateur',
      text: 'L’utilisateur pourra demander l’accès, la correction, l’exportation ou la suppression de ses données lorsque les fonctions seront disponibles.'
    },
    deletion: {
      title: 'Suppression des données',
      text: 'La suppression du compte peut entraîner l’effacement des mouvements, préférences et informations associées, sauf conservation temporaire nécessaire.'
    },
    academic: {
      title: 'Projet académique',
      text: 'Spendly est un projet académique en développement. Ses fonctions et pratiques de traitement peuvent évoluer.'
    },
    contact: {
      title: 'Contact confidentialité',
      text: 'Les demandes liées à la confidentialité peuvent être envoyées via le Centre d’aide ou Signaler un problème.'
    }
  }
},

editProfile: {
  title: 'Modifier le profil',
  loading: 'Chargement du profil...',
  heroTitle: 'Vos informations personnelles',
  heroText:
    'Mettez à jour les informations utilisées pour personnaliser votre expérience Spendly.',
  personalInformation: 'Informations personnelles',
  displayName: 'Nom affiché',
  displayNamePlaceholder: 'Exemple : Pedro',
  displayNameHelper:
    'Ce nom sera utilisé dans les salutations et les messages de l’application.',
  fullName: 'Nom complet',
  fullNamePlaceholder: 'Votre nom complet',
  email: 'Adresse e-mail',
  emailHelper:
    'Pour des raisons de sécurité, l’adresse e-mail ne peut pas être modifiée.',
  memberSince: 'Membre depuis',
  notAvailable: 'Non disponible',
  saveChanges: 'Enregistrer les modifications',
  saving: 'Enregistrement...',
  successTitle: 'Profil mis à jour',
  successMessage:
    'Vos informations ont été mises à jour.',
  loadError:
    'Impossible de charger les informations du profil.',
  saveError:
    'Impossible d’enregistrer les modifications.',

  validation: {
    displayNameRequired:
      'Le nom affiché est obligatoire.',
    displayNameTooShort:
      'Le nom affiché doit contenir au moins 2 caractères.',
    fullNameRequired:
      'Le nom complet est obligatoire.',
    fullNameTooShort:
      'Le nom complet doit contenir au moins 3 caractères.',
  },
},

stats: {
  title: 'Statistiques', loading: 'Chargement des statistiques...', loadError: 'Impossible de charger les statistiques.', periodLabel: 'Période', noPreviousComparison: 'Aucune comparaison précédente', comparisonValue: '{value} par rapport à la période précédente', noData: 'Aucune donnée', noDescription: 'Sans description', percentageOfTotal: '{value}% du total', topCategory: 'Catégorie principale', monthlyEvolution: 'Évolution des 6 derniers mois', expenseByCategory: 'Dépenses par catégorie', incomeByCategory: 'Revenus par catégorie', recentTransactions: 'Mouvements récents', searchPlaceholder: 'Rechercher un mouvement ou une catégorie...', emptyCategoriesTitle: 'Aucune donnée par catégorie', emptyCategoriesText: 'Lorsque vous enregistrerez des mouvements sur cette période, le détail apparaîtra ici.', emptyTransactionsTitle: 'Aucun mouvement', emptyTransactionsText: 'Aucun mouvement n’existe encore pour la période sélectionnée.', noSearchResults: 'Aucun mouvement ne correspond à votre recherche.', clearSearch: 'Effacer la recherche', addExpense: 'Ajouter une dépense', addIncome: 'Ajouter un revenu',
  periods: { currentMonth: 'Ce mois-ci', previousMonth: 'Mois précédent', threeMonths: '3 derniers mois', sixMonths: '6 derniers mois', currentYear: 'Cette année', all: 'Toute la période' },
  views: { overview: 'Résumé', expense: 'Dépenses', income: 'Revenus' },
  hero: { balance: 'Solde de la période', totalExpenses: 'Total des dépenses', totalIncome: 'Total des revenus' },
  metrics: { income: 'Revenus', expenses: 'Dépenses', balance: 'Solde', records: 'Enregistrements', savingsRate: 'Taux d’épargne : {value}', recordsBreakdown: '{expenses} dépenses · {income} revenus' },
  insights: { averageExpense: 'Dépense moyenne', averageIncome: 'Revenu moyen', perExpense: 'par dépense', perIncome: 'par revenu', highestExpense: 'Dépense la plus élevée', highestIncome: 'Revenu le plus élevé' },
},

security: {
  title: 'Sécurité et accès',
  heroTitle: 'Protégez votre compte',
  heroText: 'Gérez votre mot de passe, vos méthodes d’accès et la sécurité local de l’appareil.',
  access: 'Accès',
  sessions: 'Session',
  changePassword: 'Modifier le mot de passe',
  changePasswordSubtitle: 'Mettre à jour votre mot de passe',
  biometric: 'Face ID / empreinte',
  accessPin: 'Code PIN',
  enabled: 'Activé',
  disabled: 'Désactivé',
  connectedDevices: 'Appareils connectés',
  connectedDevicesSubtitle: 'Voir les sessions actives',
  logoutDevice: 'Se déconnecter sur cet appareil',
  logoutDeviceSubtitle: 'Quitter Spendly sur ce téléphone',
  biometricUnavailable: 'Cet appareil ne prend pas en charge la biométrie.',
  biometricNotConfigured: 'Aucune biométrie n’est configurée.',
  enableBiometricPrompt: 'Activer la biométrie pour Spendly',
  disableBiometricPrompt: 'Désactiver la biométrie pour Spendly',
  createPin: 'Créer un code PIN',
  confirmPin: 'Confirmer le code PIN',
  disablePin: 'Désactiver le code PIN',
  createPinText: 'Saisissez un code PIN à 4 chiffres.',
  confirmPinText: 'Saisissez à nouveau le code PIN.',
  disablePinText: 'Saisissez votre code PIN actuel.',
  pinMismatch: 'Les codes PIN ne correspondent pas.',
  incorrectPin: 'Code PIN incorrect.',
  logoutTitle: 'Se déconnecter',
  logoutConfirm: 'Voulez-vous vous déconnecter sur cet appareil ?',
  logout: 'Se déconnecter',
},

sessions: {
  title: 'Appareils connectés', loading: 'Chargement des sessions...', loadError: 'Impossible de charger les sessions.',
  heroTitle: 'Sessions actives', heroText: 'Vérifiez les appareils connectés à votre compte et fermez les accès que vous ne reconnaissez pas.',
  currentSession: 'Session actuelle', otherDevices: 'Autres appareils', current: 'Actuelle', unknownDevice: 'Appareil inconnu', noData: 'Aucune donnée',
  ip: 'IP', lastActivity: 'Dernière activité', created: 'Créée', closeSession: 'Fermer la session', closeAll: 'Tout fermer', close: 'Fermer',
  currentNotDetectedTitle: 'Session actuelle non détectée', currentNotDetectedText: 'Impossible d’identifier la session correspondant à cet appareil.',
  allGoodTitle: 'Tout est en ordre', allGoodText: 'Aucun autre appareil n’est connecté à votre compte.',
  info: 'Après la fermeture d’une session, l’appareil devra se reconnecter pour accéder à Spendly.',
  singleModalTitle: 'Fermer la session', singleModalText: 'Voulez-vous fermer la session sur cet appareil ?',
  allModalTitle: 'Fermer les autres sessions', allModalText: 'Votre compte sera déconnecté de tous les autres appareils, mais cette session restera active.',
  passwordPlaceholder: 'Mot de passe actuel', passwordRequired: 'Saisissez votre mot de passe.', successTitle: 'Sessions mises à jour',
  singleSuccess: 'La session a été fermée.', allSuccess: 'Les autres sessions ont été fermées.',
  singleError: 'Impossible de fermer la session.', allError: 'Impossible de fermer les sessions.',
},

pinUnlock: {
  loading: 'Chargement de la sécurité...',
  title: 'Déverrouiller Spendly',
  subtitle: 'Saisissez votre code PIN pour continuer.',
  lockedTitle: 'PIN bloqué',
  lockedSubtitle: 'Réessayez dans {time}.',
  tooManyAttempts: 'Trop de tentatives incorrectes.',
  incorrectWithAttempts:
    'PIN incorrect. Tentatives restantes : {attempts}.',
  attemptsUsed: 'Tentatives utilisées : {used} sur {max}',
  pinNotConfigured:
    'Aucun PIN n’est configuré. Retour à l’écran précédent.',
  loadError:
    'Impossible de charger l’état de sécurité.',
  validationError:
    'Impossible de vérifier le PIN.',

  time: {
    hoursMinutes: '{hours} h {minutes} min',
  },
},

changePassword: {
  title: 'Modifier le mot de passe',
  heroTitle: 'Mettez à jour votre mot de passe',
  heroText: 'Utilisez un mot de passe sécurisé et différent du précédent pour protéger votre compte.',
  currentPassword: 'Mot de passe actuel',
  currentPlaceholder: 'Saisissez votre mot de passe actuel',
  newPassword: 'Nouveau mot de passe',
  newPlaceholder: 'Au moins 8 caractères',
  repeatPassword: 'Répéter le nouveau mot de passe',
  repeatPlaceholder: 'Répétez le nouveau mot de passe',
  save: 'Enregistrer le nouveau mot de passe',
  saving: 'Enregistrement...',
  saveError: 'Impossible de modifier le mot de passe.',
  successTitle: 'Mot de passe mis à jour',
  successText: 'Votre mot de passe a été modifié.',
  validation: {
    required: 'Remplissez tous les champs.',
    minLength: 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
    samePassword: 'Le nouveau mot de passe doit être différent de l’actuel.',
    noMatch: 'Les nouveaux mots de passe ne correspondent pas.',
  },
},

notifications: {
  title: 'Notifications', loading: 'Chargement des notifications...', loadError: 'The settings could not be loaded.', saveError: 'The settings could not be saved.',
  heroTitle: 'Des alertes utiles, sans nuisance', heroText: 'Choose occasional reminders that genuinely help you manage your finances.',
  generalSection: 'Général', activitySection: 'Activité', summarySection: 'Résumés', goalsSection: 'Objectifs',
  permissionTitle: 'System permission', openRéglages: 'Réglages', permissionDeniedTitle: 'Permission disabled', permissionDeniedText: 'Enable notifications in your device settings to use this feature.',
  permissionRequiredTitle: 'Permission required', permissionRequiredText: 'Enable Spendly notifications first.', testScheduledTitle: 'Notification scheduled', testScheduledText: 'You will receive it in a few seconds.', testButton: 'Send test notification',
  goalsInfo: 'Goal alerts will open the matching goal directly. They are only sent for approaching deadlines, important progress or completion.',
  permission: { granted: 'Autorisées', denied: 'Bloquées', undetermined: 'Non configurées' },
  master: { title: 'Allow notifications', subtitle: 'Main control for all local Spendly alerts.' },
  daily: { title: 'Transaction reminder', subtitle: 'One daily reminder for pending expenses or income.', timeTitle: 'Reminder time', timeHint: 'Evening times reduce interruptions during the day.' },
  weekly: { title: 'Résumé hebdomadaire', subtitle: 'One Monday evening alert to review the previous week.' },
  monthly: { title: 'Résumé mensuel', subtitle: 'One alert on the first day of the month to review income and expenses.' },
  goalDeadline: { title: 'Objectifs nearing their deadline', subtitle: 'Notify three days before the target date.' },
  goalProgress: { title: 'Important progress', subtitle: 'Notify once when a goal reaches approximately 80%.' },
  goalCompleted: { title: 'Objectif atteint', subtitle: 'Celebrate when you reach the target amount.' },
  copy: { dailyTitle: 'Any transaction still pending?', dailyBody: 'Recording today’s activity takes less than a minute.', weeklyTitle: 'Your weekly financial summary is ready', weeklyBody: 'Review income, expenses and your weekly balance.', monthlyTitle: 'A new month, a new summary', monthlyBody: 'See how the previous month ended in Statistics.', testTitle: 'Spendly is ready', testBody: 'Notifications are working correctly.' },
},

goals: {
  title: 'Objectifs', subtitle: 'Transformez vos objectifs en progrès concrets.', loading: 'Chargement des objectifs...', search: 'Rechercher...',
  filters: { all: 'Tous', active: 'Actifs', paused: 'En pause', completed: 'Terminés', cancelled: 'Annulés' },
  status: { active: 'Actif', paused: 'En pause', completed: 'Terminé', cancelled: 'Annulé' },
  priority: { low: 'Basse', medium: 'Moyenne', high: 'Haute' },
  category: { emergency: 'Urgence', travel: 'Voyage', home: 'Maison', education: 'Études', vehicle: 'Véhicule', technology: 'Technologie', health: 'Santé', other: 'Autre' },
  summary: { active: 'Actifs', completed: 'Terminés', saved: 'Total épargné' }, card: { remaining: 'Reste' },
  empty: { title: 'Aucun objectif pour le moment', text: 'Créez votre premier objectif et commencez à enregistrer des versements.' },
  actions: { create: 'Créer', saveChanges: 'Enregistrer', contribute: 'Verser', withdraw: 'Retirer', confirm: 'Confirmer', edit: 'Modifier', pause: 'Mettre en pause', resume: 'Reprendre', cancelGoal: 'Annuler l’objectif', delete: 'Supprimer' },
  form: { createTitle: 'Nouvel objectif', editTitle: 'Modifier l’objectif', namePlaceholder: 'Ex. Voyage au Japon', descriptionPlaceholder: 'Que souhaitez-vous atteindre ?', targetAmount: 'Montant cible', category: 'Catégorie', priority: 'Priorité' },
  detail: { of: 'sur', history: 'Historique' }, movement: { aporte: 'Versement', retiro: 'Retrait', ajuste: 'Ajustement' },
  movementForm: { aporte: 'Ajouter un versement', retiro: 'Ajouter un retrait', ajuste: 'Ajouter un ajustement', amount: 'Montant', note: 'Note facultative' },
  validation: { name: 'Saisissez un nom.', amount: 'Saisissez un montant cible valide.', movementAmount: 'Saisissez un montant valide.' },
  confirm: { deleteTitle: 'Supprimer l’objectif', deleteText: 'L’objectif et tout son historique seront supprimés.', deleteMovementTitle: 'Supprimer le mouvement', deleteMovementText: 'La progression sera recalculée.' },
  notifications: { deadlineTitle: 'Un objectif approche de son échéance', deadlineBody: 'L’objectif « {goal} » arrive à échéance dans quelques jours.', progressTitle: 'Belle progression !', progressBody: 'L’objectif « {goal} » a atteint {percentage} %.', completedTitle: 'Objectif atteint !', completedBody: 'Vous avez atteint l’objectif « {goal} ».' },
  errors: { load: 'Impossible de charger les objectifs.', save: 'Impossible d’enregistrer l’objectif.', movement: 'Impossible d’enregistrer le mouvement.' }
},

support: { category:{ transactions:'Transactions', profile:'Profil', authentication:'Authentification', scan:'Scan', statistics:'Statistiques', goals:'Objectifs', notifications:'Notifications', appearance:'Apparence', language:'Langue', currency:'Devise', performance:'Performances', other:'Autre' }, status:{ all:'Tous', open:'Ouvert', in_review:'En cours', resolved:'Résolu', closed:'Fermé' }, validation:{ subject:'Le sujet doit contenir au moins 5 caractères.', description:'La description doit contenir au moins 10 caractères.' }, success:{ title:'Rapport envoyé', text:'Votre rapport a été enregistré. Suivez son état dans Mes rapports.' }, errors:{ submit:'Impossible d’envoyer le rapport.' }, report:{ title:'Signaler un problème', heroTitle:'Dites-nous ce qui s’est passé', heroText:'Votre rapport nous aide à améliorer Spendly.', category:'Catégorie', subject:'Sujet', subjectPlaceholder:'Résumez le problème', description:'Description', descriptionPlaceholder:'Expliquez ce qui s’est passé et le résultat attendu.', steps:'Étapes de reproduction', stepsPlaceholder:'1. Ouvrir...\n2. Appuyer...\n3. Le problème apparaît...', technicalTitle:'Inclure les informations techniques', technicalText:'Ajoute la version, le système et le modèle de l’appareil.', privacy:'Aucun mot de passe ou donnée financière n’est envoyé.', submit:'Envoyer le rapport' }, list:{ title:'Mes rapports', loading:'Chargement des rapports...', emptyTitle:'Aucun rapport envoyé', emptyText:'Créez un rapport lorsque vous avez besoin d’aide.', create:'Créer un rapport' }, detail:{ title:'Détail du rapport', description:'Description', steps:'Étapes de reproduction', dates:'Dates', created:'Créé', updated:'Mis à jour', resolved:'Résolu', technical:'Informations techniques', appVersion:'Version de l’application', platform:'Plateforme', os:'Système', device:'Appareil', responseTitle:'Réponse de l’équipe', pendingTitle:'En attente de réponse', pendingText:'L’équipe n’a pas encore répondu.' } },


home: {
  greeting: 'Bonjour, {name}',
  welcomeBack: 'Bon retour',
  defaultUser: 'Utilisateur',
  loading: 'Chargement du résumé...',
  balanceMonth: 'Solde total du mois',
  income: 'Revenus',
  expenses: 'Dépenses',
  available: 'Disponible',
  monthSummary: 'Résumé du mois',
  totalSpent: 'Total dépensé',
  totalIncome: 'Total reçu',
  topCategory: 'Catégorie principale',
  noData: 'Aucune donnée',
  featuredGoal: 'Objectif mis en avant',
  goalProgress: '{percent}% terminé',
  recentExpenses: 'Dépenses récentes',
  categories: 'Catégories',
  viewAll: 'Tout voir',
  expenseNoDescription: 'Dépense sans description',
  otherCategory: 'Autre',

  quick: {
    expense: 'Dépense',
    income: 'Revenu',
    scan: 'Scanner',
    stats: 'Stats',
  },

  emptyGoal: {
    title: 'Aucun objectif actif',
    text:
      'Créez un objectif pour suivre sa progression depuis l’accueil.',
    action: 'Créer un objectif',
  },

  emptyExpenses: {
    title: 'Aucune dépense',
    text:
      'Vos premières dépenses apparaîtront ici.',
    action: 'Ajouter une dépense',
  },

  emptyCategories: {
    title: 'Aucune catégorie',
    text:
      'Aucune dépense n’a été enregistrée par catégorie ce mois-ci.',
  },

  date: {
    today: 'Aujourd’hui',
    yesterday: 'Hier',
  },

  errors: {
    title: 'Impossible de mettre à jour l’accueil',
    load:
      'Les données principales n’ont pas pu être chargées.',
    retry: 'Réessayer',
  },
},

register: {
  tagline: 'Gestion intelligente des dépenses', title: 'Créer un compte', subtitle: 'Commencez à gérer vos finances',
  fullName: 'Nom complet', fullNamePlaceholder: 'Votre nom', email: 'Adresse e-mail', emailPlaceholder: 'vous@email.com',
  password: 'Mot de passe', passwordPlaceholder: '********', confirmPassword: 'Confirmer le mot de passe', passwordRequirement: 'Au moins 8 caractères',
  termsPrefix: 'J’accepte les', terms: 'Conditions générales', and: 'et la', privacy: 'Politique de confidentialité',
  create: 'Créer un compte', creating: 'Création du compte...', or: 'ou', haveAccount: 'Vous avez déjà un compte ?', login: 'Se connecter',
  validation: { name: 'Saisissez au moins 2 caractères.', email: 'Saisissez une adresse e-mail valide.', password: 'Le mot de passe doit contenir au moins 8 caractères.', confirm: 'Les mots de passe ne correspondent pas.', terms: 'Vous devez accepter les conditions et la politique de confidentialité.' },
  errors: { emailExists: 'Cette adresse e-mail est déjà utilisée. Essayez-en une autre ou connectez-vous.', generic: 'Impossible de créer le compte. Réessayez.' },
},

login: {
  tagline: 'Gestion intelligente des dépenses',
  title: 'Se connecter',
  subtitle: 'Bon retour',
  email: 'Adresse e-mail',
  emailPlaceholder: 'vous@email.com',
  password: 'Mot de passe',
  passwordPlaceholder: '••••••••',
  forgotPassword: 'Mot de passe oublié ?',
  rememberSession: 'Rester connecté',
  submit: 'Se connecter',
  verifying: 'Vérification...',
  or: 'ou',
  noAccount: 'Vous n’avez pas de compte ?',
  register: 'Créer un compte',
  footerPrefix: 'En continuant, vous acceptez les',
  terms: 'Conditions générales',
  and: 'et la',
  privacy: 'Politique de confidentialité',
  validation: {
    email: 'Saisissez une adresse e-mail valide.',
    password: 'Saisissez votre mot de passe.',
  },
  errors: {
    invalidCredentials: 'L’adresse e-mail ou le mot de passe est incorrect.',
    connection: 'Impossible de se connecter au serveur. Vérifiez votre connexion.',
    generic: 'Impossible de vous connecter. Réessayez.',
  },
},

scan: {
  title: 'Scanner un justificatif',
  heroTitle: 'Importez un reçu ou justificatif',
  heroText: 'Spendly analysera l’image et remplira automatiquement les données de la dépense afin que vous puissiez les vérifier avant l’enregistrement.',
  camera: 'Appareil photo',
  cameraText: 'Prenez une photo nette du justificatif.',
  gallery: 'Galerie',
  galleryText: 'Choisissez une image enregistrée sur votre appareil.',
  change: 'Changer l’image',
  remove: 'Supprimer',
  analyze: 'Analyser le justificatif',
  analyzing: 'Analyse du justificatif...',
  reviewTitle: 'Vérifiez les données détectées',
  reviewText: 'Vous pouvez corriger les informations avant de créer la dépense.',
  saveExpense: 'Enregistrer la dépense',
  saving: 'Enregistrement...',
  startAgain: 'Scanner un autre justificatif',
  fields: {
    amount: 'Montant',
    description: 'Description',
    category: 'Catégorie',
    date: 'Date',
    currency: 'Devise',
    paymentMethod: 'Mode de paiement',
  },
  permissions: {
    title: 'Autorisation requise',
    camera: 'L’accès à l’appareil photo est nécessaire.',
    gallery: 'L’accès à la galerie est nécessaire.',
  },
  validation: {
    amount: 'Saisissez un montant valide supérieur à zéro.',
    description: 'Saisissez une description.',
    date: 'La date doit respecter le format YYYY-MM-DD.',
  },
  errors: {
    title: 'Traitement impossible',
    analyze: 'Le justificatif n’a pas pu être analysé.',
    save: 'La dépense n’a pas pu être enregistrée.',
  },
  success: {
    title: 'Dépense enregistrée',
    text: 'La dépense a été créée correctement à partir du justificatif.',
  },
},

biometricUnlock: {
  title: 'Déverrouillez Spendly',
  subtitle:
    'Utilisez Face ID, Touch ID ou l’authentification de votre appareil pour continuer.',
  prompt: 'Déverrouiller Spendly',
  verifying: 'Vérification...',
  retry: 'Réessayer',
  failed:
    'Nous n’avons pas pu vérifier votre identité. Veuillez réessayer.',
  unavailable:
    "L'authentification biométrique n'est pas disponible ou n'est pas configurée.",
},

editTransaction: {
  expenseTitle: 'Modifier la dépense',
  incomeTitle: 'Modifier le revenu',
  heroTitle: 'Mettez à jour le mouvement',
  heroText: 'Modifiez les informations nécessaires et enregistrez les changements.',
  amount: 'Montant',
  paymentMethod: 'Mode de paiement',
  date: 'Date',
  currency: 'Devise',
  save: 'Enregistrer les modifications',
  saving: 'Enregistrement...',
  successTitle: 'Modifications enregistrées',
  successText: 'La transaction a été mise à jour correctement.',
  missing: 'La transaction à modifier est introuvable.',
  errors: {
    amount: 'Saisissez un montant valide supérieur à zéro.',
    description: 'Saisissez une description.',
    save: 'La transaction n’a pas pu être mise à jour.',
  },
},

passwordRecovery: { common:{errorTitle:'Impossible de continuer'}, forgot:{title:'Récupérer le mot de passe',heading:'Mot de passe oublié ?',subtitle:'Saisissez l’adresse e-mail associée au compte pour recevoir un code.',emailLabel:'Adresse e-mail',emailPlaceholder:'nom@email.com',send:'Envoyer le code',sending:'Envoi du code...',securityNote:'Pour votre sécurité, la réponse reste identique même si l’adresse n’est pas enregistrée.'}, verify:{title:'Vérifier le code',heading:'Saisissez le code',subtitle:'Saisissez le code à 6 chiffres envoyé par e-mail.',confirm:'Vérifier le code',verifying:'Vérification...',noCode:'Code non reçu ?',resend:'Renvoyer',resending:'Renvoi...',resendIn:'Renvoyer dans {seconds}s',expiration:'Le code expire dans 10 minutes et autorise 5 tentatives.',resentTitle:'Code renvoyé',resentText:'Un nouveau code a été envoyé.'}, reset:{title:'Nouveau mot de passe',heading:'Créez un nouveau mot de passe',subtitle:'Choisissez un mot de passe sécurisé et inédit.',passwordLabel:'Nouveau mot de passe',passwordPlaceholder:'8 caractères minimum',confirmLabel:'Confirmer le mot de passe',confirmPlaceholder:'Répétez le mot de passe',requirements:'Utilisez au moins 8 caractères avec lettres, chiffres et symboles.',save:'Mettre à jour',saving:'Mise à jour...',successTitle:'Mot de passe mis à jour',successText:'Le mot de passe a été mis à jour. Toutes les anciennes sessions ont été fermées.',goToLogin:'Aller à la connexion'}, errors:{emailRequired:'Saisissez votre e-mail.',emailInvalid:'Saisissez une adresse valide.',sendCode:'Le code n’a pas pu être envoyé.',codeIncomplete:'Saisissez les 6 chiffres.',verifyCode:'Le code n’a pas pu être vérifié.',resend:'Le code n’a pas pu être renvoyé.',invalidRequest:'La demande est invalide.',passwordLength:'Le mot de passe doit contenir 8 caractères.',passwordMismatch:'Les mots de passe ne correspondent pas.',reset:'Le mot de passe n’a pas pu être mis à jour.'}},


};