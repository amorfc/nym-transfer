import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors.ts";
import NymText from "./NymText";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";

const NymConnectionStatus: React.FC = () => {
  const colors = useThemeColors();
  const { isNymClientReady } = useNymClientStatus();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        background: colors.bgSecondary,
        border: `1px solid ${colors.borderPrimary}`,
        borderRadius: 8,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isNymClientReady ? colors.success : colors.error,
          marginRight: 8,
        }}
      />
      <NymText>
        {isNymClientReady ? "Mixnet Connected" : "Connecting..."}
      </NymText>
    </div>
  );
};

export default NymConnectionStatus;
