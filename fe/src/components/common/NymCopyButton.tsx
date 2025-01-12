import React, { useState } from "react";
import { Button, message, Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { useThemeColors } from "@/hooks/useThemeColors";

interface NymCopyButtonProps {
  textToCopy: string;
}

const NymCopyButton: React.FC<NymCopyButtonProps> = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);
  const colors = useThemeColors();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      message.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      message.error(`Failed to copy link ${error}`);
    }
  };

  return (
    <Tooltip title={isCopied ? "Copied!" : "Copy link"}>
      <Button
        type="text"
        icon={isCopied ? <CheckOutlined /> : <CopyOutlined />}
        onClick={handleCopy}
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isCopied ? colors.success : colors.primary,
          transition: "all 0.2s ease",
        }}
      />
    </Tooltip>
  );
};

export default NymCopyButton;
