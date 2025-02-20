package net.nymtech.server.handler.get_file;

import java.math.BigDecimal;

/**
 * Represents the response content of {@code Request.Type.GET_FILE} typed requests.
 */
record GetFileResponse(String title, String message, BigDecimal sizeInKilobytes,
    long uploadTimestamp) {
}
