import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      
      toggleDarkMode: () => set((state) => ({ 
        isDarkMode: !state.isDarkMode 
      })),
      
      setDarkMode: (isDark: boolean) => set({ 
        isDarkMode: isDark 
      }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to initialize theme based on system preference
export const useInitializeTheme = () => {
  const colorScheme = useColorScheme();
  const { isDarkMode, setDarkMode } = useThemeStore();
  
  // This function can be called in the app's entry point
  const initializeTheme = () => {
    // Only set the theme if it hasn't been explicitly set by the user
    if (isDarkMode === undefined) {
      setDarkMode(colorScheme === 'dark');
    }
  };
  
  return { initializeTheme };
};