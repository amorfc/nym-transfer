package net.nymtech.server.response;

import java.util.Arrays;
import lombok.Getter;
import lombok.experimental.Accessors;

/**
 * Represents the response to the request sent through NYM Mixnet.
 */
public record Response(Response.Status status, byte[] content) {

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((status == null) ? 0 : status.hashCode());
    result = prime * result + Arrays.hashCode(content);
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Response other = (Response) obj;
    if (status != other.status)
      return false;
    if (!Arrays.equals(content, other.content))
      return false;
    return true;
  }

  @Getter
  @Accessors(fluent = true, chain = true, makeFinal = true)
  public enum Status {
    SUCCESSFUL((byte) 1), UNSUCCESSFUL((byte) 2);

    private final byte value;

    Status(byte value) {
      this.value = value;
    }

    public static Status valueOf(byte value) {
      return switch (value) {
        case 1 -> Status.SUCCESSFUL;
        default -> null;
      };
    }
  }

}
