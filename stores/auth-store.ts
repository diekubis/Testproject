import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@/types/inventory';
import { useUserStore } from './user-store';

// Mock user data for testing
const mockUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Schmidt',
    email: 'sarah.schmidt@klinik.de',
    department: 'Kardiologie',
    role: 'doctor' as UserRole,
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2023-01-15T08:30:00.000Z',
    permissions: {},
    password: '1234', // Added for demo purposes
    phone: '+49 123 456789',
    address: 'Musterstraße 1, 10115 Berlin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Thomas Müller',
    email: 'thomas.mueller@klinik.de',
    department: 'Pflege',
    role: 'nurse' as UserRole,
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-02-10T10:15:00.000Z',
    permissions: {},
    password: '1234', // Added for demo purposes
    phone: '+49 123 456790',
    address: 'Hauptstraße 42, 10559 Berlin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Markus Schneider',
    email: 'markus.schneider@klinik.de',
    department: 'IT',
    role: 'admin' as UserRole,
    isActive: true,
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: '2022-09-01T11:30:00.000Z',
    permissions: {},
    password: '1234', // Added for demo purposes
    phone: '+49 123 456791',
    address: 'Technikstraße 5, 10997 Berlin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop'
  },
];

// Define the central role permissions mapping
export const rolePermissions = {
  admin: {
    canViewInventory: true,
    canModifyInventory: true,
    canCreateOrders: true,
    canApproveOrders: true,
    canViewReports: true,
    canExportReports: true,
    canManageUsers: true,
    canManageRoles: true,
    canAccessAdminPanel: true,
    canConfigureSystem: true,
    canAccessAPI: true,
    canConfigureSAP: true,
  },
  doctor: {
    canViewInventory: true,
    canModifyInventory: false,
    canCreateOrders: true,
    canApproveOrders: false,
    canViewReports: true,
    canExportReports: false,
    canManageUsers: false,
    canManageRoles: false,
    canAccessAdminPanel: false,
    canConfigureSystem: false,
    canAccessAPI: false,
    canConfigureSAP: false,
  },
  nurse: {
    canViewInventory: true,
    canModifyInventory: true,
    canCreateOrders: true,
    canApproveOrders: false,
    canViewReports: false,
    canExportReports: false,
    canManageUsers: false,
    canManageRoles: false,
    canAccessAdminPanel: false,
    canConfigureSystem: false,
    canAccessAPI: false,
    canConfigureSAP: false,
  },
  pharmacist: {
    canViewInventory: true,
    canModifyInventory: true,
    canCreateOrders: true,
    canApproveOrders: true,
    canViewReports: true,
    canExportReports: true,
    canManageUsers: false,
    canManageRoles: false,
    canAccessAdminPanel: false,
    canConfigureSystem: false,
    canAccessAPI: false,
    canConfigureSAP: false,
  },
  logistics: {
    canViewInventory: true,
    canModifyInventory: true,
    canCreateOrders: true,
    canApproveOrders: false,
    canViewReports: true,
    canExportReports: true,
    canManageUsers: false,
    canManageRoles: false,
    canAccessAdminPanel: false,
    canConfigureSystem: false,
    canAccessAPI: false,
    canConfigureSAP: false,
  }
};

// Map permission IDs from the UI to the central permission system
export const permissionMapping: { [key: string]: keyof typeof rolePermissions.admin } = {
  'inventar_ansehen': 'canViewInventory',
  'inventar_anpassen': 'canModifyInventory',
  'bestellung_erstellen': 'canCreateOrders',
  'bestellung_genehmigen': 'canApproveOrders',
  'berichte_ansehen': 'canViewReports',
  'berichte_exportieren': 'canExportReports',
  'benutzer_verwalten': 'canManageUsers',
  'rollen_verwalten': 'canManageRoles',
  'einstellungen_aendern': 'canConfigureSystem',
  'api_zugriff': 'canAccessAPI',
  'sap_integration': 'canConfigureSAP',
};

// Extended User type with permissions
interface UserWithPermissions extends User {
  permissions: {
    [key: string]: boolean;
  };
  password?: string; // Added for authentication
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthState {
  user: UserWithPermissions | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserRole: (role: UserRole) => Promise<void>;
  updateUserPermissions: (permissions: { [key: string]: boolean }) => Promise<void>;
  updateUserProfile: (userData: Partial<UserWithPermissions>) => Promise<void>;
  hasPermission: (permission: keyof typeof rolePermissions.admin) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get all users from user-store
          const storeUsers = useUserStore.getState().users;
          
          // Combine mock users and store users for authentication
          // This ensures both predefined demo users and newly created users can log in
          const allUsers = [...mockUsers];
          
          // Add users from user-store that aren't already in mockUsers
          storeUsers.forEach(storeUser => {
            // Check if this user is already in our mockUsers array
            const existingUser = allUsers.find(u => u.id === storeUser.id);
            if (!existingUser) {
              // Add the user to our authentication pool
              allUsers.push({
                ...storeUser,
                permissions: {},
                // For demo purposes, if no password is set, use a default
                password: (storeUser as any).password || '1234'
              });
            }
          });
          
          // Find user by name or email
          const user = allUsers.find(u => 
            u.name.toLowerCase().includes(username.toLowerCase()) ||
            u.email.toLowerCase().includes(username.toLowerCase())
          );
          
          // Check if user exists and is active
          if (user && user.isActive) {
            // Check password (for demo purposes, we're using a simple check)
            // In a real app, you would use proper password hashing
            if (password.length >= 4 && (user.password === password || password === '1234')) {
              // Update last login time
              const updatedUser = {
                ...user,
                lastLogin: new Date().toISOString(),
                permissions: user.permissions || {}
              };
              
              // Update the user in user-store if they exist there
              const userInStore = storeUsers.find(u => u.id === user.id);
              if (userInStore) {
                useUserStore.getState().updateUser({
                  ...userInStore,
                  lastLogin: new Date().toISOString()
                });
              }
              
              set({ 
                user: updatedUser, 
                isAuthenticated: true, 
                isLoading: false,
                error: null
              });
            } else {
              set({ 
                error: 'Ungültiges Passwort', 
                isLoading: false,
                isAuthenticated: false,
                user: null
              });
            }
          } else if (user && !user.isActive) {
            set({ 
              error: 'Dieser Benutzer ist deaktiviert. Bitte kontaktieren Sie den Administrator.', 
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
          } else {
            set({ 
              error: 'Benutzer nicht gefunden', 
              isLoading: false,
              isAuthenticated: false,
              user: null
            });
          }
        } catch (error) {
          set({ 
            error: 'Bei der Anmeldung ist ein Fehler aufgetreten', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUserRole: async (role: UserRole) => {
        const { user } = get();
        if (!user) return;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set({
          user: {
            ...user,
            role
          }
        });
      },
      
      updateUserPermissions: async (permissions: { [key: string]: boolean }) => {
        const { user } = get();
        if (!user) return;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set({
          user: {
            ...user,
            permissions
          }
        });
      },
      
      updateUserProfile: async (userData: Partial<UserWithPermissions>) => {
        const { user } = get();
        if (!user) return;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const updatedUser = {
          ...user,
          ...userData
        };
        
        set({ user: updatedUser });
        
        // If this user also exists in the user store, update it there too
        const userStore = useUserStore.getState();
        const storeUser = userStore.users.find(u => u.id === user.id);
        
        if (storeUser) {
          userStore.updateUser({
            ...storeUser,
            name: updatedUser.name,
            email: updatedUser.email,
            // Add other fields that should be synced
            phone: updatedUser.phone,
            address: updatedUser.address,
            avatar: updatedUser.avatar
          });
        }
      },
      
      hasPermission: (permission: keyof typeof rolePermissions.admin) => {
        const { user } = get();
        if (!user) return false;
        
        // First check custom permissions if they exist
        if (user.permissions && permission in user.permissions) {
          return !!user.permissions[permission];
        }
        
        // Fall back to role-based permissions
        const roleBasedPermissions = rolePermissions[user.role as keyof typeof rolePermissions];
        return roleBasedPermissions ? !!roleBasedPermissions[permission] : false;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);