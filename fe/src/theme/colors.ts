import { ThemeMode } from "@/types/theme";

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
  buttonBg: string; // Default button background color
  buttonHoverBg: string; // Button background color on hover
  buttonActiveBg: string; // Button background color when active
  buttonText: string; // Button text color,1
}

const colors: ThemeColors = {
  // Main brand colors based on palette
  primary: "#14E76F", // Primary green
  success: "#4CAF50",
  warning: "#FAAD14",
  error: "#FF4D4F",
  info: "#1890FF",

  // Background colors
  bgPrimary: "#242B2D", // Dark gray background
  bgSecondary: "#1F1F1F", // Slightly lighter gray for containers
  bgOverlay: "rgba(255, 255, 255, 0.05)", // Overlay background

  // Border colors
  borderPrimary: "rgba(255, 255, 255, 0.2)", // Subtle border
  borderHover: "rgba(255, 255, 255, 0.4)", // Hovered border

  // Text colors
  textPrimary: "#FFFFFF", // Bright white for primary text
  textSecondary: "rgba(255, 255, 255, 0.65)", // Slightly muted text
  textTertiary: "rgba(255, 255, 255, 0.45)", // More muted tertiary text

  // Button colors
  buttonBg: "#14E76F", // Bright green for button
  buttonHoverBg: "#00CC6E", // Slightly darker green on hover
  buttonActiveBg: "#00B261", // Even darker green when active
  buttonText: "rgba(36, 43, 45,1)", // Dark text color for buttons
} as const;

const lightColors: ThemeColors = {
  primary: "#14E76F", // Primary green
  success: "#4CAF50",
  warning: "#FAAD14",
  error: "#FF4D4F",
  info: "#1890FF",

  bgPrimary: "#FFFFFF", // White background for light theme
  bgSecondary: "#F5F5F5", // Light gray for containers
  bgOverlay: "rgba(0, 0, 0, 0.05)", // Subtle dark overlay

  borderPrimary: "rgba(0, 0, 0, 0.1)", // Light border
  borderHover: "rgba(0, 0, 0, 0.2)", // Hovered border for light theme

  textPrimary: "#000000", // Black for primary text
  textSecondary: "rgba(0, 0, 0, 0.65)", // Muted black text
  textTertiary: "rgba(0, 0, 0, 0.45)", // Tertiary muted text

  // Button colors
  buttonBg: "#F5F5F5", // Matches background for light button
  buttonHoverBg: "#E0E0E0", // Subtle gray hover effect
  buttonActiveBg: "#CCCCCC", // More pronounced when active
  buttonText: "rgba(36, 43, 45,1)", // Dark text color for buttons
} as const;

export const themeColors: Record<ThemeMode, ThemeColors> = {
  dark: colors,
  light: lightColors,
};
