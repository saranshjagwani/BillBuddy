import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, LightTheme } from "../../theme/theme";

type ThemeType = typeof LightTheme;

type ThemeContextType = {
  theme: ThemeType;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return context;
};