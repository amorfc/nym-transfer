package net.nymtech.server.handler.upload_file;

import java.util.UUID;

record FileMetadata(UUID id, UUID userId, String title, String message, String path,
        long uploadTimestamp) {
}
