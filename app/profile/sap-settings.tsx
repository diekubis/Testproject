import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Database, Key, Server, Globe, User } from 'lucide-react-native';

export default function SapSettingsScreen() {
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [systemId, setSystemId] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [isAutoSync, setIsAutoSync] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveSettings = () => {
    if (!serverUrl || !username || !password || !systemId || !clientNumber) {
      Alert.alert(
        "Fehler",
        "Bitte füllen Sie alle Pflichtfelder aus.",
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
        "SAP-Einstellungen wurden erfolgreich gespeichert.",
        [{ text: "OK" }]
      );
    }, 1500);
  };
  
  const handleTestConnection = () => {
    if (!serverUrl || !username || !password || !systemId || !clientNumber) {
      Alert.alert(
        "Fehler",
        "Bitte füllen Sie alle Pflichtfelder aus, um die Verbindung zu testen.",
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
        "Verbindung zum SAP-System erfolgreich hergestellt.",
        [{ text: "OK" }]
      );
    }, 2000);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "SAP Einstellungen",
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAP-Verbindungsdaten</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Server URL</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Server size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={serverUrl}
                onChangeText={setServerUrl}
                placeholder="https://sap-server.example.com"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>System-ID</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Database size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={systemId}
                onChangeText={setSystemId}
                placeholder="PRD"
                autoCapitalize="characters"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mandantennummer</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Globe size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={clientNumber}
                onChangeText={setClientNumber}
                placeholder="100"
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentifizierung</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Benutzername</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <User size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="SAP-Benutzername"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Passwort</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Key size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="SAP-Passwort"
                secureTextEntry
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synchronisierungsoptionen</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Automatische Synchronisierung</Text>
            <Switch
              value={isAutoSync}
              onValueChange={setIsAutoSync}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={isAutoSync ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <Text style={styles.helpText}>
            Bei aktivierter automatischer Synchronisierung werden Bestandsänderungen und Bestellungen automatisch mit dem SAP-System synchronisiert.
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
    marginBottom: 12,
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