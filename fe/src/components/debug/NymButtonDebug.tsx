import React from "react";
import NymButton from "../common/NymButton";
import NymFlexContainer from "../common/NymFlexContainer";
import NymText from "../common/NymText";
import { useThemeColors } from "@/hooks/useThemeColors";

const NymButtonDebug: React.FC = () => {
  const colors = useThemeColors();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: 24,
        padding: "16px",
        background: colors.bgSecondary,
        border: `1px solid ${colors.borderPrimary}`,
        borderRadius: 8,
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
    >
      <NymText style={{ marginBottom: 16 }}>Button States Debug</NymText>
      <NymFlexContainer vertical gap={8}>
        <NymButton>Default Button</NymButton>
        <NymButton disabled>Disabled Button</NymButton>
        <NymButton loading>Loading Button</NymButton>
        <NymButton type="primary">Primary Button</NymButton>
        <NymButton type="primary" disabled>
          Primary Disabled
        </NymButton>
        <NymButton type="text">Text Button</NymButton>
        <NymButton type="text" disabled>
          Text Disabled
        </NymButton>
      </NymFlexContainer>
    </div>
  );
};

export default NymButtonDebug;
