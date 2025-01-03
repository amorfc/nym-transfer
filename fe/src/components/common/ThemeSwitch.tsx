import React from "react";
import { Switch } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore.ts";
import { selectThemeMode, toggleTheme } from "@/store/slice/appSlice.ts";
import { ThemeMode } from "@/types/theme.ts";
import { useThemeColors } from "@/hooks/useThemeColors.ts";

export const ThemeSwitch: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const colors = useThemeColors();

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        display: "flex",
        alignItems: "center",
        background:
          themeMode === ThemeMode.DARK
            ? colors.bgSecondary
            : "rgba(255, 255, 255, 0.9)",
        padding: "6px",
        borderRadius: 100,
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        border: `1px solid ${
          themeMode === ThemeMode.DARK
            ? colors.borderPrimary
            : "rgba(0, 0, 0, 0.1)"
        }`,
        zIndex: 1000,
      }}
    >
      <Switch
        checked={themeMode === ThemeMode.DARK}
        onChange={() => dispatch(toggleTheme())}
        checkedChildren="🌙"
        unCheckedChildren="☀️"
        style={{
          backgroundColor:
            themeMode === ThemeMode.DARK ? colors.bgSecondary : colors.primary,
          minWidth: 60,
          border: "none",
          color: "#ffffff",
          fontWeight: "500",
          boxShadow:
            themeMode === ThemeMode.LIGHT
              ? "0 2px 4px rgba(0, 0, 0, 0.1)"
              : "none",
        }}
      />
    </div>
  );
};

export default ThemeSwitch;
