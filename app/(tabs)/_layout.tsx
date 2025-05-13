import React from 'react';
import { Tabs } from 'expo-router';
import { useThemeStore } from '@/stores/theme-store';
import { colors } from '@/constants/colors';
import { Home, Package, Scan, User } from 'lucide-react-native';

export default function TabLayout() {
  const { isDarkMode } = useThemeStore();
  
  // Get theme-appropriate colors
  const backgroundColor = isDarkMode ? colors.themed('tabBar') : colors.tabBar;
  const activeTintColor = isDarkMode ? colors.themed('tabBarActive') : colors.tabBarActive;
  const inactiveTintColor = isDarkMode ? colors.themed('tabBarInactive') : colors.tabBarInactive;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: { 
          backgroundColor: backgroundColor,
          borderTopColor: isDarkMode ? colors.themed('border') : colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: isDarkMode ? colors.themed('card') : colors.card,
        },
        headerTintColor: isDarkMode ? colors.themed('text') : colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventar',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Bestellungen',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scannen',
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}