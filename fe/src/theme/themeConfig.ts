import { ThemeConfig } from "antd";
import { ThemeColors, themeColors } from "./colors.ts";
import { useAppSelector } from "@/hooks/useAppStore.ts";
import { selectThemeMode } from "@/store/slice/appSlice.ts";

const getAntdTheme = (colors: ThemeColors): ThemeConfig => ({
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorBgBase: colors.bgPrimary,
    colorBgContainer: colors.bgSecondary,
    colorBgElevated: colors.bgOverlay,
    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    borderRadius: 8,
  },
  components: {
    Button: {
      algorithm: true,
      colorText: colors.buttonText,
      colorBgContainer: colors.buttonBg, // Matches button base
      colorBgTextHover: colors.buttonHoverBg, // Button hover background
      colorBgTextActive: colors.buttonActiveBg, // Button active background
      colorPrimary: colors.primary,
      colorPrimaryBorder: colors.primary,
      colorPrimaryHover: colors.primary,
      colorPrimaryActive: colors.primary,
      borderRadius: 8,
      controlHeight: 40,
      controlOutline: "none",
      paddingContentHorizontal: 16,
    },
    Input: {
      algorithm: true,
      colorBgContainer: colors.bgOverlay,
      colorBorder: colors.borderPrimary,
      colorText: colors.textPrimary,
      colorTextPlaceholder: colors.textSecondary,
      borderRadius: 8,
    },
    Card: {
      algorithm: true,
      colorBgContainer: colors.bgSecondary, // Matches card container
      colorBorder: colors.borderPrimary, // Subtle border for cards
      borderRadius: 12,
    },
    Typography: {
      colorText: colors.textPrimary,
      colorTextSecondary: colors.textSecondary,
      colorLink: colors.primary,
      colorLinkHover: colors.buttonHoverBg,
      colorLinkActive: colors.buttonActiveBg,
    },
    Upload: {
      colorText: colors.textPrimary,
      colorTextDescription: colors.textSecondary,
      colorBgContainer: colors.bgOverlay,
      colorBorder: colors.borderPrimary,
      borderRadius: 8,
    },
    List: {
      colorText: colors.textPrimary,
      colorBgContainer: "transparent",
      colorBorder: colors.borderPrimary,
      colorTextSecondary: colors.textSecondary,
    },
    Notification: {
      colorBgElevated: colors.bgSecondary, // Matches elevated background
      colorText: colors.textPrimary,
      colorTextHeading: colors.textPrimary,
      borderRadius: 12,
    },
  },
});

export const useTheme = () => {
  const themeMode = useAppSelector(selectThemeMode);
  return getAntdTheme(themeColors[themeMode]);
};
