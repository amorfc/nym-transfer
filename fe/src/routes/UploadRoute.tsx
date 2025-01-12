import TransitionWrapper from "@/components/animation/TransitionWrapper";
import NymFileUpload from "@/components/button/NymFileUpload";
import NymText from "@/components/common/NymText";
import NymUploadedFilePreview from "@/components/upload/NymUploadedFilePreview";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import { useUploadFileMutation } from "@/store/api/nymApi";
import { notifyError, notifySuccess } from "@/components/toast/toast";
import { Input, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import NymUploadAllButton from "@/components/button/NymUploadAllButton";
import { useFileUploadConfig } from "@/hooks/store/useFileUploadConfig";
import NymUploadCompleted from "@/components/upload/NymUploadCompleted";
import NymUploadInProgress from "@/components/upload/NymUploadInProgress";

const MAX_STORAGE_GB = 2;
const GB_TO_BYTES = 1024 * 1024 * 1024;

enum UploadState {
  INITIAL, // Initial state where no input has been provided.
  IN_PROGRESS, // The upload is currently in progress.
  COMPLETED, // The upload is finished.
}

const UploadRoute = () => {
  const { multipleFiles } = useFileUploadConfig();
  const { recipientAddress } = useSelectNymClient();
  const { isNymClientReady } = useNymClientStatus();
  const [title, setTitle] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>(
    UploadState.INITIAL
  );
  const [messageText, setMessageText] = useState(
    "Messages disabled for now 🦀"
  );
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, { isLoading, isSuccess, data }] = useUploadFileMutation();
  const totalSize =
    selectedFiles?.reduce((acc, file) => acc + (file.size ?? 0), 0) ?? 0;
  const remainingBytes = MAX_STORAGE_GB * GB_TO_BYTES - totalSize;
  const remainingGB = remainingBytes / GB_TO_BYTES;

  const handleUploadAll = async () => {
    if (!recipientAddress) {
      notifyError({ message: "Please enter a recipient address" });
      return;
    }

    if (!title.trim()) {
      notifyError({ message: "Please enter a title" });
      return;
    }

    if (selectedFiles.length === 0) {
      notifyError({ message: "Please select at least one file" });
      return;
    }

    try {
      setUploading(true);
      for (const file of selectedFiles) {
        if (!file.originFileObj) {
          throw new Error("No file data available");
        }

        const arrayBuffer = await file.originFileObj.arrayBuffer();
        const content = Array.from(new Uint8Array(arrayBuffer));

        await uploadFile({
          payload: {
            title: multipleFiles ? `${title} - ${file.name}` : title,
            content,
          },
        }).unwrap();
      }

      notifySuccess({
        message: `File${
          selectedFiles.length > 1 ? "s" : ""
        } uploaded successfully`,
      });
      setTitle("");
      setMessageText("");
      setSelectedFiles([]);
    } catch (error) {
      notifyError({
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file: UploadFile) => {
    if (file.size && file.size > remainingBytes) {
      notifyError({ message: "Not enough storage space remaining" });
      return;
    }

    if (!multipleFiles) {
      setSelectedFiles([file]);
    } else {
      setSelectedFiles((prev) => [...prev, file]);
    }
  };

  const handleRemoveFile = (file: UploadFile) => {
    setSelectedFiles((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  useEffect(() => {
    if (isSuccess && data?.path) {
      setUploadState(UploadState.COMPLETED);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isLoading) {
      setUploadState(UploadState.IN_PROGRESS);
    }
  }, [isLoading]);

  if (uploadState === UploadState.IN_PROGRESS) {
    return <NymUploadInProgress />;
  }

  if (uploadState === UploadState.COMPLETED && data) {
    return <NymUploadCompleted data={data} />;
  }

  return (
    <TransitionWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem", // Creates space between each child
        }}
      >
        <NymFileUpload
          onFileSelect={handleFileSelect}
          disabled={!isNymClientReady}
          uploading={uploading}
        />

        <NymUploadedFilePreview
          fileList={selectedFiles}
          onFileRemove={handleRemoveFile}
          listType="picture-card"
        />

        <NymText size="small" style={{ marginTop: 8 }}>
          {remainingGB.toFixed(1)} GB remaining
        </NymText>

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextArea
          disabled
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
        />
        {selectedFiles.length > 0 && (
          <NymUploadAllButton
            onClick={handleUploadAll}
            loading={uploading}
            disabled={!isNymClientReady}
            fileCount={selectedFiles.length}
          />
        )}
      </div>
    </TransitionWrapper>
  );
};

export default UploadRoute;
