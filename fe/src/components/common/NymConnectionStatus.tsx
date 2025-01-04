import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors.ts";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import NymText from "./NymText";

const NymConnectionStatus: React.FC = () => {
  const colors = useThemeColors();
  const { isConnected } = useSelectNymClient();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        background: colors.bgSecondary,
        border: `1px solid ${colors.borderPrimary}`,
        borderRadius: 8,
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
