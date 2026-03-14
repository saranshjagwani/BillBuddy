// ==========================================
// src/app/App.tsx
// ==========================================
// Main entry point for the React Native application.
// This component sets up the navigation, theme, and global providers.

import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import AppProviders from "./Provider/AppProviders";

/**
 * @component App
 * @description The root entry point of the application.
 * Responsibilities:
 * 1. System UI: Syncs the StatusBar style with the current theme.
 * 2. Routing: Bootstraps the main navigation tree via NavigationContainer.
 * 3. Providers: Wraps the app with global providers for theme, loading, etc.
 */
export default function App() {
  // HOOKS: Detect the device's system color scheme (light, dark, or null)
  const colorScheme = useColorScheme();

  // CONSTANTS: Determine if dark mode is active and set status bar style accordingly
  const isDarkMode = colorScheme === "dark";
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <>
      {/* THEME PROVIDER: Provides theme context to the entire app for dynamic theming */}
      <NavigationContainer>
        {/* STATUS BAR: Controls the appearance of system UI elements like clock and battery */}
        <StatusBar style={statusBarStyle} />
        {/* APP PROVIDERS: Wraps the app with global providers for state management, theming, etc. */}
        <AppProviders />
      </NavigationContainer>
    </>
  );
}
