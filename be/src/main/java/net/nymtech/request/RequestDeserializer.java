package net.nymtech.request;

import java.nio.ByteBuffer;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

/**
 * Deserializer for incoming requests through NYM Mixnet.
 * 
 * @author Onur Kayabasi(o.kayabasi@outlook.com)
 */
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public final class RequestDeserializer {

  /**
   * Converts the given {@code message} bytes to {@code Request} object.
   * 
   * @param message bytes to convert from
   * @return deserialized request
   * @throws IllegalArgumentException if given {@code message} has invalid format
   */
  public final static Request deserialize(ByteBuffer message) {
    byte[] id = new byte[16];
    byte type = 0;
    byte[] clientAddress = null;
    byte[] content = null;

    // Response tag(1 byte) + hasSenderTag flag(1 byte) + Length of data sent(8
    // byte)
    message.position(10);
    if (message.remaining() < 25) {
      throw new IllegalArgumentException("Request can't be smaller than 25 bytes!");
    }
    while (message.hasRemaining()) {
      if (message.position() >= 10 && message.position() < 26) {
        id[message.position() - 10] = message.get();
      } else if (message.position() == 26) {
        type = message.get();
        if (!Request.Type.hasValue(type)) {
          throw new IllegalArgumentException("No type value exists for given byte: %s!".formatted(type));
        }
      } else if (message.position() == 27) {
        int clientAddressLength = message.getInt(27);
        clientAddress = new byte[clientAddressLength];
        message.position(31);
      } else if (message.position() >= 31 && message.position() < 31 + clientAddress.length) {
        clientAddress[message.position() - 31] = message.get();
      } else if (message.position() == 31 + clientAddress.length) {
        int contentLength = message.getInt(31 + clientAddress.length);
        message.position(35 + clientAddress.length);
        if (message.remaining() != contentLength) {
          throw new IllegalArgumentException("Content length is not as expected, expected: %s, actual: %s"
              .formatted(contentLength, message.remaining()));
        }
        content = new byte[contentLength];
      } else {
        content[message.position() - (35 + clientAddress.length)] = message.get();
      }
    }

    return new Request(toUuid(id), Request.Type.valueOf(type), clientAddress, content);
  }

  private static UUID toUuid(byte[] from) {
    long mostSignificantBits = 0;
    long leastSignificantBits = 0;

    for (int i = 0; i < 8; i++) {
      mostSignificantBits = (mostSignificantBits << 8) | (from[i] & 0xFF);
    }
    for (int i = 8; i < 16; i++) {
      leastSignificantBits = (leastSignificantBits << 8) | (from[i] & 0xFF);
    }

    return new UUID(mostSignificantBits, leastSignificantBits);
  }

}
