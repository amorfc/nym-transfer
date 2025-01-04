package net.nymtech.server.response;

import java.nio.ByteBuffer;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

/**
 * Serializer for outgoing responses through NYM Mixnet.
 * 
 * @author Onur Kayabasi(o.kayabasi@outlook.com)
 */
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public final class ResponseSerializer {

  private static final byte REQUEST_TAG_SEND = 0x00;
  private static final long CONNECTION_ID_EMPTY = 0L;

  public static ByteBuffer serialize(byte[] clientAddress, UUID id, Response.Status status,
      byte[] content) {
    var responseLength = 21 + content.length;
    var bufferSize = 1 + clientAddress.length + (2 * Long.BYTES) + responseLength;
    var buffer = ByteBuffer.allocate(bufferSize);

    buffer.put(REQUEST_TAG_SEND);
    buffer.put(clientAddress);
    buffer.putLong(CONNECTION_ID_EMPTY); // Connection ID, why needed?
    buffer.putLong(responseLength);
    // Response itself
    buffer.putLong(id.getMostSignificantBits());
    buffer.putLong(id.getLeastSignificantBits());
    buffer.put((byte) status.value());
    buffer.putInt(content.length);
    buffer.put(content);

    buffer.flip();

    return buffer;
  }

}
