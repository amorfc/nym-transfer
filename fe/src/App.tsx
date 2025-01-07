import { useEffect, useState } from "react";
import "./App.css";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { Input, Layout, ConfigProvider, List } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useAppDispatch } from "@/hooks/useAppStore";
import {
  setIsConnected,
  setRecipientAddress,
  setSelfAddress,
} from "@/store/slice/nymClientSlice";
import {
  useInitClientMutation,
  useUploadFileMutation,
} from "@/store/api/nymApi";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import { notifyError, notifySuccess } from "@/utils/GlobalNotification";
import { UploadFile } from "antd/es/upload/interface";
import NymLayout from "@/components/common/NymLayout";
import { useTheme } from "@/theme/themeConfig";
import NymCard from "@/components/common/NymCard.tsx";
import NymText from "@/components/common/NymText";
import NymFileUpload from "@/components/common/NymFileUpload";
import NymControlCenter from "@/components/common/NymControlCenter";
import NymButton from "@/components/common/NymButton";

const { Content } = Layout;

const MAX_STORAGE_GB = 2;
const GB_TO_BYTES = 1024 * 1024 * 1024;
const ALLOW_MULTIPLE_FILES = false;

function App() {
  const dispatch = useAppDispatch();
  const { isConnected, selfAddress, recipientAddress } = useSelectNymClient();
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [initClient] = useInitClientMutation();
  const [uploadFile] = useUploadFileMutation();

  const theme = useTheme();

  useEffect(() => {
    const connectClient = async () => {
      if (isConnected) return;
      try {
        await initClient({
          eventHandlers: {
            onConnected: () => dispatch(setIsConnected(true)),
            onSelfAddress: (address: string) =>
              dispatch(setSelfAddress(address)),
          },
        }).unwrap();
      } catch (error) {
        console.error("Connection failed:", error);
      }
    };

    connectClient();
    const interval = setInterval(connectClient, 10000);
    return () => clearInterval(interval);
  }, [dispatch, initClient, isConnected]);

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
        const content = new Uint8Array(arrayBuffer);

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

  return (
    <ConfigProvider wave={{ disabled: false }} theme={theme}>
      <NymLayout>
        <Content
          style={{
            padding: "48px",
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              maxWidth: 1400,
              width: "100%",
              margin: "0 auto",
            }}
          >
            <div style={{ flex: 1 }}></div>

            <NymCard>
              <NymFlexContainer vertical gap={12}>
                <NymFileUpload
                  onFileSelect={handleFileSelect}
                  disabled={!isConnected}
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
                          <a
                            key="remove"
                            onClick={() => handleRemoveFile(file.uid)}
                          >
                            Remove
                          </a>,
                        ]}
                      >
                        <List.Item.Meta
                          title={file.name}
                          description={`${(file.size! / (1024 * 1024)).toFixed(
                            2
                          )} MB`}
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
                    disabled={!isConnected}
                  >
                    Upload{" "}
                    {ALLOW_MULTIPLE_FILES
                      ? `${selectedFiles.length} file${
                          selectedFiles.length !== 1 ? "s" : ""
                        }`
                      : "file"}
                  </NymButton>
                )}

                {process.env.NODE_ENV === "development" && (
                  <div
                    style={{
                      padding: "16px",
                      background: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px",
                    }}
                  >
                    <NymText
                      tertiary
                      style={{ display: "block", marginBottom: 8 }}
                    >
                      Self Address: {selfAddress ?? "Connecting..."}
                    </NymText>
                    <Input
                      placeholder="Recipient Address"
                      value={recipientAddress ?? ""}
                      onChange={(e) =>
                        dispatch(setRecipientAddress(e.target.value))
                      }
                      style={{ marginTop: 8 }}
                    />
                  </div>
                )}
              </NymFlexContainer>
            </NymCard>
          </div>
        </Content>

        <NymControlCenter />
      </NymLayout>
    </ConfigProvider>
  );
}

export default App;
