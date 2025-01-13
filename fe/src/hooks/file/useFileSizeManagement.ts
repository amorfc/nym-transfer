import { useMemo } from "react";
import { UploadFile } from "antd/es/upload/interface";

export const MAX_TOTAL_SIZE_MB = 50; // 50MB total limit

export const useFileSizeManagement = (files: UploadFile[]) => {
  const totalSize = useMemo(
    () => files?.reduce((acc, file) => acc + (file.size ?? 0), 0) ?? 0,
    [files]
  );

  const remainingSize = useMemo(
    () => MAX_TOTAL_SIZE_MB * 1024 * 1024 - totalSize,
    [totalSize]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const isTotalSizeValid = (additionalSize: number): boolean => {
    return totalSize + additionalSize <= MAX_TOTAL_SIZE_MB * 1024 * 1024;
  };

  return {
    totalSize,
    remainingSize,
    formatFileSize,
    isTotalSizeValid,
  };
};
