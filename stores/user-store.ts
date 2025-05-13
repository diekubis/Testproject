import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/inventory';

// Initial mock user data
const initialUsers = [
  {
    id: '1',
    name: 'Dr. Sarah Schmidt',
    email: 'sarah.schmidt@klinik.de',
    department: 'Kardiologie',
    role: 'doctor',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2023-01-15T08:30:00.000Z',
    password: '1234', // Added for authentication
  },
  {
    id: '2',
    name: 'Thomas Müller',
    email: 'thomas.mueller@klinik.de',
    department: 'Pflege',
    role: 'nurse',
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-02-10T10:15:00.000Z',
    password: '1234', // Added for authentication
  },
  {
    id: '3',
    name: 'Dr. Michael Weber',
    email: 'michael.weber@klinik.de',
    department: 'Neurologie',
    role: 'doctor',
    isActive: false,
    lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2022-11-05T14:20:00.000Z',
    password: '1234', // Added for authentication
  },
  {
    id: '4',
    name: 'Julia Becker',
    email: 'julia.becker@klinik.de',
    department: 'Apotheke',
    role: 'pharmacist',
    isActive: true,
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-03-20T09:45:00.000Z',
    password: '1234', // Added for authentication
  },
  {
    id: '5',
    name: 'Markus Schneider',
    email: 'markus.schneider@klinik.de',
    department: 'IT',
    role: 'admin',
    isActive: true,
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    createdAt: '2022-09-01T11:30:00.000Z',
    password: '1234', // Added for authentication
  },
  {
    id: '6',
    name: 'Anna Hoffmann',
    email: 'anna.hoffmann@klinik.de',
    department: 'Logistik',
    role: 'logistics',
    isActive: true,
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: '2023-04-12T13:10:00.000Z',
    password: '1234', // Added for authentication
  },
  {
    id: '7',
    name: 'Klaus Wagner',
    email: 'klaus.wagner@klinik.de',
    department: 'Einkauf',
    role: 'logistics',
    isActive: false,
    lastLogin: null,
    createdAt: '2023-05-18T15:25:00.000Z',
    password: '1234', // Added for authentication
  },
];

// Extended User type with password for authentication
interface UserWithAuth extends User {
  password?: string;
}

interface UserState {
  users: UserWithAuth[];
  addUser: (user: Omit<UserWithAuth, 'id' | 'createdAt' | 'lastLogin'>) => string;
  updateUser: (updatedUser: UserWithAuth) => void;
  deleteUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      
      addUser: (userData) => {
        const newUser: UserWithAuth = {
          ...userData,
          id: Date.now().toString(), // Generate a unique ID based on timestamp
          createdAt: new Date().toISOString(),
          lastLogin: null,
        };
        
        set((state) => ({
          users: [...state.users, newUser]
        }));
        
        return newUser.id;
      },
      
      updateUser: (updatedUser) => {
        set((state) => ({
          users: state.users.map(user => 
            user.id === updatedUser.id ? updatedUser : user
          )
        }));
      },
      
      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter(user => user.id !== userId)
        }));
      },
      
      toggleUserStatus: (userId) => {
        set((state) => ({
          users: state.users.map(user => 
            user.id === userId 
              ? { ...user, isActive: !user.isActive } 
              : user
          )
        }));
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);