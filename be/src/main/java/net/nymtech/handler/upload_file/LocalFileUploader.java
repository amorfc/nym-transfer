package net.nymtech.handler.upload_file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
final class LocalFileUploader implements FileUploader {

  // TODO: Test this! 
  @Override
  public void upload(String pathStr, byte[] content) throws IOException {
    var path = Path.of(pathStr);
    Files.createDirectories(path.getParent());
    Files.write(path, content, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
  }

}
