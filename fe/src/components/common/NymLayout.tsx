import { Layout, LayoutProps } from "antd";
import React from "react";
import { useThemeColors } from "@/hooks/useThemeColors";

interface NymLayoutProps extends LayoutProps {
  children: React.ReactNode;
}

const NymLayout: React.FC<NymLayoutProps> = ({ children, style, ...props }) => {
  const colors = useThemeColors();

  const defaultStyle = {
    minHeight: "100vh",
    background: colors.bgPrimary,
    backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.primary}26 0%, ${colors.bgPrimary} 70%)`,
    display: "flex",
    flexDirection: "column" as const,
    ...style, // Allow style override
  };

  return (
    <Layout style={defaultStyle} {...props}>
      {children}
    </Layout>
  );
};

export default NymLayout;
