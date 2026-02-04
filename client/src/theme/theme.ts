import { DarkTheme as NavDarkTheme, DefaultTheme } from "@react-navigation/native";
import { LightColors, DarkColors } from "./color";

/**
 * Application Light Theme
 */
export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,

    primary: LightColors.primary,
    background: LightColors.background,
    card: LightColors.card,
    text: LightColors.textPrimary,
    border: LightColors.border,
    notification: LightColors.accent,
  },
};

/**
 * Application Dark Theme
 */
export const DarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,

    primary: DarkColors.primary,
    background: DarkColors.background,
    card: DarkColors.card,
    text: DarkColors.textPrimary,
    border: DarkColors.border,
    notification: DarkColors.accent,
  },
};
