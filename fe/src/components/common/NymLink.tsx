import React from "react";
import { Tooltip } from "antd";
import { useThemeColors } from "@/hooks/useThemeColors";

interface NymLinkProps {
  href: string;
  clickMessage?: string;
  children: React.ReactNode;
  sameTab?: boolean;
  style?: React.CSSProperties;
}

const NymLink: React.FC<NymLinkProps> = ({
  href,
  children,
  clickMessage = "Click to open link",
  sameTab = true,
  style,
}) => {
  const colors = useThemeColors();

  return (
    <Tooltip title={clickMessage}>
      <a
        href={href}
        target={sameTab ? "_self" : "_blank"}
        rel="noopener noreferrer"
        style={{
          flex: 1,
          fontSize: "14px",
          color: colors.primary,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textDecoration: "none",
          ...style,
        }}
      >
        {children}
      </a>
    </Tooltip>
  );
};

export default NymLink;
