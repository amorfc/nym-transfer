package net.nymtech.handler.upload_file;

import java.io.IOException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.websocket.Session;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.handler.RequestHandler;
import net.nymtech.request.Request;

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
  @NonNull
  private final Session session;

  @Override
  public void handle(Request request) {
    try {
      log.info("{} is being processed...", request.id());
      var content = extractContent(request);
      var path = extractFilePath(content);
      uploader.upload(path, content.content());

      log.info("{} handled successfully!", request.id());
    } catch (IOException e) {
      log.error("{} couldn't be handled successfully!", request.id(), e);
      // TODO: Send error response!
    }
  }

  private UploadFileRequest extractContent(Request request) throws IOException {
    var content = objectMapper.readValue(request.content(), UploadFileRequest.class);
    log.debug("UploadFileRequest deserialized successfully: {}", content);
    return content;
  }

  private String extractFilePath(UploadFileRequest content) {
    return "%s/%s/%s".formatted(basePath, content.userId(),
        content.title().strip().toLowerCase().replace(" ", "_"));
  }

}
