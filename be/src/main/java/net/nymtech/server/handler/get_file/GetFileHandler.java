package net.nymtech.server.handler.get_file;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.server.handler.RequestHandler;
import net.nymtech.server.handler.common.FileMetadata;
import net.nymtech.server.handler.common.FileMetadataRepository;
import net.nymtech.server.response.Response;

/**
 * {@code RequestHandler} that handles {@code Request.Type.GET_FILE} typed requests.
 */
@Log4j2
@RequiredArgsConstructor
public final class GetFileHandler implements RequestHandler {

  private final ObjectMapper objectMapper;
  private final FileMetadataRepository repository;

  @Override
  public Response handle(UUID requestId, byte[] requestContent) {
    try {
      log.debug("{} is being processed...", requestId);

      var content = extractContent(requestId, requestContent);
      var metadata = repository
          .findBy(content.path().startsWith("/") ? content.path().substring(1) : content.path());

      if (metadata.isPresent()) {
        return Response.success(objectMapper.writeValueAsBytes(toResponse(metadata.get())));
      } else {
        return Response.failure("No file found by given path: " + content.path());
      }
    } catch (IOException e) {
      log.error("{} couldn't be handled successfully!", requestId, e);
      return Response.unexpectedFailure();
    }
  }

  private GetFileRequest extractContent(UUID requestId, byte[] requestContent) throws IOException {
    var content = objectMapper.readValue(requestContent, GetFileRequest.class);
    log.debug("{} content deserialized successfully: {}", requestId, content);
    return content;
  }

  private GetFileResponse toResponse(FileMetadata metadata) {
    return new GetFileResponse(metadata.title(), metadata.message(),
        toKilobytes(metadata.sizeInBytes()), metadata.uploadTimestamp());
  }

  private BigDecimal toKilobytes(long bytes) {
    return BigDecimal.valueOf(bytes).divide(BigDecimal.valueOf(1000), 4, RoundingMode.HALF_UP);
  }

}
