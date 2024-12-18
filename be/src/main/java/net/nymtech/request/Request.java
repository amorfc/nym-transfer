package net.nymtech.request;

import java.util.Arrays;
import java.util.UUID;
import lombok.Getter;
import lombok.experimental.Accessors;

/**
 * Represents the message format for the requests that are sent through NYM Mixnet.
 */
public record Request(UUID id, Request.Type type, String clientAddress, byte[] content) {

  @Getter
  @Accessors(fluent = true, chain = true, makeFinal = true)
  public enum Type {
    UPLOAD_FILE((byte) 1);

    private final byte value;

    Type(byte value) {
      this.value = value;
    }

    public static Type valueOf(byte value) {
      return switch (value) {
        case 1 -> Type.UPLOAD_FILE;
        default -> null;
      };
    }
  }

  @Override
  public String toString() {
    return "Request [id=%s, type=%s, clientAddress=%s, content=%s]".formatted(id, type.name(), clientAddress,
        Arrays.toString(content));
  }

}
