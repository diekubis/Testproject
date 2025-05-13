import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Search,
  User,
  Package,
  ShoppingCart,
  Scan,
  Shield,
  Settings,
  AlertTriangle,
  Info
} from 'lucide-react-native';

// FAQ data structure
type FAQ = {
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  title: string;
  icon: React.ReactNode;
  faqs: FAQ[];
};

export default function HelpSupportScreen() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // FAQ categories and questions
  const faqCategories: FAQCategory[] = [
    {
      id: 'general',
      title: 'Allgemeines zur App',
      icon: <Info size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Was ist die Funktion der App?',
          answer: 'MediStock ist eine Klinik-Inventarverwaltungsapp, die entwickelt wurde, um medizinisches Inventar effizient zu verwalten. Sie ermöglicht die Überwachung von Beständen, das Erstellen von Bestellungen und die Nachverfolgung von Artikeln durch Barcode-Scanning.'
        },
        {
          question: 'Wer sollte diese App verwenden?',
          answer: 'Die App ist für verschiedene Mitarbeiter in Kliniken und medizinischen Einrichtungen konzipiert, darunter Ärzte, Pflegepersonal, Apotheker, Logistik-Mitarbeiter und Administratoren. Jede Rolle hat spezifische Berechtigungen und Zugriff auf relevante Funktionen.'
        },
        {
          question: 'Wie navigiere ich in der App?',
          answer: 'Die Hauptnavigation erfolgt über die Tabs am unteren Bildschirmrand: Dashboard, Inventar, Scannen, Bestellungen und Profil. Tippen Sie auf einen Tab, um zu diesem Bereich zu wechseln. Innerhalb jedes Bereichs können Sie durch Tippen auf Elemente weitere Details aufrufen.'
        },
        {
          question: 'Ist die App mit anderen Systemen verbunden?',
          answer: 'Ja, die App kann mit SAP-Systemen und externen APIs verbunden werden. Diese Integrationen können von Administratoren im Bereich "Profil" unter "SAP Einstellungen" und "API Einstellungen" konfiguriert werden.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Benutzerkonto & Anmeldung',
      icon: <User size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Wie melde ich mich an?',
          answer: 'Geben Sie auf dem Anmeldebildschirm Ihren Benutzernamen und Ihr Passwort ein. Diese Zugangsdaten sollten Sie von Ihrem Administrator erhalten haben.'
        },
        {
          question: 'Ich habe mein Passwort vergessen – was tun?',
          answer: 'Wenden Sie sich an Ihren Systemadministrator, um Ihr Passwort zurücksetzen zu lassen. In zukünftigen Versionen wird eine "Passwort vergessen"-Funktion implementiert.'
        },
        {
          question: 'Wie ändere ich meine Profilinformationen?',
          answer: 'Gehen Sie zum Tab "Profil" und tippen Sie auf "Profil bearbeiten". Dort können Sie Ihre persönlichen Informationen aktualisieren.'
        },
        {
          question: 'Wie melde ich mich ab?',
          answer: 'Gehen Sie zum Tab "Profil" und scrollen Sie nach unten. Tippen Sie auf die Schaltfläche "Abmelden", um sich von der App abzumelden.'
        }
      ]
    },
    {
      id: 'inventory',
      title: 'Inventarverwaltung',
      icon: <Package size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Wie suche ich nach Artikeln im Inventar?',
          answer: 'Verwenden Sie die Suchleiste oben im Inventar-Tab, um nach Artikelnamen, SKUs oder Standorten zu suchen. Sie können auch die Kategorie-Filter verwenden, um die Ergebnisse einzugrenzen.'
        },
        {
          question: 'Wie entnehme ich Artikel aus dem Inventar?',
          answer: 'Tippen Sie auf einen Artikel, um die Detailansicht zu öffnen. Scrollen Sie zum Abschnitt "Bestandsverwaltung" und verwenden Sie die Schaltfläche "Entnehmen", um die Menge anzupassen. Bestätigen Sie die Entnahme mit "Bestand aktualisieren".'
        },
        {
          question: 'Wie fülle ich den Bestand auf?',
          answer: 'Öffnen Sie die Detailansicht eines Artikels und scrollen Sie zum Abschnitt "Bestandsverwaltung". Verwenden Sie die Schaltfläche "Auffüllen", um die Menge anzupassen, und bestätigen Sie mit "Bestand aktualisieren".'
        },
        {
          question: 'Was bedeuten die Warnungen "Niedriger Bestand" und "Bald ablaufend"?',
          answer: '"Niedriger Bestand" bedeutet, dass die aktuelle Menge unter dem festgelegten Mindestbestand liegt. "Bald ablaufend" weist darauf hin, dass das Verfallsdatum des Artikels in weniger als 30 Tagen erreicht wird. Beide Warnungen helfen, rechtzeitig Maßnahmen zu ergreifen.'
        },
        {
          question: 'Wie sehe ich die Transaktionshistorie eines Artikels?',
          answer: 'In der Detailansicht eines Artikels finden Sie den Abschnitt "Letzte Transaktionen", der die jüngsten Bestandsänderungen anzeigt. Für eine vollständige Historie tippen Sie auf "Alle Transaktionen anzeigen".'
        }
      ]
    },
    {
      id: 'orders',
      title: 'Bestellungen',
      icon: <ShoppingCart size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Wie erstelle ich eine neue Bestellung?',
          answer: 'Gehen Sie zum Tab "Bestellungen" und tippen Sie auf die Schaltfläche "Neue Bestellung". Wählen Sie einen Lieferanten aus, fügen Sie Artikel hinzu, geben Sie die gewünschten Mengen ein und senden Sie die Bestellung ab.'
        },
        {
          question: 'Wie füge ich Artikel zu einer Bestellung hinzu?',
          answer: 'Beim Erstellen oder Bearbeiten einer Bestellung tippen Sie auf "Artikel hinzufügen". Suchen Sie nach Artikeln, wählen Sie sie aus und geben Sie die gewünschte Menge ein. Bestätigen Sie mit "Zur Bestellung hinzufügen".'
        },
        {
          question: 'Wie ändere ich den Status einer Bestellung?',
          answer: 'Öffnen Sie die Detailansicht einer Bestellung und verwenden Sie die Aktionsschaltflächen am unteren Bildschirmrand, z.B. "Genehmigen", "Als bestellt markieren" usw. Beachten Sie, dass Sie je nach Ihrer Rolle möglicherweise nicht alle Statusänderungen vornehmen können.'
        },
        {
          question: 'Kann ich eine Bestellung stornieren?',
          answer: 'Ja, öffnen Sie die Detailansicht einer Bestellung und tippen Sie auf "Stornieren". Diese Option ist nur verfügbar, wenn die Bestellung noch nicht den Status "Versendet" oder "Geliefert" hat und Sie die entsprechenden Berechtigungen besitzen.'
        },
        {
          question: 'Wie filtere ich Bestellungen nach Status?',
          answer: 'Im Tab "Bestellungen" finden Sie oben Filterschaltflächen für die verschiedenen Bestellstatus. Tippen Sie auf einen Status, um nur Bestellungen mit diesem Status anzuzeigen.'
        }
      ]
    },
    {
      id: 'scanning',
      title: 'Scannen & Barcode',
      icon: <Scan size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Wie scanne ich einen Artikel?',
          answer: 'Gehen Sie zum Tab "Scannen" und richten Sie die Kamera auf den Barcode oder QR-Code des Artikels. Halten Sie die Kamera ruhig, bis der Code erkannt wird. Die App zeigt dann die Artikeldetails an.'
        },
        {
          question: 'Welche Arten von Codes kann die App scannen?',
          answer: 'Die App kann verschiedene Barcode-Formate scannen, darunter QR-Codes, EAN-13, EAN-8, Code 128 und UPC-A. Diese Codes werden häufig auf medizinischen Produkten und Verpackungen verwendet.'
        },
        {
          question: 'Die Kamera erkennt den Barcode nicht – was kann ich tun?',
          answer: 'Stellen Sie sicher, dass der Barcode gut beleuchtet und nicht beschädigt ist. Halten Sie die Kamera ruhig und in einem Abstand von etwa 10-20 cm. Wenn der Code immer noch nicht erkannt wird, versuchen Sie, die Kamera mit der Schaltfläche "Kamera wechseln" umzuschalten oder den Artikel manuell im Inventar zu suchen.'
        },
        {
          question: 'Kann ich nach dem Scannen direkt Aktionen durchführen?',
          answer: 'Ja, nach dem Scannen eines Artikels zeigt die App die Artikeldetails an. Von dort aus können Sie "Details anzeigen" wählen, um zur vollständigen Artikelansicht zu gelangen, wo Sie Bestandsaktionen wie Entnahme oder Auffüllen durchführen können.'
        }
      ]
    },
    {
      id: 'roles',
      title: 'Rollen & Berechtigungen',
      icon: <Shield size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Warum sehe ich nicht alle Funktionen?',
          answer: 'Die sichtbaren Funktionen hängen von Ihrer zugewiesenen Rolle ab. Jede Rolle (Arzt, Pfleger, Apotheker, Logistik, Administrator) hat spezifische Berechtigungen. Wenden Sie sich an Ihren Administrator, wenn Sie zusätzliche Berechtigungen benötigen.'
        },
        {
          question: 'Welche Rollen gibt es im System?',
          answer: 'Das System umfasst mehrere Rollen: Administrator (Vollzugriff), Arzt (Inventareinsicht und Bestellungen), Pflegepersonal (Inventar und Entnahme), Apotheker (Medikamentenverwaltung), Logistik-Mitarbeiter (Bestandsverwaltung) und Einkauf (Bestellungsverwaltung).'
        },
        {
          question: 'Wie kann ich meine Rolle ändern lassen?',
          answer: 'Ihre Rolle kann nur von einem Administrator geändert werden. Wenden Sie sich an Ihren Systemadministrator mit Ihrer Anfrage und begründen Sie, warum Sie eine andere Rolle benötigen.'
        },
        {
          question: 'Welche Berechtigungen hat meine Rolle?',
          answer: 'Sie können Ihre Berechtigungen einsehen, indem Sie zu "Profil" > "Rollen & Berechtigungen" gehen. Dort werden alle verfügbaren Berechtigungskategorien und die für Ihre Rolle aktivierten Berechtigungen angezeigt.'
        }
      ]
    },
    {
      id: 'admin',
      title: 'Benutzerverwaltung (nur Admins)',
      icon: <User size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Wie lege ich neue Benutzer an?',
          answer: 'Als Administrator gehen Sie zu "Profil" und wählen Sie "Benutzerverwaltung". Tippen Sie auf die Schaltfläche "Neuer Benutzer" und füllen Sie alle erforderlichen Felder aus, einschließlich Name, E-Mail, Passwort, Abteilung und Rolle.'
        },
        {
          question: 'Wie ändere ich die Rolle eines Benutzers?',
          answer: 'Öffnen Sie die Benutzerverwaltung, suchen Sie den betreffenden Benutzer und tippen Sie auf seinen Namen. In der Detailansicht können Sie auf "Bearbeiten" tippen und die Rolle aus dem Dropdown-Menü ändern.'
        },
        {
          question: 'Wie kann ich Benutzer sperren?',
          answer: 'In der Benutzerverwaltung öffnen Sie die Detailansicht des Benutzers und scrollen zum Abschnitt "Kontostatus". Tippen Sie auf "Benutzer sperren". Gesperrte Benutzer können sich nicht mehr anmelden, bis sie entsperrt werden.'
        },
        {
          question: 'Wie setze ich das Passwort eines Benutzers zurück?',
          answer: 'Öffnen Sie die Detailansicht des Benutzers und tippen Sie auf "Passwort zurücksetzen". Geben Sie ein neues Passwort ein und bestätigen Sie es. Informieren Sie den Benutzer über sein neues Passwort auf sicherem Wege.'
        },
        {
          question: 'Kann ich gelöschte Benutzer wiederherstellen?',
          answer: 'Nein, das Löschen eines Benutzers ist endgültig. Daher wird empfohlen, Benutzer zu sperren statt zu löschen, wenn Sie die Möglichkeit in Betracht ziehen, den Zugang später wiederherzustellen.'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Einstellungen & Personalisierung',
      icon: <Settings size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Wie ändere ich meine persönlichen Informationen?',
          answer: 'Gehen Sie zum Tab "Profil" und tippen Sie auf "Profil bearbeiten". Dort können Sie Ihren Namen, Ihre E-Mail-Adresse und andere persönliche Informationen aktualisieren.'
        },
        {
          question: 'Wie konfiguriere ich die SAP-Verbindung?',
          answer: 'Als Administrator gehen Sie zu "Profil" und wählen Sie "SAP Einstellungen". Geben Sie die Server-URL, System-ID, Mandantennummer sowie Ihre SAP-Anmeldedaten ein und speichern Sie die Einstellungen.'
        },
        {
          question: 'Wie richte ich die API-Verbindung ein?',
          answer: 'Als Administrator gehen Sie zu "Profil" und wählen Sie "API Einstellungen". Konfigurieren Sie die API-URL, den API-Schlüssel und das Aktualisierungsintervall. Sie können auch die SSL-Verschlüsselung aktivieren oder deaktivieren.'
        },
        {
          question: 'Kann ich Benachrichtigungseinstellungen anpassen?',
          answer: 'Ja, gehen Sie zu "Profil" > "Benachrichtigungen". Dort können Sie festlegen, welche Arten von Benachrichtigungen Sie erhalten möchten, z.B. für niedrigen Bestand, ablaufende Artikel oder Bestellstatusaktualisierungen.'
        }
      ]
    },
    {
      id: 'errors',
      title: 'Fehlermeldungen & Probleme',
      icon: <AlertTriangle size={22} color={colors.primary} />,
      faqs: [
        {
          question: 'Die App reagiert langsam – was kann ich tun?',
          answer: 'Versuchen Sie, die App zu schließen und neu zu starten. Prüfen Sie Ihre Internetverbindung, da eine langsame Verbindung die Leistung beeinträchtigen kann. Wenn das Problem weiterhin besteht, wenden Sie sich an den Support.'
        },
        {
          question: 'Ich bekomme eine Fehlermeldung beim Speichern – was kann ich tun?',
          answer: 'Stellen Sie sicher, dass alle Pflichtfelder ausgefüllt sind und die Eingaben den Formatvorgaben entsprechen. Überprüfen Sie Ihre Internetverbindung. Wenn der Fehler weiterhin auftritt, notieren Sie die genaue Fehlermeldung und kontaktieren Sie den Support.'
        },
        {
          question: 'Die Synchronisierung mit SAP schlägt fehl – wie behebe ich das?',
          answer: 'Überprüfen Sie Ihre SAP-Verbindungseinstellungen unter "Profil" > "SAP Einstellungen". Stellen Sie sicher, dass die Server-URL, System-ID und Anmeldedaten korrekt sind. Verwenden Sie die Funktion "Verbindung testen", um die Verbindung zu überprüfen.'
        },
        {
          question: 'Meine Änderungen werden nicht gespeichert – was ist das Problem?',
          answer: 'Dies kann auf Verbindungsprobleme oder fehlende Berechtigungen zurückzuführen sein. Stellen Sie sicher, dass Sie über eine stabile Internetverbindung verfügen und die erforderlichen Berechtigungen für die Aktion haben. Versuchen Sie, sich ab- und wieder anzumelden.'
        },
        {
          question: 'An wen kann ich mich bei weiteren Problemen wenden?',
          answer: 'Bei technischen Problemen wenden Sie sich an Ihren IT-Support oder Systemadministrator. Für Fragen zur Bedienung der App können Sie sich an Ihren Vorgesetzten oder den Schulungsbeauftragten Ihrer Einrichtung wenden.'
        }
      ]
    }
  ];
  
  // Filter FAQs based on search query
  const filteredCategories = searchQuery.trim() === '' 
    ? faqCategories 
    : faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0);
  
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedQuestion(null); // Close any open question when toggling category
  };
  
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Hilfe & Support",
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Suchen Sie nach Hilfe..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.introContainer}>
            <HelpCircle size={40} color={colors.primary} />
            <Text style={styles.introTitle}>Wie können wir Ihnen helfen?</Text>
            <Text style={styles.introText}>
              Hier finden Sie Antworten auf häufig gestellte Fragen und Hilfe zur Nutzung der App.
              Wählen Sie eine Kategorie oder suchen Sie nach einem bestimmten Thema.
            </Text>
          </View>
          
          {filteredCategories.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Keine Ergebnisse für "{searchQuery}" gefunden.
              </Text>
              <Text style={styles.noResultsSubtext}>
                Versuchen Sie es mit anderen Suchbegriffen oder durchsuchen Sie die Kategorien.
              </Text>
            </View>
          ) : (
            filteredCategories.map(category => (
              <View key={category.id} style={styles.categoryContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.categoryHeader,
                    pressed && styles.categoryHeaderPressed
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <View style={styles.categoryTitleContainer}>
                    <View style={styles.categoryIcon}>
                      {category.icon}
                    </View>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                  </View>
                  {expandedCategory === category.id ? (
                    <ChevronUp size={24} color={colors.text} />
                  ) : (
                    <ChevronDown size={24} color={colors.text} />
                  )}
                </Pressable>
                
                {expandedCategory === category.id && (
                  <View style={styles.faqList}>
                    {category.faqs.map((faq, index) => (
                      <View key={index} style={styles.faqItem}>
                        <Pressable
                          style={({ pressed }) => [
                            styles.questionContainer,
                            pressed && styles.questionContainerPressed
                          ]}
                          onPress={() => toggleQuestion(`${category.id}-${index}`)}
                        >
                          <Text style={styles.question}>{faq.question}</Text>
                          {expandedQuestion === `${category.id}-${index}` ? (
                            <ChevronUp size={20} color={colors.text} />
                          ) : (
                            <ChevronDown size={20} color={colors.text} />
                          )}
                        </Pressable>
                        
                        {expandedQuestion === `${category.id}-${index}` && (
                          <View style={styles.answerContainer}>
                            <Text style={styles.answer}>{faq.answer}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
          
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Noch Fragen?</Text>
            <Text style={styles.contactText}>
              Wenn Sie weitere Unterstützung benötigen, wenden Sie sich bitte an:
            </Text>
            <Text style={styles.contactEmail}>support@medistock.de</Text>
            <Text style={styles.contactPhone}>+49 (0) 123 456789</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  introContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryHeaderPressed: {
    backgroundColor: `${colors.primary}10`,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  faqList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqItem_last: {
    borderBottomWidth: 0,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 14,
  },
  questionContainerPressed: {
    backgroundColor: `${colors.primary}05`,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: colors.background,
  },
  answer: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  contactContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  contactEmail: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});