import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/stores/theme-store';
import { useAuthStore } from '@/stores/auth-store';
import Button from '@/components/Button';
import { Moon, Bell, Globe, Eye, Lock } from 'lucide-react-native';

export default function PreferencesScreen() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('de');
  const [autoLogout, setAutoLogout] = useState(true);
  
  const handleSavePreferences = () => {
    Alert.alert(
      'Einstellungen gespeichert',
      'Ihre Einstellungen wurden erfolgreich gespeichert.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Darstellung</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.iconContainer}>
              <Moon size={20} color={colors.primary} />
            </View>
            <Text style={styles.preferenceLabel}>Dunkelmodus</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: `${colors.primary}80` }}
            thumbColor={isDarkMode ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benachrichtigungen</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.iconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.preferenceLabel}>Push-Benachrichtigungen</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: `${colors.primary}80` }}
            thumbColor={notifications ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sprache</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.iconContainer}>
              <Globe size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.preferenceLabel}>Sprache</Text>
              <Text style={styles.preferenceDescription}>Deutsch</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sicherheit</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.iconContainer}>
              <Lock size={20} color={colors.primary} />
            </View>
            <Text style={styles.preferenceLabel}>Automatische Abmeldung</Text>
          </View>
          <Switch
            value={autoLogout}
            onValueChange={setAutoLogout}
            trackColor={{ false: '#767577', true: `${colors.primary}80` }}
            thumbColor={autoLogout ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <View style={styles.iconContainer}>
              <Eye size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.preferenceLabel}>Inaktivitäts-Timeout</Text>
              <Text style={styles.preferenceDescription}>Nach 15 Minuten</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Einstellungen speichern"
          onPress={handleSavePreferences}
          variant="primary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    color: colors.text,
  },
  preferenceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  buttonContainer: {
    margin: 16,
    marginBottom: 32,
  },
});