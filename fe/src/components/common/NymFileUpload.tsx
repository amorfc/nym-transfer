import React from "react";
import { Upload } from "antd";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import NymButton from "@/components/common/NymButton";

export interface NymFileUploadProps {
  onFileSelect: (file: UploadFile) => void;
  disabled?: boolean;
  uploading?: boolean;
  multiple?: boolean;
}

const NymFileUpload: React.FC<NymFileUploadProps> = ({
  onFileSelect,
  disabled = false,
  uploading = false,
  multiple = false,
}) => {
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
      multiple={multiple}
      beforeUpload={handleBeforeUpload}
      showUploadList={false}
      accept="*/*"
    >
      <NymButton block loading={uploading} disabled={disabled}>
        Add file{multiple ? "s" : ""}
      </NymButton>
    </Upload.Dragger>
  );
};

export default NymFileUpload;
