package net.nymtech.server.handler.common;

import java.util.UUID;

public record FileMetadata(UUID id, UUID userId, String title, String message, String path,
    long sizeInBytes, long uploadTimestamp) {
}
