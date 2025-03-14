package net.nymtech.server.request;

import java.util.UUID;
import lombok.Getter;
import lombok.experimental.Accessors;

/**
 * Represents the message format for the requests that are sent through NYM Mixnet.
 */
public record Request(UUID id, Request.Type type, byte[] clientAddress, byte[] content) {

  @Getter
  @Accessors(fluent = true, chain = true, makeFinal = true)
  public enum Type {
    UPLOAD_FILE((byte) 1), DOWNLOAD_FILE((byte) 2), GET_FILE((byte) 3);

    private final byte value;

    Type(byte value) {
      this.value = value;
    }

    public static boolean hasValue(byte value) {
      return switch (value) {
        case 1 -> true;
        case 2 -> true;
        case 3 -> true;
        default -> false;
      };
    }

    public static Type valueOf(byte value) {
      return switch (value) {
        case 1 -> Type.UPLOAD_FILE;
        case 2 -> Type.DOWNLOAD_FILE;
        case 3 -> Type.GET_FILE;
        default -> null;
      };
    }
  }

  @Override
  public String toString() {
    return "Request [id=%s, type=%s]".formatted(id, type.name());
  }

}
