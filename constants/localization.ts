import { Platform } from 'react-native';

// Define the structure of our translations
export type Translations = {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    search: string;
    filter: string;
    all: string;
    noResults: string;
    seeAll: string;
    version: string;
    more: string;
  };
  auth: {
    login: string;
    username: string;
    password: string;
    usernameRequired: string;
    passwordRequired: string;
    loginError: string;
    logout: string;
    confirmLogout: string;
  };
  dashboard: {
    greeting: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    stats: {
      lowStock: string;
      expiringSoon: string;
      pendingOrders: string;
    };
    alerts: string;
    noAlerts: string;
    recentActivity: string;
    noActivity: string;
    scanItem: string;
    newOrder: string;
  };
  inventory: {
    title: string;
    search: string;
    noItems: string;
    adjustFilters: string;
    categories: {
      medications: string;
      disposables: string;
      equipment: string;
      emergency: string;
      laboratory: string;
    };
    item: {
      category: string;
      location: string;
      storageLocation: string;
      batch: string;
      minStock: string;
      expiryDate: string;
      price: string;
      description: string;
      stockManagement: string;
      currentStock: string;
      withdraw: string;
      restock: string;
      return: string;
      updateStock: string;
      stockUpdated: string;
      noChange: string;
      recentTransactions: string;
      viewAllTransactions: string;
      notFound: string;
      lowStock: string;
      expiringSoon: string;
      per: string;
      transactionNotes: string;
      tapToEdit: string;
      manufacturer: string;
      manufacturerNumber: string;
      barcode: string;
    };
  };
  orders: {
    title: string;
    newOrder: string;
    noOrders: string;
    noOrdersWithFilter: string;
    createOrder: string;
    status: {
      all: string;
      pending: string;
      approved: string;
      ordered: string;
      shipped: string;
      delivered: string;
      cancelled: string;
    };
    order: {
      created: string;
      createdBy: string;
      approvedBy: string;
      delivered: string;
      items: string;
      notes: string;
      total: string;
      approve: string;
      cancel: string;
      markAsOrdered: string;
      markAsShipped: string;
      markAsDelivered: string;
      updateStatus: string;
      statusUpdated: string;
      notFound: string;
      editQuantities: string;
      quantityUpdated: string;
    };
    new: {
      title: string;
      addItems: string;
      selectItems: string;
      searchItems: string;
      noItemsFound: string;
      selectedItems: string;
      noItemsSelected: string;
      itemDetails: string;
      quantity: string;
      addToOrder: string;
      removeFromOrder: string;
      orderSummary: string;
      orderNotes: string;
      submitOrder: string;
      orderCreated: string;
      orderError: string;
      selectSupplier: string;
      supplier: string;
    };
  };
  scan: {
    title: string;
    permissionTitle: string;
    permissionText: string;
    grantPermission: string;
    instructions: string;
    instructionsText: string;
    scanning: string;
    itemFound: string;
    viewDetails: string;
    scanAgain: string;
    flipCamera: string;
    toggleFlash: string;
    flashOn: string;
    flashOff: string;
    manualScan: string;
    demoScan: string;
    noItemFound: string;
    scanResult: string;
    scanResultDetails: string;
  };
  profile: {
    title: string;
    editProfile: string;
    account: string;
    personalInfo: string;
    preferences: string;
    notifications: string;
    organization: string;
    departmentInfo: string;
    rolesPermissions: string;
    sapSettings: string;
    apiSettings: string;
    azureSettings: string;
    support: string;
    helpSupport: string;
    termsPrivacy: string;
    userManagement: string;
  };
  app: {
    title: string;
    subtitle: string;
    demoHelp: string;
  };
  transactions: {
    withdrawal: string;
    restock: string;
    return: string;
    adjustment: string;
  };
  units: {
    tablets: string;
    capsules: string;
    ampoules: string;
    vials: string;
    bottles: string;
    tubes: string;
    pieces: string;
    boxes: string;
    pairs: string;
    sets: string;
    units: string;
    ml: string;
    l: string;
    mg: string;
    g: string;
    kg: string;
  };
  userManagement: {
    title: string;
    newUser: string;
    editUser: string;
    searchUsers: string;
    noUsers: string;
    createUser: string;
    userDetails: string;
    lastLogin: string;
    status: {
      active: string;
      inactive: string;
    };
    actions: {
      resetPassword: string;
      blockUser: string;
      activateUser: string;
      deleteUser: string;
      confirmDelete: string;
      confirmBlock: string;
      confirmActivate: string;
      confirmReset: string;
    };
    form: {
      name: string;
      email: string;
      department: string;
      role: string;
      password: string;
      confirmPassword: string;
      selectDepartment: string;
      passwordRequirements: string;
      passwordsDoNotMatch: string;
    };
    success: {
      created: string;
      updated: string;
      deleted: string;
      blocked: string;
      activated: string;
      passwordReset: string;
    };
  };
  help: {
    title: string;
    search: string;
    intro: string;
    noResults: string;
    contactUs: string;
    categories: {
      general: string;
      account: string;
      inventory: string;
      orders: string;
      scanning: string;
      roles: string;
      admin: string;
      settings: string;
      errors: string;
    };
  };
  azure: {
    title: string;
    settings: string;
    connection: string;
    container: string;
    pollingInterval: string;
    autoSync: string;
    lastSync: string;
    syncNow: string;
    testConnection: string;
    saveSettings: string;
    connectionSuccess: string;
    connectionError: string;
    syncSuccess: string;
    syncError: string;
    fileTypes: string;
    errors: string;
    clearErrors: string;
    status: {
      syncing: string;
      success: string;
      error: string;
      idle: string;
    };
  };
};

// German translations
export const de: Translations = {
  common: {
    loading: "Wird geladen...",
    error: "Fehler",
    success: "Erfolg",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    save: "Speichern",
    edit: "Bearbeiten",
    delete: "Löschen",
    back: "Zurück",
    next: "Weiter",
    search: "Suchen",
    filter: "Filter",
    all: "Alle",
    noResults: "Keine Ergebnisse gefunden",
    seeAll: "Alle anzeigen",
    version: "Version",
    more: "weitere",
  },
  auth: {
    login: "Anmelden",
    username: "Benutzername",
    password: "Passwort",
    usernameRequired: "Benutzername ist erforderlich",
    passwordRequired: "Passwort ist erforderlich",
    loginError: "Anmeldung fehlgeschlagen",
    logout: "Abmelden",
    confirmLogout: "Möchten Sie sich wirklich abmelden?",
  },
  dashboard: {
    greeting: {
      morning: "Guten Morgen",
      afternoon: "Guten Tag",
      evening: "Guten Abend",
    },
    stats: {
      lowStock: "Niedriger Bestand",
      expiringSoon: "Bald ablaufend",
      pendingOrders: "Ausstehende Bestellungen",
    },
    alerts: "Warnungen",
    noAlerts: "Keine Warnungen vorhanden",
    recentActivity: "Letzte Aktivitäten",
    noActivity: "Keine Aktivitäten vorhanden",
    scanItem: "Artikel scannen",
    newOrder: "Neue Bestellung",
  },
  inventory: {
    title: "Inventar",
    search: "Artikel, SKUs, Lagerplätze suchen...",
    noItems: "Keine Artikel gefunden",
    adjustFilters: "Passen Sie Ihre Filter oder Suchanfrage an",
    categories: {
      medications: "Medikamente",
      disposables: "Verbrauchsmaterial",
      equipment: "Ausrüstung",
      emergency: "Notfall",
      laboratory: "Labor",
    },
    item: {
      category: "Kategorie",
      location: "Standort",
      storageLocation: "Lagerplatz",
      batch: "Charge",
      minStock: "Mindestbestand",
      expiryDate: "Verfallsdatum",
      price: "Preis",
      description: "Beschreibung",
      stockManagement: "Bestandsverwaltung",
      currentStock: "Aktueller Bestand",
      withdraw: "Entnehmen",
      restock: "Auffüllen",
      return: "Zurückgeben",
      updateStock: "Bestand aktualisieren",
      stockUpdated: "Bestand aktualisiert",
      noChange: "Keine Änderung am Bestand",
      recentTransactions: "Letzte Transaktionen",
      viewAllTransactions: "Alle Transaktionen anzeigen",
      notFound: "Artikel nicht gefunden",
      lowStock: "Niedriger Bestand",
      expiringSoon: "Bald ablaufend",
      per: "pro",
      transactionNotes: "Notizen zur Transaktion (optional)",
      tapToEdit: "Tippen zum Bearbeiten",
      manufacturer: "Hersteller",
      manufacturerNumber: "Hersteller-Nr.",
      barcode: "Barcode/EAN",
    },
  },
  orders: {
    title: "Bestellungen",
    newOrder: "Neue Bestellung",
    noOrders: "Keine Bestellungen gefunden",
    noOrdersWithFilter: "Es gibt keine Bestellungen mit diesem Status",
    createOrder: "Bestellung erstellen",
    status: {
      all: "Alle",
      pending: "Ausstehend",
      approved: "Genehmigt",
      ordered: "Bestellt",
      shipped: "Versendet",
      delivered: "Geliefert",
      cancelled: "Storniert",
    },
    order: {
      created: "Erstellt",
      createdBy: "Erstellt von",
      approvedBy: "Genehmigt von",
      delivered: "Geliefert",
      items: "Artikel",
      notes: "Notizen",
      total: "Gesamt",
      approve: "Genehmigen",
      cancel: "Stornieren",
      markAsOrdered: "Als bestellt markieren",
      markAsShipped: "Als versendet markieren",
      markAsDelivered: "Als geliefert markieren",
      updateStatus: "Status aktualisieren",
      statusUpdated: "Status wurde aktualisiert auf",
      notFound: "Bestellung nicht gefunden",
      editQuantities: "Mengen bearbeiten",
      quantityUpdated: "Menge aktualisiert",
    },
    new: {
      title: "Neue Bestellung",
      addItems: "Artikel hinzufügen",
      selectItems: "Artikel auswählen",
      searchItems: "Artikel suchen",
      noItemsFound: "Keine Artikel gefunden",
      selectedItems: "Ausgewählte Artikel",
      noItemsSelected: "Keine Artikel ausgewählt",
      itemDetails: "Artikeldetails",
      quantity: "Menge",
      addToOrder: "Zur Bestellung hinzufügen",
      removeFromOrder: "Aus Bestellung entfernen",
      orderSummary: "Bestellübersicht",
      orderNotes: "Bestellnotizen",
      submitOrder: "Bestellung absenden",
      orderCreated: "Bestellung wurde erstellt",
      orderError: "Fehler beim Erstellen der Bestellung",
      selectSupplier: "Lieferanten auswählen",
      supplier: "Lieferant",
    },
  },
  scan: {
    title: "Scannen",
    permissionTitle: "Kamerazugriff erforderlich",
    permissionText: "Wir benötigen Kamerazugriff, um Barcodes und QR-Codes für die Bestandsverwaltung zu scannen.",
    grantPermission: "Zugriff erlauben",
    instructions: "Scan-Anleitung",
    instructionsText: "Positionieren Sie den Barcode oder QR-Code innerhalb des Scan-Bereichs und halten Sie ihn ruhig. Oder drücken Sie den blauen Scan-Button für einen Demo-Scan.",
    scanning: "Wird gescannt",
    itemFound: "Artikel gefunden",
    viewDetails: "Details anzeigen",
    scanAgain: "Erneut scannen",
    flipCamera: "Kamera wechseln",
    toggleFlash: "Blitz ein/ausschalten",
    flashOn: "Blitz eingeschaltet",
    flashOff: "Blitz ausgeschaltet",
    manualScan: "Manueller Scan",
    demoScan: "Demo-Scan",
    noItemFound: "Kein passender Artikel gefunden. Bitte Barcode oder Artikeldaten prüfen.",
    scanResult: "Scan-Ergebnis",
    scanResultDetails: "Artikel-Details",
  },
  profile: {
    title: "Profil",
    editProfile: "Profil bearbeiten",
    account: "Konto",
    personalInfo: "Persönliche Informationen",
    preferences: "Einstellungen",
    notifications: "Benachrichtigungen",
    organization: "Organisation",
    departmentInfo: "Abteilungsinformationen",
    rolesPermissions: "Rollen & Berechtigungen",
    sapSettings: "SAP Einstellungen",
    apiSettings: "API Einstellungen",
    azureSettings: "Azure Blob Storage",
    support: "Support",
    helpSupport: "Hilfe & Support",
    termsPrivacy: "Nutzungsbedingungen & Datenschutz",
    userManagement: "Benutzerverwaltung",
  },
  app: {
    title: "MediStock",
    subtitle: "Klinik-Inventarverwaltung",
    demoHelp: "Zu Demonstrationszwecken geben Sie einen beliebigen Namen aus der App (z.B. \"Sarah\") und ein beliebiges Passwort mit mindestens 4 Zeichen ein.",
  },
  transactions: {
    withdrawal: "Entnahme",
    restock: "Auffüllung",
    return: "Rückgabe",
    adjustment: "Anpassung",
  },
  units: {
    tablets: "Tabletten",
    capsules: "Kapseln",
    ampoules: "Ampullen",
    vials: "Durchstechflaschen",
    bottles: "Flaschen",
    tubes: "Tuben",
    pieces: "Stück",
    boxes: "Schachteln",
    pairs: "Paare",
    sets: "Sets",
    units: "Einheiten",
    ml: "ml",
    l: "l",
    mg: "mg",
    g: "g",
    kg: "kg",
  },
  userManagement: {
    title: "Benutzerverwaltung",
    newUser: "Neuer Benutzer",
    editUser: "Benutzer bearbeiten",
    searchUsers: "Benutzer suchen...",
    noUsers: "Keine Benutzer gefunden",
    createUser: "Benutzer erstellen",
    userDetails: "Benutzerdetails",
    lastLogin: "Letzte Anmeldung",
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
    },
    actions: {
      resetPassword: "Passwort zurücksetzen",
      blockUser: "Benutzer sperren",
      activateUser: "Benutzer aktivieren",
      deleteUser: "Benutzer löschen",
      confirmDelete: "Möchten Sie diesen Benutzer wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
      confirmBlock: "Möchten Sie diesen Benutzer sperren? Der Benutzer kann sich nicht mehr anmelden, bis er wieder aktiviert wird.",
      confirmActivate: "Möchten Sie diesen Benutzer aktivieren? Der Benutzer kann sich dann wieder anmelden.",
      confirmReset: "Möchten Sie das Passwort für diesen Benutzer zurücksetzen?",
    },
    form: {
      name: "Name",
      email: "E-Mail",
      department: "Abteilung",
      role: "Rolle",
      password: "Passwort",
      confirmPassword: "Passwort bestätigen",
      selectDepartment: "Abteilung auswählen",
      passwordRequirements: "Mindestens 6 Zeichen",
      passwordsDoNotMatch: "Die Passwörter stimmen nicht überein",
    },
    success: {
      created: "Benutzer wurde erfolgreich erstellt",
      updated: "Benutzer wurde erfolgreich aktualisiert",
      deleted: "Benutzer wurde erfolgreich gelöscht",
      blocked: "Benutzer wurde erfolgreich gesperrt",
      activated: "Benutzer wurde erfolgreich aktiviert",
      passwordReset: "Passwort wurde erfolgreich zurückgesetzt",
    },
  },
  help: {
    title: "Hilfe & Support",
    search: "Suchen Sie nach Hilfe...",
    intro: "Wie können wir Ihnen helfen?",
    noResults: "Keine Ergebnisse gefunden",
    contactUs: "Noch Fragen?",
    categories: {
      general: "Allgemeines zur App",
      account: "Benutzerkonto & Anmeldung",
      inventory: "Inventarverwaltung",
      orders: "Bestellungen",
      scanning: "Scannen & Barcode",
      roles: "Rollen & Berechtigungen",
      admin: "Benutzerverwaltung (nur Admins)",
      settings: "Einstellungen & Personalisierung",
      errors: "Fehlermeldungen & Probleme",
    },
  },
  azure: {
    title: "Azure Blob Storage",
    settings: "Azure Blob Storage Einstellungen",
    connection: "Verbindungszeichenfolge",
    container: "Container-Name",
    pollingInterval: "Abfrageintervall (Minuten)",
    autoSync: "Automatische Synchronisierung",
    lastSync: "Letzte Synchronisierung",
    syncNow: "Jetzt synchronisieren",
    testConnection: "Verbindung testen",
    saveSettings: "Einstellungen speichern",
    connectionSuccess: "Verbindung zum Azure Blob Storage erfolgreich hergestellt",
    connectionError: "Fehler beim Verbinden mit Azure Blob Storage",
    syncSuccess: "Synchronisierung mit Azure Blob Storage erfolgreich abgeschlossen",
    syncError: "Fehler bei der Synchronisierung mit Azure Blob Storage",
    fileTypes: "Unterstützte Dateitypen",
    errors: "Fehler",
    clearErrors: "Fehler löschen",
    status: {
      syncing: "Synchronisierung läuft...",
      success: "Synchronisierung erfolgreich",
      error: "Synchronisierungsfehler",
      idle: "Bereit",
    },
  },
};

// Default language is German
export const translations = de;

// Helper function to get the current device language
export const getDeviceLanguage = (): string => {
  return Platform.OS === 'ios'
    ? 'de' // For simplicity, we're defaulting to German
    : 'de';
};