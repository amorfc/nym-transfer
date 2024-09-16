package net.nymtech;

import java.util.UUID;
import lombok.Getter;
import lombok.experimental.Accessors;

public record Request(UUID id, Request.Type type, byte[] content) {

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

}
