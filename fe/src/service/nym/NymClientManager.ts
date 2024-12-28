// src/services/NymClientManager.ts
import {
  createNymMixnetClient,
  NymMixnetClient,
  EventKinds,
} from "@nymproject/sdk-full-fat";
import uuid4 from "uuid4";

export type NymClientEventHandlers = {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onSelfAddress?: (address: string) => void;
  onMessageReceived?: (message: string) => void;
};

class NymClientManager {
  private static instance: NymClientManager;
  private client: NymMixnetClient | null = null;
  private readonly nymApiUrl = "https://validator.nymtech.net/api";
  private eventHandlers: NymClientEventHandlers = {};

  private constructor() {}

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
    this.client = await createNymMixnetClient();

    await this.client.client.start({
      clientId: uuid4(),
      nymApiUrl: this.nymApiUrl,
      forceTls: true,
    });

    this.subscribeToEvents();
  }

  private subscribeToEvents() {
    if (!this.client) return;

    this.client.events.subscribeToConnected((e) => {
      if (e.kind === EventKinds.Connected) {
        this.eventHandlers.onConnected?.();
        this.getSelfAddress();
      }
    });

    // this.client.events.subscribeToDisconnected((e) => {
    //   if (e.kind === EventKinds.Disconnected) {
    //     this.eventHandlers.onDisconnected?.();
    //   }
    // });

    this.client.events.subscribeToTextMessageReceivedEvent((e) => {
      this.eventHandlers.onMessageReceived?.(e.args.payload);
    });
  }

  private async getSelfAddress() {
    if (this.client) {
      const address = await this.client.client.selfAddress();
      if (address) {
        this.eventHandlers.onSelfAddress?.(address);
      } else {
        throw new Error("Failed to get self address");
      }
    }
  }

  public async stop() {
    if (this.client) {
      await this.client.client.stop();
      this.client = null;
      this.eventHandlers.onDisconnected?.();
    }
  }

  public async sendMessage(recipient: string, payload: Uint8Array) {
    if (this.client) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await this.client.client.rawSend({
        payload,
        recipient,
      });
    } else {
      throw new Error("NYM client is not initialized");
    }
  }

  public isConnected(): boolean {
    return this.client !== null;
  }
}

export default NymClientManager;
