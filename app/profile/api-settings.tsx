import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Server, Key, RefreshCw, Clock, Shield } from 'lucide-react-native';

export default function ApiSettingsScreen() {
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('15');
  const [isEnabled, setIsEnabled] = useState(true);
  const [useSSL, setUseSSL] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveSettings = () => {
    if (!apiUrl || !apiKey) {
      Alert.alert(
        "Fehler",
        "Bitte geben Sie die API-URL und den API-Schlüssel ein.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Erfolg",
        "API-Einstellungen wurden erfolgreich gespeichert.",
        [{ text: "OK" }]
      );
    }, 1500);
  };
  
  const handleTestConnection = () => {
    if (!apiUrl || !apiKey) {
      Alert.alert(
        "Fehler",
        "Bitte geben Sie die API-URL und den API-Schlüssel ein, um die Verbindung zu testen.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Verbindungstest",
        "Verbindung zur API erfolgreich hergestellt.",
        [{ text: "OK" }]
      );
    }, 2000);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "API Einstellungen",
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API-Konfiguration</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>API-URL</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Server size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={apiUrl}
                onChangeText={setApiUrl}
                placeholder="https://api.example.com/v1"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>API-Schlüssel</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Key size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="Ihr API-Schlüssel"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Aktualisierungsintervall (Minuten)</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Clock size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={refreshInterval}
                onChangeText={setRefreshInterval}
                placeholder="15"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sicherheit & Optionen</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>API aktivieren</Text>
            <Switch
              value={isEnabled}
              onValueChange={setIsEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={isEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>SSL-Verschlüsselung verwenden</Text>
            <Switch
              value={useSSL}
              onValueChange={setUseSSL}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={useSSL ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <Text style={styles.helpText}>
            Die API-Integration ermöglicht den Datenaustausch mit externen Systemen. Bitte stellen Sie sicher, dass Sie die korrekten Zugangsdaten verwenden.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synchronisierung</Text>
          
          <Button
            title="Jetzt synchronisieren"
            onPress={() => {
              Alert.alert(
                "Synchronisierung",
                "Möchten Sie jetzt eine manuelle Synchronisierung starten?",
                [
                  { text: "Abbrechen", style: "cancel" },
                  { 
                    text: "Synchronisieren", 
                    onPress: () => {
                      Alert.alert("Erfolg", "Synchronisierung erfolgreich abgeschlossen.");
                    }
                  }
                ]
              );
            }}
            icon={<RefreshCw size={18} color="white" />}
            fullWidth
          />
          
          <Text style={[styles.helpText, { marginTop: 12 }]}>
            Letzte Synchronisierung: Heute, 14:32 Uhr
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Verbindung testen"
            onPress={handleTestConnection}
            variant="outline"
            loading={isLoading}
            fullWidth
          />
          
          <Button
            title="Einstellungen speichern"
            onPress={handleSaveSettings}
            loading={isLoading}
            fullWidth
          />
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
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
});