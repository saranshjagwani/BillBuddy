// ==========================================
// src/app/App.tsx
// ==========================================


import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@react-navigation/native";

// --- Internal Modules ---
import AppRouter from "../router/AppRouter";
import { GlobalLoadingProvider } from "../shared/provider/GlobalLoadingProvider";
import { DarkTheme, LightTheme } from "../theme/theme";

/**
 * @component App
 * @description The root entry point of the application.
 * * Responsibilities:
 * 1. Theme Management: Switches between Light and Dark modes based on system settings.
 * 2. System UI: Syncs the StatusBar style with the current theme.
 * 3. Routing: Bootstraps the main navigation tree via AppRouter.
 */
export default function App() {
  // 1. HOOKS: Detect the device's system color scheme (light, dark, or null)
  const colorScheme = useColorScheme();

  // 2. CONSTANTS: Logic for theme selection
  const isDarkMode = colorScheme === "dark";
  const activeTheme = isDarkMode ? DarkTheme : LightTheme;
  const statusBarStyle = isDarkMode ? "light" : "dark";

  return (
    <>
      {/* CONTEXT PROVIDER: 
          Injects theme variables into the React Navigation context.
          Accessible in child components via useTheme().
      */}
      <ThemeProvider value={activeTheme}>
        
        {/* STATUS BAR: 
            Controls the clock, battery, and signal icons at the top of the screen. 
        */}
        <StatusBar style={statusBarStyle} />

        {/* ROUTING: 
            The gateway to all screens (Home, Profile, etc.). 
        */}
        <GlobalLoadingProvider >
        <AppRouter />
        </GlobalLoadingProvider>

      </ThemeProvider>
    </>
  );
}