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
      contentFontSize: 16,
      fontWeight: 500,

      // Padding
      paddingBlock: 8,
      paddingInline: 24,

      // Colors for default button
      defaultBg: colors.buttonBg,
      defaultColor: colors.buttonText,
      defaultBorderColor: colors.borderPrimary,
      defaultHoverBg: colors.buttonHoverBg,
      defaultHoverColor: colors.textPrimary,
      defaultHoverBorderColor: colors.borderHover,
      defaultActiveBg: colors.buttonActiveBg,
      defaultActiveColor: colors.textPrimary,
      defaultActiveBorderColor: colors.borderHover,

      // Colors for primary button
      primaryColor: colors.textPrimary,
      primaryShadow: "0 0 5px rgba(0, 255, 133, 0.3)", // Green glow for focus/active state
      secondaryColor: colors.textSecondary,
      tertiaryColor: colors.textTertiary,

      // Disabled states
      colorDisabled: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
      defaultDisabledBg: isDark
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.04)",
      defaultDisabledColor: isDark
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(0, 0, 0, 0.3)",
      defaultDisabledBorderColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)",
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
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          opacity: props.disabled ? 0.6 : 1,
          ...props.style,
        }}
      />
    </ConfigProvider>
  );
};

export default NymButton;
