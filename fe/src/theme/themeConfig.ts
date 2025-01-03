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
      colorText: colors.textPrimary,
      colorBgContainer: colors.bgOverlay,
      colorBgTextHover: `${colors.primary}26`,
      colorBgTextActive: `${colors.primary}40`,
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
    },
    Card: {
      algorithm: true,
      colorBgContainer: colors.bgOverlay,
      colorBorder: colors.borderPrimary,
    },
    Typography: {
      colorText: colors.textPrimary,
      colorTextSecondary: colors.textSecondary,
    },
    Upload: {
      colorText: colors.textPrimary,
      colorTextDescription: colors.textSecondary,
    },
    List: {
      colorText: colors.textPrimary,
      colorBgContainer: "transparent",
    },
    Notification: {
      colorBgElevated: colors.bgSecondary,
      colorText: colors.textPrimary,
      colorTextHeading: colors.textPrimary,
    },
  },
});

export const useTheme = () => {
  const themeMode = useAppSelector(selectThemeMode);
  return getAntdTheme(themeColors[themeMode]);
};
