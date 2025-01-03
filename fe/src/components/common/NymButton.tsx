import { Button, ButtonProps } from "antd";
import React from "react";
import { useAppSelector } from "@/hooks/useAppStore";
import { selectThemeMode } from "@/store/slice/appSlice";
import { ThemeMode } from "@/types/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

const NymButton: React.FC<ButtonProps> = ({ style, ...props }) => {
  const themeMode = useAppSelector(selectThemeMode);
  const colors = useThemeColors();

  const defaultStyle = {
    color: colors.textPrimary,
    background:
      themeMode === ThemeMode.DARK ? colors.bgOverlay : colors.primary,
    borderRadius: "8px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    border: "none",
    fontWeight: "500",
    boxShadow:
      themeMode === ThemeMode.LIGHT
        ? `0 2px 4px ${colors.bgSecondary}`
        : "none",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s ease",
    ...style,
  };

  return <Button block {...props} style={defaultStyle} />;
};

export default NymButton;
