import React from "react";
import NymConnectionStatus from "./NymConnectionStatus";
import ThemeToggle from "./ThemeToggle";
import NymFlexContainer from "./NymFlexContainer";

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
        <ThemeToggle />
        <NymConnectionStatus />
      </NymFlexContainer>
    </div>
  );
};

export default NymControlCenter;
