import TransitionWrapper from "@/components/animation/TransitionWrapper";
import NymButton from "@/components/common/NymButton";
import NymFileUpload from "@/components/common/NymFileUpload";
import NymText from "@/components/common/NymText";
import { LoadingLottie } from "@/components/lotties/LoadingLottie";
import { useNymClientStatus } from "@/hooks/store/useNymClientStatus";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import { useNymFileLink } from "@/hooks/useNymFileLink";
import { useUploadFileMutation } from "@/store/api/nymApi";
import { notifyError, notifySuccess } from "@/utils/GlobalNotification";
import { Input, List, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

const MAX_STORAGE_GB = 2;
const GB_TO_BYTES = 1024 * 1024 * 1024;
const ALLOW_MULTIPLE_FILES = false;

enum UploadState {
  INITIAL, // Initial state where no input has been provided.
  IN_PROGRESS, // The upload is currently in progress.
  COMPLETED, // The upload is finished.
}

const UploadRoute = () => {
  const { recipientAddress } = useSelectNymClient();
  const { isNymClientReady } = useNymClientStatus();
  const { createNymDownloadLink } = useNymFileLink();
  const [title, setTitle] = useState("asdfasdf");
  const [uploadState, setUploadState] = useState<UploadState>(
    UploadState.INITIAL
  );
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [uploadFile, { isLoading, isSuccess, data }] = useUploadFileMutation();

  const totalSize = selectedFiles.reduce(
    (acc, file) => acc + (file.size ?? 0),
    0
  );
  const remainingBytes = MAX_STORAGE_GB * GB_TO_BYTES - totalSize;
  const remainingGB = remainingBytes / GB_TO_BYTES;

  const handleUploadAll = async () => {
    if (!recipientAddress) {
      notifyError("Please enter a recipient address");
      return;
    }

    if (!title.trim()) {
      notifyError("Please enter a title");
      return;
    }

    if (selectedFiles.length === 0) {
      notifyError("Please select at least one file");
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
            title: ALLOW_MULTIPLE_FILES ? `${title} - ${file.name}` : title,
            content,
          },
        }).unwrap();
      }

      notifySuccess(
        `File${selectedFiles.length > 1 ? "s" : ""} uploaded successfully`
      );
      setTitle("");
      setMessageText("");
      setSelectedFiles([]);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file: UploadFile) => {
    if (file.size && file.size > remainingBytes) {
      notifyError("Not enough storage space remaining");
      return;
    }

    if (!ALLOW_MULTIPLE_FILES) {
      setSelectedFiles([file]);
    } else {
      setSelectedFiles((prev) => [...prev, file]);
    }
  };

  const handleRemoveFile = (uid: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.uid !== uid));
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
    return (
      <TransitionWrapper>
        <LoadingLottie />
      </TransitionWrapper>
    );
  }

  if (uploadState === UploadState.COMPLETED && data) {
    return (
      <TransitionWrapper>
        <LoadingLottie />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {createNymDownloadLink(data)}
        </div>
      </TransitionWrapper>
    );
  }

  return (
    <div>
      <TransitionWrapper>
        <NymFileUpload
          onFileSelect={handleFileSelect}
          disabled={!isNymClientReady}
          uploading={uploading}
          multiple={ALLOW_MULTIPLE_FILES}
        />

        {selectedFiles.length > 0 && (
          <List
            size="small"
            dataSource={selectedFiles}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <a key="remove" onClick={() => handleRemoveFile(file.uid)}>
                    Remove
                  </a>,
                ]}
              >
                <List.Item.Meta
                  title={file.name}
                  description={`${(file.size! / (1024 * 1024)).toFixed(2)} MB`}
                />
              </List.Item>
            )}
            style={{ width: "100%" }}
          />
        )}

        <NymText size="small" style={{ marginTop: 8 }}>
          {remainingGB.toFixed(1)} GB remaining
        </NymText>

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextArea
          placeholder="Message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
        />

        {selectedFiles.length > 0 && (
          <NymButton
            block
            type="primary"
            onClick={handleUploadAll}
            loading={uploading}
            disabled={!isNymClientReady}
          >
            Upload{" "}
            {ALLOW_MULTIPLE_FILES
              ? `${selectedFiles.length} file${
                  selectedFiles.length !== 1 ? "s" : ""
                }`
              : "file"}
          </NymButton>
        )}
      </TransitionWrapper>
    </div>
  );
};

export default UploadRoute;
