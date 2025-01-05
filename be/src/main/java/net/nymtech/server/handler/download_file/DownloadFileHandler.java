package net.nymtech.server.handler.download_file;

import java.io.IOException;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import net.nymtech.server.handler.RequestHandler;
import net.nymtech.server.response.Response;

/**
 * {@code RequestHandler} that handles {@code Request.Type.DOWNLOAD_FILE} typed requests.
 */
@Log4j2
public final class DownloadFileHandler implements RequestHandler {

  private final ObjectMapper objectMapper;
  private final String basePath;
  // TODO: This downloader currently reads everything into the memory and writes to the client
  // afterwards. It's possible to stream to client directly! Let's implement that by aligning with
  // the frontend later on.
  private final FileDownloader downloader;

  public DownloadFileHandler(ObjectMapper objectMapper, String basePath) {
    this.objectMapper = objectMapper;
    this.basePath = basePath;
    this.downloader = new LocalFileDownloader();
  }

  DownloadFileHandler(ObjectMapper objectMapper, String basePath, FileDownloader downloader) {
    this.objectMapper = objectMapper;
    this.basePath = basePath;
    this.downloader = downloader;
  }

  @Override
  public Response handle(UUID requestId, byte[] requestContent) {
    try {
      log.debug("{} is being processed...", requestId);

      var content = extractContent(requestId, requestContent);
      var downloaded = downloader.download(extractFilePath(content.path()));
      log.debug("{} file downloaded successfully!", requestId);

      return Response.success(downloaded);
    } catch (IOException e) {
      log.error("{} couldn't be handled successfully!", requestId, e);
      return Response.unexpectedFailure();
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
