// ==========================================
// src/app/App.tsx
// ==========================================

import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

// --- Internal Modules ---
import { GlobalLoadingProvider } from "../shared/provider/GlobalLoadingProvider";
import RootNavigator from "../Navigator/RootNavigator";
import { AppThemeProvider } from "../shared/provider/AppThemeProvider";
import { ToastProvider } from "../ui/toast/ToastProvider";
import { ItemsProvider } from "../shared/provider/ItemsContext";

/**
 * @component App
 * @description The root entry point of the application.
 * * Responsibilities:
 * 1. System UI: Syncs the StatusBar style with the current theme.
 * 2. Routing: Bootstraps the main navigation tree via AppRouter.
 */
export default function App() {
  // 1. HOOKS: Detect the device's system color scheme (light, dark, or null)
  const colorScheme = useColorScheme();

  // 2. CONSTANTS: Logic for theme selection
  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <>
      {/* THEME PROVIDER: 
              Provides theme context to the entire app, allowing for dynamic theming. 
          */}
          
      <AppThemeProvider>
        <ToastProvider>
          <ItemsProvider>
        <NavigationContainer>
          {/* STATUS BAR: 
            Controls the clock, battery, and signal icons at the top of the screen. 
        */}
          <StatusBar style={statusBarStyle} />

          {/* ROUTING: 
            The gateway to all screens (Home, Profile, etc.). 
        */}
          <GlobalLoadingProvider>
            <RootNavigator />
          </GlobalLoadingProvider>
        </NavigationContainer>
        </ItemsProvider>
        </ToastProvider>
      </AppThemeProvider>
    </>
  );
}
