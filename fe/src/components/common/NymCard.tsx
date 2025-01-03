import { Card, CardProps } from "antd";
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors.ts";

interface NymCardProps extends CardProps {
  children: React.ReactNode;
}

const NymCard: React.FC<NymCardProps> = ({ children, style, ...props }) => {
  const colors = useThemeColors();

  const defaultStyle = {
    width: "400px",
    background: colors.bgOverlay,
    borderRadius: "16px",
    border: `1px solid ${colors.borderPrimary}`,
    ...style,
  };

  return (
    <Card style={defaultStyle} {...props}>
      {children}
    </Card>
  );
};

export default NymCard;
