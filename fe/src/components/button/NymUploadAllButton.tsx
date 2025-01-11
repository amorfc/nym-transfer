import React, { useMemo } from "react";
import NymButton from "@/components/common/NymButton"; // Adjust the import path as necessary
import { useFileUploadConfig } from "@/hooks/store/useFileUploadConfig";

interface UploadButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  fileCount: number;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  onClick,
  loading,
  disabled,
  fileCount,
}) => {
  const { multipleFiles } = useFileUploadConfig();

  const fileLabel = useMemo(() => {
    const fileCountLabel = fileCount !== 1 ? "s" : "";
    return multipleFiles ? `${fileCount} file${fileCountLabel}` : "file";
  }, [fileCount, multipleFiles]);

  return (
    <NymButton onClick={onClick} loading={loading} disabled={disabled}>
      Upload {fileLabel}
    </NymButton>
  );
};

export default UploadButton;
