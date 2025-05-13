import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Bell, AlertTriangle, ShoppingCart, Clock, Mail, Smartphone } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { translations } from '@/constants/localization';
import Button from '@/components/Button';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState({
    // Push notifications
    pushEnabled: true,
    pushLowStock: true,
    pushExpiryAlerts: true,
    pushOrderUpdates: true,
    pushSystemAlerts: false,
    
    // Email notifications
    emailEnabled: true,
    emailDailyDigest: true,
    emailOrderConfirmations: true,
    emailSystemUpdates: false,
    
    // In-app notifications
    inAppEnabled: true,
    inAppLowStock: true,
    inAppExpiryAlerts: true,
    inAppOrderUpdates: true,
    inAppSystemAlerts: true,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleToggle = (key: string) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key as keyof typeof prev] };
      
      // If main toggle is turned off, turn off all sub-toggles
      if (key === 'pushEnabled' && !newState.pushEnabled) {
        newState.pushLowStock = false;
        newState.pushExpiryAlerts = false;
        newState.pushOrderUpdates = false;
        newState.pushSystemAlerts = false;
      }
      
      if (key === 'emailEnabled' && !newState.emailEnabled) {
        newState.emailDailyDigest = false;
        newState.emailOrderConfirmations = false;
        newState.emailSystemUpdates = false;
      }
      
      if (key === 'inAppEnabled' && !newState.inAppEnabled) {
        newState.inAppLowStock = false;
        newState.inAppExpiryAlerts = false;
        newState.inAppOrderUpdates = false;
        newState.inAppSystemAlerts = false;
      }
      
      // If any sub-toggle is turned on, ensure main toggle is on
      if (key.startsWith('push') && key !== 'pushEnabled' && newState[key as keyof typeof newState]) {
        newState.pushEnabled = true;
      }
      
      if (key.startsWith('email') && key !== 'emailEnabled' && newState[key as keyof typeof newState]) {
        newState.emailEnabled = true;
      }
      
      if (key.startsWith('inApp') && key !== 'inAppEnabled' && newState[key as keyof typeof newState]) {
        newState.inAppEnabled = true;
      }
      
      return newState;
    });
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      Alert.alert(
        translations.common.success,
        'Ihre Benachrichtigungseinstellungen wurden gespeichert.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        translations.common.error,
        'Beim Speichern Ihrer Einstellungen ist ein Fehler aufgetreten.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: translations.profile.notifications,
        headerBackTitle: translations.common.back
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Push-Benachrichtigungen</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push-Benachrichtigungen aktivieren</Text>
            <Switch
              value={notifications.pushEnabled}
              onValueChange={() => handleToggle('pushEnabled')}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.pushEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.pushEnabled && styles.settingDisabled]}>
            <View style={styles.settingInfo}>
              <AlertTriangle size={18} color={notifications.pushEnabled ? colors.warning : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.pushEnabled && styles.settingTextDisabled]}>
                Niedriger Bestand
              </Text>
            </View>
            <Switch
              value={notifications.pushLowStock}
              onValueChange={() => handleToggle('pushLowStock')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.pushLowStock && notifications.pushEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.pushEnabled && styles.settingDisabled]}>
            <View style={styles.settingInfo}>
              <Clock size={18} color={notifications.pushEnabled ? colors.error : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.pushEnabled && styles.settingTextDisabled]}>
                Ablaufende Artikel
              </Text>
            </View>
            <Switch
              value={notifications.pushExpiryAlerts}
              onValueChange={() => handleToggle('pushExpiryAlerts')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.pushExpiryAlerts && notifications.pushEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.pushEnabled && styles.settingDisabled]}>
            <View style={styles.settingInfo}>
              <ShoppingCart size={18} color={notifications.pushEnabled ? colors.success : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.pushEnabled && styles.settingTextDisabled]}>
                Bestellungsaktualisierungen
              </Text>
            </View>
            <Switch
              value={notifications.pushOrderUpdates}
              onValueChange={() => handleToggle('pushOrderUpdates')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.pushOrderUpdates && notifications.pushEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.pushEnabled && styles.settingDisabled, styles.settingRowLast]}>
            <View style={styles.settingInfo}>
              <Bell size={18} color={notifications.pushEnabled ? colors.primary : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.pushEnabled && styles.settingTextDisabled]}>
                Systembenachrichtigungen
              </Text>
            </View>
            <Switch
              value={notifications.pushSystemAlerts}
              onValueChange={() => handleToggle('pushSystemAlerts')}
              disabled={!notifications.pushEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.pushSystemAlerts && notifications.pushEnabled ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>E-Mail-Benachrichtigungen</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>E-Mail-Benachrichtigungen aktivieren</Text>
            <Switch
              value={notifications.emailEnabled}
              onValueChange={() => handleToggle('emailEnabled')}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.emailEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.emailEnabled && styles.settingDisabled]}>
            <Text style={[styles.settingSubLabel, !notifications.emailEnabled && styles.settingTextDisabled]}>
              Tägliche Zusammenfassung
            </Text>
            <Switch
              value={notifications.emailDailyDigest}
              onValueChange={() => handleToggle('emailDailyDigest')}
              disabled={!notifications.emailEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.emailDailyDigest && notifications.emailEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.emailEnabled && styles.settingDisabled]}>
            <Text style={[styles.settingSubLabel, !notifications.emailEnabled && styles.settingTextDisabled]}>
              Bestellungsbestätigungen
            </Text>
            <Switch
              value={notifications.emailOrderConfirmations}
              onValueChange={() => handleToggle('emailOrderConfirmations')}
              disabled={!notifications.emailEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.emailOrderConfirmations && notifications.emailEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.emailEnabled && styles.settingDisabled, styles.settingRowLast]}>
            <Text style={[styles.settingSubLabel, !notifications.emailEnabled && styles.settingTextDisabled]}>
              System-Updates
            </Text>
            <Switch
              value={notifications.emailSystemUpdates}
              onValueChange={() => handleToggle('emailSystemUpdates')}
              disabled={!notifications.emailEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.emailSystemUpdates && notifications.emailEnabled ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>In-App-Benachrichtigungen</Text>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>In-App-Benachrichtigungen aktivieren</Text>
            <Switch
              value={notifications.inAppEnabled}
              onValueChange={() => handleToggle('inAppEnabled')}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.inAppEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.inAppEnabled && styles.settingDisabled]}>
            <View style={styles.settingInfo}>
              <AlertTriangle size={18} color={notifications.inAppEnabled ? colors.warning : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.inAppEnabled && styles.settingTextDisabled]}>
                Niedriger Bestand
              </Text>
            </View>
            <Switch
              value={notifications.inAppLowStock}
              onValueChange={() => handleToggle('inAppLowStock')}
              disabled={!notifications.inAppEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.inAppLowStock && notifications.inAppEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.inAppEnabled && styles.settingDisabled]}>
            <View style={styles.settingInfo}>
              <Clock size={18} color={notifications.inAppEnabled ? colors.error : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.inAppEnabled && styles.settingTextDisabled]}>
                Ablaufende Artikel
              </Text>
            </View>
            <Switch
              value={notifications.inAppExpiryAlerts}
              onValueChange={() => handleToggle('inAppExpiryAlerts')}
              disabled={!notifications.inAppEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.inAppExpiryAlerts && notifications.inAppEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.inAppEnabled && styles.settingDisabled]}>
            <View style={styles.settingInfo}>
              <ShoppingCart size={18} color={notifications.inAppEnabled ? colors.success : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.inAppEnabled && styles.settingTextDisabled]}>
                Bestellungsaktualisierungen
              </Text>
            </View>
            <Switch
              value={notifications.inAppOrderUpdates}
              onValueChange={() => handleToggle('inAppOrderUpdates')}
              disabled={!notifications.inAppEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.inAppOrderUpdates && notifications.inAppEnabled ? colors.primary : colors.card}
            />
          </View>
          
          <View style={[styles.settingRow, !notifications.inAppEnabled && styles.settingDisabled, styles.settingRowLast]}>
            <View style={styles.settingInfo}>
              <Bell size={18} color={notifications.inAppEnabled ? colors.primary : colors.textSecondary} />
              <Text style={[styles.settingSubLabel, !notifications.inAppEnabled && styles.settingTextDisabled]}>
                Systembenachrichtigungen
              </Text>
            </View>
            <Switch
              value={notifications.inAppSystemAlerts}
              onValueChange={() => handleToggle('inAppSystemAlerts')}
              disabled={!notifications.inAppEnabled}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={notifications.inAppSystemAlerts && notifications.inAppEnabled ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Einstellungen speichern"
            onPress={handleSave}
            variant="primary"
            isLoading={isLoading}
            fullWidth
          />
        </View>
        
        <Text style={styles.hint}>
          Einige Benachrichtigungen können je nach Ihrer Rolle und Abteilung nicht deaktiviert werden.
        </Text>
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
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingDisabled: {
    opacity: 0.6,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingSubLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  settingTextDisabled: {
    color: colors.textSecondary,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
});