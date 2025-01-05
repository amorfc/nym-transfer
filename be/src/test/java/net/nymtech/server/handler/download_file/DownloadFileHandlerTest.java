package net.nymtech.server.handler.download_file;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import java.io.IOException;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.nymtech.server.response.Response;
import net.nymtech.server.response.Response.Status;

@ExtendWith(MockitoExtension.class)
final class DownloadFileHandlerTest {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Mock
  private FileDownloader downloader;

  private DownloadFileHandler underTest;

  @BeforeEach
  void setUp() {
    underTest = new DownloadFileHandler(objectMapper, "/base-path", downloader);
  }

  @Test
  void should_Handle_Downdload_File_Request() throws IOException {
    // given
    when(downloader.download("/base-path/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title"))
        .thenReturn(new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9});

    // when
    var actual = underTest.handle(TestData.requestId, TestData.requestContent);

    // then
    assertThat(actual)
        .isEqualTo(new Response(Status.SUCCESSFUL, new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9}));
    verify(downloader, times(1))
        .download("/base-path/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title");
  }

  @ParameterizedTest
  @MethodSource("argumentsForInvalidRequestContent")
  void should_Fail_When_Given_Request_Content_Is_Invalid(byte[] requestContent) throws IOException {
    // given

    // when
    var actual = underTest.handle(TestData.requestId, requestContent);

    // then
    assertThat(actual).isEqualTo(Response.unexpectedFailure());
    verifyNoInteractions(downloader);
  }

  @Test
  void should_Add_Slash_To_Beginning_Of_Built_Path_When_It_Is_Missing_In_Request_Content()
      throws IOException {
    // given
    when(downloader.download("/base-path/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title"))
        .thenReturn(new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9});

    // when
    var actual = underTest.handle(TestData.requestId, TestData.requestContent);

    // then
    assertThat(actual).isEqualTo(Response.success(new byte[] {1, 2, 3, 4, 5, 6, 7, 8, 9}));
  }

  @Test
  void should_Fail_When_File_Downloading_Failed() throws IOException {
    // given
    when(downloader.download("/base-path/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title"))
        .thenThrow(new IOException());

    // when
    var actual = underTest.handle(TestData.requestId, TestData.requestContent);

    // then
    assertThat(actual).isEqualTo(Response.unexpectedFailure());
  }

  private static Stream<Arguments> argumentsForInvalidRequestContent()
      throws JsonProcessingException {
    return Stream.of(Arguments.of(objectMapper.writeValueAsBytes(objectMapper.createObjectNode())),
        Arguments.of(objectMapper.writeValueAsBytes(
            objectMapper.createObjectNode().put("userId", "27aefbf2-9afa-4c24-a60d-564fbf8d0916"))),
        Arguments.of(objectMapper.writeValueAsBytes(
            objectMapper.createObjectNode().put("userId", "27aefbf2-9afa-4c24-a60d-564fbf8d0916"))),
        Arguments.of(objectMapper
            .writeValueAsBytes(objectMapper.createObjectNode().put("path", "/test-title"))));
  }

  private static class TestData {

    private static final UUID requestId = UUID.fromString("927e9507-dd95-4b91-bc89-4782a546c511");
    private static byte[] requestContent;
    static {
      try {
        var requestContentNode = objectMapper.createObjectNode();
        requestContentNode.put("userId", "27aefbf2-9afa-4c24-a60d-564fbf8d0916");
        requestContentNode.put("path", "/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title");
        requestContent = objectMapper.writeValueAsBytes(requestContentNode);
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }

  }

}
