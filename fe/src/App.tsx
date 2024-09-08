/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNymMixnetClient,
  NymMixnetClient,
} from "@nymproject/sdk-full-fat";
import { useCallback, useEffect, useState } from "react";

const nymApiUrl = "https://validator.nymtech.net/api";
const nymTransferRecipent = "client@address";
function App() {
  const [nym, setNym] = useState<NymMixnetClient>();
  const [selfAddress, setSelfAddress] = useState<string>();
  const [recipient, setRecipient] = useState<string>();
  const [messageText, setMessageText] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>();

  const init = useCallback(async () => {
    try {
      const client = await createNymMixnetClient();
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

  const send = () =>
    // nym?.client.rawSend({
    //   payload: jsonToUint8Array("SELAM"),
    //   recipient: nymTransferRecipent,
    // });

    //  `send` method not `rawSend` method
    nym?.client.send({
      payload: { message: "Cunku sen en cok seyi exception ile anlatirsin" },
      recipient: nymTransferRecipent,
    });

  useEffect(() => {
    init();

    return () => {
      stop();
    };
  }, []);

  return (
    <div>
      <span>Recipent - {nymTransferRecipent}</span>
      <div>
        <input
          value={messageText ?? ""}
          placeholder="Message to Send"
          onChange={(e) => setMessageText(e.target.value)}
        />
        <div>
          <button onClick={send}>Send</button>
        </div>
        <div>
          {receivedMessage && <h2>Received Message: {receivedMessage}</h2>}
        </div>
      </div>
    </div>
  );
}

export default App;
