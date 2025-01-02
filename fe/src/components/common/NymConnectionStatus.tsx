import { Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface NymConnectionStatusProps {
  isConnected: boolean;
}

const NymConnectionStatus: React.FC<NymConnectionStatusProps> = ({
  isConnected,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        background: "rgba(37, 39, 43, 0.95)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isConnected ? "#4CAF50" : "#FF5B37",
          marginRight: 8,
        }}
      />
      <Text style={{ color: "#fff", fontSize: "14px" }}>
        {isConnected ? "Mixnet Connected" : "Connecting..."}
      </Text>
    </div>
  );
};

export default NymConnectionStatus;
