package net.nymtech.handler.download_file;

import java.io.IOException;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.nymtech.handler.RequestHandler;
import net.nymtech.response.Response;
import net.nymtech.response.Response.Status;

/**
 * {@code RequestHandler} that handles {@code Request.Type.DOWNLOAD_FILE} typed requests.
 */
@RequiredArgsConstructor
@Log4j2
public final class DownloadFileHandler implements RequestHandler {

  // TODO: This downloader currently reads everything into the memory and writes to the client
  // afterwards. It's possible to stream to client directly! Let's implement that by aligning with
  // the frontend later on.
  private final LocalFileDownloader downloader = new LocalFileDownloader();

  @NonNull
  private final ObjectMapper objectMapper;
  @NonNull
  private final String basePath;

  @Override
  public Response handle(UUID requestId, byte[] requestContent) {
    try {
      log.debug("{} is being processed...", requestId);

      var content = extractContent(requestId, requestContent);
      var downloaded = downloader.download(extractFilePath(content.path()));
      log.debug("{} file downloaded!", requestId);

      return new Response(Status.SUCCESSFUL, downloaded);
    } catch (IOException e) {
      log.error("{} couldn't be handled successfully!", requestId, e);
      return new Response(Response.Status.UNSUCCESSFUL,
          "Something went unexpectedly wrong!".getBytes());
    }
  }

  private DownloadFileRequest extractContent(UUID requestId, byte[] requestContent)
      throws IOException {
    var content = objectMapper.readValue(requestContent, DownloadFileRequest.class);
    log.debug("{} content deserialized successfully: {}", requestId, content);
    return content;
  }

  public String extractFilePath(String pathStr) {
    if (!pathStr.startsWith("/")) {
      return "%s/%s".formatted(basePath, pathStr);
    } else {
      return basePath + pathStr;
    }
  }

}
