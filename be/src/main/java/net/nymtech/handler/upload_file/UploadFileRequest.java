package net.nymtech.handler.upload_file;

import java.util.UUID;

/**
 * Represents the content of {@code Request.Type.UPLOAD_FILE} typed requests.
 */
record UploadFileRequest(UUID userId, String title, String message, byte[] content) {
}
