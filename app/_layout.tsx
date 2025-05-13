import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { ErrorBoundary } from "./error-boundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "@/stores/theme-store";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, user, hasPermission } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    // Check if the user is authenticated
    const inAuthGroup = segments[0] === "(tabs)";
    
    if (!isAuthenticated && inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace("/login");
    } else if (isAuthenticated && segments[0] === "login") {
      // Redirect to the home page if already authenticated
      router.replace("/");
    }
    
    // Check permissions for admin routes
    if (isAuthenticated && segments[0] === "admin" && !hasPermission('canManageUsers')) {
      // Redirect to home if trying to access admin routes without permission
      router.replace("/");
    }
  }, [isAuthenticated, segments, user?.role]);
  
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="inventory/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="orders/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="orders/new" options={{ headerShown: true }} />
        <Stack.Screen name="profile/edit" options={{ headerShown: true, title: "Profil bearbeiten" }} />
        <Stack.Screen name="profile/personal" options={{ headerShown: true, title: "Persönliche Informationen" }} />
        <Stack.Screen name="profile/preferences" options={{ headerShown: true, title: "Einstellungen" }} />
        <Stack.Screen name="profile/notifications" options={{ headerShown: true, title: "Benachrichtigungen" }} />
        <Stack.Screen name="profile/department" options={{ headerShown: true, title: "Abteilungsinformationen" }} />
        <Stack.Screen name="profile/roles" options={{ headerShown: true, title: "Rollen & Berechtigungen" }} />
        <Stack.Screen name="profile/sap-settings" options={{ headerShown: true, title: "SAP-Einstellungen" }} />
        <Stack.Screen name="profile/api-settings" options={{ headerShown: true, title: "API-Einstellungen" }} />
        <Stack.Screen name="profile/azure-settings" options={{ headerShown: true, title: "Azure Blob Storage" }} />
        <Stack.Screen name="profile/help" options={{ headerShown: true, title: "Hilfe & Support" }} />
        <Stack.Screen name="profile/terms" options={{ headerShown: true, title: "Nutzungsbedingungen" }} />
        <Stack.Screen name="admin/users" options={{ headerShown: true, title: "Benutzerverwaltung" }} />
      </Stack>
    </>
  );
}