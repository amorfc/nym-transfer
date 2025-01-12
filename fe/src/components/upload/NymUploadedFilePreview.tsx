import React, { useState } from "react";
import { Upload, Image } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";

interface NymUploadedFilePreviewProps {
  onFileRemove: (file: UploadFile) => void;
  listType?: "text" | "picture" | "picture-card";
  fileList: UploadFile[];
}

const NymUploadedFilePreview: React.FC<NymUploadedFilePreviewProps> = ({
  onFileRemove,
  listType = "picture-card",
  fileList,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url ?? (file.preview as string));
    setPreviewOpen(true);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) =>
        reject(new Error(`Failed to read file ${JSON.stringify(error)}`));
    });

  const handleOnRemove = (info: UploadChangeParam<UploadFile>) => {
    if (info?.file?.status === "removed") {
      onFileRemove(info?.file);
    }
  };

  return (
    <div>
      <Upload
        listType={listType}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleOnRemove}
      />
      {previewImage && (
        <Image
          style={{ display: previewOpen ? "block" : "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(null),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default NymUploadedFilePreview;
