import React from "react";
import { Card } from "antd";
import { useThemeColors } from "@/hooks/useThemeColors";
import NymLink from "../common/NymLink";
import NymCopyButton from "../common/NymCopyButton";

interface NymLinkContainerProps {
  link: string;
}

const NymLinkContainer: React.FC<NymLinkContainerProps> = ({ link }) => {
  const colors = useThemeColors();

  return (
    <Card
      bordered
      style={{
        width: "100%",
        background: colors.bgOverlay,
        borderRadius: "12px",
        border: `1px solid ${colors.borderPrimary}`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
      bodyStyle={{
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <NymLink href={link}>{link}</NymLink>
      <NymCopyButton textToCopy={link} />
    </Card>
  );
};

export default NymLinkContainer;
