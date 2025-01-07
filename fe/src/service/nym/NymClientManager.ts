// import {
//   createNymMixnetClient,
//   NymMixnetClient,
//   EventKinds,
// } from "@nymproject/sdk-full-fat";
import { BaseMixnetRequest } from "@/service/request/BaseMixnetRequest";
import { RequestManager } from "@/service/request/RequestManager";

export type NymClientEventHandlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onSelfAddress?: (address: string) => void;
  onMessageReceived?: (message: string) => void;
};

type RawSendWithoutSdkParams = {
  request: BaseMixnetRequest;
  recipient: string;
};

class NymClientManager {
  private static instance: NymClientManager;
  private ws: WebSocket | null = null;
  // Manages pending requests
  readonly requestManager: RequestManager;
  // For SDK implementation:
  // private client: NymMixnetClient | null = null;
  // private readonly nymApiUrl = "https://validator.nymtech.net/api";
  private eventHandlers: NymClientEventHandlers = {};
  readonly selfAddress: Uint8Array | null = new Uint8Array([0x00]);

  private constructor() {
    this.requestManager = new RequestManager();
  }

  public static getInstance(): NymClientManager {
    if (!NymClientManager.instance) {
      NymClientManager.instance = new NymClientManager();
    }
    return NymClientManager.instance;
  }

  public async init(eventHandlers?: NymClientEventHandlers) {
    if (eventHandlers) {
      this.eventHandlers = eventHandlers;
    }

    // WebSocket implementation for development:
    return new Promise((resolve, reject) => {
      if (
        this.ws?.readyState === WebSocket.OPEN ||
        this.ws?.readyState === WebSocket.CONNECTING
      ) {
        console.log("WebSocket already connected");
        return Promise.resolve(true);
      }
      const port = "1977";
      const localClientUrl = "ws://127.0.0.1:" + port;

      const ws = new WebSocket(localClientUrl);
      this.ws = ws;

      ws.onopen = () => {
        console.log("WebSocket Connected");
        this.eventHandlers.onConnected?.();

        // Request self-address
        const selfAddressRequest = new Uint8Array([0x03]);
        ws.send(selfAddressRequest);
        resolve(true);
      };

      ws.onerror = (err) => {
        console.log({ WsOnErrorErr: err });
        reject(err);
      };

      ws.onclose = () => {
        this.eventHandlers.onDisconnected?.();
      };

      ws.onmessage = this.handleMessage.bind(this);
    });
  }
  private handleMessage(event: MessageEvent) {
    const rawData = event.data;

    // If the server sends JSON, parse it.
    // Make sure the server includes a 'requestId' to match the request.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let message: any;
    try {
      message = JSON.parse(rawData);
    } catch (err) {
      console.warn("Failed to parse incoming message as JSON:", rawData);
      console.error(err);
      return;
    }

    const { requestId, status } = message;
    if (!requestId) {
      // If there's no requestId, it's a general notification. You could
      // still pass it to onMessageReceived or handle it differently.
      this.eventHandlers.onMessageReceived?.(rawData);
      return;
    }

    // Identify the relevant pending request
    if (status === "success") {
      this.requestManager.finalizeRequest(requestId, message);
    } else if (status === "failure") {
      this.requestManager.finalizeRequest(
        requestId,
        null,
        new Error(message.error || "Request failed")
      );
    } else if (status === "progress") {
      // If you expect progress updates, you might decide NOT to finalize it yet.
      // You can store partial info here or handle progress in another way.
      // For example, you could fire an event or keep track of progress in the request.
      console.log(
        `Progress update for requestId=${requestId}: ${JSON.stringify(message)}`
      );
    } else {
      // Fallback for unrecognized status
      console.warn(
        `Unrecognized status: '${status}' in response for requestId=${requestId}`
      );
    }
  }

  // SDK implementation:
  /*
    if (eventHandlers) {
      this.eventHandlers = eventHandlers;
    }
    this.client = await createNymMixnetClient();

    await this.client.client.start({
      clientId: uuid4(),
      nymApiUrl: this.nymApiUrl,
    });

    this.subscribeToEvents();
    */

  // SDK implementation:
  /*
  private subscribeToEvents() {
    if (!this.client) return;

    this.client.events.subscribeToConnected((e) => {
      console.log({ e });

      const {
        kind,
        args: { address },
      } = e;

      if (address && EventKinds.Connected === kind) {
        this.eventHandlers.onConnected?.();
        this.eventHandlers.onSelfAddress?.(address);
      }
    });

    this.client.events.subscribeToDisconnected((e) => {
      if (e.kind === EventKinds.Disconnected) {
        this.eventHandlers.onDisconnected?.();
      }
    });

    this.client.events.subscribeToTextMessageReceivedEvent((e) => {
      this.eventHandlers.onMessageReceived?.(e.args.payload);
    });
  }
  */

  public async stop() {
    // WebSocket implementation:
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.eventHandlers.onDisconnected?.();
    }

    // Clean up all pending requests
    this.requestManager.clearAllRequests(
      "Stopping NymClientManager and clearing all pending requests."
    );

    // SDK implementation:
    /*
    if (this.client) {
      await this.client.client.stop();
      this.client = null;
      this.eventHandlers.onDisconnected?.();
    }
    */
  }

  public async sendMessage(recipient: string, request: BaseMixnetRequest) {
    // WebSocket implementation:
    if (!this.ws || !this.selfAddress) {
      throw new Error("NYM client is not initialized");
    }

    // Acquire a unique request ID from the BaseMixnetRequest instance
    const requestId: string = request.getRequestId();

    // Decide on a timeout for receiving a response
    const REQUEST_TIMEOUT_MS = 2000;

    // Create a Promise that will be resolved or rejected when we hear back
    const pendingPromise = this.requestManager.createRequest(
      requestId,
      request,
      REQUEST_TIMEOUT_MS
    );

    await this.rawSendWithoutSdk({
      request,
      recipient,
    });

    return pendingPromise;
  }

  public async rawSendWithoutSdk(params: RawSendWithoutSdkParams) {
    if (!this.ws) {
      throw new Error("NYM client is not initialized");
    }

    const { request } = params;

    // Send the buffer
    this.ws.send(request.serialize());
  }

  public isConnected(): boolean {
    // WebSocket implementation:
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;

    // SDK implementation:
    // return this.client !== null;
  }
}

export default NymClientManager;
