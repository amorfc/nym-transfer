/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNymMixnetClient,
  EventKinds,
  NymMixnetClient,
} from "@nymproject/sdk-full-fat";
import { useCallback, useState } from "react";
import "./App.css";
import NymScreenWrapper from "@/components/screen/NymScreenWrapper";
import NymButton from "@/components/common/NymButton";
import NymFlexContainer from "@/components/common/NymFlexContainer";
import { Typography, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { IconType } from "antd/es/notification/interface";
import {
  MixnetRequest,
  MixnetRequestType,
} from "@/service/request/MixnetRequest";
import { MixnetRequestSerilizer } from "@/service/utils/MixnetRequestSerilizer";
import useRecipientAddresses from "@/hooks/useRecipientAddresses";

const nymApiUrl = "https://validator.nymtech.net/api";

function App() {
  const [nym, setNym] = useState<NymMixnetClient>();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selfAddress, setSelfAddress] = useState<string>();
  const [messageText, setMessageText] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>();
  const [recipentAddress, setRecipentAdress] = useState<string | null>();
  const { recipientAddresses, addRecipient } = useRecipientAddresses();

  const init = useCallback(async () => {
    setIsConnecting(true);

    try {
      const client = await createNymMixnetClient();
      setNym(client);

      await client?.client.start({
        clientId: crypto.randomUUID(),
        nymApiUrl,
      });

      client?.events.subscribeToConnected((e) => {
        if (e.kind == EventKinds.Connected) {
          setIsConnecting(false);
          setIsConnected(true);
          showNotification("Connected to Nym Mixnet", "success");
        }

        const { address } = e.args;
        setSelfAddress(address);
      });

      client?.events.subscribeToLoaded((e) => {
        console.log("Client ready: ", e.args);
        showNotification("Client ready to loaded", "success");
      });

      client?.events.subscribeToTextMessageReceivedEvent((e) => {
        console.log(e.args.payload);
        setReceivedMessage(e.args.payload);
        showNotification(`Message received ${JSON.stringify(e)}`, "info");
      });
    } catch (error) {
      showNotification(`Failed to start client ${error}`, "error");
      console.error("Failed to start client", error);
    }
  }, []);

  const stop = useCallback(async () => {
    try {
      await nym?.client.stop();
    } catch (error) {
      showNotification(`Failed to stop client ${error}`, "error");
      console.error("Failed to stop client", error);
    } finally {
      setIsConnected(false);
    }
  }, [nym]);

  const send = async () => {
    if (!recipentAddress) {
      showNotification("Please enter a recipient address", "error");
      return;
    }
    setUploading(true);

    const request = new MixnetRequest(
      "123e4567-e89b-12d3-a456-426614174000",
      MixnetRequestType.TYPE_A,
      { message: messageText }
    );

    try {
      await nym?.client.rawSend({
        payload: MixnetRequestSerilizer.serialize(request),
        recipient: recipentAddress,
      });

      showNotification("Message sent", "success");
      addRecipient(recipentAddress);
    } catch (error) {
      showNotification(`Failed to send message ${error}`, "error");
      console.error("Failed to send message", error);
    } finally {
      setUploading(false);
    }
  };

  const showNotification = (message: string, type: IconType = "info") => {
    notification.open({
      message: type.toUpperCase(),
      description: message,
      type,
      showProgress: true,
      pauseOnHover: true,
    });
  };

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
              Recipient {isConnected ? "✅" : "❌"}
            </Typography.Title>
            {isConnected && (
              <Typography.Text type="warning">
                {recipentAddress}
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
            value={recipentAddress ?? ""}
            onChange={(e) => setRecipentAdress(e.target.value)}
          />
          <NymButton type="primary" onClick={send} loading={uploading}>
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
