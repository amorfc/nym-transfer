import { UploadPayload } from "@/service/request/UploadMixnetRequest";
import uuidv4 from "uuid4";

export enum MixnetRequestType {
  UPLOAD_FILE = 1,
  DOWNLOAD_FILE = 2,
}

export type MixnetRequestContent = UploadPayload; /*| DownloadPayload;*/
export class BaseMixnetRequest {
  public id: string;
  public type: MixnetRequestType;
  public clientAddress: string;
  public content: MixnetRequestContent;

  constructor(
    type: MixnetRequestType,
    clientAddress: string,
    payload: MixnetRequestContent
  ) {
    this.id = uuidv4();
    this.type = type;
    this.clientAddress = clientAddress;
    this.content = payload;
  }

  serialize(): ArrayBuffer {
    const clientAddressBytes = stringToSignedByteArray(this.clientAddress);
    const contentBytes = new TextEncoder().encode(JSON.stringify(this.content));
    const requestLength =
      21 + clientAddressBytes.length + 4 + contentBytes.length;
    const bufferSize = 1 + clientAddressBytes.length + 2 * 8 + requestLength;

    // Create buffer and fill it following Java implementation
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);
    let offset = 0;

    // Request tag + client address + connection ID + request length
    view.setUint8(offset++, 0x00); // Request tag
    clientAddressBytes.forEach((byte) => view.setUint8(offset++, byte)); // client address
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
    view.setUint32(offset, clientAddressBytes.length);
    offset += 4;
    clientAddressBytes.forEach((byte) => view.setUint8(offset++, byte));
    view.setUint32(offset, contentBytes.length);
    offset += 4;
    contentBytes.forEach((byte) => view.setUint8(offset++, byte));

    return buffer;
  }
}

function stringToSignedByteArray(input: string): number[] {
  const encoder = new TextEncoder();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const byteArray = encoder.encode(input);

  return [
    -90, -68, 86, -127, -57, 98, 83, 85, 119, -69, 37, 75, -26, -87, 89, -70,
    -122, -23, -35, -11, -30, -6, -8, 106, -32, 115, -19, -39, -10, 79, -68,
    -76, -125, -27, 72, 17, -116, -96, 80, -57, -55, -51, -106, -36, -109, 38,
    98, 81, 7, -96, -78, -39, 91, -69, 26, -73, -103, 109, 19, -107, 72, 12, 57,
    75, 31, -61, -108, -92, -30, 108, 64, 83, -71, 94, -42, -32, 0, 99, -56,
    -74, 52, -111, 125, -64, -3, 93, 43, -74, -95, 18, -16, -17, 109, 101, -23,
    104,
  ];
}
