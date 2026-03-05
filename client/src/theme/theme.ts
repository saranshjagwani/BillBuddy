import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from "@react-navigation/native";

import { LightColors, DarkColors } from "./color";

/**
 * Light Theme
 */
export const LightTheme = {
  ...NavLightTheme,
  dark: false,

  colors: {
    ...NavLightTheme.colors,

    // Required by navigation
    primary: LightColors.primary,
    accent: LightColors.accent,
    background: LightColors.background,
    card: LightColors.card,
    text: LightColors.textPrimary,
    border: LightColors.border,
    notification: LightColors.accent,

    // 👇 Your extra custom colors
    surface: LightColors.surface,
    textPrimary: LightColors.textPrimary,
    textSecondary: LightColors.textSecondary,
    textInverse: LightColors.textInverse,
    success: LightColors.success,
    warning: LightColors.warning,
    error: LightColors.error,
    icon: LightColors.icon,
  },
};

/**
 * Dark Theme
 */
export const DarkTheme = {
  ...NavDarkTheme,
  dark: true,

  colors: {
    ...NavDarkTheme.colors,

    // Required by navigation
    primary: DarkColors.primary,
    accent: DarkColors.accent,
    background: DarkColors.background,
    card: DarkColors.card,
    text: DarkColors.textPrimary,
    border: DarkColors.border,
    notification: DarkColors.accent,

    // 👇 Your extra custom colors
    surface: DarkColors.surface,
    textPrimary: DarkColors.textPrimary,
    textSecondary: DarkColors.textSecondary,
    textInverse: DarkColors.textInverse,
    success: DarkColors.success,
    warning: DarkColors.warning,
    error: DarkColors.error,
    icon: DarkColors.icon,
  },
};