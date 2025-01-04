package net.nymtech.server.handler.upload_file;

import java.io.IOException;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.server.handler.RequestHandler;
import net.nymtech.server.response.Response;

/**
 * {@code RequestHandler} that handles {@code Request.Type.UPLOAD_FILE} typed requests.
 */
@RequiredArgsConstructor
@Log4j2
public final class UploadFileHandler implements RequestHandler {

  private static final LocalFileUploader uploader = new LocalFileUploader();

  @NonNull
  private final ObjectMapper objectMapper;
  @NonNull
  private final String basePath;

  @Override
  public Response handle(UUID requestId, byte[] requestContent) {
    try {
      log.debug("{} is being processed...", requestId);

      var content = extractContent(requestId, requestContent);
      var path = extractFilePath(content);
      uploader.upload(basePath + path, content.content());
      log.debug("{} file uploaded!", requestId);

      return new Response(Response.Status.SUCCESSFUL,
          objectMapper.writeValueAsBytes(new UploadFileResponse(path)));
    } catch (IOException e) {
      log.error("{} couldn't be handled successfully!", requestId, e);
      return new Response(Response.Status.UNSUCCESSFUL,
          "Something went unexpectedly wrong!".getBytes());
    }
  }

  private UploadFileRequest extractContent(UUID requestId, byte[] requestContent)
      throws IOException {
    var content = objectMapper.readValue(requestContent, UploadFileRequest.class);
    log.debug("{} content deserialized successfully: {}", requestId, content);
    return content;
  }

  private String extractFilePath(UploadFileRequest content) {
    return "/%s/%s".formatted(content.userId(),
        content.title().strip().toLowerCase().replace(" ", "_"));
  }

}
