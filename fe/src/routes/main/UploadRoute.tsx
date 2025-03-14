import TransitionWrapper from "@/components/animation/TransitionWrapper";
import NymFileUpload from "@/components/button/NymFileUpload";
import NymUploadedFilePreview from "@/components/upload/NymUploadedFilePreview";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import { useUploadFileMutation } from "@/store/api/nymApi";
import { notifyError, notifySuccess } from "@/components/toast/toast";
import { Input, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCallback, useEffect, useState } from "react";
import NymUploadAllButton from "@/components/button/NymUploadAllButton";
import { useFileUploadConfig } from "@/hooks/store/useFileUploadConfig";
import NymUploadCompleted from "@/components/upload/NymUploadCompleted";
import NymUploadInProgress from "@/components/upload/NymUploadInProgress";
import NymFileSizeInfo from "@/components/upload/NymFileSizeInfo";

enum UploadState {
  INITIAL, // Initial state where no input has been provided.
  IN_PROGRESS, // The upload is currently in progress.
  COMPLETED, // The upload is finished.
  ERROR, // The upload failed.
}

const UploadRoute = () => {
  const { multipleFiles } = useFileUploadConfig();
  const { recipientAddress } = useSelectNymClient();
  const { isNymClientReady } = useNymClientStatus();
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [uploadState, setUploadState] = useState<UploadState>(
    UploadState.INITIAL
  );
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, { isLoading, isSuccess, data }] = useUploadFileMutation();

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
            title: `${title} - ${file.name}`,
            message: messageText,
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
      setUploadState(UploadState.ERROR);
      notifyError({
        message: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file: UploadFile) => {
    if (!multipleFiles) {
      setSelectedFiles([file]);
    } else {
      setSelectedFiles((prev) => [...prev, file]);
    }
  };

  const handleRemoveFile = (file: UploadFile) => {
    setSelectedFiles((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  // Add effect to reset upload state when client disconnects during upload
  useEffect(() => {
    if (!isNymClientReady && uploadState === UploadState.IN_PROGRESS) {
      setUploadState(UploadState.INITIAL);
      setUploading(false);
      notifyError({
        message: "Upload cancelled: Connection to Nym network lost",
      });
    }
  }, [isNymClientReady, uploadState]);

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

  const handleSendAnotherFile = useCallback(() => {
    setUploadState(UploadState.INITIAL);
    setSelectedFiles([]);
  }, []);

  if (uploadState === UploadState.IN_PROGRESS) {
    return <NymUploadInProgress />;
  }

  if (uploadState === UploadState.COMPLETED && data) {
    return (
      <NymUploadCompleted
        data={data}
        onSendAnotherFile={handleSendAnotherFile}
      />
    );
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
          selectedFiles={selectedFiles}
        />

        <NymFileSizeInfo files={selectedFiles} />

        <NymUploadedFilePreview
          fileList={selectedFiles}
          onFileRemove={handleRemoveFile}
          listType="picture-card"
        />

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextArea
          placeholder="Please enter a message 🦀"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
          maxLength={255}
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
