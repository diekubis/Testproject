import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { FileText, Shield, Lock } from 'lucide-react-native';

export default function TermsPrivacyScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Nutzungsbedingungen & Datenschutz",
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <FileText size={40} color={colors.primary} />
          <Text style={styles.headerTitle}>Nutzungsbedingungen & Datenschutz</Text>
          <Text style={styles.headerSubtitle}>
            Letzte Aktualisierung: 01.06.2023
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Nutzungsbedingungen</Text>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>1.1 Anwendungsbereich</Text>
            <Text style={styles.paragraph}>
              Diese Nutzungsbedingungen regeln die Nutzung der MediStock App ("App") durch autorisierte Mitarbeiter der Klinik. Durch die Nutzung der App erklären Sie sich mit diesen Bedingungen einverstanden.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>1.2 Zugang und Sicherheit</Text>
            <Text style={styles.paragraph}>
              Der Zugang zur App ist ausschließlich autorisierten Mitarbeitern vorbehalten. Sie sind verpflichtet, Ihre Zugangsdaten geheim zu halten und nicht an Dritte weiterzugeben. Jede Aktivität, die unter Ihrem Konto stattfindet, liegt in Ihrer Verantwortung.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>1.3 Nutzungszweck</Text>
            <Text style={styles.paragraph}>
              Die App darf ausschließlich für die vorgesehenen betrieblichen Zwecke der Inventarverwaltung und Bestellabwicklung verwendet werden. Eine Nutzung für private oder nicht autorisierte Zwecke ist untersagt.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>1.4 Verantwortliche Nutzung</Text>
            <Text style={styles.paragraph}>
              Bei der Nutzung der App sind Sie verpflichtet, alle geltenden Gesetze und internen Richtlinien zu beachten. Insbesondere müssen alle Inventaraktionen und Bestellungen wahrheitsgemäß und korrekt durchgeführt werden.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>1.5 Änderungen der Nutzungsbedingungen</Text>
            <Text style={styles.paragraph}>
              Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Wesentliche Änderungen werden Ihnen mitgeteilt. Die fortgesetzte Nutzung der App nach solchen Änderungen gilt als Zustimmung zu den neuen Bedingungen.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Shield size={24} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>2. Datenschutzerklärung</Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>2.1 Erhobene Daten</Text>
            <Text style={styles.paragraph}>
              Die App erhebt und verarbeitet folgende personenbezogene Daten:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Name, E-Mail-Adresse und Benutzerkennung</Text>
              <Text style={styles.bulletItem}>• Abteilungszugehörigkeit und Rolle im System</Text>
              <Text style={styles.bulletItem}>• Protokolldaten über durchgeführte Aktionen (Audit-Trail)</Text>
              <Text style={styles.bulletItem}>• Geräteinformationen und IP-Adressen bei der Nutzung</Text>
            </View>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>2.2 Zweck der Datenverarbeitung</Text>
            <Text style={styles.paragraph}>
              Die erhobenen Daten werden für folgende Zwecke verwendet:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Bereitstellung und Verwaltung Ihres Benutzerkontos</Text>
              <Text style={styles.bulletItem}>• Nachverfolgung von Inventaraktionen und Bestellungen</Text>
              <Text style={styles.bulletItem}>• Gewährleistung der Systemsicherheit</Text>
              <Text style={styles.bulletItem}>• Verbesserung der App-Funktionalität</Text>
              <Text style={styles.bulletItem}>• Erfüllung gesetzlicher Aufbewahrungspflichten</Text>
            </View>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>2.3 Datensicherheit</Text>
            <Text style={styles.paragraph}>
              Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Manipulation zu schützen. Dazu gehören Verschlüsselung, Zugriffskontrollen und regelmäßige Sicherheitsüberprüfungen.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>2.4 Datenweitergabe</Text>
            <Text style={styles.paragraph}>
              Eine Weitergabe Ihrer Daten erfolgt nur:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• An interne Abteilungen, soweit für die Aufgabenerfüllung erforderlich</Text>
              <Text style={styles.bulletItem}>• An Dienstleister, die uns bei der Bereitstellung der App unterstützen (z.B. Hosting-Provider)</Text>
              <Text style={styles.bulletItem}>• Wenn eine gesetzliche Verpflichtung zur Weitergabe besteht</Text>
            </View>
            <Text style={styles.paragraph}>
              Alle Dienstleister sind vertraglich zur Einhaltung der Datenschutzbestimmungen verpflichtet.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>2.5 Aufbewahrungsdauer</Text>
            <Text style={styles.paragraph}>
              Ihre personenbezogenen Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben. Protokolldaten werden in der Regel nach 90 Tagen gelöscht, sofern keine längere Aufbewahrung erforderlich ist.
            </Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>2.6 Ihre Rechte</Text>
            <Text style={styles.paragraph}>
              Als betroffene Person haben Sie folgende Rechte:
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Recht auf Auskunft über die gespeicherten Daten</Text>
              <Text style={styles.bulletItem}>• Recht auf Berichtigung unrichtiger Daten</Text>
              <Text style={styles.bulletItem}>• Recht auf Löschung, soweit keine Aufbewahrungspflichten bestehen</Text>
              <Text style={styles.bulletItem}>• Recht auf Einschränkung der Verarbeitung</Text>
              <Text style={styles.bulletItem}>• Recht auf Datenübertragbarkeit</Text>
              <Text style={styles.bulletItem}>• Beschwerderecht bei der zuständigen Datenschutzaufsichtsbehörde</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Lock size={24} color={colors.primary} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>3. Vertraulichkeit</Text>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.paragraph}>
              Alle über die App zugänglichen Informationen, insbesondere Inventardaten, Bestellinformationen und Patientendaten, unterliegen der Vertraulichkeit. Sie verpflichten sich, diese Informationen nicht an unbefugte Dritte weiterzugeben und ausschließlich für dienstliche Zwecke zu verwenden.
            </Text>
          </View>
        </View>
        
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Kontakt</Text>
          <Text style={styles.paragraph}>
            Bei Fragen zum Datenschutz oder zu den Nutzungsbedingungen wenden Sie sich bitte an:
          </Text>
          <Text style={styles.contactInfo}>Datenschutzbeauftragter</Text>
          <Text style={styles.contactInfo}>MediStock GmbH</Text>
          <Text style={styles.contactInfo}>Musterstraße 123, 12345 Berlin</Text>
          <Text style={styles.contactInfo}>datenschutz@medistock.de</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  contactSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
});