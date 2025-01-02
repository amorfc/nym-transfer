import { useEffect, useState } from "react";
import "./App.css";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import {
  Typography,
  Upload,
  Input,
  List,
  Card,
  Layout,
  ConfigProvider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  MixnetRequest,
  MixnetRequestType,
} from "@/service/request/MixnetRequest";
import uuid4 from "uuid4";
import { useAppDispatch } from "@/hooks/useAppStore";
import {
  setIsConnected,
  setSelfAddress,
  setRecipientAddress,
} from "@/store/slice/nymClientSlice";
import {
  useInitClientMutation,
  useUploadFileMutation,
} from "@/store/api/nymApi";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import { MixnetRequestSerilizer } from "@/utils/MixnetRequestSerilizer";
import { notifyError, notifySuccess } from "@/utils/GlobalNotification";
import { UploadFile } from "antd/es/upload/interface";
import { useFileUpload } from "@/hooks/useFileUpload";
import NymButton from "@/components/common/NymButton";
import NymLayout from "@/components/common/NymLayout";
import NymConnectionStatus from "@/components/common/NymConnectionStatus";

const { Content } = Layout;
const { Text } = Typography;

function App() {
  const dispatch = useAppDispatch();
  const { isConnected, selfAddress, recipientAddress } = useSelectNymClient();
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [initClient] = useInitClientMutation();
  const [uploadFile] = useUploadFileMutation();

  const { validateFile } = useFileUpload({
    maxSize: 500,
    allowedTypes: ["image/png", "image/jpeg", "application/pdf"],
  });

  // Auto-reconnection logic
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

    if (!isConnected) {
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

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: "rgba(255, 255, 255, 0.05)",
            colorBorder: "rgba(255, 255, 255, 0.1)",
            colorText: "#fff",
            colorTextPlaceholder: "rgba(255, 255, 255, 0.65)",
            activeBorderColor: "#FF5B37",
            hoverBorderColor: "rgba(255, 255, 255, 0.2)",
          },
          Card: {
            colorBgContainer: "rgba(255, 255, 255, 0.05)",
            colorBorderSecondary: "rgba(255, 255, 255, 0.1)",
          },
          Button: {
            primaryColor: "#fff",
            colorPrimary: "#FF5B37",
          },
        },
      }}
    >
      <NymLayout
        style={{
          minHeight: "100vh",
          background: "#1E1E1E",
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255, 91, 55, 0.15) 0%, rgba(30, 30, 30, 0) 70%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
              gap: "48px",
            }}
          >
            <div style={{ flex: 1 }}></div>

            <div style={{ width: "400px" }}>
              <Card
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <NymFlexContainer vertical gap={12}>
                  <NymFlexContainer vertical gap={8}>
                    <Upload
                      accept=".png,.jpg,.jpeg,.pdf"
                      beforeUpload={(file) => {
                        try {
                          validateFile(file);
                          handleUpload(file as UploadFile);
                        } catch (error) {
                          notifyError(
                            error instanceof Error
                              ? error.message
                              : "Invalid file"
                          );
                        }
                        return false;
                      }}
                      disabled={!isConnected || uploading}
                      style={{ width: "100%" }}
                    >
                      <NymButton
                        type="text"
                        icon={<UploadOutlined />}
                        fullWidth
                        disabled={!isConnected || uploading}
                      >
                        Add files
                      </NymButton>
                    </Upload>
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.45)",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      Up to 2 GB free
                    </Text>
                  </NymFlexContainer>

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
                      <Text
                        style={{
                          color: "rgba(255, 255, 255, 0.45)",
                          display: "block",
                          marginBottom: 8,
                        }}
                      >
                        Self Address: {selfAddress ?? "Connecting..."}
                      </Text>
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
                            <Text style={{ color: "#fff" }} ellipsis>
                              {file.name}
                            </Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  )}
                </NymFlexContainer>
              </Card>
            </div>
          </div>
        </Content>

        <NymConnectionStatus isConnected={isConnected} />
      </NymLayout>
    </ConfigProvider>
  );
}

export default App;
