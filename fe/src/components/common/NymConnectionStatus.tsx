import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors.ts";
import NymText from "./NymText";

interface NymConnectionStatusProps {
  isConnected: boolean;
}

const NymConnectionStatus: React.FC<NymConnectionStatusProps> = ({
  isConnected,
}) => {
  const colors = useThemeColors();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        background: colors.bgSecondary,
        border: `1px solid ${colors.borderPrimary}`,
        borderRadius: 8,
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isConnected ? colors.success : colors.error,
          marginRight: 8,
        }}
      />
      <NymText>{isConnected ? "Mixnet Connected" : "Connecting..."}</NymText>
    </div>
  );
};

export default NymConnectionStatus;
