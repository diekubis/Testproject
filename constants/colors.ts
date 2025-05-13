// Color palette for the app
import { useColorScheme } from 'react-native';
import { useThemeStore } from '@/stores/theme-store';

// Light theme colors
const lightColors = {
  // Primary colors
  primary: '#3B82F6', // Blue
  secondary: '#10B981', // Green
  
  // UI colors
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Specific UI elements
  tabBar: '#FFFFFF',
  tabBarActive: '#3B82F6',
  tabBarInactive: '#9CA3AF',
  
  // Gradients
  gradientStart: '#3B82F6',
  gradientEnd: '#2563EB',
};

// Dark theme colors
const darkColors = {
  // Primary colors
  primary: '#60A5FA', // Lighter blue for dark mode
  secondary: '#34D399', // Lighter green for dark mode
  
  // UI colors
  background: '#111827', // Dark background
  card: '#1F2937', // Dark card
  text: '#F9FAFB', // Light text
  textSecondary: '#D1D5DB', // Light secondary text
  border: '#374151', // Dark border
  
  // Status colors
  success: '#34D399', // Lighter green for dark mode
  warning: '#FBBF24', // Lighter amber for dark mode
  error: '#F87171', // Lighter red for dark mode
  info: '#60A5FA', // Lighter blue for dark mode
  
  // Specific UI elements
  tabBar: '#1F2937', // Dark tab bar
  tabBarActive: '#60A5FA', // Lighter blue for active tab
  tabBarInactive: '#9CA3AF', // Same as light mode
  
  // Gradients
  gradientStart: '#60A5FA',
  gradientEnd: '#3B82F6',
};

// Export a function to get the current theme colors
export const useColors = () => {
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  return isDarkMode ? darkColors : lightColors;
};

// Export the colors for places where hooks can't be used
export const colors = {
  ...lightColors,
  
  // This function should be used in components to get the current theme colors
  themed: (colorName: keyof typeof lightColors) => {
    const isDarkMode = useThemeStore.getState().isDarkMode;
    return isDarkMode ? darkColors[colorName] : lightColors[colorName];
  }
};