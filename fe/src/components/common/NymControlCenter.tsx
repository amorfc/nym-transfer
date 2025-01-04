import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import NymConnectionStatus from "./NymConnectionStatus";
import ThemeToggle from "./ThemeToggle";
import NymFlexContainer from "./NymFlexContainer";

const NymControlCenter: React.FC = () => {
  const colors = useThemeColors();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        display: "flex",
        alignItems: "center",
        padding: "4px",
        background: colors.bgOverlay,
        borderRadius: 8,
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
    >
      <NymFlexContainer gap={8}>
        <NymConnectionStatus />
        <ThemeToggle />
      </NymFlexContainer>
    </div>
  );
};

export default NymControlCenter;
