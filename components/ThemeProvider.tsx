import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/theme-store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { setDarkMode } = useThemeStore();
  
  // Initialize theme based on system preference if not already set
  useEffect(() => {
    const storedTheme = useThemeStore.getState().isDarkMode;
    
    // If theme hasn't been explicitly set by user, follow system
    if (storedTheme === undefined) {
      setDarkMode(systemColorScheme === 'dark');
    }
  }, []);
  
  return <>{children}</>;
}