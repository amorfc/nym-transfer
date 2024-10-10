import { MixnetRequest } from "@/service/request/MixnetRequest";

export class MixnetRequestSerilizer {
  static serialize(request: MixnetRequest): Uint8Array {
    const requestIdBytes = uuidToBytes(request.requestId);
    const requestTypeByte = new Uint8Array([request.type]);

    const payloadString = JSON.stringify(request.payload);
    const payloadBytes = new TextEncoder().encode(payloadString);

    const buffer = new Uint8Array(
      4 + requestIdBytes.length + requestTypeByte.length + payloadBytes.length
    );

    // Add carriage returns and new lines (CR, LF, CR, LF)
    buffer.set([13, 10, 13, 10], 0);

    // Add requestIdBytes (16 bytes)
    buffer.set(requestIdBytes, 4);

    // Add requestType (1 byte)
    buffer.set(requestTypeByte, 20);

    // Add payload
    buffer.set(payloadBytes, 21);

    return buffer;
  }
}

function uuidToBytes(uuid: string): Uint8Array {
  const bytes = new Uint8Array(16);
  const parts = uuid.split("-");

  let offset = 0;
  parts.forEach((part, index) => {
    const size = index === 2 ? 4 : index === 1 || index === 3 ? 2 : 8;
    for (let i = 0; i < size; i += 2) {
      bytes[offset++] = parseInt(part.substr(i, 2), 16);
    }
  });
  return bytes;
}
