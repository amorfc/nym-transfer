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
  // Button colors
  buttonBgDark: string;
  buttonBgDarkHover: string;
  buttonBgDarkActive: string;
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

  // Button colors
  buttonBgDark: "#000000",
  buttonBgDarkHover: "rgba(0, 0, 0, 0.06)",
  buttonBgDarkActive: "rgba(0, 0, 0, 0.08)",
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

  // Button colors
  buttonBgDark: "#000000",
  buttonBgDarkHover: "rgba(0, 0, 0, 0.06)",
  buttonBgDarkActive: "rgba(0, 0, 0, 0.08)",
} as const;

export const themeColors: Record<ThemeMode, ThemeColors> = {
  dark: colors,
  light: lightColors,
};
