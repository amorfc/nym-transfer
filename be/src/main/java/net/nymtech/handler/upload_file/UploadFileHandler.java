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

  @NonNull
  private final ObjectMapper objectMapper;
  @NonNull
  private final Session session;

  @Override
  public void handle(Request request) {
    log.info("{} is being processed...", request.id());
    var content = extractContent(request);
    if (content == null) {
      // TODO: Send error!
      log.info("{} processed unsuccessfully!", request.id());
      return;
    }

    // TODO: Write file...
    log.info("{} processed successfully!", request.id());
  }

  private UploadFileRequest extractContent(Request request) {
    try {
      return objectMapper.readValue(request.content(), UploadFileRequest.class);
    } catch (IOException e) {
      log.error("UploadFileRequest couldn't be extracted!", e);
      return null;
    }
  }

}
