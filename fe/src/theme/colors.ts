import { ThemeMode } from "@/types/theme.ts";

export interface ThemeColors {
  primary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  bgPrimary: string;
  bgSecondary: string;
  bgOverlay: string;
  borderPrimary: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  // Button specific colors
  buttonBgDark: string;
  buttonBgDarkHover: string;
  buttonBgDarkActive: string;
  buttonBgDisabled: string;
  buttonTextDisabled: string;
  buttonBorderDisabled: string;
}

const colors: ThemeColors = {
  // Main brand colors from design guide
  primary: "#FB6E4E", // Nym orange
  success: "#4CAF50",
  warning: "#FAAD14",
  error: "#FB6E4E",
  info: "#1890FF",

  // Background colors
  bgPrimary: "#000000", // Nym black
  bgSecondary: "rgba(37, 39, 43, 0.95)",
  bgOverlay: "rgba(255, 255, 255, 0.05)",

  // Border colors
  borderPrimary: "rgba(255, 255, 255, 0.1)",
  borderHover: "rgba(255, 255, 255, 0.2)",

  // Text colors
  textPrimary: "#fff",
  textSecondary: "rgba(255, 255, 255, 0.65)",
  textTertiary: "rgba(255, 255, 255, 0.45)",

  // Button specific colors
  buttonBgDark: "rgba(255, 255, 255, 0.1)",
  buttonBgDarkHover: "rgba(251, 110, 78, 0.15)",
  buttonBgDarkActive: "rgba(251, 110, 78, 0.25)",
  buttonBgDisabled: "rgba(255, 255, 255, 0.08)",
  buttonTextDisabled: "rgba(255, 255, 255, 0.3)",
  buttonBorderDisabled: "rgba(255, 255, 255, 0.08)",
} as const;

const lightColors: ThemeColors = {
  primary: "#FB6E4E", // Nym orange
  success: "#4CAF50",
  warning: "#FAAD14",
  error: "#FB6E4E",
  info: "#1890FF",

  bgPrimary: "#ffffff",
  bgSecondary: "rgba(0, 0, 0, 0.02)",
  bgOverlay: "rgba(0, 0, 0, 0.04)",

  borderPrimary: "rgba(0, 0, 0, 0.1)",
  borderHover: "rgba(0, 0, 0, 0.2)",

  textPrimary: "rgba(0, 0, 0, 0.88)",
  textSecondary: "rgba(0, 0, 0, 0.65)",
  textTertiary: "rgba(0, 0, 0, 0.45)",

  // Button specific colors
  buttonBgDark: "rgba(0, 0, 0, 0.04)",
  buttonBgDarkHover: "rgba(251, 110, 78, 0.15)",
  buttonBgDarkActive: "rgba(251, 110, 78, 0.25)",
  buttonBgDisabled: "rgba(0, 0, 0, 0.04)",
  buttonTextDisabled: "rgba(0, 0, 0, 0.25)",
  buttonBorderDisabled: "rgba(0, 0, 0, 0.04)",
} as const;

export const themeColors: Record<ThemeMode, ThemeColors> = {
  dark: colors,
  light: lightColors,
};
