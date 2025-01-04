package net.nymtech.server.handler.download_file;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.extern.log4j.Log4j2;

@Log4j2
final class LocalFileDownloader implements FileDownloader {

  private static final int BUFFER_SIZE = 1024;

  @Override
  public byte[] download(String pathStr) throws IOException {
    if (!isPathValid(pathStr)) {
      return null;
    }

    try (FileInputStream is = new FileInputStream(pathStr);
        ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      int bytesRead;
      byte[] buffer = new byte[BUFFER_SIZE];
      while ((bytesRead = is.read(buffer)) != -1)
        os.write(buffer, 0, bytesRead);

      return os.toByteArray();
    }
  }

  private static boolean isPathValid(String pathStr) {
    if (pathStr == null || pathStr.trim().isBlank()) {
      return false;
    }

    try {
      Path path = Paths.get(pathStr);

      if (Files.exists(path) && Files.isRegularFile(path)) {
        return true;
      } else {
        log.debug("No file found in the given path: {}", pathStr);
        return false;
      }
    } catch (InvalidPathException e) {
      log.debug("Given 'pathStr' is not valid!", e);
      return true;
    }
  }

}
