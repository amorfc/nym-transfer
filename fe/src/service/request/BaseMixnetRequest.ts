import { DownloadPayload } from "@/service/request/DownloadMixnetRequest";
import { UploadPayload } from "@/service/request/UploadMixnetRequest";
import uuidv4 from "uuid4";

/**
 * Represents the possible response tags from the Nym server.
 * Matches the Rust implementation in the server.
 */
export enum ServerResponseTag {
  /** Value tag representing Error variant */
  Error = 0x00,

  /** Value tag representing Received variant */
  Received = 0x01,

  /** Value tag representing SelfAddress variant */
  SelfAddress = 0x02,

  /** Value tag representing LaneQueueLength variant */
  LaneQueueLength = 0x03,
}

export enum MixnetRequestType {
  UPLOAD_FILE = 1,
  DOWNLOAD_FILE = 2,
}

export type MixnetRequestContent = UploadPayload | DownloadPayload;

export class BaseMixnetRequest {
  public id: string;
  public type: MixnetRequestType;
  public selfAddress: number[];
  public recipientAddress: number[];
  public content: MixnetRequestContent;

  constructor(
    type: MixnetRequestType,
    selfAddress: number[],
    recipientAddress: number[],
    payload: MixnetRequestContent
  ) {
    this.id = uuidv4();
    this.type = type;
    this.selfAddress = selfAddress;
    this.recipientAddress = recipientAddress;
    this.content = payload;
  }

  /**
   * Returns the request ID UUID4
   * @returns {string}
   */
  public getRequestId(): string {
    return this.id;
  }

  serialize(): ArrayBuffer {
    const selfAddressBytes = this.selfAddress;
    const recipientAddressBytes = this.recipientAddress;

    const contentBytes = new TextEncoder().encode(JSON.stringify(this.content));
    const requestLength =
      21 + selfAddressBytes.length + 4 + contentBytes.length;
    const bufferSize = 1 + recipientAddressBytes.length + 2 * 8 + requestLength;

    // Create buffer and fill it following Java implementation
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);
    let offset = 0;

    // Request tag + client address + connection ID + request length
    view.setUint8(offset++, 0x00); // Request tag
    recipientAddressBytes.forEach((byte) => view.setUint8(offset++, byte)); // client address
    view.setBigUint64(offset, BigInt(0)); // connection ID
    offset += 8;
    view.setBigUint64(offset, BigInt(requestLength)); // request length
    offset += 8;

    // Request itself - UUID parts
    const uuidParts = this.id.replace(/-/g, "").match(/.{1,16}/g);
    if (uuidParts && uuidParts.length === 2) {
      view.setBigUint64(offset, BigInt(`0x${uuidParts[0]}`));
      offset += 8;
      view.setBigUint64(offset, BigInt(`0x${uuidParts[1]}`));
      offset += 8;
    }

    view.setUint8(offset++, this.type);
    view.setUint32(offset, selfAddressBytes.length);
    offset += 4;
    selfAddressBytes.forEach((byte) => view.setUint8(offset++, byte));
    view.setUint32(offset, contentBytes.length);
    offset += 4;
    contentBytes.forEach((byte) => view.setUint8(offset++, byte));

    return buffer;
  }
}
