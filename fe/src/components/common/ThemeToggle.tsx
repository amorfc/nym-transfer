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
        position: "fixed",
        top: 24,
        right: 24,
        width: "auto",
        minWidth: 40,
        height: 40,
        padding: "0 12px",
        zIndex: 1000,
      }}
    >
      {themeMode === ThemeMode.DARK ? "🌙" : "☀️"}
    </NymButton>
  );
};

export default ThemeToggle;
