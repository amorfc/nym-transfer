import {
  createNymMixnetClient,
  NymMixnetClient,
  Payload,
} from "@nymproject/sdk-full-fat";
import { useCallback, useEffect, useState } from "react";

const nymApiUrl = "https://validator.nymtech.net/api";
const nymTransferRecipent =
  "4EmHz35EtDXsa2C4VLzrAdhm8jxSGTXpYEqMM4RmnH1p.AXhSRqSGEojF9XEPpVRYR33PtmCi6b4Qy9fhjCk5ppQw@Atnr7kpfz9sgTXqnh6A6g8BUZbCdVpo19XJXKJvSjCyQ";
function App() {
  const [nym, setNym] = useState<NymMixnetClient>();
  const [selfAddress, setSelfAddress] = useState<string>();
  const [recipient, setRecipient] = useState<string>();
  const [payload, setPayload] = useState<Payload>();
  const [receivedMessage, setReceivedMessage] = useState<string>();

  const init = useCallback(async () => {
    try {
      const client = await createNymMixnetClient({
        autoConvertStringMimeTypes: ["text/plain", "application/json"],
      });
      setNym(client);

      await client?.client.start({
        clientId: crypto.randomUUID(),
        nymApiUrl,
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
      console.error("Failed to start client Onur", error);
    }
  }, []);

  const stop = useCallback(async () => {
    await nym?.client.stop();
  }, [nym]);

  const content = {
    headers: {
      clientAddress: "encryptId.sphinxkey@gatwayId",
    },
    userId: "userId",
  };

  function jsonToUint8Array(json: any): Uint8Array {
    // Step 1: Convert the JSON object to a string
    const jsonString = JSON.stringify(json);

    // Step 2: Encode the string to a Uint8Array
    const encoder = new TextEncoder();
    return encoder.encode(jsonString);
  }

  function uint8ArrayToJson(uint8Array: Uint8Array): any {
    // Step 1: Decode the Uint8Array to a string
    const decoder = new TextDecoder("utf-8");
    const jsonString = decoder.decode(uint8Array);

    // Step 2: Parse the string as JSON
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return null;
    }
  }

  const send = () =>
    nym?.client.rawSend({
      payload: jsonToUint8Array("SELAM"),
      recipient: nymTransferRecipent,
    });

  console.log("receivedMessage", uint8ArrayToJson(jsonToUint8Array("SELAM")));

  // nym?.client.send({
  //   payload: { message: "sa" },
  //   recipient: nymTransferRecipent,
  // });

  useEffect(() => {
    init();

    return () => {
      stop();
    };
  }, []);

  return (
    <>
      <input
        value={recipient ?? ""}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <button onClick={send}>Send</button>
    </>
  );
}

export default App;
