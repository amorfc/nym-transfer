/* eslint-disable @typescript-eslint/no-unused-vars */
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
  onSelfAddress?: (address: number[]) => void;
  onMessageReceived?: (message: string) => void;
};

class NymClientManager {
  private static instance: NymClientManager;
  private ws: WebSocket | null = null;
  private isConnecting: boolean = false;
  private selfAddress: number[] | null = null;
  // Manages pending requests
  readonly requestManager: RequestManager;
  // For SDK implementation:
  // private client: NymMixnetClient | null = null;
  // private readonly nymApiUrl = "https://validator.nymtech.net/api";
  private eventHandlers: NymClientEventHandlers = {};

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
    // Check if already connected
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.debug("WebSocket already connected");
      return true;
    }

    // Check if connection is in progress
    if (this.isConnecting) {
      console.debug("Connection already in progress");
      return false;
    }

    // Clean up any existing connection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnecting = true;
    // WebSocket implementation for development:
    this.stop();
    try {
      const port = "1977";
      const localClientUrl = "ws://127.0.0.1:" + port;

      const ws = new WebSocket(localClientUrl);
      this.ws = ws;

      if (eventHandlers) {
        this.eventHandlers = eventHandlers;
      }

      ws.onopen = () => {
        console.debug("WebSocket Connected");
        this.eventHandlers.onConnected?.();
        this.isConnecting = false;

        // Send self address request (0x03) as binary data
        const selfAddressRequest = new Uint8Array([0x03]);
        this.ws?.send(selfAddressRequest);
        Promise.resolve(true);
      };

      ws.onerror = (err) => {
        this.isConnecting = false;
        const errorMessage = "WebSocket connection failed";
        console.error(errorMessage, err);
        Promise.reject(new Error(errorMessage));
      };

      ws.onclose = () => {
        console.debug("WebSocket Closed");
        this.eventHandlers.onDisconnected?.();
        this.isConnecting = false;
      };

      ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      this.isConnecting = false;
      throw error;
    }
  }
  private handleMessage(event: MessageEvent) {
    const blob = event.data as Blob;

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const data = new Uint8Array(arrayBuffer);

      // Check if there's enough data to read the tag
      if (data.length < 1) {
        console.error("Received data is too short to contain a response tag.");
        return;
      }

      const responseTag = data[0];

      switch (responseTag) {
        case 0x00: // Error
          this.handleError(data);
          break;
        case 0x01: // Received
          this.handleReceived(data);
          break;
        case 0x02: // SelfAddress
          this.handleSelfAddress(data);
          break;
        case 0x03: // LaneQueueLength
          this.handleLaneQueueLength(data);
          break;
        default:
          console.warn(`Unknown response tag: ${responseTag}`);
      }
    };

    reader.readAsArrayBuffer(blob);
  }

  private handleError(_data: Uint8Array) {
    // Deserialize and handle error response
    console.error("Error response received.");
    // Implement deserialization logic here
  }

  private handleReceived(_data: Uint8Array) {
    // Deserialize and handle received message
    console.debug("Received message.");
    // Implement deserialization logic here
  }

  private handleSelfAddress(data: Uint8Array) {
    // Deserialize and handle self address
    const selfAddressBytes = data.slice(1);
    const int8Array = new Int8Array(selfAddressBytes);
    console.debug("Self address received.");
    this.selfAddress = Array.from(int8Array);
    this.eventHandlers.onSelfAddress?.(this.selfAddress);
  }

  private handleLaneQueueLength(_data: Uint8Array) {
    // Deserialize and handle lane queue length
    console.debug("Lane queue length received.");
    // Implement deserialization logic here
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
      console.debug({ e });

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

  public async sendMessage(request: BaseMixnetRequest) {
    // WebSocket implementation:
    if (!this.ws) {
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

    await this.rawSendWithoutSdk(request);

    return pendingPromise;
  }

  public async rawSendWithoutSdk(request: BaseMixnetRequest) {
    if (!this.ws) {
      throw new Error("NYM client is not initialized");
    }

    if (!this.selfAddress) {
      throw new Error("Client address not received");
    }

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
