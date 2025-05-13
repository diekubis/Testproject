import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { Database, Key, Server, Clock, RefreshCw, FileText, AlertTriangle } from 'lucide-react-native';
import { useAzureStore } from '@/stores/azure-store';
import { translations } from '@/constants/localization';

export default function AzureSettingsScreen() {
  const { 
    connectionString, 
    containerName, 
    pollingInterval,
    isEnabled,
    lastSyncTime,
    syncStatus,
    syncErrors,
    setConnectionString,
    setContainerName,
    setPollingInterval,
    setIsEnabled,
    testConnection,
    syncNow,
    clearErrors
  } = useAzureStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [localConnectionString, setLocalConnectionString] = useState(connectionString);
  const [localContainerName, setLocalContainerName] = useState(containerName);
  const [localPollingInterval, setLocalPollingInterval] = useState(pollingInterval.toString());
  const [localIsEnabled, setLocalIsEnabled] = useState(isEnabled);
  
  useEffect(() => {
    setLocalConnectionString(connectionString);
    setLocalContainerName(containerName);
    setLocalPollingInterval(pollingInterval.toString());
    setLocalIsEnabled(isEnabled);
  }, [connectionString, containerName, pollingInterval, isEnabled]);
  
  const handleSaveSettings = () => {
    if (!localConnectionString || !localContainerName) {
      Alert.alert(
        "Fehler",
        "Bitte geben Sie die Verbindungszeichenfolge und den Container-Namen ein.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsLoading(true);
    
    // Update store values
    setConnectionString(localConnectionString);
    setContainerName(localContainerName);
    setPollingInterval(parseInt(localPollingInterval) || 15);
    setIsEnabled(localIsEnabled);
    
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Erfolg",
        "Azure Blob Storage Einstellungen wurden erfolgreich gespeichert.",
        [{ text: "OK" }]
      );
    }, 1000);
  };
  
  const handleTestConnection = async () => {
    if (!localConnectionString || !localContainerName) {
      Alert.alert(
        "Fehler",
        "Bitte geben Sie die Verbindungszeichenfolge und den Container-Namen ein, um die Verbindung zu testen.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      await testConnection(localConnectionString, localContainerName);
      setIsLoading(false);
      Alert.alert(
        "Verbindungstest",
        "Verbindung zum Azure Blob Storage erfolgreich hergestellt.",
        [{ text: "OK" }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Verbindungsfehler",
        `Fehler beim Verbinden mit Azure Blob Storage: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        [{ text: "OK" }]
      );
    }
  };
  
  const handleSyncNow = async () => {
    setIsLoading(true);
    
    try {
      await syncNow();
      setIsLoading(false);
      Alert.alert(
        "Synchronisierung",
        "Synchronisierung mit Azure Blob Storage erfolgreich abgeschlossen.",
        [{ text: "OK" }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Synchronisierungsfehler",
        `Fehler bei der Synchronisierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        [{ text: "OK" }]
      );
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Azure Blob Storage",
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Azure Blob Storage Konfiguration</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Verbindungszeichenfolge oder SAS-Token</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Key size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={localConnectionString}
                onChangeText={setLocalConnectionString}
                placeholder="DefaultEndpointsProtocol=https;AccountName=..."
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <Text style={styles.helpText}>
              Die Verbindungszeichenfolge oder das SAS-Token für den Azure Blob Storage.
            </Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Container-Name</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Database size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={localContainerName}
                onChangeText={setLocalContainerName}
                placeholder="medistock-data"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Abfrageintervall (Minuten)</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Clock size={20} color={colors.primary} />
              </View>
              <TextInput
                style={styles.input}
                value={localPollingInterval}
                onChangeText={setLocalPollingInterval}
                placeholder="15"
                keyboardType="number-pad"
              />
            </View>
            <Text style={styles.helpText}>
              Wie oft soll die App nach neuen oder geänderten Dateien suchen?
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synchronisierungsoptionen</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Automatische Synchronisierung</Text>
            <Switch
              value={localIsEnabled}
              onValueChange={setLocalIsEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={localIsEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
          
          <Text style={styles.helpText}>
            Bei aktivierter automatischer Synchronisierung werden Daten regelmäßig mit Azure Blob Storage synchronisiert.
          </Text>
          
          {lastSyncTime && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Letzte Synchronisierung:</Text>
              <Text style={styles.infoValue}>
                {new Date(lastSyncTime).toLocaleString('de-DE')}
              </Text>
            </View>
          )}
          
          {syncStatus === 'syncing' && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.statusText}>Synchronisierung läuft...</Text>
            </View>
          )}
          
          {syncErrors.length > 0 && (
            <View style={styles.errorContainer}>
              <View style={styles.errorHeader}>
                <AlertTriangle size={20} color={colors.error} />
                <Text style={styles.errorTitle}>Synchronisierungsfehler</Text>
              </View>
              {syncErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>{error}</Text>
              ))}
              <Button
                title="Fehler löschen"
                onPress={clearErrors}
                variant="outline"
                icon={<RefreshCw size={18} color={colors.primary} />}
                style={styles.clearErrorsButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dateitypen</Text>
          
          <View style={styles.fileTypeContainer}>
            <View style={styles.fileTypeIcon}>
              <FileText size={20} color={colors.primary} />
            </View>
            <View style={styles.fileTypeInfo}>
              <Text style={styles.fileTypeName}>CSV-Dateien</Text>
              <Text style={styles.fileTypeDescription}>
                Kommagetrennte Werte für Inventardaten
              </Text>
            </View>
          </View>
          
          <View style={styles.fileTypeContainer}>
            <View style={styles.fileTypeIcon}>
              <FileText size={20} color={colors.primary} />
            </View>
            <View style={styles.fileTypeInfo}>
              <Text style={styles.fileTypeName}>JSON-Dateien</Text>
              <Text style={styles.fileTypeDescription}>
                Strukturierte Daten für Bestellungen und Benutzer
              </Text>
            </View>
          </View>
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
            title="Jetzt synchronisieren"
            onPress={handleSyncNow}
            variant="outline"
            icon={<RefreshCw size={18} color={colors.primary} />}
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
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
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
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.text,
  },
  errorContainer: {
    backgroundColor: `${colors.error}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  clearErrorsButton: {
    marginTop: 8,
  },
  fileTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fileTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileTypeInfo: {
    flex: 1,
  },
  fileTypeName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  fileTypeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});