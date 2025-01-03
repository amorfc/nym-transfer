import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile, RcFile } from "antd/es/upload/interface";
import uuid4 from "uuid4";
import NymButton from "@/components/common/NymButton";
import NymText from "@/components/common/NymText";
import NymFlexContainer from "@/components/common/NymFlexContainer";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"] as const;
const MAX_FILE_SIZE = 500; // MB

interface NymFileUploadProps {
  onFileSelect: (file: UploadFile) => void;
  disabled?: boolean;
  uploading?: boolean;
  maxSize?: number;
  allowedTypes?: readonly string[];
}

const NymFileUpload: React.FC<NymFileUploadProps> = ({
  onFileSelect,
  disabled = false,
  uploading = false,
  maxSize = MAX_FILE_SIZE,
  allowedTypes = ALLOWED_TYPES,
}) => {
  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `File type not supported. Allowed types: ${allowedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`
      );
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      const uploadFile: UploadFile = {
        uid: uuid4(),
        name: file.name,
        size: file.size,
        type: file.type,
        originFileObj: file as RcFile,
        lastModifiedDate: new Date(file.lastModified),
      };
      onFileSelect(uploadFile);
    }
  };

  const inputId = React.useId();

  return (
    <NymFlexContainer vertical gap={8}>
      <input
        type="file"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
        id={inputId}
        disabled={disabled || uploading}
      />
      <NymButton
        type="text"
        icon={<UploadOutlined />}
        disabled={disabled || uploading}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        Add files
      </NymButton>
      <NymText tertiary size="small" style={{ textAlign: "center" }}>
        Up to {maxSize} MB free
      </NymText>
    </NymFlexContainer>
  );
};

export default NymFileUpload;
