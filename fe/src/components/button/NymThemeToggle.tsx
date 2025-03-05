import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { selectThemeMode, toggleTheme } from "@/store/slices/appSlice";
import { ThemeMode } from "@/types/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import NymButton from "@/components/common/NymButton";

const NymThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  const colors = useThemeColors();

  return (
    <NymButton
      onClick={() => dispatch(toggleTheme())}
      style={{
        width: "auto",
        minWidth: 40,
        height: 40,
        padding: "0 12px",
        background: colors.bgSecondary,
        border: `1px solid ${colors.borderPrimary}`,
        backdropFilter: "blur(10px)",
      }}
    >
      {themeMode === ThemeMode.DARK ? "🌙" : "☀️"}
    </NymButton>
  );
};

export default NymThemeToggle;
