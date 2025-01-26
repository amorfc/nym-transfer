import { useEffect, useState } from "react";
import {
  createNymMixnetClient,
  NymMixnetClient,
  Payload,
} from "@nymproject/sdk-full-fat";
import TransitionWrapper from "@/components/animation/TransitionWrapper";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import NymButton from "@/components/common/NymButton";

const nymApiUrl = "https://validator.nymtech.net/api";

export enum WasmE2ETestMode {
  DEV = "dev",
}

interface Props {
  mode: WasmE2ETestMode;
}

const WasmE2ETestRoute = ({ mode }: Props) => {
  const [nym, setNym] = useState<NymMixnetClient>();
  const [selfAddress, setSelfAddress] = useState<string>();
  const [recipient, setRecipient] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    try {
      setIsLoading(true);
      const client = await createNymMixnetClient();
      setNym(client);

      await client?.client.start({
        clientId: crypto.randomUUID(),
        nymApiUrl,
        // forceTls: true, // force WSS
      });

      client?.events.subscribeToConnected((e) => {
        const { address } = e.args;
        setSelfAddress(address);
      });

      client?.events.subscribeToLoaded((e) => {
        console.log("Client ready: ", e.args);
      });

      client?.events.subscribeToTextMessageReceivedEvent((e) => {
        console.log(e.args.payload);
        setReceivedMessage(e.args.payload);
      });
    } catch (error) {
      console.error("Failed to initialize client:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stop = async () => {
    try {
      await nym?.client.stop();
    } catch (error) {
      console.error("Failed to stop client:", error);
    }
  };

  const send = async () => {
    if (!nym || !recipient || !messageText) return;

    try {
      setIsLoading(true);
      await nym.client.send({
        payload: {
          message: messageText,
          mimeType: "text/plain",
        },
        recipient,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
    return () => {
      stop();
    };
  }, []);

  if (mode !== WasmE2ETestMode.DEV) {
    return null;
  }

  return (
    <TransitionWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-white font-bold text-2xl mb-8">WASM E2E Test</h1>

          <div className="flex flex-col space-y-6">
            {/* Self Address Display */}
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-gray-400 mb-2">My self address is:</div>
              <div className="text-white break-all font-mono">
                {selfAddress || "Connecting..."}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-white block mb-2">
                  Recipient Address
                </label>
                <Input
                  placeholder="Recipient Address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isLoading || !selfAddress}
                />
              </div>

              <div>
                <label className="text-white block mb-2">Message</label>
                <TextArea
                  placeholder="Message to send"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={isLoading || !selfAddress}
                  rows={4}
                />
              </div>

              <NymButton
                onClick={send}
                disabled={
                  !messageText || !recipient || isLoading || !selfAddress
                }
                loading={isLoading}
              >
                Send Message
              </NymButton>
            </div>

            {/* Received Message Display */}
            {receivedMessage && (
              <div className="bg-gray-700 p-4 rounded mt-4">
                <div className="text-gray-400 mb-2">Message Received!</div>
                <div className="text-white break-all font-mono">
                  {receivedMessage}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TransitionWrapper>
  );
};

export default WasmE2ETestRoute;
