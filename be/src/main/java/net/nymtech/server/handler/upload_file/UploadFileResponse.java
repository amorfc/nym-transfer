package net.nymtech.server.handler.upload_file;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the response content of {@code Request.Type.UPLOAD_FILE} typed requests.
 */
record UploadFileResponse(@JsonProperty(required = true) String path) {

  @Override
  public String toString() {
    return "UploadFileResponse [path=%s]".formatted(path);
  }

}
