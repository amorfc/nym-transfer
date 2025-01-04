import { useEffect, useState } from "react";
import "./App.css";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { Input, List, Layout, ConfigProvider } from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  MixnetRequest,
  MixnetRequestType,
} from "@/service/request/MixnetRequest";
import uuid4 from "uuid4";
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
import { MixnetRequestSerilizer } from "@/utils/MixnetRequestSerilizer";
import { notifyError, notifySuccess } from "@/utils/GlobalNotification";
import { UploadFile } from "antd/es/upload/interface";
import NymLayout from "@/components/common/NymLayout";
import { useTheme } from "@/theme/themeConfig";
import NymCard from "@/components/common/NymCard.tsx";
import NymText from "@/components/common/NymText";
import NymFileUpload from "@/components/common/NymFileUpload";
import NymControlCenter from "@/components/common/NymControlCenter";
import NymButtonDebug from "@/components/debug/NymButtonDebug";

const { Content } = Layout;

const alwaysTryToConnectDEV = false;

function App() {
  const dispatch = useAppDispatch();
  const { isConnected, selfAddress, recipientAddress } = useSelectNymClient();
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [initClient] = useInitClientMutation();
  const [uploadFile] = useUploadFileMutation();

  const theme = useTheme();

  useEffect(() => {
    const connectClient = async () => {
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

    if (!isConnected && alwaysTryToConnectDEV) {
      connectClient();
      const interval = setInterval(connectClient, 10000);
      return () => clearInterval(interval);
    }
  }, [isConnected, initClient, dispatch]);

  const handleUpload = async (file: UploadFile) => {
    if (!recipientAddress) {
      notifyError("Please enter a recipient address");
      return;
    }

    if (!title.trim()) {
      notifyError("Please enter a title");
      return;
    }

    try {
      setUploading(true);
      const arrayBuffer = await file.originFileObj?.arrayBuffer();
      if (!arrayBuffer) throw new Error("Failed to read file");

      const content = new Uint8Array(arrayBuffer);
      const request = new MixnetRequest(
        uuid4(),
        MixnetRequestType.UPLOAD_FILE,
        {
          userId: uuid4(),
          title: title,
          message: messageText,
          content: Array.from(content),
        }
      );

      await uploadFile({
        payload: MixnetRequestSerilizer.serialize(request),
      }).unwrap();

      setUploadedFiles((prev) => [...prev, file]);
      notifySuccess("File uploaded successfully");
      setTitle("");
      setMessageText("");
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file: UploadFile) => {
    try {
      handleUpload(file);
    } catch (error) {
      notifyError(error instanceof Error ? error.message : "Invalid file");
    }
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
                />

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

                {uploadedFiles.length > 0 && (
                  <List
                    dataSource={uploadedFiles}
                    renderItem={(file) => (
                      <List.Item>
                        <div
                          style={{
                            padding: "8px 12px",
                            background: "rgba(0, 0, 0, 0.2)",
                            borderRadius: "8px",
                            width: "100%",
                          }}
                        >
                          <NymText ellipsis>{file.name}</NymText>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </NymFlexContainer>
            </NymCard>
          </div>
        </Content>

        <NymControlCenter />
        <NymButtonDebug />
      </NymLayout>
    </ConfigProvider>
  );
}

export default App;
