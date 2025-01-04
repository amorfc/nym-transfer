import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore.ts";
import { selectThemeMode, toggleTheme } from "@/store/slice/appSlice.ts";
import { ThemeMode } from "@/types/theme.ts";
import NymButton from "./NymButton";

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);

  return (
    <NymButton
      onClick={() => dispatch(toggleTheme())}
      style={{
        width: "auto",
        minWidth: 40,
        height: 40,
        padding: "0 12px",
      }}
    >
      <span
        style={{
          filter: themeMode === ThemeMode.LIGHT ? "contrast(0.25)" : "none",
          fontSize: "16px",
        }}
      >
        {themeMode === ThemeMode.DARK ? "🌙" : "☀️"}
      </span>
    </NymButton>
  );
};

export default ThemeToggle;
