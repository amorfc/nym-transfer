package net.nymtech.server.handler.download_file;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import java.io.IOException;
import java.nio.file.Paths;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

final class LocalFileDownloaderIntegrationTest {

  private static final LocalFileDownloader underTest = new LocalFileDownloader();

  @Test
  void should_Read_File_From_File_System_By_Given_Absolute_Path() throws IOException {
    // given
    String pathStr =
        Paths.get("src", "test", "resources", "test-file.txt").toAbsolutePath().toString();

    // when
    var actual = underTest.download(pathStr);

    // then
    assertThat(actual).isEqualTo("Hello World!".getBytes());
  }

  @ParameterizedTest
  @NullAndEmptySource
  @ValueSource(strings = {"/something-doesnt-exist", "1234"})
  void should_Throw_IOException_When_No_File_Found_By_Given_Path(String pathStr)
      throws IOException {
    // given

    // when
    var actual = assertThrows(IOException.class, () -> underTest.download(pathStr));

    // then
    assertThat(actual.getMessage())
        .isEqualTo("No file found by given path: %s!".formatted(pathStr));
  }

}
