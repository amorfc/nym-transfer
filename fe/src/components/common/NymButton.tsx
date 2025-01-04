import { Button, ButtonProps, ConfigProvider } from "antd";
import React from "react";
import { useAppSelector } from "@/hooks/useAppStore";
import { selectThemeMode } from "@/store/slice/appSlice";
import { ThemeMode } from "@/types/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

const NymButton: React.FC<ButtonProps> = (props) => {
  const themeMode = useAppSelector(selectThemeMode);
  const colors = useThemeColors();

  const getButtonToken = () => {
    const isDark = themeMode === ThemeMode.DARK;

    return {
      // Font settings
      contentFontSize: 14,
      contentFontSizeLG: 16,
      contentFontSizeSM: 14,
      fontWeight: 500,

      // Padding
      paddingBlock: 6,
      paddingBlockLG: 8,
      paddingBlockSM: 4,
      paddingInline: 16,
      paddingInlineLG: 24,
      paddingInlineSM: 12,

      // Colors for default button
      defaultBg: isDark ? colors.buttonBgDark : colors.bgOverlay,
      defaultColor: colors.textPrimary,
      defaultBorderColor: isDark
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 0, 0, 0.15)",
      defaultHoverBg: isDark ? colors.buttonBgDarkHover : colors.primary,
      defaultHoverColor: "#ffffff",
      defaultHoverBorderColor: isDark
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(0, 0, 0, 0.2)",
      defaultActiveBg: isDark ? colors.buttonBgDarkActive : colors.primary,
      defaultActiveColor: "#ffffff",
      defaultActiveBorderColor: isDark
        ? "rgba(255, 255, 255, 0.25)"
        : "rgba(0, 0, 0, 0.25)",

      // Colors for primary button
      primaryColor: "#ffffff",
      primaryShadow: "none",

      // Colors for text button
      textHoverBg: isDark
        ? colors.buttonBgDarkHover
        : "rgba(251, 110, 78, 0.06)",
      textTextColor: colors.textPrimary,
      textTextHoverColor: colors.primary,
      textTextActiveColor: colors.primary,

      // Disabled states
      colorDisabled: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
      colorTextDisabled: isDark
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      borderColorDisabled: isDark
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 0, 0, 0.15)",
      defaultDisabledBg: isDark
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.04)",
      defaultDisabledColor: isDark
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      defaultDisabledBorderColor: isDark
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 0, 0, 0.15)",
      primaryDisabledBg: isDark
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.04)",
      primaryDisabledColor: isDark
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      primaryDisabledBorderColor: isDark
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(0, 0, 0, 0.15)",
      textDisabledBg: "transparent",
      textDisabledColor: isDark
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      textDisabledBorderColor: "transparent",
    };
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: getButtonToken(),
        },
      }}
    >
      <Button
        {...props}
        style={{
          width: "100%",
          borderRadius: "8px",
          height: 40,
          backdropFilter: "blur(10px)",
          transition: "all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)",
          opacity: props.disabled ? 0.5 : 1,
          ...props.style,
        }}
      />
    </ConfigProvider>
  );
};

export default NymButton;
