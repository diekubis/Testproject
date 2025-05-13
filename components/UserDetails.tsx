import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, Switch } from 'react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { User, Mail, Building, Shield, Clock, AlertTriangle, Check, X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type UserDetailsProps = {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    avatar?: string;
    isActive: boolean;
    lastLogin?: string | null;
    createdAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onResetPassword: () => void;
};

type Activity = {
  id: string;
  type: string;
  description: string;
  timestamp: string | null;
};

export default function UserDetails({ 
  user, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onResetPassword
}: UserDetailsProps) {
  const router = useRouter();
  const [showDangerZone, setShowDangerZone] = useState(false);
  
  // Mock activities for the user
  const activities: Activity[] = [
    {
      id: '1',
      type: 'login',
      description: 'Anmeldung im System',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'inventory',
      description: 'Bestand von "Paracetamol 500mg" aktualisiert',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'order',
      description: 'Bestellung #12345 erstellt',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  
  const handleDelete = () => {
    Alert.alert(
      "Benutzer löschen",
      `Möchten Sie den Benutzer "${user.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`,
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Löschen",
          onPress: onDelete,
          style: "destructive"
        }
      ]
    );
  };
  
  const handleToggleStatus = () => {
    Alert.alert(
      user.isActive ? "Benutzer sperren" : "Benutzer aktivieren",
      user.isActive 
        ? `Möchten Sie den Benutzer "${user.name}" sperren? Der Benutzer kann sich nicht mehr anmelden, bis er wieder aktiviert wird.`
        : `Möchten Sie den Benutzer "${user.name}" aktivieren? Der Benutzer kann sich dann wieder anmelden.`,
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: user.isActive ? "Sperren" : "Aktivieren",
          onPress: onToggleStatus
        }
      ]
    );
  };
  
  const handleResetPassword = () => {
    Alert.alert(
      "Passwort zurücksetzen",
      `Möchten Sie das Passwort für "${user.name}" zurücksetzen?`,
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Zurücksetzen",
          onPress: onResetPassword
        }
      ]
    );
  };
  
  // Helper function to format dates - fixed to accept undefined
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Nie";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Translate role to German
  const translateRole = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'doctor': return 'Arzt';
      case 'nurse': return 'Pfleger';
      case 'pharmacist': return 'Apotheker';
      case 'logistics': return 'Logistik';
      default: return role;
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {user.isActive ? (
            <>
              <View style={styles.statusIndicatorActive} />
              <Text style={styles.statusTextActive}>Aktiv</Text>
            </>
          ) : (
            <>
              <View style={styles.statusIndicatorInactive} />
              <Text style={styles.statusTextInactive}>Inaktiv</Text>
            </>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.infoItem}>
            <User size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{user.name}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Mail size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>E-Mail:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Building size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Abteilung:</Text>
            <Text style={styles.infoValue}>{user.department}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Shield size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Rolle:</Text>
            <Text style={styles.infoValue}>{translateRole(user.role)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Erstellt am:</Text>
            <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Letzte Anmeldung:</Text>
            <Text style={styles.infoValue}>{formatDate(user.lastLogin)}</Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Bearbeiten"
            onPress={onEdit}
            fullWidth
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Letzte Aktivitäten</Text>
        
        {activities.length > 0 ? (
          <View style={styles.activitiesList}>
            {activities.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>{formatDate(activity.timestamp)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noActivities}>Keine Aktivitäten vorhanden</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kontostatus</Text>
        
        <View style={styles.statusToggleContainer}>
          <View>
            <Text style={styles.statusToggleLabel}>
              Benutzerkonto ist {user.isActive ? 'aktiv' : 'gesperrt'}
            </Text>
            <Text style={styles.statusToggleDescription}>
              {user.isActive 
                ? 'Der Benutzer kann sich anmelden und die App verwenden.' 
                : 'Der Benutzer kann sich nicht anmelden und die App nicht verwenden.'}
            </Text>
          </View>
          <Switch
            value={user.isActive}
            onValueChange={handleToggleStatus}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={user.isActive ? colors.primary : '#f4f3f4'}
          />
        </View>
        
        <Button
          title="Passwort zurücksetzen"
          onPress={handleResetPassword}
          variant="outline"
          fullWidth
          style={styles.resetPasswordButton}
        />
      </View>
      
      <Pressable
        style={[
          styles.dangerZoneHeader,
          { 
            borderBottomLeftRadius: showDangerZone ? 0 : 12,
            borderBottomRightRadius: showDangerZone ? 0 : 12
          }
        ]}
        onPress={() => setShowDangerZone(!showDangerZone)}
      >
        <View style={styles.dangerZoneTitleContainer}>
          <AlertTriangle size={20} color={colors.error} style={styles.dangerZoneIcon} />
          <Text style={styles.dangerZoneTitle}>Gefahrenzone</Text>
        </View>
        {showDangerZone ? (
          <ChevronUp size={20} color={colors.text} />
        ) : (
          <ChevronDown size={20} color={colors.text} />
        )}
      </Pressable>
      
      {showDangerZone && (
        <View style={styles.dangerZoneContent}>
          <Text style={styles.dangerZoneDescription}>
            Das Löschen eines Benutzerkontos ist endgültig und kann nicht rückgängig gemacht werden.
            Alle mit diesem Konto verknüpften Daten werden gelöscht.
          </Text>
          <Button
            title="Benutzer löschen"
            onPress={handleDelete}
            variant="danger"
            fullWidth
          />
        </View>
      )}
    </ScrollView>
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
  header: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicatorActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusIndicatorInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    marginRight: 6,
  },
  statusTextActive: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
  },
  statusTextInactive: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  userInfo: {
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    width: 120,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 8,
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
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  activityDescription: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noActivities: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  statusToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusToggleLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusToggleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    maxWidth: '80%',
  },
  resetPasswordButton: {
    marginTop: 8,
  },
  dangerZoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.error}15`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dangerZoneTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerZoneIcon: {
    marginRight: 8,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  dangerZoneContent: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: `${colors.error}30`,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dangerZoneDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
});