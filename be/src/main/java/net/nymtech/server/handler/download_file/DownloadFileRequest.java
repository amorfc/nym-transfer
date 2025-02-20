package net.nymtech.server.handler.download_file;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the content of {@code Request.Type.DOWNLOAD_FILE} typed requests.
 */
record DownloadFileRequest(@JsonProperty(required = true) UUID userId,
    @JsonProperty(required = true) String path) {
}
