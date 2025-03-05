import { Card, CardProps } from "antd";
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import { useResponsive } from "antd-style";

interface NymCardProps extends CardProps {
  children: React.ReactNode;
}

const NymCard: React.FC<NymCardProps> = ({ children, style, ...props }) => {
  const { isConnecting } = useSelectNymClient();
  const { mobile } = useResponsive();
  const colors = useThemeColors();

  const defaultStyle = {
    minWidth: "340px",
    width: mobile ? "100%" : "400px",
    minHeight: "480px",
    background: colors.bgOverlay,
    borderRadius: "16px",
    border: `1px solid ${colors.borderPrimary}`,
    ...style,
  };

  return (
    <Card
      style={defaultStyle}
      styles={{
        body: {
          padding: "1rem",
        },
      }}
      {...props}
    >
      {isConnecting ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LoadingLottie />
        </div>
      ) : (
        <TransitionWrapper>{children}</TransitionWrapper>
      )}
    </Card>
  );
};

export default NymCard;
