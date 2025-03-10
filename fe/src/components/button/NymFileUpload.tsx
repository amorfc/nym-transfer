import React from "react";
import { Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { InboxOutlined } from "@ant-design/icons";
import { useFileUploadConfig } from "@/hooks/store/useFileUploadConfig";
import NymText from "@/components/common/NymText";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  MAX_TOTAL_SIZE_MB,
  useFileSizeManagement,
} from "@/hooks/file/useFileSizeManagement";
import { notifyError } from "@/components/toast/toast";

export interface NymFileUploadProps {
  onFileSelect: (file: UploadFile) => void;
  disabled?: boolean;
  uploading?: boolean;
  selectedFiles: UploadFile[];
}

const NymFileUpload: React.FC<NymFileUploadProps> = ({
  onFileSelect,
  disabled = false,
  uploading = false,
  selectedFiles,
}) => {
  const { maxFileCount, multipleFiles } = useFileUploadConfig();
  const colors = useThemeColors();
  const { isTotalSizeValid, formatFileSize, remainingSize } =
    useFileSizeManagement(selectedFiles);

  const handleBeforeUpload = (file: File) => {
    if (!isTotalSizeValid(file.size)) {
      notifyError({
        message: `Total size would exceed ${MAX_TOTAL_SIZE_MB}MB limit. Remaining space: ${formatFileSize(
          remainingSize
        )}`,
      });
      return false;
    }

    const rcFile = file as RcFile;
    const uploadFile: UploadFile = {
      uid: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      originFileObj: rcFile,
      lastModified: file.lastModified,
    };
    onFileSelect(uploadFile);
    return false;
  };

  return (
    <Upload.Dragger
      disabled={disabled || uploading}
      multiple={multipleFiles}
      maxCount={maxFileCount}
      beforeUpload={handleBeforeUpload}
      showUploadList={false}
      accept="*/*"
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        {`Click or drag ${
          multipleFiles ? "files" : "a file"
        } to this area to upload`}
      </p>
      <p className="ant-upload-hint">
        <NymText color={colors.success}>NYM Transfer</NymText>
        {multipleFiles
          ? " supports multiple file uploads."
          : " supports single file upload for now."}
      </p>
    </Upload.Dragger>
  );
};

export default NymFileUpload;
