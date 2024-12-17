/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./App.css";
import NymScreenWrapper from "@/components/screen/NymScreenWrapper";
import NymButton from "@/components/common/NymButton";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  MixnetRequest,
  MixnetRequestType,
} from "@/service/request/MixnetRequest";
import useRecipientAddresses from "@/hooks/useRecipientAddresses";
import uuid4 from "uuid4";
import { useAppDispatch } from "@/hooks/useAppStore";
import {
  setIsConnected,
  setIsConnecting,
  setReceivedMessage,
  setRecipientAddress,
  setSelfAddress,
} from "@/store/slice/nymClientSlice";
import {
  useInitClientMutation,
  useStopClientMutation,
  useUploadFileMutation,
} from "@/store/api/nymApi";
import { useSelectNymClient } from "@/hooks/store/useSelectNymClient";
import { MixnetRequestSerilizer } from "@/utils/MixnetRequestSerilizer";
import { notifyError, notifySuccess } from "@/utils/GlobalNotification";
import { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { useFileUpload } from "@/hooks/useFileUpload";

function App() {
  const dispatch = useAppDispatch();
  const { isConnected, isConnecting, selfAddress, recipientAddress } =
    useSelectNymClient();

  const [uploading, setUploading] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const { recipientAddresses } = useRecipientAddresses();

  const [initClient] = useInitClientMutation();
  const [stopClient] = useStopClientMutation();
  const [uploadFile] = useUploadFileMutation();

  const { file, setFile, validateFile } = useFileUpload({
    maxSize: 500, // 500MB
    allowedTypes: ["image/png", "image/jpeg", "application/pdf"],
  });

  const init = async () => {
    dispatch(setIsConnecting(true));
    try {
      await initClient({
        eventHandlers: {
          onConnected: () => {
            dispatch(setIsConnected(true));
          },
          onDisconnected: () => {
            dispatch(setIsConnected(false));
          },
          onSelfAddress: (address: string) => {
            dispatch(setSelfAddress(address));
          },
          onMessageReceived: (message: string) => {
            dispatch(setReceivedMessage(message));
          },
        },
      }).unwrap();
    } catch (error) {
      console.error("Failed to start client", error);
    } finally {
      dispatch(setIsConnecting(false));
    }
  };

  const stop = async () => {
    try {
      await stopClient().unwrap();
      dispatch(setIsConnected(false));
    } catch (error) {
      console.error("Failed to stop client", error);
    }
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    try {
      if (!info.fileList?.length) {
        notifyError("No file selected");
        return;
      }

      const uploadFile = info.fileList[0];
      const selectedFile = uploadFile.originFileObj;

      if (!selectedFile) {
        notifyError("Invalid file object");
        return;
      }

      // Validate file
      validateFile(selectedFile);

      setFile(selectedFile);
      notifySuccess(`File "${selectedFile.name}" selected successfully`);
    } catch (error) {
      if (error instanceof Error) {
        notifyError(error.message);
      } else {
        notifyError("Unknown error occurred while handling file");
      }
      console.error("File selection error:", error);
      setFile(null);
    }
  };

  const send = async () => {
    if (!recipientAddress) {
      notifyError("Please enter a recipient address");
      return;
    }

    if (!file) {
      notifyError("Please select a file to upload");
      return;
    }

    try {
      setUploading(true);
      const reader = new FileReader();

      const uploadPromise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
      });

      const arrayBuffer = await uploadPromise;
      const content = new Uint8Array(arrayBuffer as ArrayBuffer);

      const request = new MixnetRequest(
        uuid4(),
        MixnetRequestType.UPLOAD_FILE,
        {
          userId: uuid4(),
          title: file.name,
          message: messageText,
          content: Array.from(content),
        }
      );

      await uploadFile({
        payload: MixnetRequestSerilizer.serialize(request),
      }).unwrap();

      notifySuccess("File uploaded successfully");
    } catch (error) {
      if (error instanceof Error) {
        notifyError(error.message);
      } else {
        notifyError("Failed to upload file");
      }
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const setRecipentAdress = (address: string) =>
    dispatch(setRecipientAddress(address));

  const spaceY = 12;
  return (
    <NymScreenWrapper vertical flex={1} justify="center" align="center">
      <NymFlexContainer
        vertical
        flex={1}
        justify="center"
        align="center"
        gap={spaceY}
      >
        <NymFlexContainer vertical gap={spaceY}>
          <NymFlexContainer vertical>
            <Typography.Title level={4} type="danger">
              Self Address
            </Typography.Title>
            <Typography.Text type="warning">{selfAddress}</Typography.Text>
          </NymFlexContainer>
          <NymFlexContainer vertical>
            <Typography.Title level={4} type="danger">
              Recipient {isConnected && recipientAddress ? "✅" : "❌"}
            </Typography.Title>
            {isConnected && (
              <Typography.Text type="warning">
                {recipientAddress}
              </Typography.Text>
            )}
          </NymFlexContainer>
        </NymFlexContainer>
        <NymFlexContainer
          vertical
          gap={spaceY}
          style={{ backgroundColor: "transparent" }}
        >
          <TextArea
            placeholder="Message"
            onChange={(e) => setMessageText(e.target.value)}
          />
          <TextArea
            placeholder="Recipent Address"
            value={recipientAddress ?? ""}
            onChange={(e) => dispatch(setRecipientAddress(e.target.value))}
          />
          <NymButton
            type="primary"
            onClick={send}
            loading={uploading}
            disabled={!isConnected}
          >
            Send
          </NymButton>
          <NymButton type="primary" onClick={init} loading={isConnecting}>
            Try to Connect
          </NymButton>
          <NymButton
            type="primary"
            onClick={stop}
            disabled={!isConnected}
            loading={isConnecting}
          >
            Stop
          </NymButton>
          <Upload beforeUpload={() => false} onChange={handleFileChange}>
            <NymButton icon={<UploadOutlined />}>Select File</NymButton>
          </Upload>
        </NymFlexContainer>
        <NymFlexContainer vertical>
          {recipientAddresses.map((address) => (
            <NymButton
              key={address}
              type="text"
              onClick={() => setRecipentAdress(address)}
            >
              {address}
            </NymButton>
          ))}
        </NymFlexContainer>
      </NymFlexContainer>
    </NymScreenWrapper>
  );
}

export default App;
