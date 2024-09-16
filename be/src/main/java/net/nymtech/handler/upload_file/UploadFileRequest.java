package net.nymtech.handler.upload_file;

/**
 * Represents the content of {@code Request.Type.UPLOAD_FILE} typed requests.
 */
record UploadFileRequest(String userEmail, String title, String message) {
}
