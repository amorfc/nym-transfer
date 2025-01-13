import React from "react";
import NymText from "../common/NymText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { UploadFile } from "antd/es/upload/interface";
import {
  useFileSizeManagement,
  MAX_TOTAL_SIZE_MB,
} from "@/hooks/file/useFileSizeManagement";
import { useFileUploadConfig } from "@/hooks/store/useFileUploadConfig";

interface NymFileSizeInfoProps {
  files: UploadFile[];
}

const NymFileSizeInfo: React.FC<NymFileSizeInfoProps> = ({ files }) => {
  const colors = useThemeColors();
  const { multipleFiles } = useFileUploadConfig();
  const { remainingSize, totalSize, formatFileSize } =
    useFileSizeManagement(files);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <NymText size="small" color={colors.textSecondary}>
        Total size: {formatFileSize(totalSize)} / {MAX_TOTAL_SIZE_MB}MB
      </NymText>
      {multipleFiles && (
        <NymText size="small" color={colors.success}>
          Remaining: {formatFileSize(remainingSize)}
        </NymText>
      )}
      {files.map((file) => (
        <NymText key={file.uid} size="small">
          {file.name}: {formatFileSize(file.size ?? 0)}
        </NymText>
      ))}
    </div>
  );
};

export default NymFileSizeInfo;
