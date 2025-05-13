import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Search, Plus, Filter, User, ChevronRight, X } from 'lucide-react-native';
import Button from '@/components/Button';
import UserForm from '@/components/UserForm';
import UserDetails from '@/components/UserDetails';
import { useAuthStore } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';

type User = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
};

type FilterOptions = {
  role: string | null;
  status: 'all' | 'active' | 'inactive';
};

export default function UsersScreen() {
  const router = useRouter();
  const { user: currentUser, hasPermission } = useAuthStore();
  
  // Use the user store instead of local state
  const { users, addUser, updateUser, deleteUser, toggleUserStatus } = useUserStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    role: null,
    status: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if current user has permission to manage users
  useEffect(() => {
    if (!hasPermission('canManageUsers')) {
      Alert.alert(
        "Zugriff verweigert",
        "Sie haben keine Berechtigung, auf die Benutzerverwaltung zuzugreifen.",
        [
          { text: "OK", onPress: () => router.back() }
        ]
      );
    }
  }, [currentUser, router, hasPermission]);
  
  // Filter and search users
  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply role filter
    const matchesRole = filterOptions.role === null || user.role === filterOptions.role;
    
    // Apply status filter
    const matchesStatus = 
      filterOptions.status === 'all' || 
      (filterOptions.status === 'active' && user.isActive) ||
      (filterOptions.status === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const handleAddUser = (newUser: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    // Use the addUser function from the store
    const newUserId = addUser(newUser);
    setShowAddUser(false);
    
    Alert.alert(
      "Erfolg",
      `Benutzer "${newUser.name}" wurde erfolgreich erstellt.`,
      [{ text: "OK" }]
    );
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    // Use the updateUser function from the store
    updateUser(updatedUser);
    setSelectedUser(updatedUser);
    setEditMode(false);
    
    Alert.alert(
      "Erfolg",
      `Benutzer "${updatedUser.name}" wurde erfolgreich aktualisiert.`,
      [{ text: "OK" }]
    );
  };
  
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Use the deleteUser function from the store
    deleteUser(selectedUser.id);
    setSelectedUser(null);
    setShowUserDetails(false);
    
    Alert.alert(
      "Erfolg",
      `Benutzer "${selectedUser.name}" wurde erfolgreich gelöscht.`,
      [{ text: "OK" }]
    );
  };
  
  const handleToggleUserStatus = () => {
    if (!selectedUser) return;
    
    // Use the toggleUserStatus function from the store
    toggleUserStatus(selectedUser.id);
    
    // Find the updated user to update the selected user state
    const updatedUser = users.find(u => u.id === selectedUser.id);
    if (updatedUser) {
      setSelectedUser(updatedUser);
    }
    
    Alert.alert(
      "Erfolg",
      `Benutzer "${selectedUser.name}" wurde erfolgreich ${updatedUser?.isActive ? 'aktiviert' : 'gesperrt'}.`,
      [{ text: "OK" }]
    );
  };
  
  const handleResetPassword = () => {
    if (!selectedUser) return;
    
    // In a real app, this would generate a new password or send a reset link
    Alert.alert(
      "Erfolg",
      `Das Passwort für "${selectedUser.name}" wurde zurückgesetzt. Ein temporäres Passwort wurde an ${selectedUser.email} gesendet.`,
      [{ text: "OK" }]
    );
  };
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };
  
  const handleEditUser = () => {
    setEditMode(true);
  };
  
  const renderUserItem = ({ item }: { item: User }) => (
    <Pressable
      style={({ pressed }) => [
        styles.userItem,
        pressed && styles.userItemPressed
      ]}
      onPress={() => handleSelectUser(item)}
    >
      <View style={styles.userItemContent}>
        <View style={[
          styles.statusIndicator,
          item.isActive ? styles.statusActive : styles.statusInactive
        ]} />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userDetails}>
            {translateRole(item.role)} • {item.department}
          </Text>
        </View>
        
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>
    </Pressable>
  );
  
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
  
  // Get available roles for filter
  const availableRoles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'doctor', name: 'Arzt' },
    { id: 'nurse', name: 'Pfleger' },
    { id: 'pharmacist', name: 'Apotheker' },
    { id: 'logistics', name: 'Logistik' },
  ];
  
  if (showAddUser) {
    return (
      <>
        <Stack.Screen 
          options={{
            title: "Neuer Benutzer",
            headerBackTitle: "Zurück",
          }}
        />
        
        <UserForm 
          onSubmit={handleAddUser}
          onCancel={() => setShowAddUser(false)}
        />
      </>
    );
  }
  
  if (showUserDetails && selectedUser) {
    if (editMode) {
      return (
        <>
          <Stack.Screen 
            options={{
              title: "Benutzer bearbeiten",
              headerBackTitle: "Zurück",
            }}
          />
          
          <UserForm 
            user={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditMode(false)}
            isEdit
          />
        </>
      );
    }
    
    return (
      <>
        <Stack.Screen 
          options={{
            title: selectedUser.name,
            headerBackTitle: "Zurück",
          }}
        />
        
        <UserDetails 
          user={selectedUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleUserStatus}
          onResetPassword={handleResetPassword}
        />
      </>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Benutzerverwaltung",
          headerRight: () => (
            <Pressable
              style={styles.addButton}
              onPress={() => setShowAddUser(true)}
            >
              <Plus size={24} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Benutzer suchen..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery !== '' && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
          
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={colors.primary} />
          </Pressable>
        </View>
        
        {showFilters && (
          <View style={styles.filtersContainer}>
            <Text style={styles.filterTitle}>Filter</Text>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Rolle</Text>
              <View style={styles.filterOptions}>
                <Pressable
                  style={[
                    styles.filterOption,
                    filterOptions.role === null && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilterOptions({ ...filterOptions, role: null })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.role === null && styles.filterOptionTextSelected
                  ]}>Alle</Text>
                </Pressable>
                
                {availableRoles.map(role => (
                  <Pressable
                    key={role.id}
                    style={[
                      styles.filterOption,
                      filterOptions.role === role.id && styles.filterOptionSelected
                    ]}
                    onPress={() => setFilterOptions({ ...filterOptions, role: role.id })}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filterOptions.role === role.id && styles.filterOptionTextSelected
                    ]}>{role.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              <View style={styles.filterOptions}>
                <Pressable
                  style={[
                    styles.filterOption,
                    filterOptions.status === 'all' && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilterOptions({ ...filterOptions, status: 'all' })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.status === 'all' && styles.filterOptionTextSelected
                  ]}>Alle</Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.filterOption,
                    filterOptions.status === 'active' && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilterOptions({ ...filterOptions, status: 'active' })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.status === 'active' && styles.filterOptionTextSelected
                  ]}>Aktiv</Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.filterOption,
                    filterOptions.status === 'inactive' && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilterOptions({ ...filterOptions, status: 'inactive' })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterOptions.status === 'inactive' && styles.filterOptionTextSelected
                  ]}>Inaktiv</Text>
                </Pressable>
              </View>
            </View>
            
            <Button
              title="Filter zurücksetzen"
              onPress={() => {
                setFilterOptions({ role: null, status: 'all' });
                setSearchQuery('');
              }}
              variant="outline"
              fullWidth
            />
          </View>
        )}
        
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {filteredUsers.length} {filteredUsers.length === 1 ? 'Benutzer' : 'Benutzer'}
            </Text>
          </View>
          
          {filteredUsers.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={40} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>Keine Benutzer gefunden</Text>
              <Text style={styles.emptyStateDescription}>
                Passen Sie Ihre Suchkriterien an oder erstellen Sie einen neuen Benutzer.
              </Text>
              <View style={styles.emptyStateButton}>
                <Button
                  title="Neuen Benutzer erstellen"
                  onPress={() => setShowAddUser(true)}
                />
              </View>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
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
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  filterOptionTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  userItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  userItemPressed: {
    opacity: 0.7,
  },
  userItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  statusActive: {
    backgroundColor: colors.success,
  },
  statusInactive: {
    backgroundColor: colors.error,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    marginTop: 8,
  },
});