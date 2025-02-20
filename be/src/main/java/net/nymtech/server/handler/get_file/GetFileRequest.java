package net.nymtech.server.handler.get_file;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the content of {@code Request.Type.GET_FILE} typed requests.
 */
record GetFileRequest(@JsonProperty(required = true) UUID userId,
    @JsonProperty(required = true) String path) {

  @Override
  public String toString() {
    return "GetFileRequest [path=%s]".formatted(path);
  }

}
