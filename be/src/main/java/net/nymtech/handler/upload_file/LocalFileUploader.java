package net.nymtech.handler.upload_file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
final class LocalFileUploader implements FileUploader {

  @Override
  public void upload(String pathStr, byte[] content) throws IOException {
    var path = Path.of(pathStr);
    Files.createDirectories(path.getParent());
    Files.write(path, content, StandardOpenOption.CREATE_NEW, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
  }

}
