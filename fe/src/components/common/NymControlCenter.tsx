import NymConnectionStatus from "@/components/common/NymConnectionStatus";
import NymThemeToggle from "@/components/button/NymThemeToggle";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import React from "react";

const NymControlCenter: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        display: "flex",
        alignItems: "center",
        padding: "4px",
        borderRadius: 8,
        zIndex: 1000,
      }}
    >
      <NymFlexContainer gap={8}>
        <NymThemeToggle />
        <NymConnectionStatus />
      </NymFlexContainer>
    </div>
  );
};

export default NymControlCenter;
