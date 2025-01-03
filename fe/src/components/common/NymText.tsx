import React from "react";
import { Typography } from "antd";
import { TextProps } from "antd/es/typography/Text";
import { useThemeColors } from "@/hooks/useThemeColors";

const { Text } = Typography;

interface NymTextProps extends TextProps {
  size?: "small" | "default" | "large";
  secondary?: boolean;
  tertiary?: boolean;
  mono?: boolean;
  weight?: "regular" | "medium" | "semibold" | "bold";
}

const NymText: React.FC<NymTextProps> = ({
  size = "default",
  style,
  secondary,
  tertiary,
  weight = "regular",
  children,
  ...props
}) => {
  const colors = useThemeColors();

  const getFontSize = () => {
    switch (size) {
      case "small":
        return "12px";
      case "large":
        return "16px";
      default:
        return "14px";
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case "bold":
        return 700;
      case "semibold":
        return 600;
      case "medium":
        return 500;
      default:
        return 400;
    }
  };

  const getColor = () => {
    if (tertiary) return colors.textTertiary;
    if (secondary) return colors.textSecondary;
    return colors.textPrimary;
  };

  const defaultStyle = {
    color: getColor(),
    fontSize: getFontSize(),
    fontWeight: getFontWeight(),
    transition: "color 0.2s ease",
    ...style,
  };

  return (
    <Text {...props} style={defaultStyle}>
      {children}
    </Text>
  );
};

export default NymText;
