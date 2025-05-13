import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { translations } from '@/constants/localization';
import { 
  User, Settings, Bell, Building, Shield, Database, Server, 
  HelpCircle, FileText, Users, Cloud
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, hasPermission } = useAuthStore();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nicht angemeldet</Text>
      </View>
    );
  }
  
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };
  
  const navigateTo = (route: string) => {
    router.push(route);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.department} • {user.role}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => navigateTo('/profile/edit')}>
          <Text style={styles.editButtonText}>{translations.profile.editProfile}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{translations.profile.account}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/personal')}>
          <View style={styles.menuIconContainer}>
            <User size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.personalInfo}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/preferences')}>
          <View style={styles.menuIconContainer}>
            <Settings size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.preferences}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/notifications')}>
          <View style={styles.menuIconContainer}>
            <Bell size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.notifications}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{translations.profile.organization}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/department')}>
          <View style={styles.menuIconContainer}>
            <Building size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.departmentInfo}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/roles')}>
          <View style={styles.menuIconContainer}>
            <Shield size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.rolesPermissions}</Text>
        </TouchableOpacity>
        
        {hasPermission('canConfigureSAP') && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/sap-settings')}>
            <View style={styles.menuIconContainer}>
              <Database size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>{translations.profile.sapSettings}</Text>
          </TouchableOpacity>
        )}
        
        {hasPermission('canAccessAPI') && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/api-settings')}>
            <View style={styles.menuIconContainer}>
              <Server size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>{translations.profile.apiSettings}</Text>
          </TouchableOpacity>
        )}
        
        {hasPermission('canConfigureSystem') && (
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/azure-settings')}>
            <View style={styles.menuIconContainer}>
              <Cloud size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Azure Blob Storage</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{translations.profile.support}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/help')}>
          <View style={styles.menuIconContainer}>
            <HelpCircle size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.helpSupport}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/profile/terms')}>
          <View style={styles.menuIconContainer}>
            <FileText size={20} color={colors.primary} />
          </View>
          <Text style={styles.menuItemText}>{translations.profile.termsPrivacy}</Text>
        </TouchableOpacity>
      </View>
      
      {hasPermission('canManageUsers') && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Administration</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('/admin/users')}>
            <View style={styles.menuIconContainer}>
              <Users size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>{translations.profile.userManagement}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{translations.auth.logout}</Text>
      </TouchableOpacity>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{translations.common.version} 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${colors.primary}20`,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: `${colors.error}10`,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
  },
});