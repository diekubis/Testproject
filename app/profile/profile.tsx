import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import { 
  User, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Shield,
  FileText,
  Building,
  Database,
  Server,
  Users
} from 'lucide-react-native';
import { translations } from '@/constants/localization';
import { UserRole } from '@/types/inventory';

// Define the menu item type with optional requiredPermission
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  requiredPermission?: string;
}

// Define the section type
interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, hasPermission } = useAuthStore();
  
  const handleLogout = () => {
    Alert.alert(
      translations.auth.logout,
      translations.auth.confirmLogout,
      [
        {
          text: translations.common.cancel,
          style: 'cancel',
        },
        {
          text: translations.auth.logout,
          onPress: () => {
            logout();
            router.replace('/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const menuItems: MenuSection[] = [
    {
      title: translations.profile.account,
      items: [
        {
          icon: <User size={20} color={colors.primary} />,
          label: translations.profile.personalInfo,
          onPress: () => router.push('/profile/personal'),
        },
        {
          icon: <Settings size={20} color={colors.primary} />,
          label: translations.profile.preferences,
          onPress: () => router.push('/profile/preferences'),
        },
        {
          icon: <Bell size={20} color={colors.primary} />,
          label: translations.profile.notifications,
          onPress: () => router.push('/profile/notifications'),
        },
      ],
    },
    {
      title: translations.profile.organization,
      items: [
        {
          icon: <Building size={20} color={colors.primary} />,
          label: translations.profile.departmentInfo,
          onPress: () => router.push('/profile/department'),
          requiredPermission: 'canViewInventory',
        },
        {
          icon: <Shield size={20} color={colors.primary} />,
          label: translations.profile.rolesPermissions,
          onPress: () => router.push('/profile/roles'),
          requiredPermission: 'canManageRoles',
        },
        {
          icon: <Database size={20} color={colors.primary} />,
          label: translations.profile.sapSettings,
          onPress: () => router.push('/profile/sap-settings'),
          requiredPermission: 'canConfigureSAP',
        },
        {
          icon: <Server size={20} color={colors.primary} />,
          label: translations.profile.apiSettings,
          onPress: () => router.push('/profile/api-settings'),
          requiredPermission: 'canAccessAPI',
        },
        // Nur für Administratoren sichtbar
        {
          icon: <Users size={20} color={colors.primary} />,
          label: translations.profile.userManagement,
          onPress: () => router.push('/admin/users'),
          requiredPermission: 'canManageUsers',
        },
      ],
    },
    {
      title: translations.profile.support,
      items: [
        {
          icon: <HelpCircle size={20} color={colors.primary} />,
          label: translations.profile.helpSupport,
          onPress: () => router.push('/profile/help'),
        },
        {
          icon: <FileText size={20} color={colors.primary} />,
          label: translations.profile.termsPrivacy,
          onPress: () => router.push('/profile/terms'),
        },
      ],
    },
  ];
  
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
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
            style={styles.profileImage}
            contentFit="cover"
          />
        </View>
        
        <Text style={styles.name}>{user?.name || 'Benutzername'}</Text>
        <Text style={styles.role}>{translateRole(user?.role || '')} • {user?.department || 'Abteilung'}</Text>
        
        <Button
          title={translations.profile.editProfile}
          onPress={() => router.push('/profile/edit')}
          variant="outline"
          size="small"
        />
      </View>
      
      {menuItems.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          <View style={styles.menuContainer}>
            {section.items
              .filter(item => !item.requiredPermission || hasPermission(item.requiredPermission as any))
              .map((item, itemIndex, filteredItems) => (
                <Pressable
                  key={itemIndex}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    itemIndex === filteredItems.length - 1 && styles.menuItemLast,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemIcon}>
                    {item.icon}
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </Pressable>
              ))}
          </View>
        </View>
      ))}
      
      <View style={styles.logoutContainer}>
        <Button
          title={translations.auth.logout}
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={18} color={colors.error} />}
          fullWidth
        />
      </View>
      
      <Text style={styles.version}>{translations.common.version} 1.0.0</Text>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.border,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemPressed: {
    backgroundColor: `${colors.primary}05`,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});