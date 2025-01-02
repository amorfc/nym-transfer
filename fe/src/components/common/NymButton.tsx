import { Button, ButtonProps } from "antd";
import React from "react";

interface NymButtonProps extends ButtonProps {
  fullWidth?: boolean;
}

const NymButton: React.FC<NymButtonProps> = ({
  fullWidth,
  style,
  ...props
}) => {
  const defaultStyle = {
    color: "#fff",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    height: "40px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: fullWidth ? 1 : undefined,
    minWidth: 0,
    width: fullWidth ? "100%" : undefined,
    ...style,
  };

  return <Button {...props} style={defaultStyle} />;
};

export default NymButton;
