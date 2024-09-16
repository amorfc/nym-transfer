package net.nymtech.request;

import java.nio.ByteBuffer;
import java.util.Arrays;
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

  private static final int SIZE_REQUEST_ID = 16;
  private static final int SIZE_REQUEST_TYPE = 16;
  private static final int ASCII_DECIMAL_CARRIAGE_RETURN = 13;
  private static final int ASCII_DECIMAL_NEW_LINE = 10;

  /**
   * Converts the given {@code message} bytes to {@code Request} object.
   * 
   * @param message bytes to convert from
   * @return deserialized request
   * @throws IllegalArgumentException if given {@code message} has invalid format
   */
  public final static Request deserialize(ByteBuffer message) {
    int offset = findOffset(message);
    if (offset == -1) {
      throw new IllegalArgumentException("Offset couldn't be extracted!");
    }
    if (message.limit() < offset + SIZE_REQUEST_ID + SIZE_REQUEST_TYPE) {
      throw new IllegalArgumentException("Message has invalid format!");
    }

    var requestIdBytes = new byte[16];
    message.get(offset, requestIdBytes, 0, 16);
    var requestIdByteBuffer = ByteBuffer.wrap(requestIdBytes);
    long high = requestIdByteBuffer.getLong();
    long low = requestIdByteBuffer.getLong();
    UUID requestId = new UUID(high, low);

    byte requestTypeByte = message.array()[offset + 16];
    var requestType = Request.Type.valueOf(requestTypeByte);
    if (requestType == null) {
      throw new IllegalArgumentException("Request type couldn't be extracted!");
    }

    return new Request(requestId, requestType,
        Arrays.copyOfRange(message.array(), offset + 17, message.array().length));
  }

  private static int findOffset(ByteBuffer message) {
    int offset = -1;

    byte[] arr = message.array();
    for (int i = 0; i < arr.length - 4; i++) {
      if (i + 4 >= arr.length) {
        return -1;
      } else {
        if (arr[i] != ASCII_DECIMAL_CARRIAGE_RETURN) {
          continue;
        }
        if (arr[i + 1] != ASCII_DECIMAL_NEW_LINE) {
          continue;
        }
        if (arr[i + 2] != ASCII_DECIMAL_CARRIAGE_RETURN) {
          continue;
        }
        if (arr[i + 3] != ASCII_DECIMAL_NEW_LINE) {
          continue;
        }

        return i + 4;
      }
    }

    return offset;
  }

}
