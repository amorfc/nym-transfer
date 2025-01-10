import React from "react";
import { Button, Card } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";

interface UploadCompleteProps {
  link: string;
}

const UploadComplete: React.FC<UploadCompleteProps> = ({ link }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        gap: "24px",
      }}
    >
      {/* Lottie animation */}
      <div>
        <LoadingLottie />
      </div>

      {/* Success container */}
      <Card
        style={{
          width: "400px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: 500, textAlign: "center" }}>
          Your upload is complete! Here’s your link:
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
        >
          {/* Link display */}
          <span
            style={{
              flex: 1,
              fontSize: "14px",
              color: "#1890ff",
              textDecoration: "underline",
              cursor: "pointer",
              overflowWrap: "break-word",
            }}
            onClick={() => window.open(link, "_blank")}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                window.open(link, "_blank");
              }
            }}
          >
            {link}
          </span>

          {/* Copy button */}
          <Button
            onClick={handleCopy}
            type="primary"
            icon={<CopyOutlined />}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default UploadComplete;
