package net.nymtech.server.handler.upload_file;

import static org.assertj.core.api.Assertions.assertThat;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;

final class LocalFileUploaderIntegrationTest {

  private static final LocalFileUploader underTest = new LocalFileUploader();

  @AfterAll
  static void cleanUp() throws IOException {
    var basePath = Paths.get("src", "test", "resources", "integration-test");
    if (Files.exists(basePath)) {
      Files.walk(basePath).sorted((path1, path2) -> path2.compareTo(path1)).forEach(path -> {
        try {
          Files.delete(path);
        } catch (IOException e) {
          throw new RuntimeException("Failed to delete: " + path, e);
        }
      });
    }
  }

  @Test
  void should_Write_Given_Data_To_File_System_By_Given_File_Path() throws IOException {
    // given
    Path path = Paths.get("src", "test", "resources", "integration-test", "content.txt");
    String pathStr = path.toAbsolutePath().toString();
    byte[] content = "From integration test!".getBytes();

    // when
    underTest.upload(pathStr, content);

    // then
    var writtenData = Files.readAllBytes(path);
    assertThat(writtenData).isEqualTo(content);
  }

  @Test
  void should_Overwrite_Existing_File() throws IOException {
    // given
    Path path = Paths.get("src", "test", "resources", "integration-test", "content.txt");
    String pathStr = path.toAbsolutePath().toString();
    underTest.upload(pathStr, "From integration test!".getBytes());
    byte[] content = "Overwritten data!".getBytes();

    // when
    underTest.upload(pathStr, content);

    // then
    var writtenData = Files.readAllBytes(path);
    assertThat(writtenData).isEqualTo(content);
  }

}
