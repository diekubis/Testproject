import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore, rolePermissions, permissionMapping } from '@/stores/auth-store';
import { Shield, Check, Info, AlertTriangle } from 'lucide-react-native';
import Button from '@/components/Button';
import { UserRole } from '@/types/inventory';

export default function RolesScreen() {
  const { user, updateUserRole, hasPermission } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(user?.role as UserRole || null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Reset selected role when user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role as UserRole);
    }
  }, [user]);
  
  // Check if user has permission to manage roles
  useEffect(() => {
    if (!hasPermission('canManageRoles')) {
      Alert.alert(
        "Zugriff verweigert",
        "Sie haben keine Berechtigung, Rollen und Berechtigungen zu verwalten.",
        [{ text: "OK" }]
      );
    }
  }, [hasPermission]);
  
  // Update hasChanges when selectedRole changes
  useEffect(() => {
    if (user) {
      setHasChanges(selectedRole !== user.role);
    }
  }, [selectedRole, user]);
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };
  
  const handleSaveChanges = async () => {
    if (!selectedRole || !hasChanges) return;
    
    setIsLoading(true);
    
    try {
      await updateUserRole(selectedRole);
      
      Alert.alert(
        "Erfolg",
        "Die Rolle wurde erfolgreich aktualisiert.",
        [{ text: "OK" }]
      );
      
      setHasChanges(false);
    } catch (error) {
      Alert.alert(
        "Fehler",
        "Es ist ein Fehler beim Aktualisieren der Rolle aufgetreten.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Available roles
  const availableRoles: { id: UserRole; name: string; description: string }[] = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Vollständiger Zugriff auf alle Funktionen und Einstellungen der Anwendung.',
    },
    {
      id: 'doctor',
      name: 'Arzt',
      description: 'Kann Inventar einsehen, Bestellungen erstellen und Berichte anzeigen.',
    },
    {
      id: 'nurse',
      name: 'Pfleger',
      description: 'Kann Inventar einsehen und anpassen sowie Bestellungen erstellen.',
    },
    {
      id: 'pharmacist',
      name: 'Apotheker',
      description: 'Kann Inventar verwalten, Bestellungen genehmigen und Berichte einsehen.',
    },
    {
      id: 'logistics',
      name: 'Logistik',
      description: 'Kann Inventar verwalten, Bestellungen erstellen und Berichte einsehen.',
    },
  ];
  
  // Group permissions by category
  const permissionCategories = [
    {
      id: 'inventory',
      name: 'Inventar',
      permissions: [
        { id: 'canViewInventory', name: 'Inventar einsehen' },
        { id: 'canModifyInventory', name: 'Inventar anpassen' },
      ],
    },
    {
      id: 'orders',
      name: 'Bestellungen',
      permissions: [
        { id: 'canCreateOrders', name: 'Bestellungen erstellen' },
        { id: 'canApproveOrders', name: 'Bestellungen genehmigen' },
      ],
    },
    {
      id: 'reports',
      name: 'Berichte',
      permissions: [
        { id: 'canViewReports', name: 'Berichte einsehen' },
        { id: 'canExportReports', name: 'Berichte exportieren' },
      ],
    },
    {
      id: 'admin',
      name: 'Administration',
      permissions: [
        { id: 'canManageUsers', name: 'Benutzer verwalten' },
        { id: 'canManageRoles', name: 'Rollen verwalten' },
        { id: 'canConfigureSystem', name: 'System konfigurieren' },
        { id: 'canAccessAPI', name: 'API-Zugriff' },
        { id: 'canConfigureSAP', name: 'SAP-Integration' },
      ],
    },
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: "Rollen & Berechtigungen" }} />
      
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rolle auswählen</Text>
            <Text style={styles.sectionDescription}>
              Die Rolle bestimmt, welche Funktionen und Bereiche der Anwendung für den Benutzer zugänglich sind.
            </Text>
            
            <View style={styles.rolesContainer}>
              {availableRoles.map((role) => (
                <Pressable
                  key={role.id}
                  style={[
                    styles.roleCard,
                    selectedRole === role.id && styles.roleCardSelected,
                  ]}
                  onPress={() => handleRoleSelect(role.id)}
                >
                  <View style={styles.roleHeader}>
                    <Shield 
                      size={20} 
                      color={selectedRole === role.id ? colors.primary : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.roleName,
                      selectedRole === role.id && styles.roleNameSelected,
                    ]}>
                      {role.name}
                    </Text>
                    
                    {selectedRole === role.id && (
                      <View style={styles.checkIcon}>
                        <Check size={18} color={colors.primary} />
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.roleDescription}>{role.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Berechtigungen</Text>
            <Text style={styles.sectionDescription}>
              Übersicht der Berechtigungen für die ausgewählte Rolle.
            </Text>
            
            <View style={styles.infoBox}>
              <Info size={20} color={colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Die Berechtigungen werden automatisch basierend auf der ausgewählten Rolle festgelegt.
                Individuelle Berechtigungen können nur von einem Administrator zugewiesen werden.
              </Text>
            </View>
            
            {permissionCategories.map((category) => (
              <View key={category.id} style={styles.permissionCategory}>
                <Text style={styles.categoryName}>{category.name}</Text>
                
                <View style={styles.permissionsContainer}>
                  {category.permissions.map((permission) => {
                    const hasPermission = selectedRole ? 
                      rolePermissions[selectedRole][permission.id as keyof typeof rolePermissions.admin] : 
                      false;
                    
                    return (
                      <View key={permission.id} style={styles.permissionItem}>
                        <View style={[
                          styles.permissionStatus,
                          hasPermission ? styles.permissionGranted : styles.permissionDenied,
                        ]}>
                          {hasPermission ? (
                            <Check size={16} color={colors.success} />
                          ) : (
                            <AlertTriangle size={16} color={colors.error} />
                          )}
                        </View>
                        
                        <Text style={styles.permissionName}>{permission.name}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        
        {/* Fixed footer with save button */}
        <View style={styles.footer}>
          <Button
            title="Änderungen speichern"
            onPress={handleSaveChanges}
            disabled={!hasChanges || isLoading}
            fullWidth
          />
          
          {isLoading && (
            <ActivityIndicator 
              style={styles.loader} 
              color={colors.primary} 
              size="small" 
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Add padding for the footer
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  rolesContainer: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleCardSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  roleNameSelected: {
    color: colors.primary,
  },
  checkIcon: {
    backgroundColor: `${colors.primary}20`,
    borderRadius: 12,
    padding: 2,
  },
  roleDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  permissionCategory: {
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  permissionsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  permissionStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  permissionGranted: {
    backgroundColor: `${colors.success}20`,
  },
  permissionDenied: {
    backgroundColor: `${colors.error}20`,
  },
  permissionName: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    paddingBottom: 24,
  },
  loader: {
    position: 'absolute',
    top: 16,
    right: 32,
  },
});