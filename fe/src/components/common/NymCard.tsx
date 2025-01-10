import { Card, CardProps } from "antd";
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors.ts";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";

interface NymCardProps extends CardProps {
  children: React.ReactNode;
}

const NymCard: React.FC<NymCardProps> = ({ children, style, ...props }) => {
  const { isConnecting } = useSelectNymClient();
  const colors = useThemeColors();

  const defaultStyle = {
    width: "420px",
    minHeight: "480px",
    background: colors.bgOverlay,
    borderRadius: "16px",
    border: `1px solid ${colors.borderPrimary}`,
    ...style,
  };

  return (
    <Card style={defaultStyle} {...props}>
      {isConnecting ? (
        <LoadingLottie />
      ) : (
        <TransitionWrapper>{children}</TransitionWrapper>
      )}
    </Card>
  );
};

export default NymCard;
