package net.nymtech.server.handler.upload_file;

import java.io.IOException;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import net.nymtech.server.handler.RequestHandler;
import net.nymtech.server.response.Response;

/**
 * {@code RequestHandler} that handles {@code Request.Type.UPLOAD_FILE} typed requests.
 */
@Log4j2
public final class UploadFileHandler implements RequestHandler {

  private final ObjectMapper objectMapper;
  private final String basePath;
  private final FileUploader uploader;
  private final FileMetadataRepository repository;

  public UploadFileHandler(ObjectMapper objectMapper, String basePath) {
    this.objectMapper = objectMapper;
    this.basePath = basePath;
    this.uploader = new LocalFileUploader();
    this.repository = new InMemoryFileMetadataRepository();
  }

  UploadFileHandler(ObjectMapper objectMapper, String basePath, FileUploader uploader,
      FileMetadataRepository repository) {
    this.objectMapper = objectMapper;
    this.basePath = basePath;
    this.uploader = uploader;
    this.repository = repository;
  }

  @Override
  public Response handle(UUID requestId, byte[] requestContent) {
    try {
      log.debug("{} is being processed...", requestId);

      var content = extractContent(requestId, requestContent);
      var path = extractFilePath(content);
      uploader.upload(basePath + path, content.content());
      repository.insert(buildMetadata(content, path));
      log.debug("{} file uploaded successfully!", requestId);

      return Response.success(objectMapper.writeValueAsBytes(new UploadFileResponse(path)));
    } catch (IOException e) {
      log.error("{} couldn't be handled successfully!", requestId, e);
      return Response.unexpectedFailure();
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

  private FileMetadata buildMetadata(UploadFileRequest content, String path) {
    return new FileMetadata(UUID.randomUUID(), content.userId(), content.title(), content.message(),
        path, System.currentTimeMillis() /* TODO: Change with TimeUtils! */);
  }

}
