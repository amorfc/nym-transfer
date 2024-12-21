package net.nymtech.handler.upload_file;

import java.util.Arrays;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the content of {@code Request.Type.UPLOAD_FILE} typed requests.
 */
record UploadFileRequest(@JsonProperty(required = true) UUID userId,
    @JsonProperty(required = true) String title, @JsonProperty(required = true) byte[] content) {

  @Override
  public String toString() {
    return "UploadFileRequest [userId=%s, title=%s, content=%s]".formatted(userId, title, Arrays.toString(content));
  }

}
