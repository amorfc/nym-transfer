import React from "react";
import { Card, Space, Collapse, CollapseProps } from "antd";
import {
  FileOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { themeColors } from "@/theme/colors";
import { formatKilobytesToHuman, formatTimestamp } from "@/utils/fileUtils";
import { FileInfoResponseData } from "@/service/response/FileInfoMixnetResponse";
import NymText from "@/components/common/NymText";

interface FileInfoCardProps {
  fileInfo: FileInfoResponseData;
}

const FileInfoCard: React.FC<FileInfoCardProps> = ({ fileInfo }) => {
  const {
    title = "Unknown File",
    sizeInKilobytes = 0,
    uploadTimestamp = "",
    message,
  } = fileInfo || {};

  // Prepare collapse items
  const collapseItems: CollapseProps["items"] = message
    ? [
        {
          key: "1",
          label: (
            <Space align="center" style={{ width: "100%" }}>
              <MessageOutlined
                style={{
                  color: themeColors.dark.textSecondary,
                }}
              />
              <NymText secondary>Message</NymText>
            </Space>
          ),
          children: (
            <Space
              align="center"
              style={{ width: "100%", paddingInlineStart: 16 }}
            >
              <NymText tertiary>{message}</NymText>
            </Space>
          ),
        },
      ]
    : [];

  return (
    <Card
      style={{
        width: "100%",
        backgroundColor: themeColors.dark.bgPrimary,
        borderColor: themeColors.dark.bgSecondary,
        color: themeColors.dark.textTertiary,
      }}
      title={
        <Space>
          <FileOutlined style={{ color: themeColors.dark.primary }} />
          <NymText>{title}</NymText>
        </Space>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space>
          <DatabaseOutlined style={{ color: themeColors.dark.textSecondary }} />
          <NymText secondary>
            Size: {formatKilobytesToHuman(sizeInKilobytes)}
          </NymText>
        </Space>
        <Space>
          <ClockCircleOutlined
            style={{ color: themeColors.dark.textSecondary }}
          />
          <NymText secondary>{formatTimestamp(uploadTimestamp)}</NymText>
        </Space>
        {message && (
          <Collapse
            ghost
            expandIconPosition="end"
            style={{
              backgroundColor: "transparent",
              border: "none",
            }}
            items={collapseItems}
          />
        )}
      </Space>
    </Card>
  );
};

export default FileInfoCard;
