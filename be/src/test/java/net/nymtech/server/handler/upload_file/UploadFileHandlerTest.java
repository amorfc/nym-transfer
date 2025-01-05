package net.nymtech.server.handler.upload_file;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verifyNoInteractions;
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

@ExtendWith(MockitoExtension.class)
final class UploadFileHandlerTest {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  @Mock
  private FileUploader uploader;

  private UploadFileHandler underTest;

  @BeforeEach
  void setUp() {
    underTest = new UploadFileHandler(objectMapper, "/base-path", uploader);
  }

  @Test
  void should_Handle_Upload_File_Request() throws IOException {
    // given
    doNothing().when(uploader).upload("/base-path/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title",
        "Hello World!".getBytes());

    // when
    var actual = underTest.handle(TestData.requestId, TestData.requestContent);

    // then
    var expectedResponseContent =
        new UploadFileResponse("/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title");
    assertThat(actual)
        .isEqualTo(Response.success(objectMapper.writeValueAsBytes(expectedResponseContent)));
  }

  @ParameterizedTest
  @MethodSource("argumentsForInvalidRequestContent")
  void should_Fail_When_Given_Request_Content_Is_Invalid(byte[] requestContent) throws IOException {
    // given

    // when
    var actual = underTest.handle(TestData.requestId, requestContent);

    // then
    assertThat(actual).isEqualTo(Response.unexpectedFailure());
    verifyNoInteractions(uploader);
  }

  @Test
  void should_Fail_When_File_Uploading_Failed() throws IOException {
    // given
    doThrow(new IOException()).when(uploader).upload(
        "/base-path/27aefbf2-9afa-4c24-a60d-564fbf8d0916/test-title", "Hello World!".getBytes());

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
        Arguments.of(objectMapper
            .writeValueAsBytes(objectMapper.createObjectNode().put("title", "test-title"))),
        Arguments.of(objectMapper.writeValueAsBytes(
            objectMapper.createObjectNode().put("content", "Hello World!".getBytes()))));
  }

  private static class TestData {

    private static final UUID requestId = UUID.fromString("4b1363d1-241b-4e7a-9c0c-adb46d4507c2");
    private static byte[] requestContent;
    static {
      try {
        requestContent = objectMapper.writeValueAsBytes(
            new UploadFileRequest(UUID.fromString("27aefbf2-9afa-4c24-a60d-564fbf8d0916"),
                "test-title", "Hello World!".getBytes()));
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }

  }

}
