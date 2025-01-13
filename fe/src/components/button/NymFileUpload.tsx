import React from "react";
import { Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { InboxOutlined } from "@ant-design/icons";
import { useFileUploadConfig } from "@/hooks/store/useFileUploadConfig";
import NymText from "@/components/common/NymText";
import { useThemeColors } from "@/hooks/useThemeColors";

export interface NymFileUploadProps {
  onFileSelect: (file: UploadFile) => void;
  disabled?: boolean;
  uploading?: boolean;
}

const NymFileUpload: React.FC<NymFileUploadProps> = ({
  onFileSelect,
  disabled = false,
  uploading = false,
}) => {
  const { maxFileCount, multipleFiles } = useFileUploadConfig();
  const colors = useThemeColors();

  const handleBeforeUpload = (file: File) => {
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
    return false; // Prevent default upload behavior
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
